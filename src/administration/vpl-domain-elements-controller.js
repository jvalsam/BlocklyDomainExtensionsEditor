import { LoadVPLDomainElements } from './vpl-domain-elements';

class _VPLDomainElementsController {
    constructor() {
        this._domains = {};
        this._currVPLDomainElements = null;
        this._blocklyDExEditor = null;
    }

    get data() {
        return this._currVPLDomainElements;
    }

    get signals() {
        return this._currVPLDomainElements.signals;
    }

    receiveSignal(signal, data) {
        
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

export const VPLDomainElementsController = new _VPLDomainElementsController();
