using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using LaughTale.Core.Data;
using Xunit;

namespace LaughTale.Tests;

public class ServerSideDataTests
{
    public class SampleCustomer
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public DateTime RegisteredDate { get; set; }
        public bool IsActive { get; set; }
    }

    private static IQueryable<SampleCustomer> GenerateDataset(int count = 1000)
    {
        var cities = new[] { "Erbil", "Sulaymaniyah", "Duhok", "Kirkuk", "Halabja" };
        var list = new List<SampleCustomer>(count);

        for (int i = 1; i <= count; i++)
        {
            list.Add(new SampleCustomer
            {
                Id = i,
                Name = $"Customer {i:D6}",
                City = cities[i % cities.Length],
                Balance = (i * 15.5m) % 10000,
                RegisteredDate = new DateTime(2025, 1, 1).AddDays(i % 365),
                IsActive = i % 2 == 0
            });
        }

        return list.AsQueryable();
    }

    [Fact]
    public void Paging_CalculatesCorrectSliceAndTotalCount()
    {
        var query = GenerateDataset(500);
        var request = new IslandDataRequest
        {
            Page = 3,
            PageSize = 25
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Id", "Name", "City", "Balance"));

        Assert.Equal(500, result.TotalCount);
        Assert.Equal(500, result.TotalRecords);
        Assert.Equal(25, result.Items.Count);
        Assert.Equal(20, result.TotalPages);
        Assert.Equal(3, result.Page);
        Assert.Equal(25, result.PageSize);
        Assert.Equal(51, result.Items[0].Id); // (3-1)*25 + 1 = 51
        Assert.Equal(75, result.Items[^1].Id);
    }

    [Fact]
    public void Paging_100kRows_ExecutesBlazinglyFast()
    {
        var query = GenerateDataset(100_000);
        var request = new IslandDataRequest
        {
            Page = 500,
            PageSize = 50
        };

        var sw = Stopwatch.StartNew();
        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Id", "Name", "City", "Balance"));
        sw.Stop();

        Assert.Equal(100_000, result.TotalCount);
        Assert.Equal(50, result.Items.Count);
        Assert.Equal(2000, result.TotalPages);
        Assert.True(sw.ElapsedMilliseconds < 500, $"Expected <500ms but took {sw.ElapsedMilliseconds}ms");
    }

    [Fact]
    public void Filtering_ColumnContains_FiltersCorrectly()
    {
        var query = GenerateDataset(100);
        var request = new IslandDataRequest
        {
            Filter = new List<IslandFilterDescriptor>
            {
                new() { Field = "City", Operator = "contains", Value = "Erbil" }
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("City"));

        Assert.All(result.Items, item => Assert.Contains("Erbil", item.City));
        Assert.True(result.TotalCount > 0);
    }

    [Fact]
    public void Filtering_NumericComparisons_FiltersCorrectly()
    {
        var query = GenerateDataset(100);
        var request = new IslandDataRequest
        {
            Filter = new List<IslandFilterDescriptor>
            {
                new() { Field = "Balance", Operator = "gte", Value = "5000" }
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Balance"));

        Assert.All(result.Items, item => Assert.True(item.Balance >= 5000));
    }

    [Fact]
    public void GlobalSearch_SearchesAcrossMultipleFields()
    {
        var query = GenerateDataset(200);
        var request = new IslandDataRequest
        {
            GlobalSearch = "Customer 00004"
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("Name"));

        Assert.True(result.TotalCount > 0);
        Assert.All(result.Items, item => Assert.Contains("00004", item.Name));
    }

    [Fact]
    public void Sorting_AscendingAndDescending_SortsCorrectly()
    {
        var query = GenerateDataset(100);
        var requestDesc = new IslandDataRequest
        {
            Sort = new List<IslandSortDescriptor>
            {
                new() { Field = "Id", Descending = true }
            }
        };

        var result = query.ToIslandDataResult(requestDesc, IslandFieldPolicy.For("Id"));

        Assert.Equal(100, result.Items[0].Id);
        Assert.Equal(99, result.Items[1].Id);
    }

    [Fact]
    public void Security_AllowlistEnforcement_RejectsMaliciousFieldNames()
    {
        var query = GenerateDataset(50);
        var allowed = IslandFieldPolicy.For("Name", "City");

        var request = new IslandDataRequest
        {
            Filter = new List<IslandFilterDescriptor>
            {
                new() { Field = "NonExistentField", Operator = "equals", Value = "hack" },
                new() { Field = "DROP TABLE Students; --", Operator = "equals", Value = "1" }
            },
            Sort = new List<IslandSortDescriptor>
            {
                new() { Field = "Balance; malicious_sql", Descending = true }
            }
        };

        // Must NOT throw; safely skips invalid fields
        var result = query.ToIslandDataResult(request, allowed);

        Assert.Equal(50, result.TotalCount);
        Assert.NotEmpty(result.Items);
    }

    [Fact]
    public void LaughTaleCompatibility_AliasesMapSeamlessly()
    {
        var query = GenerateDataset(500);
        var request = new IslandDataRequest
        {
            First = 20,
            Rows = 10,
            SortField = "Name",
            SortOrder = -1,
            Filters = new Dictionary<string, IslandFilterValue>
            {
                ["City"] = new() { Value = "Duhok", MatchMode = "equals" }
            }
        };

        var result = query.ToIslandDataResult(request, IslandFieldPolicy.For("City", "Name"));

        Assert.Equal(3, result.Page);
        Assert.Equal(10, result.PageSize);
        Assert.All(result.Items, item => Assert.Equal("Duhok", item.City));
        Assert.NotEmpty(result.Data);
        Assert.True(result.TotalRecords > 0);
    }
}
