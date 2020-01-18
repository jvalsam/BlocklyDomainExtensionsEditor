import { ViSmaOE } from './visma';
import { BlocklyDExEditor } from './../src/blockly-domain-extension-editor';
import {
    VPLDomainElementsManager
} from '../src/administration/vpl-domain-elements-manager';

class _IDECore {
    constructor() {
        this._signals = {};
        this._components = {};
    }

    initialize() {
        VPLDomainElementsManager.initialize();
        this.addComponent(VPLDomainElementsManager);
        //
        ViSmaOE.initialize();
        this.addComponent(ViSmaOE);
        BlocklyDExEditor.initialize();
        this.addComponent(BlocklyDExEditor);
    }

    postSignal(signal, data, compName) {
        if (!(signal in this._signals)) {
            console.warn(
                'Signal ' + signal + ' posted by ' + compName +
                ' has not receiver.'
            );
            return;
        }

        this._signals[signal].forEach(component => this._components[component]
            .receiveSignal(signal, data, compName));
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