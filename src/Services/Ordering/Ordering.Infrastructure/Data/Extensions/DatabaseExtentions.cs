using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Ordering.Infrastructure.Data.SeedData;

namespace Ordering.Infrastructure.Data.Extensions;
public static class DatabaseExtentions
{
    public static async Task InitialiseDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        context.Database.MigrateAsync().GetAwaiter().GetResult();

        await SeedAsync(context, logger);
    }

    private static async Task SeedAsync(ApplicationDbContext context, ILogger logger)
    {
        await SeedCustomerAsync(context);
        await SeedProductAsync(context);
        await SeedOrdersWithItemsAsync(context);

        // Add new comprehensive seed data
        await OrderingSeedData.SeedAsync(context, logger);
    }

    private static async Task SeedCustomerAsync(ApplicationDbContext context)
    {
        if (!await context.Customers.AnyAsync())
        {
            await context.Customers.AddRangeAsync(InitialData.Customers);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedProductAsync(ApplicationDbContext context)
    {
        if (!await context.Products.AnyAsync())
        {
            await context.Products.AddRangeAsync(InitialData.Products);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedOrdersWithItemsAsync(ApplicationDbContext context)
    {
        if (!await context.Orders.AnyAsync())
        {
            await context.Orders.AddRangeAsync(InitialData.OrdersWithItems);
            await context.SaveChangesAsync();
        }
    }
}
