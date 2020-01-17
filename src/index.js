
import { InitializeVPDL } from './iot-domain/vpdl/iot-domain';

import { IDECore } from './../dummy/ide-core';
import { BlocklyDExEditor } from './blockly-domain-extension-editor';
import { VPLDomainElementsController } from './administration/vpl-domain-elements-controller';


document.addEventListener("DOMContentLoaded", function () {
    IDECore.initialize();
    
    // call all domains definition of the domain elements to register them
    InitializeVPDL();

    // load the domain
    VPLDomainElementsController.load('IoTAutomations');

    BlocklyDExEditor.createSource(
        'smart-objects-task',
        'blocklyDiv'
    );

    document.getElementById('btnAddSO').onclick = function (evt) {
        alert('btn clicked!');
    };
});