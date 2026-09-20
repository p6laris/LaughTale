using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using LaughTale.Components.Rendering;
using Xunit;

namespace LaughTale.Tests.Rendering;

public class PageHeadViewDataExtensionsTests
{
    private static ViewDataDictionary CreateViewData() =>
        new(new EmptyModelMetadataProvider(), new ModelStateDictionary());

    [Fact]
    public void GetHead_WithoutSetHead_FallsBackToViewDataTitle()
    {
        var viewData = CreateViewData();
        viewData["Title"] = "Legacy Page";

        var head = viewData.GetHead();

        Assert.Equal("Legacy Page", head.Title);
        Assert.Null(head.Description);
    }

    [Fact]
    public void GetHead_WithoutSetHeadOrTitle_ReturnsEmptyHead()
    {
        var viewData = CreateViewData();

        var head = viewData.GetHead();

        Assert.Null(head.Title);
    }

    [Fact]
    public void SetHead_ThenGetHead_ReturnsTheStoredTypedHead()
    {
        var viewData = CreateViewData();
        viewData["Title"] = "Ignored Once SetHead Is Used";

        viewData.SetHead(new PageHead(Title: "Typed Title", Description: "Typed description"));

        var head = viewData.GetHead();

        Assert.Equal("Typed Title", head.Title);
        Assert.Equal("Typed description", head.Description);
    }
}
