# LaughTale Directive Expression Grammar

Formal grammar for the language `l-*` directive expressions (`l-bind`, `l-if`, `l-on:click`, ...) are
written in. This is a **closed, hand-written language**, not a subset of JavaScript syntax reused via
`eval`/`new Function` — every construct below is the *complete* set of what the lexer
([`lexer.ts`](./lexer.ts)) and parser ([`parser.ts`](./parser.ts)) accept. Anything not listed here is
rejected, either as a lex/parse error or (for security-sensitive names) silently as `undefined` at
evaluation time. Keeping this document in sync with the two source files is exactly what
[`tests/expression-fuzz.test.ts`](../../../tests/expression-fuzz.test.ts) checks automatically —
regenerate this file's understanding from the source, don't hand-wave it, if either file changes.

## EBNF

```ebnf
Program        = [ Expression { ";" { ";" } Expression } ] ;   (* empty source -> Literal(undefined) *)

Expression     = Assignment ;

Assignment     = Ternary [ AssignOp Assignment ] ;              (* right-associative *)
AssignOp       = "=" | "+=" | "-=" | "*=" | "/=" ;
                 (* left-hand side MUST be Identifier | MemberExpr | IndexExpr, checked after parsing *)

Ternary        = Nullish [ "?" Expression ":" Expression ] ;

Nullish        = LogicalOr { "??" LogicalOr } ;
LogicalOr      = LogicalAnd { "||" LogicalAnd } ;
LogicalAnd     = Equality { "&&" Equality } ;
Equality       = Relational { ("==" | "!=" | "===" | "!==") Relational } ;
Relational     = Additive { ("<" | "<=" | ">" | ">=" | "in" | "instanceof") Additive } ;
Additive       = Multiplicative { ("+" | "-") Multiplicative } ;
Multiplicative = Unary { ("*" | "/" | "%") Unary } ;

Unary          = ("!" | "+" | "-" | "~") Unary
               | "typeof" Unary
               | ("++" | "--") Postfix                          (* prefix update; target must be assignable *)
               | Postfix ;

Postfix        = Primary { PostfixOp } ;
PostfixOp      = "." Identifier                                 (* member access *)
               | "?." Identifier                                (* optional member access *)
               | "?." "[" Expression "]"                        (* optional computed index *)
               | "?." "(" Arguments ")"                          (* optional call *)
               | "[" Expression "]"                              (* computed index *)
               | "(" Arguments ")"                                (* call *)
               | ("++" | "--") ;                                  (* postfix update; target must be assignable *)

Arguments      = [ Expression { "," Expression } ] ;

Primary        = Number | String | "true" | "false" | "null" | "undefined"
               | NoSubstitutionTemplate
               | Identifier
               | "(" Expression ")"
               | "[" [ Expression { "," Expression } ] "]"        (* array literal *)
               | "{" [ Property { "," Property } ] "}" ;          (* object literal *)

Property       = (Identifier | String) [ ":" Expression ] ;       (* no ":" => shorthand { count } *)

Identifier     = IdentStart { IdentPart } ;
IdentStart     = "a".."z" | "A".."Z" | "_" | "$" ;
IdentPart      = IdentStart | "0".."9" ;

Number         = Digits [ "." Digits ] [ ("e"|"E") ["+"|"-"] Digits ]
               | "." Digits [ ("e"|"E") ["+"|"-"] Digits ] ;
String         = '"' { EscapedChar | ~'"' } '"'  |  "'" { EscapedChar | ~"'" } "'" ;
EscapedChar    = "\" ("n" | "r" | "t" | "\" | "'" | '"' | <any other char, passed through literally>) ;
NoSubstitutionTemplate = "`" { EscapedChar | ~"`" } "`" ;         (* see "What's deliberately NOT supported" *)
```

## Operator precedence (lowest to highest)

1. `,` — sequence (statement separator is `;`, not `,`; `,` only appears inside call/array/object lists)
2. Assignment: `=` `+=` `-=` `*=` `/=` (right-associative)
3. Ternary: `?:`
4. `??`
5. `||`
6. `&&`
7. Equality: `==` `!=` `===` `!==`
8. Relational: `<` `<=` `>` `>=` `in` `instanceof`
9. Additive: `+` `-`
10. Multiplicative: `*` `/` `%`
11. Unary (prefix): `!` `+` `-` `~` `typeof` `++` `--`
12. Postfix: `.` `?.` `[...]` `(...)` `++` `--`

All binary tiers (4–10) are **left-associative** (the parser loops with `while`, not recursion, at each
tier). There is no exponentiation operator (`**`) despite `**=` being lexed as a 3-char operator token —
it's tokenized but no parser rule ever consumes it, so `a **= b` is a parse error (`Unexpected token`),
not silently ignored.

## Security-relevant rules (defense in depth — two independent blocklists)

**1. Structural blocklist, enforced by the *parser*, at every place an identifier or property name is
introduced** (`Parser.validatePropertyName`, called from `parsePrimary`'s `Identifier` case AND
`parsePostfix`'s `.prop`/`?.prop` cases): `constructor`, `__proto__`, `prototype`,
`__defineGetter__`, `__defineSetter__`, `__lookupGetter__`, `__lookupSetter__`. These throw a
`ParseError` — a malicious expression using one of these names never even produces an AST.

**2. Global-escape blocklist, enforced by the *evaluator*, at every identifier/property *read, write,
call, and index*** (`FORBIDDEN_IDENTIFIERS`/`FORBIDDEN_PROPERTIES` in `evaluator.ts`): `window`,
`document`, `globalThis`, `top`, `parent`, `frames`, `self`, `location`, `localStorage`,
`sessionStorage`, `indexedDB`, `cookie`, `eval`, `Function`, `XMLHttpRequest`, `fetch`, `setTimeout`,
`setInterval`, `setImmediate`, `clearTimeout`, `clearInterval`, `clearImmediate`, `process`, `require`,
`importScripts`, plus the 7 structural names from blocklist 1 again (defense in depth: even if a
property name reached evaluation some other way, it's still checked here). Blocked reads return
`undefined` rather than throwing — a directive expression degrades to "nothing happened", not a crash.
This blocklist deliberately lives in a *different file* than blocklist 1, checking a *different, mostly
non-overlapping* set of names (structural/prototype-pollution shapes vs. global-object-escape names) —
both must independently hold for the sandbox to be sound, which is exactly what the fuzz suite checks
by generating expressions that reach every one of these names through arbitrarily deep
member/index/call nesting, not just as a bare top-level identifier.

**3. Keyword blocklist, enforced by the *lexer*** (`FORBIDDEN_KEYWORDS` in `lexer.ts`): `new`,
`function`, `class`, `import`, `export`, `return`, `with`, `while`, `for`, `do`, `switch`, `case`,
`break`, `continue`, `debugger`, `var`, `let`, `const`, `throw`, `try`, `catch`, `finally`, `yield`,
`async`, `await`, `delete`, `void`. Tokenized as `FORBIDDEN_KEYWORD`, which `parsePrimary` immediately
rejects with a `ParseError` the moment it's the next token. `=>` is separately special-cased at the
lexer level to also tokenize as `FORBIDDEN_KEYWORD` (arrow functions are blocked before the parser ever
runs) even though it's matched by the *2-character operator* scanner, not the keyword scanner.

**4. Runtime guard on the callee itself** (`evaluateAst`'s `CallExpression` case): even if a value
bound into `state`/`extraContext` happens to literally *be* `Function` or `eval` (the app's own fault
for putting it there, not a sandbox bypass), calling it is still blocked by an identity check
(`fn === Function || fn === eval`) right before invocation.

## What's deliberately NOT supported (and what happens if you write it anyway)

- **Template literal interpolation** (`` `Hello ${name}` ``): the lexer tokenizes the `${` boundary
  correctly (`TEMPLATE_HEAD`/`TEMPLATE_MIDDLE`/`TEMPLATE_TAIL` token types exist), but the parser's
  `parsePrimary` only has a case for `TEMPLATE_NO_SUBST` (a backtick string with no `${...}` at all).
  Any interpolated template literal hits `parsePrimary`'s final `throw new ParseError('Unexpected
  token...')` the moment the head token is consumed as far as it can be — it is a real parse error, not
  silently-wrong output. Only `` `plain text, no interpolation` `` works, and it evaluates to a plain
  string literal (`TemplateLiteral.quasis.join('')`), not a real template literal AST.
- **Exponentiation (`**`)**, **arrow functions (`=>`)**, **`new`**, **destructuring**, **spread
  (`...`)**, **regex literals**, **bitwise `&`/`|`/`^`/`<<`/`>>`** (the lexer's single-char operator set
  includes `&`/`|`/`^` but no parser tier ever consumes them as binary operators, so e.g. `a & b` parses
  `a` as a complete expression and then fails on the unconsumed `& b`), **labeled statements**, **multi-
  statement blocks (`{ ... }` is only ever an object literal, never a block)** — none of these exist in
  this language. If you write them, you get a `ParseError` (a real `Error` instance, always synchronous,
  never a hang), not a silent misinterpretation.
- Every caller (`evaluateExpression`/`executeStatement` in `directives/reactivity.ts`) wraps
  `parseExpressionToAst` + `evaluateAst` in a `try`/`catch` and logs a console warning on failure — a
  malformed or malicious directive expression degrades that one binding to `undefined`/no-op, it never
  takes down the page.

## Known, accepted resource bound

`parsePostfix`/`parsePrimary`'s grouping/array/object/call-argument rules recurse into
`parseExpression` for each nested construct, so pathological input like `((((((...))))))` (or the
member-access/array-index equivalent) consumes one JS call-stack frame per nesting level. For a large
enough N this throws a `RangeError: Maximum call stack size exceeded` — a real, catchable `Error`
(verified by the fuzz suite), not a crash or a hang. `directives/reactivity.ts`'s existing `try`/`catch`
around every evaluation already absorbs this the same way it absorbs a `ParseError`. Directive
expressions are authored by the same developer who writes the surrounding Razor markup, not arbitrary
end-user input in this framework's threat model — but if an app ever interpolates untrusted length into
a directive expression string, this is the shape of the resulting (non-crashing) failure mode.
