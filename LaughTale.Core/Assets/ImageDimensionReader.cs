using System;
using System.Buffers.Binary;
using System.IO;

namespace LaughTale.Core.Assets;

/// <summary>
/// Reads a raster image's real pixel dimensions straight from its format headers - PNG, GIF, and
/// JPEG only (ROADMAP.v5.md Part H "image optimization"), no image-processing dependency. Supports
/// the piece of "image optimization" that matters most for Core Web Vitals without one: knowing an
/// image's real width/height lets <see cref="Assets.ImageTagHelper"/> (or any caller) stamp them on
/// the element automatically, which is what actually prevents layout shift (CLS) - resizing/format
/// conversion (the other half of what Next.js/Astro's image components do) is a materially bigger,
/// separate feature requiring a real image-processing library, deliberately not attempted here (see
/// ROADMAP.v5.md's own closure note for this item).
///
/// Deliberately reads only the handful of header bytes each format needs, not the whole file - a
/// multi-megabyte photo costs the same few hundred bytes to measure as a 1 KB icon.
/// </summary>
public static class ImageDimensionReader
{
    /// <summary>
    /// Attempts to read <paramref name="stream"/>'s real pixel width/height from its own format
    /// header. Returns <c>null</c> for a format this reader doesn't understand (e.g. WebP, AVIF,
    /// SVG - none of these have a fixed-offset binary header this simple, or SVG has no fixed pixel
    /// size at all) or for a stream that isn't a recognized image at all. Never throws on malformed
    /// input - a truncated/corrupt file degrades to "couldn't determine", not an exception.
    /// </summary>
    public static (int Width, int Height)? TryReadDimensions(Stream stream)
    {
        try
        {
            Span<byte> header = stackalloc byte[32];
            var read = ReadFully(stream, header);
            if (read < 8) return null;

            if (IsPng(header)) return ReadPngDimensions(header, read);
            if (IsGif(header)) return ReadGifDimensions(header, read);
            if (IsJpeg(header)) return ReadJpegDimensions(stream, header, read);

            return null; // WebP, AVIF, SVG, or genuinely unrecognized - not a failure, just unsupported
        }
        catch
        {
            // Malformed/truncated input must degrade to "unknown", never propagate - this reader
            // exists purely to add a convenience attribute, and is never allowed to break a page.
            return null;
        }
    }

    private static int ReadFully(Stream stream, Span<byte> buffer)
    {
        var total = 0;
        while (total < buffer.Length)
        {
            var n = stream.Read(buffer[total..]);
            if (n == 0) break;
            total += n;
        }
        return total;
    }

    // --- PNG: 8-byte signature, then an IHDR chunk whose data is (width:u32 BE, height:u32 BE). ---
    private static readonly byte[] PngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

    private static bool IsPng(ReadOnlySpan<byte> header) =>
        header.Length >= 8 && header[..8].SequenceEqual(PngSignature);

    private static (int, int)? ReadPngDimensions(ReadOnlySpan<byte> header, int read)
    {
        if (read < 24) return null; // signature(8) + length(4) + "IHDR"(4) + width(4) + height(4)
        if (header[12] != (byte)'I' || header[13] != (byte)'H' || header[14] != (byte)'D' || header[15] != (byte)'R')
        {
            return null;
        }
        var width = BinaryPrimitives.ReadUInt32BigEndian(header.Slice(16, 4));
        var height = BinaryPrimitives.ReadUInt32BigEndian(header.Slice(20, 4));
        return ((int)width, (int)height);
    }

    // --- GIF: "GIF87a"/"GIF89a" (6 bytes), then Logical Screen Width/Height (u16 LE each). ---
    private static bool IsGif(ReadOnlySpan<byte> header) =>
        header.Length >= 6 && header[0] == 'G' && header[1] == 'I' && header[2] == 'F'
        && header[3] == '8' && (header[4] == '7' || header[4] == '9') && header[5] == 'a';

    private static (int, int)? ReadGifDimensions(ReadOnlySpan<byte> header, int read)
    {
        if (read < 10) return null;
        var width = BinaryPrimitives.ReadUInt16LittleEndian(header.Slice(6, 2));
        var height = BinaryPrimitives.ReadUInt16LittleEndian(header.Slice(8, 2));
        return (width, height);
    }

    // --- JPEG: SOI (FFD8), then a marker segment sequence. Dimensions live in the first SOFn
    // marker's segment (precision:u8, height:u16 BE, width:u16 BE) - unlike PNG/GIF this isn't at a
    // fixed offset, so the segment chain must be walked. Segments with no data (the "standalone"
    // markers, D0-D9/TEM) have no length prefix to skip; everything else does. ---
    private static bool IsJpeg(ReadOnlySpan<byte> header) =>
        header.Length >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;

    private static (int, int)? ReadJpegDimensions(Stream stream, ReadOnlySpan<byte> header, int alreadyRead)
    {
        // The initial 32-byte peek already consumed some of the stream; rebuild a single logical
        // reader over "the already-buffered bytes, then the live stream" so marker-walking doesn't
        // need to special-case the first few markers.
        using var combined = new PrefixedStream(header[..alreadyRead].ToArray(), stream);

        Span<byte> marker = stackalloc byte[2];
        combined.ReadExact(marker); // FF D8 (SOI), already validated by IsJpeg
        if (marker[0] != 0xFF || marker[1] != 0xD8) return null;

        for (var guard = 0; guard < 256; guard++) // bounded: a real JPEG never has anywhere near this many segments before SOF
        {
            if (!combined.TryReadExact(marker)) return null;
            if (marker[0] != 0xFF) return null; // desynchronized - not a marker where one was expected

            var code = marker[1];
            if (code == 0xD8 || code == 0x01 || (code >= 0xD0 && code <= 0xD9))
            {
                continue; // standalone marker, no length/data segment to skip
            }
            if (code == 0xD9) return null; // EOI reached with no SOF found

            Span<byte> lenBytes = stackalloc byte[2];
            if (!combined.TryReadExact(lenBytes)) return null;
            var segmentLen = BinaryPrimitives.ReadUInt16BigEndian(lenBytes); // includes the 2 length bytes themselves

            var isSof = code is (>= 0xC0 and <= 0xC3) or (>= 0xC5 and <= 0xC7) or (>= 0xC9 and <= 0xCB) or (>= 0xCD and <= 0xCF);
            if (isSof)
            {
                if (segmentLen < 7) return null;
                Span<byte> sof = stackalloc byte[5]; // precision(1) + height(2) + width(2)
                if (!combined.TryReadExact(sof)) return null;
                var height = BinaryPrimitives.ReadUInt16BigEndian(sof.Slice(1, 2));
                var width = BinaryPrimitives.ReadUInt16BigEndian(sof.Slice(3, 2));
                return (width, height);
            }

            var remaining = segmentLen - 2;
            if (remaining < 0) return null;
            if (!combined.TrySkip(remaining)) return null;
        }

        return null;
    }

    /// <summary>Presents an in-memory prefix followed by the rest of a live stream as one Stream.</summary>
    private sealed class PrefixedStream(byte[] prefix, Stream rest) : IDisposable
    {
        private int _prefixPos;

        public void ReadExact(Span<byte> buffer)
        {
            if (!TryReadExact(buffer)) throw new EndOfStreamException();
        }

        public bool TryReadExact(Span<byte> buffer)
        {
            var total = 0;
            while (total < buffer.Length && _prefixPos < prefix.Length)
            {
                buffer[total++] = prefix[_prefixPos++];
            }
            while (total < buffer.Length)
            {
                var n = rest.Read(buffer[total..]);
                if (n == 0) return false;
                total += n;
            }
            return true;
        }

        public bool TrySkip(int count)
        {
            Span<byte> junk = stackalloc byte[Math.Min(count, 512)];
            var remaining = count;
            while (remaining > 0)
            {
                var chunk = Math.Min(remaining, junk.Length);
                if (!TryReadExact(junk[..chunk])) return false;
                remaining -= chunk;
            }
            return true;
        }

        public void Dispose() { }
    }
}
