/**
 * Class representing a keyboard control module.
 * Handles input events and provides methods to manage key bindings and actions.
 *
 * @module KeyboardControl
 * @requires document
 * @example
 * 	 const keyboard = new KeyboardControl();
 * 	 keyboard.bindKey('ArrowUp', () => moveUp());
 * 	 keyboard.unbindKey('ArrowUp');
 * @property {Object} keyBindings - An object mapping key names to their corresponding action callbacks.
 * @method init - Initializes the keyboard control by setting up event listeners for keydown and keyup events.
 * @event keydown - Triggered when a key is pressed down.
 * @method handleKeyDown - Handles the keydown event and triggers the bound action.
 * @event keyup - Triggered when a key is released.
 * @method handleKeyUp - Handles the keyup event and can be used to stop actions.
 * @method bindKey - Binds a specific key to an action callback.
 * @property {String} key - The name of the key to bind or unbind.
 * @method unbindKey - Removes the binding for a specific key.
 * @property {Function} action - The callback function to execute when the key is pressed.
 * @property {Function} cancel - The callback function to execute when the key is released.
 */

class KeyboardControl {
	constructor() {
		this.keyBindings = {};
		this.init();
	}

	init() {
		document.addEventListener('keydown', (event) => this.handleKeyDown(event));
		document.addEventListener('keyup', (event) => this.handleKeyUp(event));
	}

	bindKey(key, action) {
		this.keyBindings[key] = action;
	}

	unbindKey(key) {
		delete this.keyBindings[key];
	}

	handleKeyDown(event) {
		const action = this.keyBindings[event.key];
		if (action) {
			action();
		}
	}

	handleKeyUp(event) {
		const cancel = this.keyBindings[event.key];
		if (cancel) {
			cancel();
		}
	}
}