class FormHandler {
	constructor() {
		this.inputs = {};
	}

	registerInput(inputName, stateHook) {
		this.inputs[inputName] = {
			stateValue: stateHook[0],
			stateSetter: stateHook[1]
		};
	}

	setValue(inputName, value) {
		return this.inputs[inputName].stateSetter(value);
	}

	getValue(inputName) {
		return this.inputs[inputName].stateValue;
	}

	onHandler(inputName) {
		return (e) => {
			this.inputs[inputName].stateSetter(e.target.value);
		};
	}
}

export { FormHandler };