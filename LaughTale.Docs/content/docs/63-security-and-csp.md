---
title: Security Model & Content Security Policy (CSP)
description: Enterprise-grade security with automated CSP nonce generation, directive expression sandboxing, and OWASP URL sanitization.
category: Security & Architecture
order: 63
---

# Security Model & CSP

LaughTale enforces a defense-in-depth security architecture designed to eliminate Cross-Site Scripting (XSS), script injection, prototype pollution, and unauthorized script execution.

---

## 1. Automated CSP Nonce Generation & Injection

LaughTale provides built-in ASP.NET Core middleware to automatically stamp cryptographically secure, per-request nonce tokens into `Content-Security-Policy` headers and dynamic Razor elements.

```csharp
// Program.cs
builder.Services.AddLaughTaleCsp(options =>
{
    options.Enabled = true;
    options.ReportOnly = false;
    options.BaseDirectives["script-src"] = "'self' 'nonce-{NONCE}'";
    options.BaseDirectives["style-src"] = "'self' 'nonce-{NONCE}'";
});

app.UseLaughTaleCsp();
```

### Accessing Nonce in Razor
```html
<script nonce="@GetCspNonce()">
    console.log('Secure script execution with verified nonce');
</script>
```

---

## 2. Directive Expression Sandbox

Declarative directives (`l-show`, `l-text`, `l-on:*`, `l-state`) run through an AST-based recursive expression parser that forbids access to dangerous globals:

- **Forbidden Identifiers:** `window`, `document`, `globalThis`, `eval`, `Function`, `process`, `import`.
- **Prototype Pollution Defense:** Blocked assignments and queries to `__proto__`, `constructor`, `prototype`.
- **Dynamic Code Execution Prevention:** Expressions cannot execute arbitrary Function constructors.

---

## 3. OWASP URL Sanitization Matrix

Dynamic URL attributes (e.g. `l-bind:href`, `l-bind:src`) are automatically validated across a 25-vector OWASP sanitization matrix:

- Blocked protocols: `javascript:`, `data:text/html`, `vbscript:`, `file:`.
- Allowed protocols: `https://`, `http://`, `mailto:`, `tel:`, `blob:`, and relative paths (`/`, `./`, `../`).
