using System.Collections.Concurrent;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Hosting;

namespace LaughTale.Core.Assets;

internal sealed class AssetIntegrityService : IAssetIntegrityService
{
    private readonly IWebHostEnvironment _env;
    private readonly ConcurrentDictionary<string, string?> _cache = new();

    public AssetIntegrityService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public string? GetIntegrityHash(string relativePath)
    {
        var normalized = relativePath.TrimStart('/');
        return _cache.GetOrAdd(normalized, ComputeHash);
    }

    private string? ComputeHash(string relativePath)
    {
        var fileInfo = _env.WebRootFileProvider.GetFileInfo(relativePath);
        if (!fileInfo.Exists || fileInfo.IsDirectory)
        {
            return null;
        }

        using var stream = fileInfo.CreateReadStream();
        var hash = SHA384.HashData(stream);
        return "sha384-" + System.Convert.ToBase64String(hash);
    }
}
