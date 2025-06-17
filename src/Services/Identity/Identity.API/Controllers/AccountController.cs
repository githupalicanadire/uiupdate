using Identity.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Identity.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<AccountController> _logger;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<AccountController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null)
        {
            return BadRequest(new { message = "Invalid username or password" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Invalid username or password" });
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {Username} logged in successfully", request.Username);

        return Ok(new
        {
            message = "Login successful",
            user = new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                fullName = user.FullName
            }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _userManager.FindByNameAsync(request.Username);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Username already exists" });
        }

        existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        var user = new ApplicationUser
        {
            UserName = request.Username,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = "Failed to create user", errors = result.Errors });
        }

        // Add default claims
        await _userManager.AddClaimsAsync(user, new[]
        {
            new Claim("sub", user.Id),
            new Claim("name", user.FullName),
            new Claim("given_name", user.FirstName),
            new Claim("family_name", user.LastName),
            new Claim("email", user.Email),
            new Claim("role", "customer")
        });

        _logger.LogInformation("User {Username} registered successfully", request.Username);

        return Ok(new
        {
            message = "Registration successful",
            user = new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                fullName = user.FullName
            }
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        _logger.LogInformation("User logged out");
        return Ok(new { message = "Logout successful" });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest(new { message = "User ID not found" });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(new
        {
            id = user.Id,
            username = user.UserName,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            fullName = user.FullName,
            createdAt = user.CreatedAt,
            lastLoginAt = user.LastLoginAt
        });
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
