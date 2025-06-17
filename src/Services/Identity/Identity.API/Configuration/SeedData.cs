using Identity.API.Data;
using Identity.API.Models;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Security.Claims;

namespace Identity.API.Configuration;

public static class SeedData
{
    public static async Task EnsureSeedData(IServiceProvider serviceProvider)
    {
        Log.Information("🌱 Seeding database...");

        // Seed IdentityServer configuration data
        await SeedIdentityServerConfigurationData(serviceProvider);
        
        // Seed users
        await SeedUsers(serviceProvider);
        
        Log.Information("✅ Database seeding completed");
    }

    private static async Task SeedIdentityServerConfigurationData(IServiceProvider serviceProvider)
    {
        var configurationDbContext = serviceProvider.GetRequiredService<ConfigurationDbContext>();

        // Seed Identity Resources
        if (!await configurationDbContext.IdentityResources.AnyAsync())
        {
            Log.Information("🔑 Seeding identity resources...");
            foreach (var resource in Config.IdentityResources)
            {
                await configurationDbContext.IdentityResources.AddAsync(resource.ToEntity());
            }
            await configurationDbContext.SaveChangesAsync();
        }

        // Seed API Scopes
        if (!await configurationDbContext.ApiScopes.AnyAsync())
        {
            Log.Information("🔒 Seeding API scopes...");
            foreach (var scope in Config.ApiScopes)
            {
                await configurationDbContext.ApiScopes.AddAsync(scope.ToEntity());
            }
            await configurationDbContext.SaveChangesAsync();
        }

        // Seed API Resources
        if (!await configurationDbContext.ApiResources.AnyAsync())
        {
            Log.Information("🌐 Seeding API resources...");
            foreach (var resource in Config.ApiResources)
            {
                await configurationDbContext.ApiResources.AddAsync(resource.ToEntity());
            }
            await configurationDbContext.SaveChangesAsync();
        }

        // Seed Clients
        if (!await configurationDbContext.Clients.AnyAsync())
        {
            Log.Information("👥 Seeding clients...");
            foreach (var client in Config.Clients)
            {
                await configurationDbContext.Clients.AddAsync(client.ToEntity());
            }
            await configurationDbContext.SaveChangesAsync();
        }
    }

    private static async Task SeedUsers(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        
        // Demo user "swn" - keeping compatibility with current frontend
        var swnUser = await userManager.FindByNameAsync("swn");
        if (swnUser == null)
        {
            Log.Information("👤 Creating demo user 'swn'...");
            swnUser = new ApplicationUser
            {
                UserName = "swn",
                Email = "swn@shopping.com",
                FirstName = "Demo",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(swnUser, "Password123!");
            if (result.Succeeded)
            {
                await userManager.AddClaimsAsync(swnUser, new[]
                {
                    new Claim("sub", swnUser.Id),
                    new Claim("name", swnUser.FullName),
                    new Claim("given_name", swnUser.FirstName),
                    new Claim("family_name", swnUser.LastName),
                    new Claim("email", swnUser.Email),
                    new Claim("role", "customer")
                });
                Log.Information("✅ Demo user 'swn' created successfully");
            }
            else
            {
                Log.Error("❌ Failed to create demo user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }

        // Admin user
        var adminUser = await userManager.FindByNameAsync("admin");
        if (adminUser == null)
        {
            Log.Information("👤 Creating admin user...");
            adminUser = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@shopping.com",
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddClaimsAsync(adminUser, new[]
                {
                    new Claim("sub", adminUser.Id),
                    new Claim("name", adminUser.FullName),
                    new Claim("given_name", adminUser.FirstName),
                    new Claim("family_name", adminUser.LastName),
                    new Claim("email", adminUser.Email),
                    new Claim("role", "admin")
                });
                Log.Information("✅ Admin user created successfully");
            }
        }

        // Test customer
        var customerUser = await userManager.FindByNameAsync("customer");
        if (customerUser == null)
        {
            Log.Information("👤 Creating test customer...");
            customerUser = new ApplicationUser
            {
                UserName = "customer",
                Email = "customer@shopping.com",
                FirstName = "Test",
                LastName = "Customer",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(customerUser, "Customer123!");
            if (result.Succeeded)
            {
                await userManager.AddClaimsAsync(customerUser, new[]
                {
                    new Claim("sub", customerUser.Id),
                    new Claim("name", customerUser.FullName),
                    new Claim("given_name", customerUser.FirstName),
                    new Claim("family_name", customerUser.LastName),
                    new Claim("email", customerUser.Email),
                    new Claim("role", "customer")
                });
                Log.Information("✅ Test customer created successfully");
            }
        }
    }
}
