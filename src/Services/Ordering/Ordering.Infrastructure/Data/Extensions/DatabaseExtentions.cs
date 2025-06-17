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
        // Use only the new comprehensive seed data that matches Identity Service users
        await OrderingSeedData.SeedAsync(context, logger);
    }
}
