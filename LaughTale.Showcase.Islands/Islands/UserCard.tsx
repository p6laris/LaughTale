/**
 * UserCard — ROADMAP.v5.md Part B end-to-end validation example.
 *
 * A real, hand-authored React island living under LaughTale.Showcase.Islands/Islands/,
 * discovered and compiled entirely by the `laughtale islands build` pipeline
 * (LaughTale.Client/scripts/islands/discover.mjs + bundle.mjs) rather than a
 * hand-written defineIsland() call. Exercises every type the syntactic
 * prop-type mapper supports: a required string, an optional string, an
 * optional boolean, and an optional number.
 *
 * Lives in its own project (LaughTale.Showcase.Islands), not directly inside
 * LaughTale.Showcase: the generated <island-user-card> TagHelper is only
 * recognized by Razor when it's compiled in a DIFFERENT project than the
 * .cshtml page using it. Razor's own compiler is itself a Roslyn incremental
 * generator, and independent incremental generators can't see each other's
 * emitted types within one compilation - confirmed empirically (the tag was
 * silently treated as literal HTML text when tried in the same project as
 * IslandCompiler.cshtml, even on a clean rebuild). See
 * LaughTale.Showcase.Islands.csproj's own remarks for the full account.
 *
 * Authoring contract (see discover.mjs's extractIsland and its own tests in
 * LaughTale.Client/tests/islands-discover.test.ts):
 *   - Exactly one exported `interface`/`type` alias whose name ends in "Props".
 *   - A top-level `export default function Name(...) { ... }` FUNCTION
 *     DECLARATION - not an arrow function assigned to a variable and then
 *     exported, and not a bare `export default someExpression;`. discover.mjs
 *     inspects syntax only, so the default export itself must literally be a
 *     function declaration (see hasValidDefaultExportFunction). The real React
 *     component is therefore wrapped in createReactAdapter *inside* that
 *     declaration's body: the wrapper's own (container, props, ctx) => ...
 *     signature is exactly the IslandFactory shape createReactAdapter already
 *     returns (see LaughTale.Client/src/runtime/hydrator.ts's `mount(container,
 *     props, ctx)` call), so this satisfies discover.mjs's syntactic check
 *     *and* the runtime's real hydration contract at the same time.
 */
import { createReactAdapter } from 'laughtale/adapters/react';
import type { IslandContext } from 'laughtale';

export interface UserCardProps {
    userName: string;
    avatarUrl?: string;
    isOnline?: boolean;
    score?: number;
}

function UserCard({ userName, avatarUrl, isOnline, score }: UserCardProps) {
    const initial = userName.trim().charAt(0).toUpperCase() || '?';

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--p-border-radius-xl, 1rem)',
                border: '1px solid var(--p-border-color)',
                background: 'var(--p-surface-0)',
                boxShadow: 'var(--p-shadow-sm)',
                fontFamily: 'var(--p-font-family, sans-serif)'
            }}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={userName}
                    style={{ width: 48, height: 48, borderRadius: '9999px', objectFit: 'cover', flexShrink: 0 }}
                />
            ) : (
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '9999px',
                        background: 'var(--p-primary-500)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.125rem',
                        flexShrink: 0
                    }}
                >
                    {initial}
                </div>
            )}

            <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--p-text-color)' }}>
                    <span>{userName}</span>
                    {isOnline && (
                        <span
                            title="Online"
                            style={{ width: 8, height: 8, borderRadius: '9999px', background: '#10b981', display: 'inline-block', flexShrink: 0 }}
                        />
                    )}
                </div>
                {typeof score === 'number' && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--p-text-muted)', marginTop: '0.15rem' }}>
                        Score: <strong style={{ fontFamily: 'var(--p-font-mono, monospace)' }}>{score}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UserCardIsland(container: HTMLElement, props: UserCardProps, ctx?: IslandContext) {
    return createReactAdapter(UserCard)(container, props, ctx);
}
