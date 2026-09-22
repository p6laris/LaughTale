using System.Collections.Concurrent;
using Microsoft.AspNetCore.Hosting;

namespace LaughTale.Core.Assets;

internal sealed class ImageDimensionService : IImageDimensionService
{
    private readonly IWebHostEnvironment _env;
    private readonly ConcurrentDictionary<string, (int Width, int Height)?> _cache = new();

    public ImageDimensionService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public (int Width, int Height)? GetDimensions(string relativePath)
    {
        var normalized = relativePath.TrimStart('/');
        return _cache.GetOrAdd(normalized, Read);
    }

    private (int Width, int Height)? Read(string relativePath)
    {
        var fileInfo = _env.WebRootFileProvider.GetFileInfo(relativePath);
        if (!fileInfo.Exists || fileInfo.IsDirectory)
        {
            return null;
        }

        using var stream = fileInfo.CreateReadStream();
        return ImageDimensionReader.TryReadDimensions(stream);
    }
}
