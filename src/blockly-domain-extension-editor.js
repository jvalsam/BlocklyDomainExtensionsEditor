import {
    VPLDomainElementsController
} from "./administration/vpl-domain-elements-controller";


export class BlocklyDExEditor {

    constructor() {
        this._wsps = {};
        this._editorSignals = {};
        this._domainSignals = {};

        VPLDomainElementsController.blocklyDExEditor = this;
    }
    // holder of the missions and wsps are open is required...

    createSource(mission, selector) {

    }

    openSource(src, selector) {

    }

    closeSource(srcId) {

    }

    deleteSource(srcId) {

    }

    _signalNotExists (signal) {
        return (data) => {
            throw new Error(
                'Signal ' + signal + ' does not exist in the Blockly Editor'
            );
        };
    }

    receiveSignal(signal, data) {
        let responseSignal =
            this._editorSignals[signal] ||
            this._domainSignals[signal] ||
            this._signalNotExists(signal);
        
        return responseSignal(data);
    }

    onPopulateSignals() {
        // define which are the signals that are received
        let signals = Object.keys(this._)
        // TODO: based on the new domain we have to refresh signals are 
        // listened
    }

    onClose() {
        // destroy Blockly Blocks of the domain
    }

    onLoadDomain() {
        this._domainSignals = VPLDomainElementsController.signals;
        
        this.onPopulateSignals();
        // all wsps has to be open in the project?

    }

    onUnloadDomain() {
        //notify which signals stop to be received
        let signals = Object.keys(this._domainSignals);

        // notify domain controller call to unload the domain elems

    }

    onCloseProject(projectID) {
        //find all wsps of the project
    }

    // find all wsps with specific mission
    onUpdateToolbox(mission, toolbox) {
        
    }

    // TODO: remove all the element instances from all the sources...
    onDeleteToolboxElement(element, missions) {

    }
}
