import '../setup.ts';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createMachine } from '../../src/runtime/state-machine.ts';
import { effect } from '../../src/runtime/signals.ts';

describe('Finite State Machine Suite (ROADMAP.v5.md Part M "Adopt - State machine")', () => {
    it('starts in the configured initial state', () => {
        const machine = createMachine({
            initial: 'closed',
            context: {},
            states: {
                closed: { on: { OPEN: 'open' } },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        assert.equal(machine.state(), 'closed');
        assert.equal(machine.matches('closed'), true);
        assert.equal(machine.matches('open'), false);
    });

    it('transitions on a matching event', () => {
        const machine = createMachine({
            initial: 'closed',
            context: {},
            states: {
                closed: { on: { OPEN: 'open' } },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        machine.send('OPEN');
        assert.equal(machine.state(), 'open');

        machine.send('CLOSE');
        assert.equal(machine.state(), 'closed');
    });

    it('ignores an event with no matching transition in the current state', () => {
        const machine = createMachine({
            initial: 'closed',
            context: {},
            states: {
                closed: { on: { OPEN: 'open' } },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        machine.send('CLOSE'); // no CLOSE handler while closed
        assert.equal(machine.state(), 'closed');

        machine.send('BOGUS_EVENT' as any);
        assert.equal(machine.state(), 'closed');
    });

    it('a failing guard blocks the transition entirely - no state change, no action', () => {
        let actionRan = false;
        const machine = createMachine({
            initial: 'closed',
            context: { disabled: true },
            states: {
                closed: {
                    on: {
                        OPEN: {
                            target: 'open',
                            guard: (ctx) => !ctx.disabled,
                            action: () => { actionRan = true; }
                        }
                    }
                },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        machine.send('OPEN');

        assert.equal(machine.state(), 'closed', 'the boolean-soup bug this exists to end: disabled must block OPEN entirely');
        assert.equal(actionRan, false, 'the action must not run when the guard blocks the transition');
    });

    it('a passing guard allows the transition and runs the action', () => {
        let actionRan = false;
        const machine = createMachine({
            initial: 'closed',
            context: { disabled: false },
            states: {
                closed: {
                    on: {
                        OPEN: {
                            target: 'open',
                            guard: (ctx) => !ctx.disabled,
                            action: () => { actionRan = true; }
                        }
                    }
                },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        machine.send('OPEN');

        assert.equal(machine.state(), 'open');
        assert.equal(actionRan, true);
    });

    it('runs entry/exit hooks exactly once per real transition, never on a same-state no-op', () => {
        const log: string[] = [];
        const machine = createMachine({
            initial: 'closed',
            context: {},
            states: {
                closed: {
                    on: { OPEN: 'open' },
                    entry: () => log.push('enter:closed'),
                    exit: () => log.push('exit:closed')
                },
                open: {
                    on: { OPEN: 'open', CLOSE: 'closed' }, // self-transition on OPEN while already open
                    entry: () => log.push('enter:open'),
                    exit: () => log.push('exit:open')
                }
            }
        });

        assert.deepEqual(log, ['enter:closed'], 'the initial state\'s entry hook must run at creation');

        machine.send('OPEN');
        assert.deepEqual(log, ['enter:closed', 'exit:closed', 'enter:open']);

        machine.send('OPEN'); // self-transition: target === current state
        assert.deepEqual(
            log,
            ['enter:closed', 'exit:closed', 'enter:open'],
            'a transition whose target is the CURRENT state must not re-fire exit/entry'
        );
    });

    it('the context object is a stable, shared, mutable reference across transitions', () => {
        const machine = createMachine({
            initial: 'idle',
            context: { count: 0 },
            states: {
                idle: {
                    on: { INCREMENT: { target: 'idle', action: (ctx) => { ctx.count++; } } }
                }
            }
        });

        machine.send('INCREMENT');
        machine.send('INCREMENT');
        machine.send('INCREMENT');

        assert.equal(machine.context.count, 3);
    });

    it('state is a real signal - an effect depending on it re-runs on every real transition', () => {
        const machine = createMachine({
            initial: 'closed',
            context: {},
            states: {
                closed: { on: { OPEN: 'open' } },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        const seen: string[] = [];
        effect(() => {
            seen.push(machine.state());
        });

        assert.deepEqual(seen, ['closed']);
        machine.send('OPEN');
        assert.deepEqual(seen, ['closed', 'open']);
        machine.send('CLOSE');
        assert.deepEqual(seen, ['closed', 'open', 'closed']);
    });

    it('a blocked (guard-failed) transition does not re-run effects depending on state', () => {
        const machine = createMachine({
            initial: 'closed',
            context: { disabled: true },
            states: {
                closed: { on: { OPEN: { target: 'open', guard: (ctx) => !ctx.disabled } } },
                open: { on: { CLOSE: 'closed' } }
            }
        });

        let runs = 0;
        effect(() => {
            machine.state();
            runs++;
        });

        assert.equal(runs, 1);
        machine.send('OPEN'); // blocked by guard
        assert.equal(runs, 1, 'a guard-blocked transition must not touch the signal at all, so no effect re-run');
    });
});
