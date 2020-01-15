import { ViSmaOE } from './visma';

class _IDECore {
    constructor() {
        this._signals = {};
        this._components = {};
    }

    initialize() {
        ViSmaOE.initialize();
        this.addComponent(ViSmaOE);
    }

    postSignal(signal, data, compName) {
        this._signals[signal].forEach(component => this._components[component].receiveSignal(signal, data, compName));
    }

    listensSignals(signals, compName) {
        signals.forEach(signal => {
            if (!(signal in this._signals)) this._signals[signal] = [];

            this._signals[signal].push(compName);
        });
    }

    addComponent(component) {
        this._components[component.name] = component;
    }
}
export const IDECore = new _IDECore();