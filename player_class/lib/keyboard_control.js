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
 * @method init - Initializes the keyboard event listeners.
 * @method cleanup - Cleans up the event listeners when the control is no longer needed.
 */
class KeyboardControl {
    constructor() {
        this.keyBindings = {};
        this.init();
    }
    /**
     * Initializes the keyboard event listeners.
     * Binds keydown and keyup events to the respective handlers.
     */
    init() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    /**
   * Binds a specific key to an action callback.
   * @param {string} key - The key to bind (e.g., 'ArrowUp').
   * @param {function} action - The callback function to execute when the key is pressed.
   * @param {function} [cancel] - Optional callback function to execute when the key is released.
   */
    bindKey(key, action, cancel) {
        this.keyBindings[key] = action;
        if (cancel) {
            // Bind the cancel action to the key + 'Up' event
            this.keyBindings[key+"Up"] = cancel;
        }
    }
    /**
     * Unbinds a specific key, removing its action callback.
     * @param {string} key - The key to unbind.
     */
    unbindKey(key) {
        delete this.keyBindings[key];

    }
    /**
     * Handles the keydown event and triggers the bound action for the pressed key.
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    handleKeyDown(event) {
        const action = this.keyBindings[event.key];
        if (action) {
            action(event);
        }
    }
    /**
     * Handles the keyup event. This can be used to stop actions or reset states.
     * @param {KeyboardEvent} event - The keyboard event object.
     */ 
    handleKeyUp(event) {
        const cancel = this.keyBindings[event.key+ "Up"];
        if (cancel) {
            cancel(event);
        } 
    }
    /**
     * Destroys the keyboard control, cleaning up resources and event listeners.
     */
    cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        document.removeEventListener('keyup', this.handleKeyUp.bind(this));
        this.keyBindings = {};
    }
    
}