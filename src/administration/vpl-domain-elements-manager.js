import { LoadVPLDomainElements } from './vpl-domain-elements';
import { IDECore } from '../../dummy/ide-core';

class _VPLDomainElementsManager {
    constructor() {
        this._domains = {};
        this._currVPLDomainElements = null;
        this._blocklyDExEditor = null;
        this._signalActions = {}
    }

    get name() {
        return 'VPLDomainElementsManager'
    }

    get data() {
        return this._currVPLDomainElements;
    }

    get signals() {
        return this._currVPLDomainElements.signals;
    }

    receiveSignal(signal, data) {
        let signals = this.signals;

        if (!(signal in signals)) {
            throw new Error(
                'Signal ' + signal +
                ' is not listened by the VPLDomainElementsManager.'
            );
        }

        signals[signal] (data);
    }

    // if there are signals already, updates the signals
    listenSignals() {
        IDECore.listensSignals(
            Object.keys(this.signals),
            this.name
        );
    }

    // TODO: populate the signals has to be received
    // notifies when vpl editor has new domain elements to add or remove

    register(domain, elems) {
        this._domains[domain] = elems;
    }

    load(domain) {
        if (this._currVPLDomainElements) this._currVPLDomainElements.unload();

        this._currVPLDomainElements = LoadVPLDomainElements(
            domain, this._domains[domain]
        );

        this.listenSignals();
    }

    getToolbox(mission) {
        return this._currVPLDomainElements.getToolbox(mission);
    }

    set blocklyDExEditor(blocklyEditor) {
        this._blocklyDExEditor = blocklyEditor;
    }

    updateToolbox(mission, toolbox) {
        this._blocklyDExEditor.updateToolbox(mission, toolbox);
    }
}

export const VPLDomainElementsManager = new _VPLDomainElementsManager();
