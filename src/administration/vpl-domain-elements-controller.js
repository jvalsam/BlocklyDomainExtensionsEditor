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
        this.domains[domain] = elems;
    }

    load(domain) {
        if (!this._currVPLDomainElements) this._currVPLDomainElements.unload();

        this._currVPLDomainElements = LoadVPLDomainElements(
            domain, this.domains[domain]
        );
    }

    set blocklyDExEditor(blocklyEditor) {
        this._blocklyDExEditor = blocklyEditor;
    }

    updateToolbox(mission, toolbox) {
        this._blocklyDExEditor.updateToolbox(mission, toolbox);
    }
}

const VPLDomainElementsController = new _VPLDomainElementsController();
export default VPLDomainElementsController;