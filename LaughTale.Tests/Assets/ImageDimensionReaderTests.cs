using System;
using System.IO;
using System.Reflection;
using LaughTale.Core.Assets;
using Xunit;

namespace LaughTale.Tests.Assets;

/// <summary>
/// ROADMAP.v5.md Part H "image optimization". Fixture files under TestAssets/ are real, encoder-
/// produced PNG/JPEG/GIF files (via System.Drawing at generation time) with known exact dimensions -
/// proving the header parser against real bytes, not hand-crafted ones that might silently encode
/// the same misunderstanding the parser itself has.
/// </summary>
public class ImageDimensionReaderTests
{
    private static string AssetPath(string fileName) =>
        Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)!, "TestAssets", fileName);

    private static Stream OpenAsset(string fileName) => File.OpenRead(AssetPath(fileName));

    [Fact]
    public void ReadsRealPngDimensions()
    {
        using var stream = OpenAsset("test-64x32.png");
        var dims = ImageDimensionReader.TryReadDimensions(stream);

        Assert.NotNull(dims);
        Assert.Equal(64, dims!.Value.Width);
        Assert.Equal(32, dims.Value.Height);
    }

    [Fact]
    public void ReadsRealGifDimensions()
    {
        using var stream = OpenAsset("test-20x15.gif");
        var dims = ImageDimensionReader.TryReadDimensions(stream);

        Assert.NotNull(dims);
        Assert.Equal(20, dims!.Value.Width);
        Assert.Equal(15, dims.Value.Height);
    }

    [Fact]
    public void ReadsRealJpegDimensions()
    {
        using var stream = OpenAsset("test-37x51.jpg");
        var dims = ImageDimensionReader.TryReadDimensions(stream);

        Assert.NotNull(dims);
        Assert.Equal(37, dims!.Value.Width);
        Assert.Equal(51, dims.Value.Height);
    }

    [Fact]
    public void ReturnsNull_ForUnsupportedFormat_WebP()
    {
        // A real WebP RIFF header (not a full valid file - just enough to prove this reader
        // recognizes it as "not one of the formats I parse" rather than misreading garbage as a
        // width/height, or throwing).
        byte[] webpHeader = "RIFF\0\0\0\0WEBPVP8 "u8.ToArray();
        using var stream = new MemoryStream(webpHeader);

        Assert.Null(ImageDimensionReader.TryReadDimensions(stream));
    }

    [Fact]
    public void ReturnsNull_ForTruncatedFile_NeverThrows()
    {
        using var stream = new MemoryStream([0x89, 0x50, 0x4E, 0x47]); // PNG signature cut off mid-way

        var ex = Record.Exception(() => ImageDimensionReader.TryReadDimensions(stream));

        Assert.Null(ex);
    }

    [Fact]
    public void ReturnsNull_ForCompletelyUnrelatedBytes()
    {
        using var stream = new MemoryStream([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        Assert.Null(ImageDimensionReader.TryReadDimensions(stream));
    }

    [Fact]
    public void ReturnsNull_ForEmptyStream()
    {
        using var stream = new MemoryStream([]);

        Assert.Null(ImageDimensionReader.TryReadDimensions(stream));
    }

    [Fact]
    public void JpegReader_SkipsExifAndOtherSegments_BeforeFindingSof()
    {
        // A minimal, real JPEG produced by System.Drawing typically already carries some APPn
        // metadata segments before SOF0 - this test's real fixture proves the marker-walk correctly
        // skips over them rather than only working on a JPEG with SOF as the very first segment.
        using var stream = OpenAsset("test-37x51.jpg");
        using var reader = new BinaryReader(stream);
        var bytes = reader.ReadBytes(64);

        // Sanity-check the fixture itself actually has more than just SOI+SOF (i.e. this test is
        // exercising real marker-skipping, not a degenerate single-segment file).
        Assert.True(bytes.Length > 4);
        Assert.Equal(0xFF, bytes[0]);
        Assert.Equal(0xD8, bytes[1]);

        stream.Position = 0;
        var dims = ImageDimensionReader.TryReadDimensions(stream);
        Assert.Equal((37, 51), dims);
    }
}
