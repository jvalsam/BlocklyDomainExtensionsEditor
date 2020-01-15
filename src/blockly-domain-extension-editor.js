import * as Blockly from 'blockly';
import { IDECore } from './../dummy/ide-core';

import {
    VPLDomainElementsController
} from "./administration/vpl-domain-elements-controller";


export class BlocklyDExEditor {

    constructor() {
        this._wsps = {};
        this._editorSignals = {};
        this._domainSignals = {};
        this._currentNO = 1; // TODO: load proj total blockly instances

        VPLDomainElementsController.blocklyDExEditor = this;
    }

    get name() {
        return 'BlocklyDExEditor';
    }

    // holder of the missions and wsps are open is required...

    createSource(mission, selector) {
        let data = {
            id: mission + (++this._currentNO),
            mission: mission,
            text: '',
            wsp: null
        };

        if (!(mission in this._wsps)) {
            this._missions[mission] = [];
        }

        let toolbox = VPLDomainElementsController.getToolbox(mission);
        srcData.wsp = Blockly.inject(
            selector,
            {
                toolbox: toolbox,
                media: 'media/'
            }
        );
        this._wsps[mission].push(datd);

        //
        IDECore.postSignal('create-'+mission, data, this.name);
    }

    openSource(data, selector) {
        let toolbox = VPLDomainElementsController.getToolbox(mission);

        data.wsp = Blockly.inject(
            selector,
            {
                toolbox: toolbox,
                media: 'media/'
            }
        );

        let xml = Blockly.Xml.textToDom(data.text);
        Blockly.Xml.domToWorkspace(xml, data.wsp);

        if (!(mission in this._wsps)) {
            this._missions[mission] = [];
        }

        this._wsps[data.mission] = data;
    }

    closeSource(srcId) {
        // var xml = Blockly.Xml.workspaceToDom(workspace);
        // var xml_text = Blockly.Xml.domToText(xml);
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
        this._domainSignals = {};
        VPLDomainElementsController.signals.forEach(signal =>
            this._domainSignals[signal.name] = signal.action
        );
        // TODO: based on the new domain we have to refresh signals are 
        // listened
    }

    onClose() {
        // destroy Blockly Blocks of the domain
    }

    onLoadDomain() {
        VPLDomainElementsController.signals;
        
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
