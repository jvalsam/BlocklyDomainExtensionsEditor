import * as Blockly from 'blockly';
import { IDECore } from './../dummy/ide-core';

import {
    VPLDomainElementsManager
} from "./administration/vpl-domain-elements-manager";


class _BlocklyDExEditor {
    constructor() {
        this._wsps = {};
        this._editorSignals = {};
        this._domainSignals = {};
        this._currentNO = 1; // TODO: load proj total blockly instances
    }

    get name() {
        return 'BlocklyDExEditor';
    }

    initialize() {

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
            this._wsps[mission] = [];
        }

        let toolbox = VPLDomainElementsManager.getToolbox(mission);
        var toolboxXml = Blockly.Xml.textToDom(toolbox.gen);

        data.wsp = Blockly.inject(
            selector,
            {
                toolbox: toolboxXml,
                media: 'media/'
            }
        );

        //TODO: fix extra of the editor
        let items = document.getElementsByClassName('blocklyTreeRow');
        items[Object.keys(items)
            .filter(key => items[key].innerText === 'Built-in')]
            .nextSibling.style.marginLeft = '20px';

        items = document.getElementsByClassName('blocklyTreeSeparator');
        Object.keys(items)
            .forEach(i => items[i].style.marginTop = '20px');

        //TODO: handle case of extra handlers and style...

        this._wsps[mission].push(data);

        //
        IDECore.postSignal('create-'+mission, data, this.name);
    }

    openSource(data, selector) {
        let toolbox = VPLDomainElementsManager.getToolbox(mission);

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

    listenSignals() {
        IDECore.listensSignals(

        );
    }

    onPopulateSignals() {
        // define which are the signals that are received
        this._domainSignals = {};
        VPLDomainElementsManager.signals.forEach(signal =>
            this._domainSignals[signal.name] = signal.action
        );
        // TODO: based on the new domain we have to refresh signals are 
        // listened
    }

    // functions are required to be provided by the vpl editors 
    // for the domain elements
    /**
     * 
     * @param {*} mission 
     */
    onMissionUpdate(missions) {
        missions.forEach(mission => {
            let toolboxXml = Blockly.Xml.textToDom(mission.toolbox.gen);

            this._wsps[mission.name].forEach(data =>
                data.wsp.updateToolbox(toolboxXml));

            //TODO: handle the toolbox extra
            let items = document.getElementsByClassName('blocklyTreeRow');
            items[Object.keys(items)
                    .filter(key => items[key].innerText === 'Built-in')]
                .nextSibling.style.marginLeft = '20px';

            items = document.getElementsByClassName('blocklyTreeSeparator');
            Object.keys(items)
                .forEach(i => items[i].style.marginTop = '20px');
        });
    }

    onDeleteVPLElements(missions, elemNames) {
        console.warn('delete developed elements of blockly not implemented yet');
        missions.forEach(mission => {
                this._wsps[mission.name].forEach(data => {
                    let allBlocks = data.wsp.getAllBlocks();
                });
        });

    }

    onClose() {
        // destroy Blockly Blocks of the domain
    }

    onLoadDomain() {
        VPLDomainElementsManager.signals;
        
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
export const BlocklyDExEditor = new _BlocklyDExEditor();
