/**
 * SoftMax.LaughTale: Directive Expression Lexer / Tokenizer
 * Tokenizes safe expression strings with fast scanning and immediate rejection of dangerous keywords.
 */

export type TokenType =
    | 'NUMBER'
    | 'STRING'
    | 'BOOLEAN'
    | 'NULL'
    | 'UNDEFINED'
    | 'IDENTIFIER'
    | 'OPERATOR'
    | 'PUNCTUATION'
    | 'TEMPLATE_HEAD'
    | 'TEMPLATE_MIDDLE'
    | 'TEMPLATE_TAIL'
    | 'TEMPLATE_NO_SUBST'
    | 'FORBIDDEN_KEYWORD'
    | 'EOF';

export interface Token {
    type: TokenType;
    value: string;
    raw?: any;
    pos: number;
}

export const FORBIDDEN_KEYWORDS = new Set([
    'new',
    'function',
    'class',
    'import',
    'export',
    'return',
    'with',
    'while',
    'for',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'debugger',
    'var',
    'let',
    'const',
    'throw',
    'try',
    'catch',
    'finally',
    'yield',
    'async',
    'await',
    'delete',
    'void'
]);

export class Lexer {
    private src: string;
    private pos: number = 0;
    private len: number;

    constructor(src: string) {
        this.src = src;
        this.len = src.length;
    }

    public tokenize(): Token[] {
        const tokens: Token[] = [];
        while (this.pos < this.len) {
            this.skipWhitespace();
            if (this.pos >= this.len) break;

            const ch = this.src[this.pos];
            const start = this.pos;

            // 1. Comments (skip line or block comments)
            if (ch === '/' && this.pos + 1 < this.len) {
                if (this.src[this.pos + 1] === '/') {
                    this.pos += 2;
                    while (this.pos < this.len && this.src[this.pos] !== '\n') this.pos++;
                    continue;
                }
                if (this.src[this.pos + 1] === '*') {
                    this.pos += 2;
                    while (this.pos + 1 < this.len && !(this.src[this.pos] === '*' && this.src[this.pos + 1] === '/')) {
                        this.pos++;
                    }
                    this.pos += 2;
                    continue;
                }
            }

            // 2. Numbers
            if (this.isDigit(ch) || (ch === '.' && this.pos + 1 < this.len && this.isDigit(this.src[this.pos + 1]))) {
                tokens.push(this.readNumber());
                continue;
            }

            // 3. Strings
            if (ch === '"' || ch === "'") {
                tokens.push(this.readString(ch));
                continue;
            }

            // 4. Template literals
            if (ch === '`') {
                tokens.push(this.readTemplateLiteral());
                continue;
            }

            // 5. Identifiers & Keywords
            if (this.isIdentStart(ch)) {
                tokens.push(this.readIdentifierOrKeyword());
                continue;
            }

            // 6. Multi-character operators and punctuation
            const multi = this.readOperatorOrPunctuation();
            if (multi) {
                tokens.push(multi);
                continue;
            }

            throw new Error(`Unexpected character '${ch}' at position ${this.pos}`);
        }

        tokens.push({ type: 'EOF', value: '', pos: this.pos });
        return tokens;
    }

    private skipWhitespace(): void {
        while (this.pos < this.len) {
            const ch = this.src.charCodeAt(this.pos);
            if (ch === 32 || ch === 9 || ch === 10 || ch === 13) {
                this.pos++;
            } else {
                break;
            }
        }
    }

    private isDigit(ch: string): boolean {
        return ch >= '0' && ch <= '9';
    }

    private isIdentStart(ch: string): boolean {
        return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_' || ch === '$';
    }

    private isIdentPart(ch: string): boolean {
        return this.isIdentStart(ch) || this.isDigit(ch);
    }

    private readNumber(): Token {
        const start = this.pos;
        let isFloat = false;

        if (this.src[this.pos] === '.') {
            isFloat = true;
            this.pos++;
        }

        while (this.pos < this.len) {
            const ch = this.src[this.pos];
            if (this.isDigit(ch)) {
                this.pos++;
            } else if (ch === '.' && !isFloat) {
                isFloat = true;
                this.pos++;
            } else if ((ch === 'e' || ch === 'E') && this.pos + 1 < this.len) {
                this.pos++;
                if (this.src[this.pos] === '+' || this.src[this.pos] === '-') {
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
            type: 'NUMBER',
            value: raw,
            raw: Number(raw),
            pos: start
        };
    }

    private readString(quote: string): Token {
        const start = this.pos;
        this.pos++; // skip opening quote
        let val = '';

        while (this.pos < this.len) {
            const ch = this.src[this.pos];
            if (ch === quote) {
                this.pos++; // skip closing quote
                return {
                    type: 'STRING',
                    value: val,
                    raw: val,
                    pos: start
                };
            }
            if (ch === '\\' && this.pos + 1 < this.len) {
                this.pos++;
                const esc = this.src[this.pos];
                if (esc === 'n') val += '\n';
                else if (esc === 'r') val += '\r';
                else if (esc === 't') val += '\t';
                else if (esc === '\\') val += '\\';
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

    private readTemplateLiteral(): Token {
        const start = this.pos;
        this.pos++; // skip `
        let val = '';

        while (this.pos < this.len) {
            const ch = this.src[this.pos];
            if (ch === '`') {
                this.pos++;
                return {
                    type: 'TEMPLATE_NO_SUBST',
                    value: val,
                    raw: val,
                    pos: start
                };
            }
            if (ch === '$' && this.pos + 1 < this.len && this.src[this.pos + 1] === '{') {
                this.pos += 2;
                return {
                    type: 'TEMPLATE_HEAD',
                    value: val,
                    raw: val,
                    pos: start
                };
            }
            if (ch === '\\' && this.pos + 1 < this.len) {
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

    private readIdentifierOrKeyword(): Token {
        const start = this.pos;
        while (this.pos < this.len && this.isIdentPart(this.src[this.pos])) {
            this.pos++;
        }

        const word = this.src.slice(start, this.pos);

        if (word === 'true') {
            return { type: 'BOOLEAN', value: word, raw: true, pos: start };
        }
        if (word === 'false') {
            return { type: 'BOOLEAN', value: word, raw: false, pos: start };
        }
        if (word === 'null') {
            return { type: 'NULL', value: word, raw: null, pos: start };
        }
        if (word === 'undefined') {
            return { type: 'UNDEFINED', value: word, raw: undefined, pos: start };
        }
        if (FORBIDDEN_KEYWORDS.has(word)) {
            return { type: 'FORBIDDEN_KEYWORD', value: word, pos: start };
        }

        return { type: 'IDENTIFIER', value: word, pos: start };
    }

    private readOperatorOrPunctuation(): Token | null {
        const start = this.pos;
        const rest = this.src.slice(start);

        // 3-char operators
        const threeChar = ['===', '!==', '>>>', '**=', '&&=', '||=', '??='];
        for (const op of threeChar) {
            if (rest.startsWith(op)) {
                this.pos += 3;
                return { type: 'OPERATOR', value: op, pos: start };
            }
        }

        // 2-char operators & punctuation
        const twoChar = [
            '==', '!=', '<=', '>=', '&&', '||', '??', '++', '--',
            '+=', '-=', '*=', '/=', '%=', '?.', '=>'
        ];
        for (const op of twoChar) {
            if (rest.startsWith(op)) {
                this.pos += 2;
                if (op === '=>') {
                    return { type: 'FORBIDDEN_KEYWORD', value: op, pos: start };
                }
                if (op === '?.') {
                    return { type: 'PUNCTUATION', value: op, pos: start };
                }
                return { type: 'OPERATOR', value: op, pos: start };
            }
        }

        // 1-char punctuation
        const singleCharPunct = '()[]{},;.:?';
        const ch = this.src[this.pos];
        if (singleCharPunct.includes(ch)) {
            this.pos++;
            return { type: 'PUNCTUATION', value: ch, pos: start };
        }

        // 1-char operators
        const singleCharOps = '+-*/%&|^!~<>=';
        if (singleCharOps.includes(ch)) {
            this.pos++;
            return { type: 'OPERATOR', value: ch, pos: start };
        }

        return null;
    }
}
