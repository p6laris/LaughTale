using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using LaughTale.Core.Attributes;
using LaughTale.Core.Diagnostics;
using LaughTale.Core.Enums;
using LaughTale.Core.Serialization;

namespace LaughTale.Core.TagHelpers;

/// <summary>
/// ASP.NET Core MVC &amp; Razor Pages TagHelper for rendering Islands with multi-framework, slots, streaming SSR, and cache leak protection (LT-1507).
/// </summary>
[HtmlTargetElement("island", TagStructure = TagStructure.NormalOrSelfClosing)]
public class IslandTagHelper : TagHelper
{
    private readonly ILogger<IslandTagHelper> _logger;

    public IslandTagHelper(ILogger<IslandTagHelper>? logger = null)
    {
        _logger = logger ?? NullLogger<IslandTagHelper>.Instance;
    }

    [ViewContext]
    [HtmlAttributeNotBound]
    public ViewContext? ViewContext { get; set; }

    [HtmlAttributeName("name")]
    public string Name { get; set; } = string.Empty;

    [HtmlAttributeName("props")]
    public object? Props { get; set; }

    [HtmlAttributeName("hydrate")]
    public HydrateStrategy Hydrate { get; set; } = HydrateStrategy.Load;

    [HtmlAttributeName("framework")]
    public IslandFramework Framework { get; set; } = IslandFramework.Vanilla;

    [HtmlAttributeName("media")]
    public string? Media { get; set; }

    [HtmlAttributeName("persist")]
    public string? Persist { get; set; }

    [HtmlAttributeName("class")]
    public string? Class { get; set; }

    [HtmlAttributeName("style")]
    public string? Style { get; set; }

    [HtmlAttributeName("id")]
    public string? Id { get; set; }

    [HtmlAttributeName("fallback")]
    public string? Fallback { get; set; }

    [HtmlAttributeName("private")]
    public bool? IsPrivate { get; set; }

    public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
    {
        output.TagName = "div";
        output.TagMode = TagMode.StartTagAndEndTag;

        // LT-1507: Cache Leak Guard & Privacy Enforcement
        EnforceCachePrivacy();

        var serializedProps = IslandJson.SerializeProps(Props);
        var propBytes = System.Text.Encoding.UTF8.GetByteCount(serializedProps);

        output.Attributes.SetAttribute("data-island", Name);
        output.Attributes.SetAttribute("data-props", serializedProps);
        output.Attributes.SetAttribute("data-hydrate", Hydrate.ToString().ToLowerInvariant());

        _logger.LogDebug("LaughTale Island rendered: Name={Name}, Strategy={Strategy}, PropsSize={PropsBytes}B", Name, Hydrate, propBytes);

        if (Framework != IslandFramework.Vanilla)
        {
            output.Attributes.SetAttribute("data-framework", Framework.ToString().ToLowerInvariant());
        }

        if (!string.IsNullOrWhiteSpace(Persist))
        {
            output.Attributes.SetAttribute("data-persist", Persist);
        }

        if (!string.IsNullOrWhiteSpace(Media))
        {
            output.Attributes.SetAttribute("data-media", Media);
        }

        if (!string.IsNullOrWhiteSpace(Fallback))
        {
            output.Attributes.SetAttribute("data-fallback", Fallback);
        }

        if (!string.IsNullOrWhiteSpace(Id))
        {
            output.Attributes.SetAttribute("id", Id);
        }

        if (!string.IsNullOrWhiteSpace(Class))
        {
            output.Attributes.SetAttribute("class", Class);
        }

        if (!string.IsNullOrWhiteSpace(Style))
        {
            output.Attributes.SetAttribute("style", Style);
        }

        var childContent = await output.GetChildContentAsync();
        var sb = new System.Text.StringBuilder();

        if (!childContent.IsEmptyOrWhiteSpace)
        {
            sb.Append($"<div data-slot=\"default\" class=\"island-slot\">{childContent.GetContent()}</div>");
        }

        if (!string.IsNullOrWhiteSpace(Fallback))
        {
            sb.Append($"<template data-slot=\"fallback\" class=\"island-fallback-template\">{System.Net.WebUtility.HtmlEncode(Fallback)}</template>");
        }

        if (sb.Length > 0)
        {
            sb.Append($"<!--island:end:{Name}-->");
            output.Content.SetHtmlContent(sb.ToString());
        }

        IslandDiagnostics.ValidateIsland(
            Name,
            Hydrate,
            Media,
            !string.IsNullOrWhiteSpace(Persist),
            output);
    }

    private void EnforceCachePrivacy()
    {
        var httpContext = ViewContext?.HttpContext;
        if (httpContext == null) return;

        bool hasPrivateAttr = false;
        if (IsPrivate == true)
        {
            hasPrivateAttr = true;
        }
        else if (Props != null)
        {
            var propsType = Props.GetType();
            hasPrivateAttr = propsType.GetCustomAttribute<IslandPrivateAttribute>(true) != null ||
                             propsType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                      .Any(p => p.GetCustomAttribute<IslandPrivateAttribute>(true) != null);
        }

        if (hasPrivateAttr)
        {
            var response = httpContext.Response;
            var currentCacheControl = response.Headers.CacheControl.ToString();
            if (currentCacheControl.Contains("public", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("[LaughTale Security] Island '{Name}' carries private user props on a publicly cached response. Overriding Cache-Control to no-store.", Name);
            }

            response.Headers.CacheControl = "no-store, no-cache, private";
            response.Headers.Pragma = "no-cache";
            response.Headers.Vary = "Cookie";
        }
    }
}
