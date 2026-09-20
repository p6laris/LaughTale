using System;
using System.Collections.Generic;
using System.Linq;
using LaughTale.Core.Data;
using Xunit;

namespace LaughTale.Tests.Security;

public class IslandFieldPolicyTests
{
    private class TestItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SecretNote { get; set; } = string.Empty;
        public string TenantId { get; set; } = string.Empty;
    }

    private IQueryable<TestItem> GetSampleData() => new List<TestItem>
    {
        new() { Id = 1, Name = "Alice", Email = "alice@example.com", SecretNote = "TopSecret1", TenantId = "tenant-a" },
        new() { Id = 2, Name = "Bob", Email = "bob@example.com", SecretNote = "TopSecret2", TenantId = "tenant-b" },
        new() { Id = 3, Name = "Charlie", Email = "charlie@example.com", SecretNote = "TopSecret3", TenantId = "tenant-a" }
    }.AsQueryable();

    [Fact]
    public void Filter_NonePolicy_RefusesFilterAndRecordsRefusedField()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            Filters = new Dictionary<string, IslandFilterValue>
            {
                ["Name"] = new() { Value = "Alice", MatchMode = "equals" }
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.None);

        // Filter was not applied because field is refused
        Assert.Equal(3, result.TotalCount);
        Assert.Contains("Name", result.RefusedFields);
    }

    [Fact]
    public void Filter_ForPolicy_AllowsMatchingField()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            Filters = new Dictionary<string, IslandFilterValue>
            {
                ["Name"] = new() { Value = "Alice", MatchMode = "equals" }
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Name"));

        Assert.Equal(1, result.TotalCount);
        Assert.DoesNotContain("Name", result.RefusedFields);
    }

    [Fact]
    public void Sort_NonePolicy_RefusesSortAndRecordsRefusedField()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            SortField = "Name",
            SortOrder = -1 // descending
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.None);

        Assert.Contains("Name", result.RefusedFields);
        // Original order preserved (Alice first, not Charlie)
        Assert.Equal("Alice", result.Items[0].Name);
    }

    [Fact]
    public void Sort_ForPolicy_AllowsMatchingField()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            SortField = "Name",
            SortOrder = -1 // descending
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Name"));

        Assert.DoesNotContain("Name", result.RefusedFields);
        Assert.Equal("Charlie", result.Items[0].Name);
    }

    [Fact]
    public void GlobalSearch_NonePolicy_RefusesAllSearchProperties()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            GlobalSearch = "Alice"
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.None);

        // No search was executed, all 3 items returned
        Assert.Equal(3, result.TotalCount);
    }

    [Fact]
    public void GlobalSearch_ForPolicy_SearchesOnlyAllowedFields()
    {
        var query = GetSampleData();
        // Searching for TopSecret1, which is in SecretNote.
        // If SecretNote is not in field policy, it should not match.
        var request = new IslandDataRequest
        {
            GlobalSearch = "TopSecret1"
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Name", "Email"));

        Assert.Equal(0, result.TotalCount);
    }

    [Fact]
    public void AllMappedProperties_AllowsAllFields()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            Filters = new Dictionary<string, IslandFilterValue>
            {
                ["SecretNote"] = new() { Value = "TopSecret2", MatchMode = "equals" }
            },
            SortField = "Email",
            SortOrder = -1
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.AllMappedProperties);

        Assert.Equal(1, result.TotalCount);
        Assert.Equal("Bob", result.Items[0].Name);
        Assert.Empty(result.RefusedFields);
    }

    [Fact]
    public void EmptyFor_RefusesAllFields()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            Filters = new Dictionary<string, IslandFilterValue>
            {
                ["Name"] = new() { Value = "Alice", MatchMode = "equals" }
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For());

        Assert.Equal(3, result.TotalCount);
        Assert.Contains("Name", result.RefusedFields);
    }

    [Fact]
    public void OracleRule_NonAllowlistedAndNonExistentFields_ProduceIndistinguishableRefusals()
    {
        var query = GetSampleData();
        var request = new IslandDataRequest
        {
            Filters = new Dictionary<string, IslandFilterValue>
            {
                ["SecretNote"] = new() { Value = "foo", MatchMode = "equals" },     // Real property, not allowlisted
                ["NonExistentField"] = new() { Value = "bar", MatchMode = "equals" } // Not a property
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Name", "Email"));

        // Both must be recorded in RefusedFields as flat string names without any reason code
        Assert.Equal(2, result.RefusedFields.Count);
        Assert.Contains("SecretNote", result.RefusedFields);
        Assert.Contains("NonExistentField", result.RefusedFields);
    }

    [Fact]
    public void WithTenantColumn_SetsHasTenantColumnAndTenantColumn()
    {
        var policy = IslandFieldPolicy.For("Name").WithTenantColumn("TenantId");

        Assert.True(policy.HasTenantColumn);
        Assert.Equal("TenantId", policy.TenantColumn);
    }

    [Fact]
    public void WithTenantColumn_RejectsNullOrWhitespace()
    {
        Assert.Throws<ArgumentException>(() => IslandFieldPolicy.For("Name").WithTenantColumn(""));
        Assert.Throws<ArgumentException>(() => IslandFieldPolicy.For("Name").WithTenantColumn("   "));
    }

    [Fact]
    public void DefaultPolicy_HasNoTenantColumn()
    {
        Assert.False(IslandFieldPolicy.For("Name").HasTenantColumn);
        Assert.Null(IslandFieldPolicy.For("Name").TenantColumn);
    }

    [Fact]
    public void TenantColumn_FiltersToOnlyMatchingTenantRows()
    {
        var query = GetSampleData();
        var policy = IslandFieldPolicy.For("Name").WithTenantColumn("TenantId");

        var result = query.ToIslandDataResult(new IslandDataRequest(), policy, tenantValue: "tenant-a");

        Assert.Equal(2, result.TotalCount);
        Assert.All(result.Items, item => Assert.Equal("tenant-a", item.TenantId));
    }

    [Fact]
    public void TenantColumn_AppliesBeforeClientFiltersAndSort()
    {
        var query = GetSampleData();
        var policy = IslandFieldPolicy.For("Name").WithTenantColumn("TenantId");
        var request = new IslandDataRequest { SortField = "Name", SortOrder = 1 };

        var result = query.ToIslandDataResult(request, policy, tenantValue: "tenant-a");

        Assert.Equal(2, result.TotalCount);
        Assert.Equal("Alice", result.Items[0].Name);
        Assert.Equal("Charlie", result.Items[1].Name);
    }

    [Fact]
    public void TenantColumn_MissingTenantValue_ThrowsInvalidOperationException()
    {
        var query = GetSampleData();
        var policy = IslandFieldPolicy.For("Name").WithTenantColumn("TenantId");

        Assert.Throws<InvalidOperationException>(() => query.ToIslandDataResult(new IslandDataRequest(), policy));
        Assert.Throws<InvalidOperationException>(() => query.ToIslandDataResult(new IslandDataRequest(), policy, tenantValue: "  "));
    }

    [Fact]
    public void TenantColumn_ConfiguredColumnDoesNotExistOnEntity_ThrowsInvalidOperationException()
    {
        var query = GetSampleData();
        var policy = IslandFieldPolicy.For("Name").WithTenantColumn("NoSuchColumn");

        var ex = Assert.Throws<InvalidOperationException>(
            () => query.ToIslandDataResult(new IslandDataRequest(), policy, tenantValue: "tenant-a"));
        Assert.Contains("NoSuchColumn", ex.Message);
    }

    [Fact]
    public void TenantColumn_NoMatchingRows_ReturnsEmptyResult()
    {
        var query = GetSampleData();
        var policy = IslandFieldPolicy.For("Name").WithTenantColumn("TenantId");

        var result = query.ToIslandDataResult(new IslandDataRequest(), policy, tenantValue: "tenant-z");

        Assert.Equal(0, result.TotalCount);
        Assert.Empty(result.Items);
    }
}
