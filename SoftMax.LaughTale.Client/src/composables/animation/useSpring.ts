/**
 * SoftMax.LaughTale: Composable useSpring Animation
 * Physics-based harmonic spring solver with stiffness, damping, mass, and velocity.
 */

export interface SpringConfig {
    stiffness?: number; // Spring tension (default 170)
    damping?: number;   // Friction (default 26)
    mass?: number;      // Inertia (default 1)
    precision?: number; // Stop threshold (default 0.001)
}

export interface UseSpringReturn {
    readonly value: number;
    set: (target: number) => void;
    onUpdate: (listener: (val: number) => void) => () => void;
    stop: () => void;
}

export function useSpring(initialValue: number, config: SpringConfig = {}): UseSpringReturn {
    const stiffness = config.stiffness ?? 170;
    const damping = config.damping ?? 26;
    const mass = config.mass ?? 1;
    const precision = config.precision ?? 0.001;

    let current = initialValue;
    let target = initialValue;
    let velocity = 0;
    let animFrame: number | null = null;
    const updateListeners = new Set<(val: number) => void>();

    function step() {
        // F = -k * x - c * v
        const displacement = current - target;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * velocity;
        const acceleration = (springForce + dampingForce) / mass;

        const dt = 1 / 60; // 60 FPS delta
        velocity += acceleration * dt;
        current += velocity * dt;

        updateListeners.forEach(fn => fn(current));

        if (Math.abs(displacement) < precision && Math.abs(velocity) < precision) {
            current = target;
            velocity = 0;
            updateListeners.forEach(fn => fn(current));
            animFrame = null;
        } else {
            if (typeof requestAnimationFrame !== 'undefined') {
                animFrame = requestAnimationFrame(step);
            }
        }
    }

    function set(nextTarget: number) {
        target = nextTarget;
        if (animFrame === null && typeof requestAnimationFrame !== 'undefined') {
            animFrame = requestAnimationFrame(step);
        } else if (typeof requestAnimationFrame === 'undefined') {
            current = nextTarget;
            updateListeners.forEach(fn => fn(current));
        }
    }

    function stop() {
        if (animFrame !== null && typeof cancelAnimationFrame !== 'undefined') {
            cancelAnimationFrame(animFrame);
            animFrame = null;
        }
        velocity = 0;
    }

    function onUpdate(listener: (val: number) => void): () => void {
        updateListeners.add(listener);
        return () => updateListeners.delete(listener);
    }

    return {
        get value() { return current; },
        set,
        onUpdate,
        stop
    };
}
