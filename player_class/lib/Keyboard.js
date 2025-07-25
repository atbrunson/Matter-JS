/**
 * Class representing a keyboard control module.
 * Handles keyboard input events and provides methods to manage key bindings and actions.
 *
 * @class
 * @example
 * const keyboard = new KeyboardControl();
 * keyboard.bindKey('ArrowUp', () => moveUp());
 *
 * @property {Object} keyBindings - An object mapping key names to their corresponding action callbacks.
 * @method bindKey - Binds a specific key to an action callback.
 * @method unbindKey - Removes the binding for a specific key.
 * @method handleKeyDown - Handles the keydown event and triggers the bound action.
 * @method handleKeyUp - Handles the keyup event and can be used to stop actions.
 */