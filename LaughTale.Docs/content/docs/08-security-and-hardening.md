---
title: Security & Production Hardening
description: Enterprise security architecture — Strict Content Security Policy (CSP), anti-CSRF auto-propagation, AST sandboxing with zero eval, and reflection allowlisting.
order: 8
icon: shield
category: Framework Architecture
---

# 🛡️ Security & Hardening

Security is a foundational pillar of LaughTale. The framework is architected from the ground up for strict enterprise compliance, government standards, and zero-trust web environments.

---

## 🔒 1. Strict Content Security Policy (Zero `unsafe-eval`)

Many JavaScript frameworks and templating engines rely on `new Function(...)` or `eval(...)` to execute client expressions, forcing developers to weaken their Content Security Policy with `unsafe-eval`.

**LaughTale requires ZERO `unsafe-eval`:**
- All declarative directives (`l-*`) are parsed through a deterministic, sandboxed **Abstract Syntax Tree (AST) evaluator**.
- No code is dynamically compiled at runtime on the browser.
- Works out-of-the-box with high-security CSP headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-rAnd0m'; style-src 'self'; object-src 'none'; base-uri 'self';
```

---

## 🛡️ 2. Automatic Anti-CSRF Token Propagation

Cross-Site Request Forgery (CSRF) is a critical vulnerability in web applications. LaughTale automatically detects ASP.NET Core anti-forgery tokens on the page (`__RequestVerificationToken`) and attaches them to all island network operations:

- **Server-Driven Island Refreshes** (`POST /_laughtale/island/{name}`)
- **Server Data Contract Queries** (`POST /api/.../data`)
- **File Uploads** (`<island-fileupload />`)

```typescript
// Automatically attached on all POST / PUT / DELETE requests
headers['RequestVerificationToken'] = token;
headers['X-CSRF-TOKEN'] = token;
```

---

## 🛑 3. Safe Server-Side Reflection & Allowlisting

When client grids request sorting or filtering by column name (e.g. `sortField: "balance"`), malicious actors might attempt dynamic SQL injection, prototype pollution, or private property exfiltration.

LaughTale protects against this via a multi-layer guard:

```csharp
// 1. Model Property Verification:
// Only public, readable properties declared on T are permitted. Non-existent fields are silently ignored.
var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

// 2. Explicit Security Allowlist (Recommended for Public APIs):
var allowed = new HashSet<string>(StringComparer.OrdinalIgnoreCase) 
{ 
    "Id", "Name", "City", "Balance", "CreatedAt" 
};

var result = query.ToIslandDataResult(request, allowedFields: allowed);
```

### Protection Summary:
- **Zero Raw SQL String Concatenation**: Queries are built exclusively via type-safe LINQ Expression Trees.
- **Private Fields Guard**: Fields decorated with `[IslandPrivate]` or non-public properties can never be read or filtered.
- **Malformed Input Resilience**: Unparseable integers, dates, or Guids are rejected cleanly without throwing unhandled server exceptions.

---

## 🧹 4. HTML Sanitization & XSS Defense

LaughTale encodes all user-provided strings and JSON properties before rendering them to the DOM.

- Text bindings (`l-text`, table cells, labels) are escaped with `textContent` / `HtmlEncode`.
- HTML bindings (`l-html`, custom templates) pass through a DOMPurify sanitizer preventing `<script>`, `onload=`, and `javascript:` URI attacks.

---

## 📋 Security Checklist for Production

- [x] Enable HTTPS redirection (`app.UseHttpsRedirection()`).
- [x] Configure strict CSP headers without `unsafe-eval`.
- [x] Define explicit property allowlists on public `MapIslandData` endpoints.
- [x] Ensure anti-forgery token middleware is enabled in ASP.NET Core.
- [x] Use `[IslandPrivate]` on sensitive model properties (e.g. PasswordHash, InternalNotes).
