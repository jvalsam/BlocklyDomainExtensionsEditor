
import { InitializeVPDL } from './iot-domain/vpdl/iot-domain';

import { IDECore } from './../dummy/ide-core';
import { BlocklyDExEditor } from './blockly-domain-extension-editor';
import { VPLDomainElementsManager } from './administration/vpl-domain-elements-manager';


document.addEventListener("DOMContentLoaded", function () {
    IDECore.initialize();
    
    // call all domains definition of the domain elements to register them
    InitializeVPDL();

    // load the domain
    VPLDomainElementsManager.load('IoTAutomations');

    BlocklyDExEditor.createSource(
        'smart-objects-task',
        'blocklyDiv'
    );

    IDECore.postSignal(
        'create-project-element',
        {
            id: 'so-task-1',
            taskName: 'Morning tasks',
            elem: {
                labelStyle: 'task-label',
                colour: '60',
                tooltip: 'It runs the blocks are included in this task.'
            },
            mission: 'smart-objects-task'
        },
        'ProjectWSPManager'
    );

    document.getElementById('btnAddSO').onclick = function (evt) {
        alert('btn clicked!');
    };
});