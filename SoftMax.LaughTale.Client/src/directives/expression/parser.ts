/**
 * SoftMax.LaughTale: Directive Expression Parser
 * Recursive-descent AST parser with strict security validation.
 */

import {
    ASTNode,
    LiteralNode,
    IdentifierNode,
    UnaryExpressionNode,
    BinaryExpressionNode,
    LogicalExpressionNode,
    ConditionalExpressionNode,
    MemberExpressionNode,
    IndexExpressionNode,
    CallExpressionNode,
    ArrayLiteralNode,
    ObjectLiteralNode,
    PropertyNode,
    AssignmentExpressionNode,
    UpdateExpressionNode,
    SequenceExpressionNode
} from './ast.ts';
import { Lexer, Token, TokenType } from './lexer.ts';

export class ParseError extends Error {
    public pos: number;
    constructor(message: string, pos: number = 0) {
        super(`[SoftMax.LaughTale Expression Parser] ${message} at pos ${pos}`);
        this.name = 'ParseError';
        this.pos = pos;
    }
}

export class Parser {
    private tokens: Token[];
    private current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    public static parse(source: string): ASTNode {
        const trimmed = source.trim();
        if (!trimmed) {
            return { type: 'Literal', value: undefined };
        }
        const lexer = new Lexer(trimmed);
        const tokens = lexer.tokenize();
        const parser = new Parser(tokens);
        const node = parser.parseStatementSequence();
        if (!parser.isAtEnd()) {
            throw new ParseError(`Unexpected token '${parser.peek().value}'`, parser.peek().pos);
        }
        return node;
    }

    private parseStatementSequence(): ASTNode {
        const exprs: ASTNode[] = [];
        while (!this.isAtEnd()) {
            const expr = this.parseExpression();
            exprs.push(expr);

            if (this.match('PUNCTUATION', ';')) {
                // allow trailing or separating semicolon
                while (this.match('PUNCTUATION', ';')) {
                    // skip multiple semicolons
                }
            } else {
                break;
            }
        }

        if (exprs.length === 0) {
            return { type: 'Literal', value: undefined };
        }
        if (exprs.length === 1) {
            return exprs[0];
        }
        return { type: 'SequenceExpression', expressions: exprs };
    }

    private parseExpression(): ASTNode {
        return this.parseAssignment();
    }

    private parseAssignment(): ASTNode {
        const expr = this.parseTernary();

        const assignOps = ['=', '+=', '-=', '*=', '/='];
        if (this.check('OPERATOR') && assignOps.includes(this.peek().value)) {
            const opToken = this.advance();
            const right = this.parseAssignment();

            if (expr.type === 'Identifier' || expr.type === 'MemberExpression' || expr.type === 'IndexExpression') {
                return {
                    type: 'AssignmentExpression',
                    operator: opToken.value as any,
                    left: expr,
                    right
                };
            }
            throw new ParseError('Invalid left-hand side in assignment', opToken.pos);
        }

        return expr;
    }

    private parseTernary(): ASTNode {
        let expr = this.parseNullish();

        if (this.match('PUNCTUATION', '?') || this.match('OPERATOR', '?')) {
            const consequent = this.parseExpression();
            if (!this.match('PUNCTUATION', ':') && !this.match('OPERATOR', ':')) {
                throw new ParseError("Expected ':' in conditional expression", this.peek().pos);
            }
            const alternate = this.parseExpression();
            expr = {
                type: 'ConditionalExpression',
                test: expr,
                consequent,
                alternate
            };
        }

        return expr;
    }

    private parseNullish(): ASTNode {
        let left = this.parseLogicalOr();

        while (this.match('OPERATOR', '??')) {
            const right = this.parseLogicalOr();
            left = {
                type: 'LogicalExpression',
                operator: '??',
                left,
                right
            };
        }

        return left;
    }

    private parseLogicalOr(): ASTNode {
        let left = this.parseLogicalAnd();

        while (this.match('OPERATOR', '||')) {
            const right = this.parseLogicalAnd();
            left = {
                type: 'LogicalExpression',
                operator: '||',
                left,
                right
            };
        }

        return left;
    }

    private parseLogicalAnd(): ASTNode {
        let left = this.parseEquality();

        while (this.match('OPERATOR', '&&')) {
            const right = this.parseEquality();
            left = {
                type: 'LogicalExpression',
                operator: '&&',
                left,
                right
            };
        }

        return left;
    }

    private parseEquality(): ASTNode {
        let left = this.parseRelational();

        while (this.check('OPERATOR') && ['===', '!==', '==', '!='].includes(this.peek().value)) {
            const op = this.advance().value as any;
            const right = this.parseRelational();
            left = {
                type: 'BinaryExpression',
                operator: op,
                left,
                right
            };
        }

        return left;
    }

    private parseRelational(): ASTNode {
        let left = this.parseAdditive();

        while (this.check('OPERATOR') && ['<', '<=', '>', '>=', 'in', 'instanceof'].includes(this.peek().value)) {
            const op = this.advance().value as any;
            const right = this.parseAdditive();
            left = {
                type: 'BinaryExpression',
                operator: op,
                left,
                right
            };
        }

        return left;
    }

    private parseAdditive(): ASTNode {
        let left = this.parseMultiplicative();

        while (this.check('OPERATOR') && ['+', '-'].includes(this.peek().value)) {
            const op = this.advance().value as any;
            const right = this.parseMultiplicative();
            left = {
                type: 'BinaryExpression',
                operator: op,
                left,
                right
            };
        }

        return left;
    }

    private parseMultiplicative(): ASTNode {
        let left = this.parseUnary();

        while (this.check('OPERATOR') && ['*', '/', '%'].includes(this.peek().value)) {
            const op = this.advance().value as any;
            const right = this.parseUnary();
            left = {
                type: 'BinaryExpression',
                operator: op,
                left,
                right
            };
        }

        return left;
    }

    private parseUnary(): ASTNode {
        if (this.check('OPERATOR') && ['!', '+', '-', '~'].includes(this.peek().value)) {
            const op = this.advance().value as any;
            const arg = this.parseUnary();
            return {
                type: 'UnaryExpression',
                operator: op,
                argument: arg
            };
        }

        if (this.check('IDENTIFIER') && this.peek().value === 'typeof') {
            this.advance();
            const arg = this.parseUnary();
            return {
                type: 'UnaryExpression',
                operator: 'typeof',
                argument: arg
            };
        }

        if (this.check('OPERATOR') && (this.peek().value === '++' || this.peek().value === '--')) {
            const op = this.advance().value as '++' | '--';
            const arg = this.parsePostfix();
            if (arg.type === 'Identifier' || arg.type === 'MemberExpression' || arg.type === 'IndexExpression') {
                return {
                    type: 'UpdateExpression',
                    operator: op,
                    argument: arg,
                    prefix: true
                };
            }
            throw new ParseError(`Invalid left-hand side in prefix ${op} operation`, this.peek().pos);
        }

        return this.parsePostfix();
    }

    private parsePostfix(): ASTNode {
        let expr = this.parsePrimary();

        while (true) {
            if (this.match('PUNCTUATION', '.')) {
                // Member expression: obj.prop
                const propToken = this.consume('IDENTIFIER', undefined, 'Expected property identifier after .');
                this.validatePropertyName(propToken.value, propToken.pos);
                expr = {
                    type: 'MemberExpression',
                    object: expr,
                    property: propToken.value
                };
            } else if (this.match('OPERATOR', '?.') || this.match('PUNCTUATION', '?.')) {
                // Optional chaining: obj?.prop or obj?.[idx] or obj?.(args)
                if (this.match('PUNCTUATION', '[')) {
                    const index = this.parseExpression();
                    this.consume('PUNCTUATION', ']', "Expected ']' after optional index");
                    expr = {
                        type: 'IndexExpression',
                        object: expr,
                        index,
                        optional: true
                    };
                } else if (this.match('PUNCTUATION', '(')) {
                    const args = this.parseArguments();
                    expr = {
                        type: 'CallExpression',
                        callee: expr,
                        args,
                        optional: true
                    };
                } else {
                    const propToken = this.consume('IDENTIFIER', undefined, 'Expected property identifier after ?.');
                    this.validatePropertyName(propToken.value, propToken.pos);
                    expr = {
                        type: 'MemberExpression',
                        object: expr,
                        property: propToken.value,
                        optional: true
                    };
                }
            } else if (this.match('PUNCTUATION', '[')) {
                // Index expression: obj[expr]
                const index = this.parseExpression();
                this.consume('PUNCTUATION', ']', "Expected ']' after computed index");
                expr = {
                    type: 'IndexExpression',
                    object: expr,
                    index
                };
            } else if (this.match('PUNCTUATION', '(')) {
                // Function / method call: fn(a, b)
                const args = this.parseArguments();
                expr = {
                    type: 'CallExpression',
                    callee: expr,
                    args
                };
            } else if (this.check('OPERATOR') && (this.peek().value === '++' || this.peek().value === '--')) {
                // Postfix increment / decrement
                const op = this.advance().value as '++' | '--';
                if (expr.type === 'Identifier' || expr.type === 'MemberExpression' || expr.type === 'IndexExpression') {
                    expr = {
                        type: 'UpdateExpression',
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

    private parseArguments(): ASTNode[] {
        const args: ASTNode[] = [];
        if (!this.check('PUNCTUATION', ')')) {
            do {
                if (this.check('PUNCTUATION', ')')) break;
                args.push(this.parseExpression());
            } while (this.match('PUNCTUATION', ','));
        }
        this.consume('PUNCTUATION', ')', "Expected ')' after argument list");
        return args;
    }

    private parsePrimary(): ASTNode {
        const token = this.peek();

        if (token.type === 'FORBIDDEN_KEYWORD') {
            throw new ParseError(`Forbidden keyword '${token.value}' is prohibited in directive expressions`, token.pos);
        }

        if (token.type === 'NUMBER') {
            this.advance();
            return { type: 'Literal', value: token.raw };
        }

        if (token.type === 'STRING') {
            this.advance();
            return { type: 'Literal', value: token.raw };
        }

        if (token.type === 'BOOLEAN') {
            this.advance();
            return { type: 'Literal', value: token.raw };
        }

        if (token.type === 'NULL') {
            this.advance();
            return { type: 'Literal', value: null };
        }

        if (token.type === 'UNDEFINED') {
            this.advance();
            return { type: 'Literal', value: undefined };
        }

        if (token.type === 'TEMPLATE_NO_SUBST') {
            this.advance();
            return {
                type: 'TemplateLiteral',
                quasis: [token.value],
                expressions: []
            };
        }

        if (token.type === 'IDENTIFIER') {
            this.advance();
            this.validatePropertyName(token.value, token.pos);
            return { type: 'Identifier', name: token.value };
        }

        // Grouping: ( expr )
        if (this.match('PUNCTUATION', '(')) {
            const expr = this.parseExpression();
            this.consume('PUNCTUATION', ')', "Expected ')' after grouped expression");
            return expr;
        }

        // Array Literal: [ item1, item2 ]
        if (this.match('PUNCTUATION', '[')) {
            const elements: ASTNode[] = [];
            if (!this.check('PUNCTUATION', ']')) {
                do {
                    if (this.check('PUNCTUATION', ']')) break;
                    elements.push(this.parseExpression());
                } while (this.match('PUNCTUATION', ','));
            }
            this.consume('PUNCTUATION', ']', "Expected ']' after array literal");
            return { type: 'ArrayLiteral', elements };
        }

        // Object Literal: { key: val, prop }
        if (this.match('PUNCTUATION', '{')) {
            const properties: PropertyNode[] = [];
            if (!this.check('PUNCTUATION', '}')) {
                do {
                    if (this.check('PUNCTUATION', '}')) break;
                    let key = '';
                    if (this.check('IDENTIFIER') || this.check('STRING')) {
                        const kToken = this.advance();
                        key = kToken.value;
                    } else {
                        throw new ParseError('Expected property name in object literal', this.peek().pos);
                    }

                    let val: ASTNode;
                    if (this.match('PUNCTUATION', ':')) {
                        val = this.parseExpression();
                    } else {
                        // Shorthand { count }
                        val = { type: 'Identifier', name: key };
                    }
                    properties.push({ key, value: val });
                } while (this.match('PUNCTUATION', ','));
            }
            this.consume('PUNCTUATION', '}', "Expected '}' after object literal");
            return { type: 'ObjectLiteral', properties };
        }

        throw new ParseError(`Unexpected token '${token.value}'`, token.pos);
    }

    private validatePropertyName(name: string, pos: number): void {
        const forbiddenProps = ['constructor', '__proto__', 'prototype', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
        if (forbiddenProps.includes(name)) {
            throw new ParseError(`Access to restricted property '${name}' is blocked for security`, pos);
        }
    }

    private match(type: TokenType, value?: string): boolean {
        if (this.check(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    private check(type: TokenType, value?: string): boolean {
        if (this.isAtEnd()) return false;
        const t = this.peek();
        if (t.type !== type) return false;
        if (value !== undefined && t.value !== value) return false;
        return true;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === 'EOF';
    }

    private peek(): Token {
        return this.tokens[this.current] ?? { type: 'EOF', value: '', pos: 0 };
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private consume(type: TokenType, value?: string, errMsg?: string): Token {
        if (this.check(type, value)) return this.advance();
        const t = this.peek();
        throw new ParseError(errMsg ?? `Expected token ${type} ${value ?? ''} but got '${t.value}'`, t.pos);
    }
}
