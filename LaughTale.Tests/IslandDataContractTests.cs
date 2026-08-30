using System.Collections.Generic;
using System.Linq;
using LaughTale.Core.Data;
using Xunit;

namespace LaughTale.Tests;

public record Customer(int Id, string Name, string City, decimal Balance);

public class IslandDataContractTests
{
    private readonly IQueryable<Customer> _sampleData = new List<Customer>
    {
        new(1, "Alice Smith", "New York", 1500.00m),
        new(2, "Bob Jones", "London", 2300.50m),
        new(3, "Charlie Brown", "New York", 450.00m),
        new(4, "Diana Prince", "Paris", 9800.00m),
        new(5, "Evan Wright", "London", 120.00m),
        new(6, "Fiona Gallagher", "Chicago", 3400.00m),
        new(7, "George Clark", "Paris", 560.00m),
        new(8, "Hannah Abbott", "London", 7200.00m)
    }.AsQueryable();

    [Fact]
    public void Paging_ReturnsExactPageAndPageSize()
    {
        var request = new IslandDataRequest
        {
            Page = 2,
            PageSize = 3
        };

        var result = _sampleData.ToIslandDataResult(request);

        Assert.Equal(8, result.TotalCount);
        Assert.Equal(3, result.Items.Count);
        Assert.Equal(2, result.Page);
        Assert.Equal(3, result.PageSize);
        Assert.Equal(3, result.TotalPages);
        Assert.Equal("Diana Prince", result.Items[0].Name);
    }

    [Fact]
    public void Sorting_AppliesAscendingAndDescendingOrder()
    {
        var request = new IslandDataRequest
        {
            Page = 1,
            PageSize = 5,
            Sort = new() { new() { Field = "Balance", Descending = true } }
        };

        var result = _sampleData.ToIslandDataResult(request);

        Assert.Equal("Diana Prince", result.Items[0].Name);
        Assert.Equal(9800.00m, result.Items[0].Balance);
        Assert.Equal("Hannah Abbott", result.Items[1].Name);
    }

    [Fact]
    public void Filtering_FiltersByStringContains()
    {
        var request = new IslandDataRequest
        {
            Page = 1,
            PageSize = 10,
            Filter = new() { new() { Field = "City", Operator = "equals", Value = "London" } }
        };

        var result = _sampleData.ToIslandDataResult(request);

        Assert.Equal(3, result.TotalCount);
        Assert.All(result.Items, c => Assert.Equal("London", c.City));
    }

    [Fact]
    public void Security_IgnoreNonAllowedFields()
    {
        var request = new IslandDataRequest
        {
            Page = 1,
            PageSize = 5,
            Sort = new() { new() { Field = "NonExistentField", Descending = true } }
        };

        var allowed = new HashSet<string> { "Name", "City", "Balance" };
        var result = _sampleData.ToIslandDataResult(request, allowed);

        Assert.Equal(5, result.Items.Count);
    }
}
