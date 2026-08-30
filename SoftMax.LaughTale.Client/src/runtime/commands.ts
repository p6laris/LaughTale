/**
 * SoftMax.LaughTale: Client Command Registry (Hardened Security Edition)
 * Central runtime registry for named client commands, eliminating dynamic JavaScript evaluation from server props.
 */

export type CommandHandler<T = any> = (item: T) => void;

const commandRegistry = new Map<string, CommandHandler>();

/**
 * Registers a named client-side command handler.
 * @param name The unique command key referenced by server-side props.
 * @param handler The JavaScript callback function to invoke.
 */
export function registerCommand(name: string, handler: CommandHandler): void {
    if (typeof name !== 'string' || !name.trim()) {
        console.warn('[SoftMax.LaughTale Commands] Invalid command name provided to registerCommand');
        return;
    }
    if (typeof handler !== 'function') {
        console.warn(`[SoftMax.LaughTale Commands] Invalid handler provided for command "${name}"`);
        return;
    }
    commandRegistry.set(name.trim(), handler);
}

/**
 * Unregisters a command handler by name.
 * @param name The command key to remove.
 */
export function unregisterCommand(name: string): boolean {
    return commandRegistry.delete(name.trim());
}

/**
 * Retrieves a registered command handler by name.
 * @param name The command key.
 */
export function getCommand(name: string): CommandHandler | undefined {
    return commandRegistry.get(name.trim());
}

/**
 * Safely executes a registered command handler by name.
 * Logs a warning and no-ops if the command is not registered.
 * @param name The command key.
 * @param item Optional item payload to pass to the handler.
 * @returns boolean indicating whether the command was found and executed.
 */
export function executeCommand(name: string, item?: any): boolean {
    if (!name || typeof name !== 'string') {
        return false;
    }
    const handler = commandRegistry.get(name.trim());
    if (!handler) {
        console.warn(`[SoftMax.LaughTale Commands] Command "${name}" is not registered in the client registry.`);
        return false;
    }
    try {
        handler(item);
        return true;
    } catch (err) {
        console.error(`[SoftMax.LaughTale Commands] Error executing command "${name}":`, err);
        return false;
    }
}

/**
 * Clears all registered commands (useful for test resets).
 */
export function clearCommands(): void {
    commandRegistry.clear();
}

/**
 * Returns a list of all currently registered command names.
 */
export function listCommands(): string[] {
    return Array.from(commandRegistry.keys());
}
