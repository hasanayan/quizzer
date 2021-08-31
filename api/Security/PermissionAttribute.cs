using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using System.Linq.Expressions;
using System.Linq;


internal class PermissionAttribute : AuthorizeAttribute
{
    const string POLICY_PREFIX = "PERMISSION";

    public PermissionAttribute(string permission) => Permission = permission;

    // Get or set the Age property by manipulating the underlying Policy property
    public int Age
    {
        get
        {
            if (int.TryParse(Policy.Substring(POLICY_PREFIX.Length), out var age))
            {
                return age;
            }
            return default(int);
        }
        set
        {
            Policy = $"{POLICY_PREFIX}{value.ToString()}";
        }
    }

    public string Permission
    {
        get
        {
            if (Policy.Substring(POLICY_PREFIX.Length) is var permission && permission != null)
            {
                return permission;
            }
            return default(string);
        }
        set
        {
            Policy = $"{POLICY_PREFIX}{value.ToString()}";
        }
    }
}


internal class PermissionPolicyProvider : IAuthorizationPolicyProvider
{
    const string POLICY_PREFIX = "PERMISSION";

    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() =>
    Task.FromResult(new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme).RequireAuthenticatedUser().Build());

    public Task<AuthorizationPolicy> GetFallbackPolicyAsync() =>
      Task.FromResult<AuthorizationPolicy>(null);


    public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
    {
        if (policyName.StartsWith(POLICY_PREFIX, StringComparison.OrdinalIgnoreCase) &&
            policyName.Substring(POLICY_PREFIX.Length) is string permission && permission != default(string))
        {
            var policy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme);
            policy.AddRequirements(new PermissionRequirement(permission));
            return Task.FromResult(policy.Build());
        }

        return Task.FromResult<AuthorizationPolicy>(null);
    }
}

public class PermissionRequirement : IAuthorizationRequirement
{
    public string Permission { get; }

    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }
}

public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
                                                   PermissionRequirement requirement)
    {
        string scopes = context.User.FindFirstValue("scope");

        if (
            scopes != null &&
            scopes.Split(' ').Any(scopes => scopes == requirement.Permission) is var hasPermission &&
            hasPermission)
        {
            context.Succeed(requirement);
        }


        return Task.CompletedTask;
    }
}