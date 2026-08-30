/**
 * LaughTale: Directive Expression AST Node Definitions
 * Strict AST node types for safe declarative directive evaluation.
 */

export type ASTNodeType =
    | 'Literal'
    | 'Identifier'
    | 'UnaryExpression'
    | 'BinaryExpression'
    | 'LogicalExpression'
    | 'ConditionalExpression'
    | 'MemberExpression'
    | 'IndexExpression'
    | 'CallExpression'
    | 'ArrayLiteral'
    | 'ObjectLiteral'
    | 'TemplateLiteral'
    | 'AssignmentExpression'
    | 'UpdateExpression'
    | 'SequenceExpression';

export interface BaseNode {
    type: ASTNodeType;
}

export interface LiteralNode extends BaseNode {
    type: 'Literal';
    value: string | number | boolean | null | undefined;
}

export interface IdentifierNode extends BaseNode {
    type: 'Identifier';
    name: string;
}

export interface UnaryExpressionNode extends BaseNode {
    type: 'UnaryExpression';
    operator: '!' | '+' | '-' | '~' | 'typeof';
    argument: ASTNode;
}

export interface BinaryExpressionNode extends BaseNode {
    type: 'BinaryExpression';
    operator: '+' | '-' | '*' | '/' | '%' | '==' | '===' | '!=' | '!==' | '<' | '<=' | '>' | '>=' | 'in' | 'instanceof';
    left: ASTNode;
    right: ASTNode;
}

export interface LogicalExpressionNode extends BaseNode {
    type: 'LogicalExpression';
    operator: '&&' | '||' | '??';
    left: ASTNode;
    right: ASTNode;
}

export interface ConditionalExpressionNode extends BaseNode {
    type: 'ConditionalExpression';
    test: ASTNode;
    consequent: ASTNode;
    alternate: ASTNode;
}

export interface MemberExpressionNode extends BaseNode {
    type: 'MemberExpression';
    object: ASTNode;
    property: string;
    optional?: boolean;
}

export interface IndexExpressionNode extends BaseNode {
    type: 'IndexExpression';
    object: ASTNode;
    index: ASTNode;
    optional?: boolean;
}

export interface CallExpressionNode extends BaseNode {
    type: 'CallExpression';
    callee: ASTNode;
    args: ASTNode[];
    optional?: boolean;
}

export interface ArrayLiteralNode extends BaseNode {
    type: 'ArrayLiteral';
    elements: ASTNode[];
}

export interface PropertyNode {
    key: string;
    value: ASTNode;
    computed?: boolean;
}

export interface ObjectLiteralNode extends BaseNode {
    type: 'ObjectLiteral';
    properties: PropertyNode[];
}

export interface TemplateLiteralNode extends BaseNode {
    type: 'TemplateLiteral';
    quasis: string[];
    expressions: ASTNode[];
}

export interface AssignmentExpressionNode extends BaseNode {
    type: 'AssignmentExpression';
    operator: '=' | '+=' | '-=' | '*=' | '/=';
    left: IdentifierNode | MemberExpressionNode | IndexExpressionNode;
    right: ASTNode;
}

export interface UpdateExpressionNode extends BaseNode {
    type: 'UpdateExpression';
    operator: '++' | '--';
    argument: IdentifierNode | MemberExpressionNode | IndexExpressionNode;
    prefix: boolean;
}

export interface SequenceExpressionNode extends BaseNode {
    type: 'SequenceExpression';
    expressions: ASTNode[];
}

export type ASTNode =
    | LiteralNode
    | IdentifierNode
    | UnaryExpressionNode
    | BinaryExpressionNode
    | LogicalExpressionNode
    | ConditionalExpressionNode
    | MemberExpressionNode
    | IndexExpressionNode
    | CallExpressionNode
    | ArrayLiteralNode
    | ObjectLiteralNode
    | TemplateLiteralNode
    | AssignmentExpressionNode
    | UpdateExpressionNode
    | SequenceExpressionNode;
