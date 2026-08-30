var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/directives/security.ts
function isSafeProperty(prop) {
  if (typeof prop !== "string") return true;
  return !BLOCKED_PROPERTIES.has(prop);
}
function sanitizeUrl(url) {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  const cleaned = trimmed.replace(/[\u0000-\u001F\u007F\s]+/g, "");
  const lowerCleaned = cleaned.toLowerCase();
  if (lowerCleaned.startsWith("javascript:") || lowerCleaned.startsWith("vbscript:") || lowerCleaned.startsWith("data:text/html") || lowerCleaned.startsWith("data:application/") || lowerCleaned.startsWith("data:text/javascript") || lowerCleaned.startsWith("file:")) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous URL protocol: "${trimmed}"`);
    return "about:blank";
  }
  if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("#") || trimmed.startsWith("?")) {
    return trimmed;
  }
  if (lowerCleaned.startsWith("data:")) {
    if (SAFE_IMAGE_DATA_REGEX.test(cleaned)) {
      return trimmed;
    }
    console.warn(`[SoftMax.LaughTale Security] Blocked non-whitelisted data URI: "${trimmed}"`);
    return "about:blank";
  }
  try {
    const base = typeof document !== "undefined" && document.baseURI ? document.baseURI : "http://localhost";
    const parsed = new URL(trimmed, base);
    if (parsed.protocol) {
      if (SAFE_PROTOCOLS.has(parsed.protocol)) {
        return trimmed;
      }
      console.warn(`[SoftMax.LaughTale Security] Blocked disallowed protocol "${parsed.protocol}": "${trimmed}"`);
      return "about:blank";
    }
    return trimmed;
  } catch {
    console.warn(`[SoftMax.LaughTale Security] Failed to parse URL: "${trimmed}"`);
    return "about:blank";
  }
}
function isSafeAttribute(attrName) {
  const lower = attrName.toLowerCase();
  if (lower.startsWith("on") || DANGEROUS_ATTRIBUTES.has(lower)) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous dynamic attribute binding: "${attrName}"`);
    return false;
  }
  return true;
}
var BLOCKED_PROPERTIES, DANGEROUS_ATTRIBUTES, SAFE_PROTOCOLS, SAFE_IMAGE_DATA_REGEX, trustedTypesPolicy;
var init_security = __esm({
  "src/directives/security.ts"() {
    "use strict";
    BLOCKED_PROPERTIES = /* @__PURE__ */ new Set([
      "__proto__",
      "prototype",
      "constructor",
      "window",
      "document",
      "globalThis",
      "location",
      "localStorage",
      "sessionStorage",
      "indexedDB",
      "cookie",
      "eval",
      "Function",
      "XMLHttpRequest",
      "fetch"
    ]);
    DANGEROUS_ATTRIBUTES = /* @__PURE__ */ new Set([
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onfocus",
      "onblur",
      "onchange",
      "onsubmit",
      "formaction",
      "onanimationstart",
      "onanimationend",
      "ontransitionend",
      "onmouseenter",
      "onmouseleave"
    ]);
    SAFE_PROTOCOLS = /* @__PURE__ */ new Set([
      "http:",
      "https:",
      "mailto:",
      "tel:",
      "blob:"
    ]);
    SAFE_IMAGE_DATA_REGEX = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml)(?:;[a-z0-9-]+=[a-z0-9-]+)*;base64,[a-z0-9+/=\s]+$/i;
    trustedTypesPolicy = null;
    if (typeof window !== "undefined" && window.trustedTypes?.createPolicy) {
      try {
        trustedTypesPolicy = window.trustedTypes.createPolicy("laughtale-html", {
          createHTML: (s) => s
        });
      } catch {
      }
    }
  }
});

// src/directives/expression/ast.ts
var init_ast = __esm({
  "src/directives/expression/ast.ts"() {
    "use strict";
  }
});

// src/directives/expression/lexer.ts
var FORBIDDEN_KEYWORDS, Lexer;
var init_lexer = __esm({
  "src/directives/expression/lexer.ts"() {
    "use strict";
    FORBIDDEN_KEYWORDS = /* @__PURE__ */ new Set([
      "new",
      "function",
      "class",
      "import",
      "export",
      "return",
      "with",
      "while",
      "for",
      "do",
      "switch",
      "case",
      "break",
      "continue",
      "debugger",
      "var",
      "let",
      "const",
      "throw",
      "try",
      "catch",
      "finally",
      "yield",
      "async",
      "await",
      "delete",
      "void"
    ]);
    Lexer = class {
      src;
      pos = 0;
      len;
      constructor(src) {
        this.src = src;
        this.len = src.length;
      }
      tokenize() {
        const tokens = [];
        while (this.pos < this.len) {
          this.skipWhitespace();
          if (this.pos >= this.len) break;
          const ch = this.src[this.pos];
          const start = this.pos;
          if (ch === "/" && this.pos + 1 < this.len) {
            if (this.src[this.pos + 1] === "/") {
              this.pos += 2;
              while (this.pos < this.len && this.src[this.pos] !== "\n") this.pos++;
              continue;
            }
            if (this.src[this.pos + 1] === "*") {
              this.pos += 2;
              while (this.pos + 1 < this.len && !(this.src[this.pos] === "*" && this.src[this.pos + 1] === "/")) {
                this.pos++;
              }
              this.pos += 2;
              continue;
            }
          }
          if (this.isDigit(ch) || ch === "." && this.pos + 1 < this.len && this.isDigit(this.src[this.pos + 1])) {
            tokens.push(this.readNumber());
            continue;
          }
          if (ch === '"' || ch === "'") {
            tokens.push(this.readString(ch));
            continue;
          }
          if (ch === "`") {
            tokens.push(this.readTemplateLiteral());
            continue;
          }
          if (this.isIdentStart(ch)) {
            tokens.push(this.readIdentifierOrKeyword());
            continue;
          }
          const multi = this.readOperatorOrPunctuation();
          if (multi) {
            tokens.push(multi);
            continue;
          }
          throw new Error(`Unexpected character '${ch}' at position ${this.pos}`);
        }
        tokens.push({ type: "EOF", value: "", pos: this.pos });
        return tokens;
      }
      skipWhitespace() {
        while (this.pos < this.len) {
          const ch = this.src.charCodeAt(this.pos);
          if (ch === 32 || ch === 9 || ch === 10 || ch === 13) {
            this.pos++;
          } else {
            break;
          }
        }
      }
      isDigit(ch) {
        return ch >= "0" && ch <= "9";
      }
      isIdentStart(ch) {
        return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "_" || ch === "$";
      }
      isIdentPart(ch) {
        return this.isIdentStart(ch) || this.isDigit(ch);
      }
      readNumber() {
        const start = this.pos;
        let isFloat = false;
        if (this.src[this.pos] === ".") {
          isFloat = true;
          this.pos++;
        }
        while (this.pos < this.len) {
          const ch = this.src[this.pos];
          if (this.isDigit(ch)) {
            this.pos++;
          } else if (ch === "." && !isFloat) {
            isFloat = true;
            this.pos++;
          } else if ((ch === "e" || ch === "E") && this.pos + 1 < this.len) {
            this.pos++;
            if (this.src[this.pos] === "+" || this.src[this.pos] === "-") {
              this.pos++;
            }
            while (this.pos < this.len && this.isDigit(this.src[this.pos])) {
              this.pos++;
            }
            break;
          } else {
            break;
          }
        }
        const raw = this.src.slice(start, this.pos);
        return {
          type: "NUMBER",
          value: raw,
          raw: Number(raw),
          pos: start
        };
      }
      readString(quote) {
        const start = this.pos;
        this.pos++;
        let val = "";
        while (this.pos < this.len) {
          const ch = this.src[this.pos];
          if (ch === quote) {
            this.pos++;
            return {
              type: "STRING",
              value: val,
              raw: val,
              pos: start
            };
          }
          if (ch === "\\" && this.pos + 1 < this.len) {
            this.pos++;
            const esc = this.src[this.pos];
            if (esc === "n") val += "\n";
            else if (esc === "r") val += "\r";
            else if (esc === "t") val += "	";
            else if (esc === "\\") val += "\\";
            else if (esc === quote) val += quote;
            else val += esc;
            this.pos++;
          } else {
            val += ch;
            this.pos++;
          }
        }
        throw new Error(`Unterminated string starting at position ${start}`);
      }
      readTemplateLiteral() {
        const start = this.pos;
        this.pos++;
        let val = "";
        while (this.pos < this.len) {
          const ch = this.src[this.pos];
          if (ch === "`") {
            this.pos++;
            return {
              type: "TEMPLATE_NO_SUBST",
              value: val,
              raw: val,
              pos: start
            };
          }
          if (ch === "$" && this.pos + 1 < this.len && this.src[this.pos + 1] === "{") {
            this.pos += 2;
            return {
              type: "TEMPLATE_HEAD",
              value: val,
              raw: val,
              pos: start
            };
          }
          if (ch === "\\" && this.pos + 1 < this.len) {
            this.pos++;
            val += this.src[this.pos];
            this.pos++;
          } else {
            val += ch;
            this.pos++;
          }
        }
        throw new Error(`Unterminated template string starting at position ${start}`);
      }
      readIdentifierOrKeyword() {
        const start = this.pos;
        while (this.pos < this.len && this.isIdentPart(this.src[this.pos])) {
          this.pos++;
        }
        const word = this.src.slice(start, this.pos);
        if (word === "true") {
          return { type: "BOOLEAN", value: word, raw: true, pos: start };
        }
        if (word === "false") {
          return { type: "BOOLEAN", value: word, raw: false, pos: start };
        }
        if (word === "null") {
          return { type: "NULL", value: word, raw: null, pos: start };
        }
        if (word === "undefined") {
          return { type: "UNDEFINED", value: word, raw: void 0, pos: start };
        }
        if (FORBIDDEN_KEYWORDS.has(word)) {
          return { type: "FORBIDDEN_KEYWORD", value: word, pos: start };
        }
        return { type: "IDENTIFIER", value: word, pos: start };
      }
      readOperatorOrPunctuation() {
        const start = this.pos;
        const rest = this.src.slice(start);
        const threeChar = ["===", "!==", ">>>", "**=", "&&=", "||=", "??="];
        for (const op of threeChar) {
          if (rest.startsWith(op)) {
            this.pos += 3;
            return { type: "OPERATOR", value: op, pos: start };
          }
        }
        const twoChar = [
          "==",
          "!=",
          "<=",
          ">=",
          "&&",
          "||",
          "??",
          "++",
          "--",
          "+=",
          "-=",
          "*=",
          "/=",
          "%=",
          "?.",
          "=>"
        ];
        for (const op of twoChar) {
          if (rest.startsWith(op)) {
            this.pos += 2;
            if (op === "=>") {
              return { type: "FORBIDDEN_KEYWORD", value: op, pos: start };
            }
            if (op === "?.") {
              return { type: "PUNCTUATION", value: op, pos: start };
            }
            return { type: "OPERATOR", value: op, pos: start };
          }
        }
        const singleCharPunct = "()[]{},;.:?";
        const ch = this.src[this.pos];
        if (singleCharPunct.includes(ch)) {
          this.pos++;
          return { type: "PUNCTUATION", value: ch, pos: start };
        }
        const singleCharOps = "+-*/%&|^!~<>=";
        if (singleCharOps.includes(ch)) {
          this.pos++;
          return { type: "OPERATOR", value: ch, pos: start };
        }
        return null;
      }
    };
  }
});

// src/directives/expression/parser.ts
var ParseError, Parser;
var init_parser = __esm({
  "src/directives/expression/parser.ts"() {
    "use strict";
    init_lexer();
    ParseError = class extends Error {
      pos;
      constructor(message, pos = 0) {
        super(`[SoftMax.LaughTale Expression Parser] ${message} at pos ${pos}`);
        this.name = "ParseError";
        this.pos = pos;
      }
    };
    Parser = class _Parser {
      tokens;
      current = 0;
      constructor(tokens) {
        this.tokens = tokens;
      }
      static parse(source) {
        const trimmed = source.trim();
        if (!trimmed) {
          return { type: "Literal", value: void 0 };
        }
        const lexer = new Lexer(trimmed);
        const tokens = lexer.tokenize();
        const parser = new _Parser(tokens);
        const node = parser.parseStatementSequence();
        if (!parser.isAtEnd()) {
          throw new ParseError(`Unexpected token '${parser.peek().value}'`, parser.peek().pos);
        }
        return node;
      }
      parseStatementSequence() {
        const exprs = [];
        while (!this.isAtEnd()) {
          const expr = this.parseExpression();
          exprs.push(expr);
          if (this.match("PUNCTUATION", ";")) {
            while (this.match("PUNCTUATION", ";")) {
            }
          } else {
            break;
          }
        }
        if (exprs.length === 0) {
          return { type: "Literal", value: void 0 };
        }
        if (exprs.length === 1) {
          return exprs[0];
        }
        return { type: "SequenceExpression", expressions: exprs };
      }
      parseExpression() {
        return this.parseAssignment();
      }
      parseAssignment() {
        const expr = this.parseTernary();
        const assignOps = ["=", "+=", "-=", "*=", "/="];
        if (this.check("OPERATOR") && assignOps.includes(this.peek().value)) {
          const opToken = this.advance();
          const right = this.parseAssignment();
          if (expr.type === "Identifier" || expr.type === "MemberExpression" || expr.type === "IndexExpression") {
            return {
              type: "AssignmentExpression",
              operator: opToken.value,
              left: expr,
              right
            };
          }
          throw new ParseError("Invalid left-hand side in assignment", opToken.pos);
        }
        return expr;
      }
      parseTernary() {
        let expr = this.parseNullish();
        if (this.match("PUNCTUATION", "?") || this.match("OPERATOR", "?")) {
          const consequent = this.parseExpression();
          if (!this.match("PUNCTUATION", ":") && !this.match("OPERATOR", ":")) {
            throw new ParseError("Expected ':' in conditional expression", this.peek().pos);
          }
          const alternate = this.parseExpression();
          expr = {
            type: "ConditionalExpression",
            test: expr,
            consequent,
            alternate
          };
        }
        return expr;
      }
      parseNullish() {
        let left = this.parseLogicalOr();
        while (this.match("OPERATOR", "??")) {
          const right = this.parseLogicalOr();
          left = {
            type: "LogicalExpression",
            operator: "??",
            left,
            right
          };
        }
        return left;
      }
      parseLogicalOr() {
        let left = this.parseLogicalAnd();
        while (this.match("OPERATOR", "||")) {
          const right = this.parseLogicalAnd();
          left = {
            type: "LogicalExpression",
            operator: "||",
            left,
            right
          };
        }
        return left;
      }
      parseLogicalAnd() {
        let left = this.parseEquality();
        while (this.match("OPERATOR", "&&")) {
          const right = this.parseEquality();
          left = {
            type: "LogicalExpression",
            operator: "&&",
            left,
            right
          };
        }
        return left;
      }
      parseEquality() {
        let left = this.parseRelational();
        while (this.check("OPERATOR") && ["===", "!==", "==", "!="].includes(this.peek().value)) {
          const op = this.advance().value;
          const right = this.parseRelational();
          left = {
            type: "BinaryExpression",
            operator: op,
            left,
            right
          };
        }
        return left;
      }
      parseRelational() {
        let left = this.parseAdditive();
        while (this.check("OPERATOR") && ["<", "<=", ">", ">=", "in", "instanceof"].includes(this.peek().value)) {
          const op = this.advance().value;
          const right = this.parseAdditive();
          left = {
            type: "BinaryExpression",
            operator: op,
            left,
            right
          };
        }
        return left;
      }
      parseAdditive() {
        let left = this.parseMultiplicative();
        while (this.check("OPERATOR") && ["+", "-"].includes(this.peek().value)) {
          const op = this.advance().value;
          const right = this.parseMultiplicative();
          left = {
            type: "BinaryExpression",
            operator: op,
            left,
            right
          };
        }
        return left;
      }
      parseMultiplicative() {
        let left = this.parseUnary();
        while (this.check("OPERATOR") && ["*", "/", "%"].includes(this.peek().value)) {
          const op = this.advance().value;
          const right = this.parseUnary();
          left = {
            type: "BinaryExpression",
            operator: op,
            left,
            right
          };
        }
        return left;
      }
      parseUnary() {
        if (this.check("OPERATOR") && ["!", "+", "-", "~"].includes(this.peek().value)) {
          const op = this.advance().value;
          const arg = this.parseUnary();
          return {
            type: "UnaryExpression",
            operator: op,
            argument: arg
          };
        }
        if (this.check("IDENTIFIER") && this.peek().value === "typeof") {
          this.advance();
          const arg = this.parseUnary();
          return {
            type: "UnaryExpression",
            operator: "typeof",
            argument: arg
          };
        }
        if (this.check("OPERATOR") && (this.peek().value === "++" || this.peek().value === "--")) {
          const op = this.advance().value;
          const arg = this.parsePostfix();
          if (arg.type === "Identifier" || arg.type === "MemberExpression" || arg.type === "IndexExpression") {
            return {
              type: "UpdateExpression",
              operator: op,
              argument: arg,
              prefix: true
            };
          }
          throw new ParseError(`Invalid left-hand side in prefix ${op} operation`, this.peek().pos);
        }
        return this.parsePostfix();
      }
      parsePostfix() {
        let expr = this.parsePrimary();
        while (true) {
          if (this.match("PUNCTUATION", ".")) {
            const propToken = this.consume("IDENTIFIER", void 0, "Expected property identifier after .");
            this.validatePropertyName(propToken.value, propToken.pos);
            expr = {
              type: "MemberExpression",
              object: expr,
              property: propToken.value
            };
          } else if (this.match("OPERATOR", "?.") || this.match("PUNCTUATION", "?.")) {
            if (this.match("PUNCTUATION", "[")) {
              const index = this.parseExpression();
              this.consume("PUNCTUATION", "]", "Expected ']' after optional index");
              expr = {
                type: "IndexExpression",
                object: expr,
                index,
                optional: true
              };
            } else if (this.match("PUNCTUATION", "(")) {
              const args = this.parseArguments();
              expr = {
                type: "CallExpression",
                callee: expr,
                args,
                optional: true
              };
            } else {
              const propToken = this.consume("IDENTIFIER", void 0, "Expected property identifier after ?.");
              this.validatePropertyName(propToken.value, propToken.pos);
              expr = {
                type: "MemberExpression",
                object: expr,
                property: propToken.value,
                optional: true
              };
            }
          } else if (this.match("PUNCTUATION", "[")) {
            const index = this.parseExpression();
            this.consume("PUNCTUATION", "]", "Expected ']' after computed index");
            expr = {
              type: "IndexExpression",
              object: expr,
              index
            };
          } else if (this.match("PUNCTUATION", "(")) {
            const args = this.parseArguments();
            expr = {
              type: "CallExpression",
              callee: expr,
              args
            };
          } else if (this.check("OPERATOR") && (this.peek().value === "++" || this.peek().value === "--")) {
            const op = this.advance().value;
            if (expr.type === "Identifier" || expr.type === "MemberExpression" || expr.type === "IndexExpression") {
              expr = {
                type: "UpdateExpression",
                operator: op,
                argument: expr,
                prefix: false
              };
            } else {
              throw new ParseError(`Invalid target for postfix ${op}`, this.peek().pos);
            }
          } else {
            break;
          }
        }
        return expr;
      }
      parseArguments() {
        const args = [];
        if (!this.check("PUNCTUATION", ")")) {
          do {
            if (this.check("PUNCTUATION", ")")) break;
            args.push(this.parseExpression());
          } while (this.match("PUNCTUATION", ","));
        }
        this.consume("PUNCTUATION", ")", "Expected ')' after argument list");
        return args;
      }
      parsePrimary() {
        const token = this.peek();
        if (token.type === "FORBIDDEN_KEYWORD") {
          throw new ParseError(`Forbidden keyword '${token.value}' is prohibited in directive expressions`, token.pos);
        }
        if (token.type === "NUMBER") {
          this.advance();
          return { type: "Literal", value: token.raw };
        }
        if (token.type === "STRING") {
          this.advance();
          return { type: "Literal", value: token.raw };
        }
        if (token.type === "BOOLEAN") {
          this.advance();
          return { type: "Literal", value: token.raw };
        }
        if (token.type === "NULL") {
          this.advance();
          return { type: "Literal", value: null };
        }
        if (token.type === "UNDEFINED") {
          this.advance();
          return { type: "Literal", value: void 0 };
        }
        if (token.type === "TEMPLATE_NO_SUBST") {
          this.advance();
          return {
            type: "TemplateLiteral",
            quasis: [token.value],
            expressions: []
          };
        }
        if (token.type === "IDENTIFIER") {
          this.advance();
          this.validatePropertyName(token.value, token.pos);
          return { type: "Identifier", name: token.value };
        }
        if (this.match("PUNCTUATION", "(")) {
          const expr = this.parseExpression();
          this.consume("PUNCTUATION", ")", "Expected ')' after grouped expression");
          return expr;
        }
        if (this.match("PUNCTUATION", "[")) {
          const elements = [];
          if (!this.check("PUNCTUATION", "]")) {
            do {
              if (this.check("PUNCTUATION", "]")) break;
              elements.push(this.parseExpression());
            } while (this.match("PUNCTUATION", ","));
          }
          this.consume("PUNCTUATION", "]", "Expected ']' after array literal");
          return { type: "ArrayLiteral", elements };
        }
        if (this.match("PUNCTUATION", "{")) {
          const properties = [];
          if (!this.check("PUNCTUATION", "}")) {
            do {
              if (this.check("PUNCTUATION", "}")) break;
              let key = "";
              if (this.check("IDENTIFIER") || this.check("STRING")) {
                const kToken = this.advance();
                key = kToken.value;
              } else {
                throw new ParseError("Expected property name in object literal", this.peek().pos);
              }
              let val;
              if (this.match("PUNCTUATION", ":")) {
                val = this.parseExpression();
              } else {
                val = { type: "Identifier", name: key };
              }
              properties.push({ key, value: val });
            } while (this.match("PUNCTUATION", ","));
          }
          this.consume("PUNCTUATION", "}", "Expected '}' after object literal");
          return { type: "ObjectLiteral", properties };
        }
        throw new ParseError(`Unexpected token '${token.value}'`, token.pos);
      }
      validatePropertyName(name, pos) {
        const forbiddenProps = ["constructor", "__proto__", "prototype", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__"];
        if (forbiddenProps.includes(name)) {
          throw new ParseError(`Access to restricted property '${name}' is blocked for security`, pos);
        }
      }
      match(type, value) {
        if (this.check(type, value)) {
          this.advance();
          return true;
        }
        return false;
      }
      check(type, value) {
        if (this.isAtEnd()) return false;
        const t = this.peek();
        if (t.type !== type) return false;
        if (value !== void 0 && t.value !== value) return false;
        return true;
      }
      advance() {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
      }
      isAtEnd() {
        return this.peek().type === "EOF";
      }
      peek() {
        return this.tokens[this.current] ?? { type: "EOF", value: "", pos: 0 };
      }
      previous() {
        return this.tokens[this.current - 1];
      }
      consume(type, value, errMsg) {
        if (this.check(type, value)) return this.advance();
        const t = this.peek();
        throw new ParseError(errMsg ?? `Expected token ${type} ${value ?? ""} but got '${t.value}'`, t.pos);
      }
    };
  }
});

// src/directives/expression/evaluator.ts
function parseExpressionToAst(expr) {
  const trimmed = expr.trim();
  if (!trimmed) return null;
  let ast = astCache.get(trimmed);
  if (!ast) {
    ast = Parser.parse(trimmed);
    if (astCache.size >= MAX_CACHE_SIZE) {
      const firstKey = astCache.keys().next().value;
      if (firstKey) astCache.delete(firstKey);
    }
    astCache.set(trimmed, ast);
  }
  return ast;
}
function evaluateAst(ast, state, extraContext = {}) {
  switch (ast.type) {
    case "Literal":
      return ast.value;
    case "Identifier": {
      const name = ast.name;
      if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked access to forbidden identifier: "${name}"`);
        return void 0;
      }
      if (extraContext && Object.prototype.hasOwnProperty.call(extraContext, name)) {
        return extraContext[name];
      }
      if (state && Object.prototype.hasOwnProperty.call(state, name)) {
        return state[name];
      }
      if (state && name in state && !FORBIDDEN_PROPERTIES.has(name)) {
        return state[name];
      }
      if (Object.prototype.hasOwnProperty.call(SAFE_BUILTINS, name)) {
        return SAFE_BUILTINS[name];
      }
      return void 0;
    }
    case "UnaryExpression": {
      const val = evaluateAst(ast.argument, state, extraContext);
      switch (ast.operator) {
        case "!":
          return !val;
        case "+":
          return +val;
        case "-":
          return -val;
        case "~":
          return ~val;
        case "typeof":
          return typeof val;
        default:
          return void 0;
      }
    }
    case "BinaryExpression": {
      const left = evaluateAst(ast.left, state, extraContext);
      const right = evaluateAst(ast.right, state, extraContext);
      switch (ast.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "%":
          return left % right;
        case "==":
          return left == right;
        case "===":
          return left === right;
        case "!=":
          return left != right;
        case "!==":
          return left !== right;
        case "<":
          return left < right;
        case "<=":
          return left <= right;
        case ">":
          return left > right;
        case ">=":
          return left >= right;
        case "in":
          return typeof right === "object" && right !== null ? left in right : false;
        case "instanceof":
          return typeof right === "function" ? left instanceof right : false;
        default:
          return void 0;
      }
    }
    case "LogicalExpression": {
      const left = evaluateAst(ast.left, state, extraContext);
      switch (ast.operator) {
        case "&&":
          return left ? evaluateAst(ast.right, state, extraContext) : left;
        case "||":
          return left ? left : evaluateAst(ast.right, state, extraContext);
        case "??":
          return left !== null && left !== void 0 ? left : evaluateAst(ast.right, state, extraContext);
        default:
          return void 0;
      }
    }
    case "ConditionalExpression": {
      const test = evaluateAst(ast.test, state, extraContext);
      return test ? evaluateAst(ast.consequent, state, extraContext) : evaluateAst(ast.alternate, state, extraContext);
    }
    case "MemberExpression": {
      const obj = evaluateAst(ast.object, state, extraContext);
      if (obj == null) {
        return void 0;
      }
      const prop = ast.property;
      if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked access to restricted property: "${prop}"`);
        return void 0;
      }
      return obj[prop];
    }
    case "IndexExpression": {
      const obj = evaluateAst(ast.object, state, extraContext);
      if (obj == null) {
        return void 0;
      }
      const idx = evaluateAst(ast.index, state, extraContext);
      const prop = String(idx);
      if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked access to restricted property: "${prop}"`);
        return void 0;
      }
      return obj[idx];
    }
    case "CallExpression": {
      let fn;
      let thisArg = state;
      if (ast.callee.type === "MemberExpression") {
        const obj = evaluateAst(ast.callee.object, state, extraContext);
        if (obj == null) return void 0;
        const prop = ast.callee.property;
        if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
          console.warn(`[SoftMax.LaughTale Security] Blocked call to restricted property: "${prop}"`);
          return void 0;
        }
        fn = obj[prop];
        thisArg = obj;
      } else if (ast.callee.type === "IndexExpression") {
        const obj = evaluateAst(ast.callee.object, state, extraContext);
        if (obj == null) return void 0;
        const idx = evaluateAst(ast.callee.index, state, extraContext);
        const prop = String(idx);
        if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
          console.warn(`[SoftMax.LaughTale Security] Blocked call to restricted property: "${prop}"`);
          return void 0;
        }
        fn = obj[idx];
        thisArg = obj;
      } else {
        fn = evaluateAst(ast.callee, state, extraContext);
      }
      if (typeof fn !== "function") {
        return void 0;
      }
      if (fn === Function || typeof eval !== "undefined" && fn === eval) {
        console.warn("[SoftMax.LaughTale Security] Blocked execution of dynamic Function/eval constructor");
        return void 0;
      }
      const args = ast.args.map((arg) => evaluateAst(arg, state, extraContext));
      return fn.apply(thisArg, args);
    }
    case "ArrayLiteral":
      return ast.elements.map((el) => evaluateAst(el, state, extraContext));
    case "ObjectLiteral": {
      const obj = {};
      for (const prop of ast.properties) {
        if (FORBIDDEN_PROPERTIES.has(prop.key)) {
          console.warn(`[SoftMax.LaughTale Security] Blocked object literal key: "${prop.key}"`);
          continue;
        }
        obj[prop.key] = evaluateAst(prop.value, state, extraContext);
      }
      return obj;
    }
    case "TemplateLiteral": {
      return ast.quasis.join("");
    }
    case "AssignmentExpression": {
      const val = evaluateAst(ast.right, state, extraContext);
      return applyAssignment(ast.left, ast.operator, val, state, extraContext);
    }
    case "UpdateExpression": {
      return applyUpdate(ast.argument, ast.operator, ast.prefix, state, extraContext);
    }
    case "SequenceExpression": {
      let result = void 0;
      for (const expr of ast.expressions) {
        result = evaluateAst(expr, state, extraContext);
      }
      return result;
    }
    default:
      return void 0;
  }
}
function applyAssignment(target, operator, value, state, extraContext) {
  if (target.type === "Identifier") {
    const name = target.name;
    if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
      console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted identifier: "${name}"`);
      return void 0;
    }
    const targetObj = extraContext && name in extraContext ? extraContext : state;
    const current = targetObj[name];
    let next = value;
    if (operator === "+=") next = current + value;
    else if (operator === "-=") next = current - value;
    else if (operator === "*=") next = current * value;
    else if (operator === "/=") next = current / value;
    targetObj[name] = next;
    return next;
  }
  if (target.type === "MemberExpression") {
    const obj = evaluateAst(target.object, state, extraContext);
    if (obj == null) return void 0;
    const prop = target.property;
    if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
      console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${prop}"`);
      return void 0;
    }
    const current = obj[prop];
    let next = value;
    if (operator === "+=") next = current + value;
    else if (operator === "-=") next = current - value;
    else if (operator === "*=") next = current * value;
    else if (operator === "/=") next = current / value;
    obj[prop] = next;
    return next;
  }
  if (target.type === "IndexExpression") {
    const obj = evaluateAst(target.object, state, extraContext);
    if (obj == null) return void 0;
    const idx = evaluateAst(target.index, state, extraContext);
    const prop = String(idx);
    if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
      console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${prop}"`);
      return void 0;
    }
    const current = obj[idx];
    let next = value;
    if (operator === "+=") next = current + value;
    else if (operator === "-=") next = current - value;
    else if (operator === "*=") next = current * value;
    else if (operator === "/=") next = current / value;
    obj[idx] = next;
    return next;
  }
  return void 0;
}
function applyUpdate(target, operator, prefix, state, extraContext) {
  const delta = operator === "++" ? 1 : -1;
  if (target.type === "Identifier") {
    const name = target.name;
    if (FORBIDDEN_PROPERTIES.has(name) || FORBIDDEN_IDENTIFIERS.has(name)) {
      return void 0;
    }
    const targetObj = extraContext && name in extraContext ? extraContext : state;
    const oldVal = Number(targetObj[name] ?? 0);
    const newVal = oldVal + delta;
    targetObj[name] = newVal;
    return prefix ? newVal : oldVal;
  }
  if (target.type === "MemberExpression") {
    const obj = evaluateAst(target.object, state, extraContext);
    if (obj == null) return void 0;
    const prop = target.property;
    if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
      return void 0;
    }
    const oldVal = Number(obj[prop] ?? 0);
    const newVal = oldVal + delta;
    obj[prop] = newVal;
    return prefix ? newVal : oldVal;
  }
  if (target.type === "IndexExpression") {
    const obj = evaluateAst(target.object, state, extraContext);
    if (obj == null) return void 0;
    const idx = evaluateAst(target.index, state, extraContext);
    const prop = String(idx);
    if (FORBIDDEN_PROPERTIES.has(prop) || FORBIDDEN_IDENTIFIERS.has(prop)) {
      return void 0;
    }
    const oldVal = Number(obj[idx] ?? 0);
    const newVal = oldVal + delta;
    obj[idx] = newVal;
    return prefix ? newVal : oldVal;
  }
  return void 0;
}
var FORBIDDEN_PROPERTIES, FORBIDDEN_IDENTIFIERS, SAFE_BUILTINS, astCache, MAX_CACHE_SIZE;
var init_evaluator = __esm({
  "src/directives/expression/evaluator.ts"() {
    "use strict";
    init_parser();
    FORBIDDEN_PROPERTIES = /* @__PURE__ */ new Set([
      "constructor",
      "__proto__",
      "prototype",
      "__defineGetter__",
      "__defineSetter__",
      "__lookupGetter__",
      "__lookupSetter__"
    ]);
    FORBIDDEN_IDENTIFIERS = /* @__PURE__ */ new Set([
      "window",
      "document",
      "globalThis",
      "top",
      "parent",
      "frames",
      "self",
      "location",
      "localStorage",
      "sessionStorage",
      "indexedDB",
      "cookie",
      "eval",
      "Function",
      "XMLHttpRequest",
      "fetch",
      "setTimeout",
      "setInterval",
      "setImmediate",
      "clearTimeout",
      "clearInterval",
      "clearImmediate",
      "process",
      "require",
      "importScripts"
    ]);
    SAFE_BUILTINS = {
      Math: Object.freeze(Math),
      Number: Object.freeze(Number),
      String: Object.freeze(String),
      Boolean: Object.freeze(Boolean),
      Date: Object.freeze(Date),
      Array: Object.freeze(Array),
      Object: Object.freeze(Object),
      JSON: Object.freeze(JSON),
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      encodeURI,
      encodeURIComponent,
      decodeURI,
      decodeURIComponent
    };
    astCache = /* @__PURE__ */ new Map();
    MAX_CACHE_SIZE = 500;
  }
});

// src/directives/expression/index.ts
var init_expression = __esm({
  "src/directives/expression/index.ts"() {
    "use strict";
    init_ast();
    init_lexer();
    init_parser();
    init_evaluator();
  }
});

// src/directives/reactivity.ts
var reactivity_exports = {};
__export(reactivity_exports, {
  bindElementReactivity: () => bindElementReactivity,
  createReactiveScope: () => createReactiveScope,
  evaluateExpression: () => evaluateExpression,
  executeStatement: () => executeStatement,
  getNearestScope: () => getNearestScope
});
function getNearestScope(element) {
  let current = element;
  while (current) {
    const scope = elementScopeMap.get(current);
    if (scope) return scope;
    current = current.parentElement;
  }
  return void 0;
}
function createReactiveScope(container, initialData) {
  const listeners = /* @__PURE__ */ new Set();
  const state = new Proxy(initialData, {
    set(target, prop, value) {
      if (!isSafeProperty(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked assignment to restricted property: "${String(prop)}"`);
        return true;
      }
      target[prop] = value;
      listeners.forEach((fn) => fn());
      return true;
    },
    get(target, prop) {
      if (!isSafeProperty(prop)) {
        console.warn(`[SoftMax.LaughTale Security] Blocked access to restricted property: "${String(prop)}"`);
        return void 0;
      }
      return target[prop];
    }
  });
  const scope = { state, listeners, container };
  elementScopeMap.set(container, scope);
  return scope;
}
function evaluateExpression(expr, state, extraContext = {}) {
  try {
    const ast = parseExpressionToAst(expr);
    if (!ast) return void 0;
    return evaluateAst(ast, state, extraContext);
  } catch (err) {
    console.warn(`[SoftMax.LaughTale] Error evaluating expression "${expr}":`, err);
    return void 0;
  }
}
function executeStatement(stmt, state, extraContext = {}) {
  try {
    const ast = parseExpressionToAst(stmt);
    if (!ast) return;
    evaluateAst(ast, state, extraContext);
  } catch (err) {
    console.warn(`[SoftMax.LaughTale] Error executing statement "${stmt}":`, err);
  }
}
function bindElementReactivity(element, scope) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-bind") {
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
        element.textContent = String(val ?? "");
      };
      scope.listeners.add(update);
      update();
    } else if (attr.name.startsWith("l-bind:")) {
      const targetAttr = attr.name.slice(7);
      if (!isSafeAttribute(targetAttr)) {
        continue;
      }
      const expr = attr.value;
      const update = () => {
        let val = evaluateExpression(expr, scope.state);
        if (["href", "src", "action"].includes(targetAttr.toLowerCase())) {
          val = sanitizeUrl(val);
        }
        if (val === false || val === null || val === void 0) {
          element.removeAttribute(targetAttr);
        } else if (val === true) {
          element.setAttribute(targetAttr, "");
        } else {
          element.setAttribute(targetAttr, String(val));
        }
      };
      scope.listeners.add(update);
      update();
    } else if (attr.name === "l-class") {
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
        if (typeof val === "object" && val !== null) {
          for (const [className, active] of Object.entries(val)) {
            element.classList.toggle(className, Boolean(active));
          }
        } else if (typeof val === "string") {
          element.className = val;
        }
      };
      scope.listeners.add(update);
      update();
    } else if (attr.name === "l-style") {
      const expr = attr.value;
      const update = () => {
        const val = evaluateExpression(expr, scope.state);
        if (typeof val === "object" && val !== null) {
          Object.assign(element.style, val);
        }
      };
      scope.listeners.add(update);
      update();
    }
  }
  if (element.hasAttribute("l-model")) {
    const propName = element.getAttribute("l-model");
    if (!isSafeProperty(propName)) {
      console.warn(`[SoftMax.LaughTale Security] Blocked l-model binding on restricted property: "${propName}"`);
      return;
    }
    const input = element;
    const update = () => {
      const val = scope.state[propName];
      if (input.type === "checkbox") {
        input.checked = Boolean(val);
      } else {
        input.value = val ?? "";
      }
    };
    scope.listeners.add(update);
    update();
    const eventName = input.type === "checkbox" || input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(eventName, () => {
      if (input.type === "checkbox") {
        scope.state[propName] = input.checked;
      } else if (input.type === "number") {
        scope.state[propName] = input.value === "" ? null : Number(input.value);
      } else {
        scope.state[propName] = input.value;
      }
    });
  }
}
var elementScopeMap;
var init_reactivity = __esm({
  "src/directives/reactivity.ts"() {
    "use strict";
    init_security();
    init_expression();
    elementScopeMap = /* @__PURE__ */ new WeakMap();
  }
});

// tests/setup.ts
import { Window } from "happy-dom";
var win = new Window({
  url: "http://localhost:5000"
});
globalThis.window = win;
globalThis.document = win.document;
globalThis.HTMLElement = win.HTMLElement;
globalThis.HTMLInputElement = win.HTMLInputElement;
globalThis.HTMLSelectElement = win.HTMLSelectElement;
globalThis.HTMLTextAreaElement = win.HTMLTextAreaElement;
globalThis.HTMLButtonElement = win.HTMLButtonElement;
globalThis.CustomEvent = win.CustomEvent;
globalThis.Event = win.Event;
globalThis.MouseEvent = win.MouseEvent;
globalThis.KeyboardEvent = win.KeyboardEvent;
globalThis.Node = win.Node;
globalThis.localStorage = win.localStorage;
globalThis.sessionStorage = win.sessionStorage;
globalThis.DOMParser = win.DOMParser;
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16);
try {
  Object.defineProperty(globalThis.navigator, "clipboard", {
    value: {
      writeText: async (_text) => Promise.resolve()
    },
    configurable: true
  });
} catch {
}
globalThis.MutationObserver = win.MutationObserver || class {
  observe() {
  }
  disconnect() {
  }
};
globalThis.IntersectionObserver = class {
  callback;
  constructor(cb) {
    this.callback = cb;
  }
  observe(el) {
    this.callback([{ isIntersecting: true, target: el }]);
  }
  disconnect() {
  }
};

// tests/router.test.ts
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

// src/runtime/registry.ts
var registry = /* @__PURE__ */ new Map();
function getIslandDefinition(name) {
  const loader = registry.get(name);
  return loader ? { name, loader } : void 0;
}

// src/runtime/reviver.ts
var ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;
var propTypes = {
  0: (val) => reviveObject(val),
  1: (val) => reviveArray(val),
  2: (val) => new RegExp(val),
  3: (val) => new Date(val),
  4: (val) => new Map(reviveArray(val)),
  5: (val) => new Set(reviveArray(val)),
  6: (val) => BigInt(val),
  7: (val) => new URL(val, window.location.origin),
  8: (val) => {
    if (typeof val === "string") {
      const binaryString = atob(val);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    return new Uint8Array(val);
  }
};
function reviveTuple(raw) {
  if (Array.isArray(raw) && raw.length === 2 && typeof raw[0] === "number" && raw[0] in propTypes) {
    return propTypes[raw[0]](raw[1]);
  }
  if (typeof raw === "string" && ISO_DATE_REGEX.test(raw)) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
  }
  if (Array.isArray(raw)) {
    return reviveArray(raw);
  }
  if (typeof raw === "object" && raw !== null) {
    return reviveObject(raw);
  }
  return raw;
}
function reviveArray(raw) {
  return raw.map(reviveTuple);
}
function reviveObject(raw) {
  if (!raw || typeof raw !== "object") return raw;
  const result = {};
  for (const [key, value] of Object.entries(raw)) {
    result[key] = reviveTuple(value);
  }
  return result;
}
function parseAndReviveProps(rawJson) {
  if (!rawJson || rawJson.trim() === "" || rawJson === "{}") {
    return {};
  }
  try {
    const parsed = JSON.parse(rawJson);
    return reviveTuple(parsed);
  } catch (err) {
    console.error("[SoftMax.LaughTale] Failed to parse and revive island props:", err, rawJson);
    return {};
  }
}

// src/runtime/retry.ts
async function importWithRetry(importFnOrUrl, retries = 3, baseDelayMs = 1e3) {
  if (typeof importFnOrUrl === "function") {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await importFnOrUrl();
      } catch (err) {
        if (attempt === retries - 1) throw err;
        const delay = baseDelayMs * Math.pow(2, attempt);
        console.warn(`[SoftMax.LaughTale] Island dynamic import failed. Retrying in ${delay}ms (Attempt ${attempt + 1}/${retries})...`, err);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  let url = importFnOrUrl;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await import(
        /* @vite-ignore */
        url
      );
    } catch (err) {
      if (attempt === retries - 1) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt);
      console.warn(`[SoftMax.LaughTale] Failed to fetch island script at ${url}. Retrying with cache-buster in ${delay}ms...`, err);
      await new Promise((resolve) => setTimeout(resolve, delay));
      const parsed = new URL(url, document.baseURI);
      parsed.searchParams.set("island-retry", Date.now().toString());
      url = parsed.toString();
    }
  }
  throw new Error(`[SoftMax.LaughTale] Permanent failure loading island module after ${retries} attempts.`);
}

// src/runtime/streaming.ts
function awaitStreamingReady(container) {
  const islandId = container.getAttribute("data-island-id") || container.getAttribute("data-island");
  const markerValue = `island:end:${islandId}`;
  if (document.readyState === "complete" || !container.hasAttribute("data-streaming")) {
    return Promise.resolve();
  }
  for (let node = container.lastChild; node; node = node.previousSibling) {
    if (node.nodeType === Node.COMMENT_NODE && (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === "island:end")) {
      node.remove();
      return Promise.resolve();
    }
  }
  return new Promise((resolve) => {
    let isResolved = false;
    const onDone = () => {
      if (!isResolved) {
        isResolved = true;
        observer.disconnect();
        document.removeEventListener("DOMContentLoaded", onDone);
        resolve();
      }
    };
    const observer = new MutationObserver(() => {
      for (let node = container.lastChild; node; node = node.previousSibling) {
        if (node.nodeType === Node.COMMENT_NODE && (node.nodeValue?.trim() === markerValue || node.nodeValue?.trim() === "island:end")) {
          node.remove();
          onDone();
          break;
        }
      }
    });
    observer.observe(container, { childList: true });
    document.addEventListener("DOMContentLoaded", onDone);
  });
}

// src/runtime/hydrator.ts
var HYDRATED_FLAG = "__laughtale_hydrated";
function hydrateIsland(container) {
  if (container[HYDRATED_FLAG]) return;
  const name = container.getAttribute("data-island") || container.getAttribute("name");
  if (!name) return;
  const strategy = (container.getAttribute("data-hydrate") || container.getAttribute("hydrate") || "load").toLowerCase();
  const mediaQuery = container.getAttribute("data-media") || container.getAttribute("media");
  switch (strategy) {
    case "load":
      executeHydration(container, name);
      break;
    case "idle":
      hydrateIdle(container, name);
      break;
    case "visible":
      hydrateVisible(container, name);
      break;
    case "interaction":
      hydrateInteraction(container, name);
      break;
    case "media":
      hydrateMedia(container, name, mediaQuery);
      break;
    case "never":
      break;
    default:
      executeHydration(container, name);
  }
}
async function executeHydration(container, name) {
  if (container[HYDRATED_FLAG]) return;
  container[HYDRATED_FLAG] = true;
  const definition = getIslandDefinition(name);
  if (!definition) {
    console.warn(`[SoftMax.LaughTale] Island '${name}' is not registered in the client registry.`);
    return;
  }
  try {
    await awaitStreamingReady(container);
    const rawProps = container.getAttribute("data-props") || container.getAttribute("props-json") || container.getAttribute("props");
    const props = parseAndReviveProps(rawProps);
    const module = await importWithRetry(definition.loader);
    const mount = module.default || module;
    if (typeof mount !== "function") {
      console.error(`[SoftMax.LaughTale] Island '${name}' module does not export a mount function.`);
      return;
    }
    const unmount = mount(container, props);
    if (typeof unmount === "function") {
      container.addEventListener("laughtale:unmount", unmount, { once: true });
    }
    container.dispatchEvent(new CustomEvent("laughtale:hydrated", {
      bubbles: true,
      composed: true,
      detail: { name, strategy: container.getAttribute("data-hydrate") }
    }));
  } catch (error) {
    container[HYDRATED_FLAG] = false;
    console.error(`[SoftMax.LaughTale] Error hydrating island '${name}':`, error);
    container.dispatchEvent(new CustomEvent("laughtale:hydration-error", {
      bubbles: true,
      composed: true,
      detail: { name, error }
    }));
  }
}
function hydrateIdle(container, name) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => executeHydration(container, name), { timeout: 2e3 });
  } else {
    setTimeout(() => executeHydration(container, name), 200);
  }
}
function hydrateVisible(container, name) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        observer.disconnect();
        executeHydration(container, name);
        break;
      }
    }
  }, { rootMargin: "120px" });
  observer.observe(container);
  for (let i = 0; i < container.children.length; i++) {
    observer.observe(container.children[i]);
  }
}
function hydrateInteraction(container, name) {
  const events = ["mouseenter", "focusin", "touchstart", "click"];
  const onInteract = () => {
    events.forEach((e) => container.removeEventListener(e, onInteract));
    executeHydration(container, name);
  };
  events.forEach((e) => container.addEventListener(e, onInteract, { once: true, passive: true }));
}
function hydrateMedia(container, name, query) {
  if (!query) {
    executeHydration(container, name);
    return;
  }
  const mql = window.matchMedia(query);
  if (mql.matches) {
    executeHydration(container, name);
  } else {
    const handler = (e) => {
      if (e.matches) {
        mql.removeEventListener("change", handler);
        executeHydration(container, name);
      }
    };
    mql.addEventListener("change", handler);
  }
}
function initIslands(root = document) {
  const islands = root.querySelectorAll("[data-island], island, [hydrate], [data-hydrate]");
  islands.forEach(hydrateIsland);
}

// src/directives/index.ts
init_reactivity();

// src/directives/events.ts
init_reactivity();
function bindElementEvents(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith("l-on:")) {
      const rawEvent = attr.name.slice(5);
      const [eventName, ...modifiers] = rawEvent.split(".");
      const stmt = attr.value;
      let debounceMs = 0;
      let throttleMs = 0;
      for (let i = 0; i < modifiers.length; i++) {
        if (modifiers[i] === "debounce") {
          const next = modifiers[i + 1];
          debounceMs = next ? parseDurationMs(next) : 250;
        } else if (modifiers[i] === "throttle") {
          const next = modifiers[i + 1];
          throttleMs = next ? parseDurationMs(next) : 250;
        }
      }
      let timer = null;
      let lastExecution = 0;
      const executeHandler = (e) => {
        if (modifiers.includes("prevent")) e.preventDefault();
        if (modifiers.includes("stop")) e.stopPropagation();
        if (modifiers.includes("enter") && e.key !== "Enter") return;
        if (modifiers.includes("escape") && e.key !== "Escape") return;
        const emitFn = (channel, payload) => {
          window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
        };
        const context = {
          $event: e,
          $el: element,
          $emit: emitFn
        };
        const activeState = scope ? scope.state : {};
        executeStatement(stmt, activeState, context);
      };
      const handler = (e) => {
        if (debounceMs > 0) {
          clearTimeout(timer);
          timer = setTimeout(() => executeHandler(e), debounceMs);
        } else if (throttleMs > 0) {
          const now = Date.now();
          if (now - lastExecution >= throttleMs) {
            lastExecution = now;
            executeHandler(e);
          }
        } else {
          executeHandler(e);
        }
      };
      const isWindow = modifiers.includes("window");
      const isDocument = modifiers.includes("document");
      const isOnce = modifiers.includes("once");
      const target = isWindow ? window : isDocument ? document : element;
      target.addEventListener(eventName, handler, { once: isOnce });
    }
    if (attr.name.startsWith("l-listen:")) {
      const channel = attr.name.slice(9);
      const stmt = attr.value;
      window.addEventListener(`laughtale:${channel}`, (e) => {
        const context = {
          $event: e.detail,
          $el: element,
          $emit: (c, p) => {
            window.dispatchEvent(new CustomEvent(`laughtale:${c}`, { detail: p, bubbles: true }));
          }
        };
        const activeState = scope ? scope.state : {};
        executeStatement(stmt, activeState, context);
      });
    }
    if (attr.name === "l-emit") {
      const channel = attr.value;
      element.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { bubbles: true }));
      });
    }
  }
}
function parseDurationMs(spec) {
  if (spec.endsWith("ms")) return parseFloat(spec) || 250;
  if (spec.endsWith("s")) return (parseFloat(spec) || 0.25) * 1e3;
  return parseFloat(spec) || 250;
}

// src/directives/htmx.ts
function bindServerAction(element) {
  let method = "GET";
  let url = "";
  if (element.hasAttribute("l-get")) {
    method = "GET";
    url = element.getAttribute("l-get");
  } else if (element.hasAttribute("l-post")) {
    method = "POST";
    url = element.getAttribute("l-post");
  } else if (element.hasAttribute("l-put")) {
    method = "PUT";
    url = element.getAttribute("l-put");
  } else if (element.hasAttribute("l-delete")) {
    method = "DELETE";
    url = element.getAttribute("l-delete");
  } else return;
  const targetSelector = element.getAttribute("l-target");
  const swapMode = element.getAttribute("l-swap") || "innerHTML";
  const indicatorSelector = element.getAttribute("l-indicator");
  const confirmMessage = element.getAttribute("l-confirm");
  const rawTrigger = element.getAttribute("l-trigger") || (element.tagName === "FORM" ? "submit" : element.tagName === "INPUT" ? "input" : "click");
  let delayMs = 0;
  const parts = rawTrigger.split(" ");
  const eventName = parts[0];
  for (const part of parts) {
    if (part.startsWith("delay:")) {
      delayMs = parseInt(part.slice(6), 10) || 0;
    }
  }
  let timeoutId = null;
  const executeRequest = async (e) => {
    if (e) e.preventDefault();
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }
    const indicator = indicatorSelector ? document.querySelector(indicatorSelector) : null;
    if (indicator) indicator.style.display = "block";
    try {
      let requestUrl = url;
      let body = null;
      const headers = {
        "X-LaughTale-Request": "true"
      };
      if (element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA") {
        const input = element;
        const paramName = input.name || "query";
        const separator = requestUrl.includes("?") ? "&" : "?";
        requestUrl = `${requestUrl}${separator}${encodeURIComponent(paramName)}=${encodeURIComponent(input.value)}`;
      } else if (element.tagName === "FORM") {
        const formData = new FormData(element);
        if (method === "GET") {
          const searchParams = new URLSearchParams(formData).toString();
          requestUrl = `${requestUrl}${requestUrl.includes("?") ? "&" : "?"}${searchParams}`;
        } else {
          body = formData;
        }
      }
      const response = await fetch(requestUrl, { method, body, headers });
      const html = await response.text();
      const target = targetSelector ? document.querySelector(targetSelector) : element;
      if (target) {
        switch (swapMode) {
          case "outerHTML":
            target.outerHTML = html;
            break;
          case "beforeend":
            target.insertAdjacentHTML("beforeend", html);
            break;
          case "afterbegin":
            target.insertAdjacentHTML("afterbegin", html);
            break;
          case "beforebegin":
            target.insertAdjacentHTML("beforebegin", html);
            break;
          case "afterend":
            target.insertAdjacentHTML("afterend", html);
            break;
          case "none":
            break;
          case "innerHTML":
          default:
            target.innerHTML = html;
            break;
        }
        initDirectives(target);
        initIslands(target);
      }
    } catch (err) {
      console.error("[SoftMax.LaughTale] Server fragment request failed:", err);
    } finally {
      if (indicator) indicator.style.display = "none";
    }
  };
  element.addEventListener(eventName, (e) => {
    if (delayMs > 0) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => executeRequest(e), delayMs);
    } else {
      executeRequest(e);
    }
  });
}

// src/directives/masking.ts
function bindInputMask(input) {
  const pattern = input.getAttribute("l-mask");
  if (!pattern) return;
  input.addEventListener("input", () => {
    const raw = input.value.replace(/[^a-zA-Z0-9]/g, "");
    let formatted = "";
    let rawIdx = 0;
    for (let i = 0; i < pattern.length && rawIdx < raw.length; i++) {
      const maskChar = pattern[i];
      if (maskChar === "9") {
        while (rawIdx < raw.length && !/\d/.test(raw[rawIdx])) rawIdx++;
        if (rawIdx < raw.length) formatted += raw[rawIdx++];
      } else if (maskChar === "a") {
        while (rawIdx < raw.length && !/[a-zA-Z]/.test(raw[rawIdx])) rawIdx++;
        if (rawIdx < raw.length) formatted += raw[rawIdx++];
      } else if (maskChar === "*") {
        formatted += raw[rawIdx++];
      } else {
        formatted += maskChar;
        if (raw[rawIdx] === maskChar) rawIdx++;
      }
    }
    input.value = formatted;
  });
}

// src/directives/utils.ts
init_reactivity();
function bindUtilityDirectives(element) {
  const scope = getNearestScope(element);
  if (element.hasAttribute("l-show")) {
    const expr = element.getAttribute("l-show");
    const originalDisplay = element.style.display || "";
    const update = () => {
      const state = scope ? scope.state : {};
      const isVisible = Boolean(evaluateExpression(expr, state));
      element.style.display = isVisible ? originalDisplay : "none";
    };
    if (scope) scope.listeners.add(update);
    update();
  }
  if (element.hasAttribute("l-hide")) {
    const expr = element.getAttribute("l-hide");
    const originalDisplay = element.style.display || "";
    const update = () => {
      const state = scope ? scope.state : {};
      const isHidden = Boolean(evaluateExpression(expr, state));
      element.style.display = isHidden ? "none" : originalDisplay;
    };
    if (scope) scope.listeners.add(update);
    update();
  }
  if (element.hasAttribute("l-copy")) {
    const selector = element.getAttribute("l-copy");
    const feedback = element.getAttribute("l-feedback") || "Copied!";
    const originalHtml = element.innerHTML;
    element.addEventListener("click", async () => {
      const target = document.querySelector(selector);
      const textToCopy = target ? target.value || target.textContent || "" : selector;
      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        element.innerHTML = feedback;
        setTimeout(() => {
          element.innerHTML = originalHtml;
        }, 2e3);
      } catch (err) {
        console.error("[SoftMax.LaughTale] Failed to copy to clipboard:", err);
      }
    });
  }
  if (element.hasAttribute("l-toggle")) {
    const selector = element.getAttribute("l-toggle");
    const className = element.getAttribute("l-toggle-class") || "open";
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = document.querySelector(selector);
      if (target) {
        target.classList.toggle(className);
      }
    });
  }
}

// src/directives/hotkey.ts
init_reactivity();
function bindHotkeyDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-hotkey" || attr.name === "l-shortcut" || attr.name.startsWith("l-hotkey.") || attr.name.startsWith("l-shortcut.")) {
      const isGlobal = attr.name.includes(".global") || !attr.name.includes(".local");
      const prevent = !attr.name.includes(".noprevent");
      const shortcutSpec = attr.value.trim().toLowerCase();
      const stmt = element.getAttribute("l-on:hotkey") || element.getAttribute("l-action");
      const handler = (e) => {
        if (matchesShortcut(e, shortcutSpec)) {
          if (prevent) e.preventDefault();
          if (stmt) {
            const activeState = scope ? scope.state : {};
            const context = {
              $event: e,
              $el: element,
              $emit: (channel, payload) => {
                window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
              }
            };
            executeStatement(stmt, activeState, context);
          } else {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
              element.focus();
            } else {
              element.click();
            }
          }
        }
      };
      const target = isGlobal ? window : element;
      target.addEventListener("keydown", handler);
    }
  }
}
function matchesShortcut(e, spec) {
  const parts = spec.split("+").map((s) => s.trim());
  const needsCtrl = parts.includes("ctrl") || parts.includes("control") || parts.includes("cmd") || parts.includes("meta");
  const needsAlt = parts.includes("alt") || parts.includes("option");
  const needsShift = parts.includes("shift");
  const keyPart = parts.find((p) => !["ctrl", "control", "cmd", "meta", "alt", "option", "shift"].includes(p));
  const ctrlPressed = e.ctrlKey || e.metaKey;
  if (needsCtrl !== ctrlPressed) return false;
  if (needsAlt !== e.altKey) return false;
  if (needsShift !== e.shiftKey) return false;
  if (!keyPart) return true;
  const actualKey = e.key.toLowerCase();
  if (keyPart === "escape" || keyPart === "esc") return actualKey === "escape";
  if (keyPart === "enter" || keyPart === "return") return actualKey === "enter";
  if (keyPart === "space") return actualKey === " " || actualKey === "spacebar";
  return actualKey === keyPart;
}

// src/directives/csp.ts
var cachedNonce = null;
function getCspNonce() {
  if (cachedNonce) return cachedNonce;
  if (typeof document === "undefined") return null;
  const meta = document.querySelector('meta[name="csp-nonce"]');
  if (meta?.content) {
    cachedNonce = meta.content.trim();
    return cachedNonce;
  }
  if (typeof window !== "undefined" && window.__LAUGHTALE_NONCE__) {
    cachedNonce = String(window.__LAUGHTALE_NONCE__).trim();
    return cachedNonce;
  }
  const scriptWithNonce = document.querySelector("script[nonce]");
  if (scriptWithNonce) {
    const nonce = scriptWithNonce.nonce || scriptWithNonce.getAttribute("nonce");
    if (nonce) {
      cachedNonce = nonce.trim();
      return cachedNonce;
    }
  }
  if (document.currentScript) {
    const currentNonce = document.currentScript.nonce || document.currentScript.getAttribute("nonce");
    if (currentNonce) {
      cachedNonce = currentNonce.trim();
      return cachedNonce;
    }
  }
  return null;
}
function setCspNonce(nonce) {
  cachedNonce = nonce ? nonce.trim() : null;
}
function applyNonceToStyle(style) {
  const nonce = getCspNonce();
  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}
function applyNonceToScript(script) {
  const nonce = getCspNonce();
  if (nonce) {
    script.setAttribute("nonce", nonce);
  }
}

// src/runtime/styles.ts
var injectedStyles = /* @__PURE__ */ new Set();
function injectIslandStyle(islandName, css) {
  if (injectedStyles.has(islandName) || typeof document === "undefined") {
    return;
  }
  injectedStyles.add(islandName);
  const styleEl = document.createElement("style");
  styleEl.setAttribute("data-island-style", islandName);
  styleEl.textContent = css;
  applyNonceToStyle(styleEl);
  document.head.appendChild(styleEl);
}

// src/directives/tooltip.ts
var TOOLTIP_CSS = `
.p-tooltip {
    position: fixed;
    z-index: 100000;
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
    transform: scale(0.92);
    transform-origin: center center;
    will-change: transform, opacity;
    transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, visibility 0.15s;
}

.p-tooltip.p-tooltip-active {
    visibility: visible !important;
    opacity: 1 !important;
    transform: scale(1) !important;
}

.p-tooltip.p-tooltip-interactive {
    pointer-events: auto;
}

.p-tooltip-text {
    background: var(--p-surface-800, #1e293b);
    color: var(--p-surface-0, #ffffff);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    padding: 0.4rem 0.8rem;
    border-radius: var(--p-border-radius, 6px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    max-width: 18rem;
    word-break: break-word;
    display: inline-flex;
    align-items: center;
}

/* Arrow Notch */
.p-tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--p-surface-800, #1e293b);
    transform: rotate(45deg);
    z-index: 1;
}

.p-tooltip-top .p-tooltip-arrow {
    bottom: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-bottom .p-tooltip-arrow {
    top: -4px;
    left: calc(50% - 4px);
}
.p-tooltip-left .p-tooltip-arrow {
    right: -4px;
    top: calc(50% - 4px);
}
.p-tooltip-right .p-tooltip-arrow {
    left: -4px;
    top: calc(50% - 4px);
}

/* Dark Mode Tokens */
.dark .p-tooltip-text,
[data-theme="dark"] .p-tooltip-text {
    background: var(--p-surface-900, #0f172a);
    color: var(--p-surface-0, #f8fafc);
    border: 1px solid var(--p-surface-700, #334155);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.dark .p-tooltip-arrow,
[data-theme="dark"] .p-tooltip-arrow {
    background: var(--p-surface-900, #0f172a);
    border-color: var(--p-surface-700, #334155);
}
`;
var activeTooltipEl = null;
var currentTargetEl = null;
var showTimeoutId = null;
var hideTimeoutId = null;
var globalTooltipDelegationBound = false;
function findTooltipTarget(startEl) {
  let curr = startEl;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    for (const attr of Array.from(curr.attributes)) {
      const name = attr.name.toLowerCase();
      if (name === "p-tooltip" || name.startsWith("p-tooltip.") || name === "v-tooltip" || name.startsWith("v-tooltip.") || name === "data-tooltip" || name.startsWith("data-tooltip.") || name === "l-tooltip" || name.startsWith("l-tooltip.") || name === "data-tooltip-target") {
        return curr;
      }
    }
    curr = curr.parentElement;
  }
  return null;
}
function parseTooltipConfig(element) {
  let rawValue = "";
  let position = "right";
  for (const attr of Array.from(element.attributes)) {
    const name = attr.name.toLowerCase();
    if (name === "p-tooltip" || name === "v-tooltip" || name === "data-tooltip" || name === "l-tooltip" || name.startsWith("p-tooltip.") || name.startsWith("v-tooltip.") || name.startsWith("l-tooltip.") || name.startsWith("data-tooltip.")) {
      rawValue = attr.value;
      if (name.includes(".top")) position = "top";
      else if (name.includes(".bottom")) position = "bottom";
      else if (name.includes(".left")) position = "left";
      else if (name.includes(".right")) position = "right";
      break;
    }
  }
  if (!rawValue) {
    const targetId = element.getAttribute("data-tooltip-target");
    if (targetId) {
      const template = document.getElementById(targetId);
      if (template) rawValue = template.innerHTML;
    }
  }
  if (!rawValue) return null;
  if (rawValue.trim().startsWith("{") && rawValue.trim().endsWith("}")) {
    try {
      const parsed = JSON.parse(rawValue);
      return {
        value: parsed.value || "",
        position: parsed.position || position,
        showDelay: parsed.showDelay !== void 0 ? Number(parsed.showDelay) : 0,
        hideDelay: parsed.hideDelay !== void 0 ? Number(parsed.hideDelay) : 0,
        event: parsed.event || "hover",
        autoHide: parsed.autoHide !== false,
        escape: parsed.escape !== false,
        class: parsed.class || ""
      };
    } catch {
    }
  }
  const posAttr = element.getAttribute("p-tooltip-position") || element.getAttribute("data-tooltip-position");
  if (posAttr) position = posAttr;
  const showDelayAttr = element.getAttribute("p-tooltip-show-delay") || element.getAttribute("data-tooltip-show-delay");
  const hideDelayAttr = element.getAttribute("p-tooltip-hide-delay") || element.getAttribute("data-tooltip-hide-delay");
  const eventAttr = element.getAttribute("p-tooltip-event") || element.getAttribute("data-tooltip-event");
  const autoHideAttr = element.getAttribute("p-tooltip-auto-hide") || element.getAttribute("data-tooltip-auto-hide");
  const escapeAttr = element.getAttribute("p-tooltip-escape") || element.getAttribute("data-tooltip-escape");
  return {
    value: rawValue,
    position,
    showDelay: showDelayAttr ? parseInt(showDelayAttr, 10) : 0,
    hideDelay: hideDelayAttr ? parseInt(hideDelayAttr, 10) : 0,
    event: eventAttr || "hover",
    autoHide: autoHideAttr !== "false",
    escape: escapeAttr !== "false"
  };
}
function positionTooltip(tooltipEl, targetEl, position) {
  const targetRect = targetEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const margin = 8;
  let top = 0;
  let left = 0;
  switch (position) {
    case "top":
      top = targetRect.top - tooltipRect.height - margin;
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      break;
    case "bottom":
      top = targetRect.bottom + margin;
      left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      left = targetRect.left - tooltipRect.width - margin;
      break;
    case "right":
    default:
      top = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
      left = targetRect.right + margin;
      break;
  }
  if (left < 8) left = 8;
  if (left + tooltipRect.width > window.innerWidth - 8) {
    left = window.innerWidth - tooltipRect.width - 8;
  }
  if (top < 8) top = 8;
  if (top + tooltipRect.height > window.innerHeight - 8) {
    top = window.innerHeight - tooltipRect.height - 8;
  }
  tooltipEl.style.top = `${Math.round(top)}px`;
  tooltipEl.style.left = `${Math.round(left)}px`;
}
function showTooltipForElement(targetEl, config) {
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  if (showTimeoutId) {
    clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }
  const triggerShow = () => {
    if (!activeTooltipEl) {
      activeTooltipEl = document.createElement("div");
      activeTooltipEl.className = "p-tooltip p-component";
      activeTooltipEl.setAttribute("role", "tooltip");
      document.body.appendChild(activeTooltipEl);
    }
    currentTargetEl = targetEl;
    const pos = config.position || "right";
    activeTooltipEl.className = `p-tooltip p-component p-tooltip-${pos} ${config.class || ""}`;
    if (!config.autoHide) {
      activeTooltipEl.classList.add("p-tooltip-interactive");
    }
    if (config.escape) {
      activeTooltipEl.innerHTML = `
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${escapeHtml(config.value)}</div>
            `;
    } else {
      activeTooltipEl.innerHTML = `
                <div class="p-tooltip-arrow"></div>
                <div class="p-tooltip-text">${config.value}</div>
            `;
    }
    positionTooltip(activeTooltipEl, targetEl, pos);
    activeTooltipEl.classList.add("p-tooltip-active");
  };
  if (config.showDelay && config.showDelay > 0) {
    showTimeoutId = setTimeout(triggerShow, config.showDelay);
  } else {
    triggerShow();
  }
}
function hideActiveTooltip(delay = 0) {
  if (showTimeoutId) {
    clearTimeout(showTimeoutId);
    showTimeoutId = null;
  }
  if (hideTimeoutId) {
    clearTimeout(hideTimeoutId);
    hideTimeoutId = null;
  }
  const triggerHide = () => {
    if (activeTooltipEl) {
      activeTooltipEl.classList.remove("p-tooltip-active");
      currentTargetEl = null;
    }
  };
  if (delay > 0) {
    hideTimeoutId = setTimeout(triggerHide, delay);
  } else {
    triggerHide();
  }
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function initGlobalTooltipDelegation() {
  if (globalTooltipDelegationBound || typeof document === "undefined") return;
  globalTooltipDelegationBound = true;
  injectIslandStyle("tooltip", TOOLTIP_CSS);
  document.addEventListener("mouseover", (e) => {
    const target = findTooltipTarget(e.target);
    if (target) {
      const config = parseTooltipConfig(target);
      if (config && (config.event === "hover" || config.event === "both" || !config.event)) {
        showTooltipForElement(target, config);
      }
    }
  });
  document.addEventListener("mouseout", (e) => {
    const target = findTooltipTarget(e.target);
    if (target && target === currentTargetEl) {
      const config = parseTooltipConfig(target);
      hideActiveTooltip(config?.hideDelay || 0);
    }
  });
  document.addEventListener("focusin", (e) => {
    const target = findTooltipTarget(e.target);
    if (target) {
      const config = parseTooltipConfig(target);
      if (config && (config.event === "focus" || config.event === "both")) {
        showTooltipForElement(target, config);
      }
    }
  });
  document.addEventListener("focusout", (e) => {
    const target = findTooltipTarget(e.target);
    if (target && target === currentTargetEl) {
      const config = parseTooltipConfig(target);
      hideActiveTooltip(config?.hideDelay || 0);
    }
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeTooltipEl) {
      hideActiveTooltip(0);
    }
  });
}
if (typeof document !== "undefined") {
  initGlobalTooltipDelegation();
}
function bindTooltipDirectives(element) {
  initGlobalTooltipDelegation();
}

// src/directives/outside.ts
init_reactivity();
function bindOutsideClickDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-outside" || attr.name === "l-click-outside") {
      const stmt = attr.value;
      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!element.contains(target)) {
          const activeState = scope ? scope.state : {};
          const context = {
            $event: e,
            $el: element,
            $emit: (channel, payload) => {
              window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
            }
          };
          executeStatement(stmt, activeState, context);
        }
      });
    }
  }
}

// src/directives/storage.ts
function bindStoragePersistence(element, scope) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-persist" || attr.name.startsWith("l-persist.") || attr.name === "l-sync-storage") {
      const key = attr.value || "laughtale_persisted_state";
      const useSession = attr.name.includes(".session");
      const storage = useSession ? sessionStorage : localStorage;
      try {
        const saved = storage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed === "object" && parsed !== null) {
            Object.assign(scope.state, parsed);
          }
        }
      } catch (err) {
        console.warn(`[SoftMax.LaughTale] Failed to read persisted state for key "${key}":`, err);
      }
      let timer = null;
      const save = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            storage.setItem(key, JSON.stringify(scope.state));
          } catch (err) {
            console.warn(`[SoftMax.LaughTale] Failed to save persisted state for key "${key}":`, err);
          }
        }, 150);
      };
      scope.listeners.add(save);
    }
  }
}

// src/directives/poll.ts
init_reactivity();
function bindPollingDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name.startsWith("l-poll")) {
      let intervalMs = 3e3;
      const parts = attr.name.split(".");
      for (const part of parts) {
        if (part.endsWith("s") && !part.endsWith("ms")) {
          const sec = parseFloat(part);
          if (!isNaN(sec)) intervalMs = sec * 1e3;
        } else if (part.endsWith("ms")) {
          const ms = parseFloat(part);
          if (!isNaN(ms)) intervalMs = ms;
        }
      }
      const stmt = attr.value;
      const runPoll = () => {
        if (!document.body.contains(element)) {
          clearInterval(intervalId);
          return;
        }
        if (stmt) {
          const activeState = scope ? scope.state : {};
          const context = {
            $el: element,
            $emit: (channel, payload) => {
              window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
            }
          };
          executeStatement(stmt, activeState, context);
        } else {
          element.dispatchEvent(new CustomEvent("laughtale:poll-trigger", { bubbles: true }));
        }
      };
      const intervalId = setInterval(runPoll, intervalMs);
    }
  }
}

// src/directives/intersect.ts
init_reactivity();
function bindIntersectionDirectives(element) {
  const scope = getNearestScope(element);
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-intersect" || attr.name.startsWith("l-intersect.") || attr.name === "l-viewport") {
      const isOnce = attr.name.includes(".once");
      const isHalf = attr.name.includes(".half");
      const stmt = attr.value;
      const threshold = isHalf ? 0.5 : 0.1;
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (stmt) {
              const activeState = scope ? scope.state : {};
              const context = {
                $event: entry,
                $el: element,
                $emit: (channel, payload) => {
                  window.dispatchEvent(new CustomEvent(`laughtale:${channel}`, { detail: payload, bubbles: true }));
                }
              };
              executeStatement(stmt, activeState, context);
            }
            element.dispatchEvent(new CustomEvent("laughtale:intersect", { bubbles: true, detail: entry }));
            if (isOnce) {
              observer.disconnect();
            }
          }
        }
      }, { threshold });
      observer.observe(element);
    }
  }
}

// src/directives/scroll.ts
function bindScrollToDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-scroll-to" || attr.name.startsWith("l-scroll-to.")) {
      const target = attr.value.trim();
      element.addEventListener("click", (e) => {
        e.preventDefault();
        if (target === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (target === "bottom") {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } else if (target) {
          const targetEl = document.querySelector(target);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    }
  }
}

// src/directives/badge.ts
function bindBadgeDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-badge" || attr.name.startsWith("l-badge.")) {
      const isDot = attr.name.includes(".dot");
      const value = attr.value;
      let severity = "danger";
      if (attr.name.includes(".success")) severity = "success";
      else if (attr.name.includes(".warning")) severity = "warning";
      else if (attr.name.includes(".info")) severity = "info";
      else if (attr.name.includes(".slate") || attr.name.includes(".secondary")) severity = "slate";
      const compStyle = window.getComputedStyle(element);
      if (compStyle.position === "static") {
        element.style.position = "relative";
      }
      const badge = document.createElement("span");
      badge.className = `aura-directive-badge badge-${severity}`;
      let bg = "var(--p-red-500, #ef4444)";
      let color = "#ffffff";
      if (severity === "success") bg = "var(--p-emerald-500, #10b981)";
      else if (severity === "warning") bg = "var(--p-amber-500, #f59e0b)";
      else if (severity === "info") bg = "var(--p-blue-500, #3b82f6)";
      else if (severity === "slate") {
        bg = "var(--p-surface-600, #475569)";
        color = "#ffffff";
      }
      if (isDot) {
        badge.style.cssText = `
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    width: 8px;
                    height: 8px;
                    background: ${bg};
                    border-radius: 50%;
                    border: 2px solid var(--p-surface-0, #ffffff);
                    pointer-events: none;
                `;
      } else {
        badge.textContent = value || "";
        badge.style.cssText = `
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    min-width: 18px;
                    height: 18px;
                    line-height: 18px;
                    padding: 0 5px;
                    font-size: 0.6875rem;
                    font-weight: 700;
                    text-align: center;
                    background: ${bg};
                    color: ${color};
                    border-radius: 9999px;
                    border: 2px solid var(--p-surface-0, #ffffff);
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                    pointer-events: none;
                `;
      }
      element.appendChild(badge);
    }
  }
}

// src/directives/teleport.ts
function bindTeleportDirectives(element) {
  for (const attr of Array.from(element.attributes)) {
    if (attr.name === "l-teleport") {
      const targetSelector = attr.value || "body";
      const targetContainer = document.querySelector(targetSelector);
      if (targetContainer && targetContainer !== element.parentElement) {
        targetContainer.appendChild(element);
      }
    }
  }
}

// src/directives/index.ts
init_security();
init_reactivity();
function initDirectives(root = document) {
  const stateElements = root.querySelectorAll("[l-state]");
  stateElements.forEach((el) => {
    const rawJson = el.getAttribute("l-state");
    try {
      const initialData = rawJson ? JSON.parse(rawJson) : {};
      const scope = createReactiveScope(el, initialData);
      bindStoragePersistence(el, scope);
    } catch (err) {
      console.error("[SoftMax.LaughTale] Invalid JSON in l-state:", rawJson, err);
    }
  });
  const allElements = root.querySelectorAll("*");
  allElements.forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name === "l-bind" || attr.name.startsWith("l-bind:") || attr.name === "l-model" || attr.name === "l-class" || attr.name === "l-style") {
        Promise.resolve().then(() => (init_reactivity(), reactivity_exports)).then(({ getNearestScope: getNearestScope2 }) => {
          const nearest = getNearestScope2(el);
          if (nearest) bindElementReactivity(el, nearest);
        });
        break;
      }
    }
    bindElementEvents(el);
    if (el.hasAttribute("l-get") || el.hasAttribute("l-post") || el.hasAttribute("l-put") || el.hasAttribute("l-delete")) {
      bindServerAction(el);
    }
    if (el.hasAttribute("l-mask") && el.tagName === "INPUT") {
      bindInputMask(el);
    }
    bindUtilityDirectives(el);
    bindHotkeyDirectives(el);
    bindTooltipDirectives(el);
    bindOutsideClickDirectives(el);
    bindPollingDirectives(el);
    bindIntersectionDirectives(el);
    bindScrollToDirectives(el);
    bindBadgeDirectives(el);
    bindTeleportDirectives(el);
  });
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initDirectives());
  } else {
    initDirectives();
  }
}

// src/runtime/router.ts
var isRouterActive = false;
var inFlightController = null;
function enableViewTransitions() {
  if (isRouterActive || typeof window === "undefined") return;
  isRouterActive = true;
  if ("history" in window && "scrollRestoration" in window.history) {
    try {
      window.history.scrollRestoration = "manual";
    } catch {
    }
  }
  document.addEventListener("click", handleLinkClick);
  window.addEventListener("popstate", handlePopState);
}
async function handleLinkClick(e) {
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) {
    return;
  }
  const anchor = e.target.closest("a");
  if (!anchor || !anchor.href) return;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  if (anchor.target && anchor.target !== "_self") return;
  if (anchor.hasAttribute("download") || anchor.getAttribute("data-no-transition") !== null) return;
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, "");
  const targetPath = url.pathname.toLowerCase().replace(/\/$/, "");
  if ((currentPath === targetPath || !targetPath) && url.hash) {
    return;
  }
  e.preventDefault();
  await navigateTo(url.href, true);
}
async function handlePopState(e) {
  const state = e.state || {};
  const restoreScroll = typeof state.scrollY === "number" ? {
    scrollX: state.scrollX || 0,
    scrollY: state.scrollY
  } : void 0;
  await navigateTo(window.location.href, false, restoreScroll);
}
async function reconcileHead(newHead) {
  if (!document.head || !newHead) return;
  const getHeadKey = (el) => {
    const tagName = el.tagName.toLowerCase();
    if (tagName === "title") return "title";
    if (tagName === "meta") {
      const name = el.getAttribute("name");
      if (name) {
        if (name === "viewport" || name === "csp-nonce") return null;
        return `meta:name:${name.toLowerCase()}`;
      }
      const prop = el.getAttribute("property");
      if (prop) return `meta:property:${prop.toLowerCase()}`;
      const httpEquiv = el.getAttribute("http-equiv");
      if (httpEquiv) return `meta:http-equiv:${httpEquiv.toLowerCase()}`;
      if (el.hasAttribute("charset")) return null;
      return `meta:raw:${el.outerHTML}`;
    }
    if (tagName === "link") {
      const rel = (el.getAttribute("rel") || "").toLowerCase();
      const href = el.getAttribute("href") || "";
      if (rel === "stylesheet") return `link:stylesheet:${href}`;
      if (rel === "canonical") return `link:canonical`;
      if (rel === "icon" || rel === "shortcut icon") return `link:icon`;
      return `link:${rel}:${href}`;
    }
    return null;
  };
  const existingDynamicElements = /* @__PURE__ */ new Map();
  Array.from(document.head.children).forEach((child) => {
    if (child.hasAttribute("data-island-style")) return;
    const key = getHeadKey(child);
    if (key) {
      existingDynamicElements.set(key, child);
    }
  });
  const newKeys = /* @__PURE__ */ new Set();
  const pendingStylesheets = [];
  Array.from(newHead.children).forEach((incomingEl) => {
    const key = getHeadKey(incomingEl);
    if (!key) return;
    newKeys.add(key);
    const existing = existingDynamicElements.get(key);
    if (existing) {
      if (existing.outerHTML === incomingEl.outerHTML) {
        return;
      }
      const clone = incomingEl.cloneNode(true);
      existing.replaceWith(clone);
    } else {
      const clone = incomingEl.cloneNode(true);
      if (clone.tagName.toLowerCase() === "link" && clone.getAttribute("rel")?.toLowerCase() === "stylesheet") {
        const sheetPromise = new Promise((resolve) => {
          const timeout = setTimeout(resolve, 500);
          clone.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          clone.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
        pendingStylesheets.push(sheetPromise);
      }
      document.head.appendChild(clone);
    }
  });
  existingDynamicElements.forEach((existingEl, key) => {
    if (!newKeys.has(key)) {
      existingEl.remove();
    }
  });
  if (pendingStylesheets.length > 0) {
    await Promise.all(pendingStylesheets);
  }
}
async function navigateTo(urlStr, pushState = true, restoreScroll) {
  if (inFlightController) {
    inFlightController.abort();
  }
  inFlightController = new AbortController();
  const signal = inFlightController.signal;
  if (pushState && typeof window !== "undefined" && "history" in window) {
    try {
      window.history.replaceState({
        ...window.history.state,
        scrollX: window.scrollX || 0,
        scrollY: window.scrollY || 0
      }, "", window.location.href);
    } catch {
    }
  }
  try {
    const response = await fetch(urlStr, {
      signal,
      headers: {
        "X-Requested-With": "SoftMaxIslands-ViewTransition"
      }
    });
    if (!response.ok) {
      window.location.href = urlStr;
      return;
    }
    const finalUrl = response.url ? new URL(response.url, window.location.href) : new URL(urlStr, window.location.href);
    if (finalUrl.origin !== window.location.origin) {
      console.warn(`[SoftMax.LaughTale Router] Blocked cross-origin HTML injection from "${finalUrl.href}". Falling back to hard navigation.`);
      window.location.href = finalUrl.href;
      return;
    }
    const htmlText = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(htmlText, "text/html");
    document.querySelectorAll("[data-island]").forEach((el) => {
      if (!el.closest("[data-persist]")) {
        el.dispatchEvent(new CustomEvent("laughtale:unmount", { bubbles: false }));
      }
    });
    const persistentElements = /* @__PURE__ */ new Map();
    document.querySelectorAll("[data-persist]").forEach((el) => {
      const id = el.dataset.persist;
      if (id) persistentElements.set(id, el);
    });
    const newScripts = Array.from(newDoc.body.querySelectorAll("script"));
    newScripts.forEach((s) => s.remove());
    const updateDom = async () => {
      document.title = newDoc.title;
      if (newDoc.head) {
        await reconcileHead(newDoc.head);
      }
      const images = Array.from(newDoc.body.querySelectorAll("img[src]"));
      const imagePromises = images.map((img) => {
        if ("decode" in img && typeof img.decode === "function") {
          return img.decode().catch(() => {
          });
        }
        return Promise.resolve();
      });
      if (imagePromises.length > 0) {
        await Promise.race([Promise.all(imagePromises), new Promise((r) => setTimeout(r, 500))]);
      }
      document.body.innerHTML = newDoc.body.innerHTML;
      persistentElements.forEach((liveEl, id) => {
        const targetSlot = document.querySelector(`[data-persist="${id}"]`);
        if (targetSlot && targetSlot.parentNode) {
          targetSlot.parentNode.replaceChild(liveEl, targetSlot);
        }
      });
      newScripts.forEach((script) => {
        if (script.type && script.type !== "text/javascript" && script.type !== "module" && script.type !== "application/javascript") {
          return;
        }
        const newScript = document.createElement("script");
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = script.textContent;
        applyNonceToScript(newScript);
        document.body.appendChild(newScript);
      });
      initIslands(document.body);
      initDirectives(document.body);
      if (restoreScroll && typeof restoreScroll.scrollY === "number") {
        window.scrollTo({ left: restoreScroll.scrollX || 0, top: restoreScroll.scrollY, behavior: "instant" });
      } else {
        const targetUrl = new URL(urlStr, window.location.origin);
        if (targetUrl.hash) {
          const targetEl = document.querySelector(targetUrl.hash);
          if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }
      if (pushState) {
        window.history.pushState({ scrollX: 0, scrollY: 0 }, "", finalUrl.href);
      }
      window.dispatchEvent(new CustomEvent("island:page-loaded", { detail: { url: finalUrl.href } }));
    };
    if ("startViewTransition" in document) {
      await document.startViewTransition(updateDom);
    } else {
      await updateDom();
    }
  } catch (err) {
    if (err?.name === "AbortError" || signal.aborted) {
      return;
    }
    console.error("[SoftMax.LaughTale] View transition failed, falling back to full navigation:", err);
    window.location.href = urlStr;
  } finally {
    if (inFlightController?.signal === signal) {
      inFlightController = null;
    }
  }
}

// tests/router.test.ts
describe("Router Comprehensive Suite (LT-107, LT-202, LT-203, LT-204)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.head.innerHTML = `
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="csp-nonce" content="test-router-nonce-888">
            <meta name="description" content="Initial Home Description">
            <meta property="og:title" content="Initial Home OG">
            <link rel="canonical" href="https://mysite.com/home">
            <link rel="stylesheet" href="/css/home.css">
        `;
    setCspNonce("test-router-nonce-888");
  });
  it("navigateTo: dispatches laughtale:unmount to unpersisted islands before updating DOM", async () => {
    let unmounted = false;
    const island = document.createElement("div");
    island.setAttribute("data-island", "demo-widget");
    island.addEventListener("laughtale:unmount", () => {
      unmounted = true;
    });
    document.body.appendChild(island);
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return {
        ok: true,
        url: window.location.href,
        text: async () => "<html><head><title>New Page</title></head><body><h1>Welcome</h1></body></html>"
      };
    });
    try {
      await navigateTo("/next-page", false);
      assert.equal(unmounted, true, "laughtale:unmount was not dispatched to unpersisted island");
      assert.equal(document.title, "New Page");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
  it("navigateTo: preserves persistent island ([data-persist]) without dispatching unmount", async () => {
    let unmounted = false;
    const persistContainer = document.createElement("div");
    persistContainer.setAttribute("data-persist", "global-audio");
    const island = document.createElement("div");
    island.setAttribute("data-island", "audio-player");
    island.addEventListener("laughtale:unmount", () => {
      unmounted = true;
    });
    persistContainer.appendChild(island);
    document.body.appendChild(persistContainer);
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return {
        ok: true,
        url: window.location.href,
        text: async () => '<html><head><title>Next</title></head><body><div data-persist="global-audio"></div></body></html>'
      };
    });
    try {
      await navigateTo("/player-next", false);
      assert.equal(unmounted, false, "laughtale:unmount should NOT be dispatched for persistent elements");
      const restored = document.querySelector('[data-persist="global-audio"]');
      assert.ok(restored, "Persistent container was not restored");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
  it("navigateTo: falls back to window.location.href when response redirects cross-origin", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return {
        ok: true,
        url: "https://evil-attacker.com/login",
        text: async () => "<html><body><h1>Injected</h1></body></html>"
      };
    });
    const currentOrigin = window.location.origin;
    assert.notEqual(currentOrigin, "https://evil-attacker.com");
    try {
      await navigateTo("/redirect-test", false);
      assert.equal(document.body.innerHTML.includes("Injected"), false, "Injected HTML was unexpectedly found in body");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
  it("navigateTo: reconciles <head> metadata, OpenGraph, canonical links, and route stylesheets (LT-202)", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return {
        ok: true,
        url: window.location.href,
        text: async () => `
                    <html>
                    <head>
                        <title>About Us - SoftMax</title>
                        <meta name="description" content="Updated About Us Description">
                        <meta property="og:title" content="About Us OG Title">
                        <link rel="canonical" href="https://mysite.com/about">
                        <link rel="stylesheet" href="/css/about.css">
                    </head>
                    <body>
                        <h1>About Page</h1>
                    </body>
                    </html>
                `
      };
    });
    try {
      await navigateTo("/about", false);
      assert.equal(document.title, "About Us - SoftMax");
      const descMeta = document.querySelector('meta[name="description"]');
      assert.equal(descMeta?.getAttribute("content"), "Updated About Us Description");
      const ogMeta = document.querySelector('meta[property="og:title"]');
      assert.equal(ogMeta?.getAttribute("content"), "About Us OG Title");
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      assert.equal(canonicalLink?.getAttribute("href"), "https://mysite.com/about");
      const aboutCss = document.querySelector('link[href="/css/about.css"]');
      const homeCss = document.querySelector('link[href="/css/home.css"]');
      assert.ok(aboutCss, "New stylesheet /css/about.css was not added to head");
      assert.equal(homeCss, null, "Old stylesheet /css/home.css was not removed from head");
      const cspNonceMeta = document.querySelector('meta[name="csp-nonce"]');
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      assert.ok(cspNonceMeta, "CSP nonce meta was unexpectedly removed");
      assert.ok(viewportMeta, "Viewport meta was unexpectedly removed");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
  it("navigateTo: cancels in-flight navigation when a newer navigation is triggered (LT-203)", async () => {
    let routeASignalAborted = false;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = ((url, opts) => {
      if (url.includes("/slow-route-a")) {
        const signal = opts?.signal;
        return new Promise((resolve, reject) => {
          if (signal) {
            signal.addEventListener("abort", () => {
              routeASignalAborted = true;
              const err = new Error("Aborted");
              err.name = "AbortError";
              reject(err);
            });
          }
          setTimeout(() => {
            resolve({
              ok: true,
              url: window.location.href,
              text: async () => "<html><head><title>Route A</title></head><body><h1>Route A Body</h1></body></html>"
            });
          }, 80);
        });
      }
      return Promise.resolve({
        ok: true,
        url: window.location.href,
        text: async () => "<html><head><title>Route B</title></head><body><h1>Route B Body</h1></body></html>"
      });
    });
    try {
      const navA = navigateTo("/slow-route-a", false);
      const navB = navigateTo("/fast-route-b", false);
      await Promise.all([navA, navB]);
      assert.equal(routeASignalAborted, true, "Prior in-flight request was not aborted");
      assert.equal(document.title, "Route B", "DOM was overwritten by aborted Route A instead of Route B");
      assert.ok(document.body.innerHTML.includes("Route B Body"), "Body does not contain Route B content");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
  it("navigateTo: preserves departure scroll in history and restores scroll position (LT-204)", async () => {
    let scrollToOptions = null;
    const originalScrollTo = window.scrollTo;
    window.scrollTo = ((opts) => {
      scrollToOptions = opts;
    });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = (async () => {
      return {
        ok: true,
        url: window.location.href,
        text: async () => "<html><head><title>Restored Page</title></head><body><h1>Content</h1></body></html>"
      };
    });
    try {
      Object.defineProperty(window, "scrollX", { value: 0, configurable: true, writable: true });
      Object.defineProperty(window, "scrollY", { value: 1250, configurable: true, writable: true });
      await navigateTo("/blog/post-1", true);
      assert.equal(window.history.state?.scrollY, 0);
      await navigateTo("/blog", false, { scrollX: 0, scrollY: 1250 });
      assert.deepEqual(scrollToOptions, { left: 0, top: 1250, behavior: "instant" });
    } finally {
      globalThis.fetch = originalFetch;
      window.scrollTo = originalScrollTo;
    }
  });
  it("enableViewTransitions: sets history.scrollRestoration to manual (LT-204)", () => {
    enableViewTransitions();
    assert.equal(window.history.scrollRestoration, "manual");
  });
});
