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

    }

    set blocklyDExEditor(blocklyEditor) {
        this._blocklyDExEditor = blocklyEditor;
    }

    updateToolbox(mission, toolbox) {
        this._blocklyDExEditor.updateToolbox(mission, toolbox);
    }
}

export const VPLDomainElementsController = new _VPLDomainElementsController();
