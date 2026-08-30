---
title: "Security & Enterprise Hardening"
description: "Defense-in-depth architecture: Automated CSP nonces, [IslandPrivate] cache guards, AST sandboxing, OWASP URL sanitization, and Roslyn security analyzers."
order: 8
section: "Core Concepts"
---

# Security & Enterprise Hardening

Security in LaughTale is not an afterthought; it is built into the compilation pipeline, server TagHelpers, and client runtime.

LaughTale enforces **Defense-in-Depth** across 5 distinct security layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Compile-Time Roslyn Analyzers (LTI001 - LTI004)          │
├─────────────────────────────────────────────────────────────┤
│ 2. Output Cache Privacy Guard ([IslandPrivate])             │
├─────────────────────────────────────────────────────────────┤
│ 3. Automated Content Security Policy (CSP) Nonce Injection  │
├─────────────────────────────────────────────────────────────┤
│ 4. AST Reactive Expression Sandboxing                       │
├─────────────────────────────────────────────────────────────┤
│ 5. OWASP 25-Form URL & Input Neutralization                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛡️ 1. Compile-Time Credential Leak Analyzer (`LTI004`)

When passing C# ViewModels as island props, developers might inadvertently expose sensitive user properties (e.g. hashed passwords, access tokens, API secrets) to public HTML attributes.

The LaughTale Roslyn source analyzer scans all `[Island]` props models at compile-time:
* If a property matches sensitive credential patterns (`password`, `token`, `secret`, `apikey`, `connectionstring`, `privatekey`), **the build immediately fails with error `LTI004`**.
* To intentionally exclude or serialize a property, decorate it with `[IslandIgnore]`.

```csharp
[Island("user-profile")]
public record UserProfileProps(
    string DisplayName,
    string Email,
    [IslandIgnore] string HashedSecret // ✅ Safe: Ignored by island serializer
);
```

---

## 🛡️ 2. Output Cache Privacy Guard (`[IslandPrivate]`)

When using ASP.NET Core Output Caching or Cloudflare/Fastly edge CDNs, caching a page containing personalized user data can lead to catastrophic data leakages (user A seeing user B's account balance).

LaughTale protects against this automatically:
1. Decorate private props models or properties with `[IslandPrivate]`:
   ```csharp
   [IslandPrivate]
   public record AccountBalanceProps(string AccountNumber, decimal Balance);
   ```
2. When the `IslandTagHelper` processes this island, it automatically checks the HTTP response cache headers:
   * If `Cache-Control` contains `public`, LaughTale logs a security warning and immediately **overrides the headers to `no-store, no-cache, private; Vary: Cookie`**.

---

## 🛡️ 3. Automated Content Security Policy (CSP) Nonce Injection

LaughTale generates a cryptographically random, per-request CSP nonce (`ICspNonceProvider`):

```csharp
// Program.cs
builder.Services.AddLaughTale(options =>
{
    options.Csp.Enabled = true;
    options.Csp.EnforceHeader = true; // Emits Content-Security-Policy: script-src 'nonce-...'
});
```

In your Razor views, use the `<island-csp-script>` TagHelper to automatically attach the per-request nonce without manual string formatting:

```razor
<island-csp-script>
    console.log("Securely executed with valid per-request nonce!");
</island-csp-script>
```

---

## 🛡️ 4. AST Expression Sandboxing & Prototype Pollution Defense

LaughTale's reactive directives interpreter (`l-*`) parses all expressions into an Abstract Syntax Tree (AST) before execution.

The sandbox rejects:
- `__proto__`, `constructor`, and `prototype` property assignments.
- Global scope escapes (`window`, `globalThis`, `document`, `Function`).
- Dangerous inline execution vectors (`eval()`, `setTimeout("code")`).

---

## 🛡️ 5. OWASP URL & Dynamic Protocol Sanitization

LaughTale evaluates all dynamically bound URLs against a 25-form OWASP attack matrix, stripping control characters (`\x00`–`\x1F`), whitespace injection (`jav ascript:`), and neutralizing dangerous protocols (`javascript:`, `vbscript:`, `data:text/html`).
