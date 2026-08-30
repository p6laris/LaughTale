// ../SoftMax.LaughTale.Client/src/directives/security.ts
var BLOCKED_PROPERTIES = /* @__PURE__ */ new Set([
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
var DANGEROUS_ATTRIBUTES = /* @__PURE__ */ new Set([
  "onerror",
  "onload",
  "onclick",
  "onmouseover",
  "onfocus",
  "onblur",
  "onchange",
  "onsubmit",
  "formaction"
]);
var DANGEROUS_PROTOCOLS = /^\s*(javascript|data|vbscript):/i;
function isSafeProperty(prop) {
  if (typeof prop !== "string") return true;
  return !BLOCKED_PROPERTIES.has(prop);
}
function sanitizeUrl(url) {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  if (DANGEROUS_PROTOCOLS.test(trimmed)) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous URL protocol: "${trimmed}"`);
    return "about:blank";
  }
  return trimmed;
}
function isSafeAttribute(attrName) {
  const lower = attrName.toLowerCase();
  if (lower.startsWith("on") || DANGEROUS_ATTRIBUTES.has(lower)) {
    console.warn(`[SoftMax.LaughTale Security] Blocked dangerous dynamic attribute binding: "${attrName}"`);
    return false;
  }
  return true;
}

// ../SoftMax.LaughTale.Client/src/directives/expression/lexer.ts
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

// ../SoftMax.LaughTale.Client/src/directives/expression/parser.ts
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

// ../SoftMax.LaughTale.Client/src/directives/expression/evaluator.ts
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

// ../SoftMax.LaughTale.Client/src/directives/reactivity.ts
var elementScopeMap = /* @__PURE__ */ new WeakMap();
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

export {
  getNearestScope,
  createReactiveScope,
  evaluateExpression,
  executeStatement,
  bindElementReactivity
};
//# sourceMappingURL=chunk-OKWR2G6H.js.map
