
import { InitializeVPDL } from './iot-domain/vpdl/iot-domain';

import { IDECore } from './../dummy/ide-core';
import { BlocklyDExEditor } from './blockly-domain-extension-editor';
import { VPLDomainElementsManager } from './administration/vpl-domain-elements-manager';
import { ViSmaOE } from './../dummy/visma';


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
            taskName: 'Good Morning',
            elem: {
                labelStyle: 'task-label',
                colour: '60',
                tooltip: 'It runs the blocks are included in this task.'
            },
            mission: 'smart-objects-task'
        },
        'ProjectWSPManager'
    );

    document.getElementById('btnAddSOAirCondition').onclick = function (evt) {
        ViSmaOE.createSmartObject('AirCondition', '');
    };

    document.getElementById('btnAddHomeTask').onclick = function (evt) {
        IDECore.postSignal(
            'create-project-element',
            {
                id: 'so-task-2',
                taskName: 'Tidying Home',
                elem: {
                    labelStyle: 'task-label',
                    colour: '60',
                    tooltip: 'It runs the blocks are included in this task.'
                },
                mission: 'smart-objects-task'
            },
            'ProjectWSPManager'
        );
    };

    document.getElementById('btnAddLeavingTask').onclick = function (evt) {
        IDECore.postSignal(
            'create-project-element',
            {
                id: 'so-task-3',
                taskName: 'Leaving Home',
                elem: {
                    labelStyle: 'task-label',
                    colour: '60',
                    tooltip: 'It runs the blocks are included in this task.'
                },
                mission: 'smart-objects-task'
            },
            'ProjectWSPManager'
        );
    };

    document.getElementById("btnRemoveLeavingTask").onclick = function (evt) {
        IDECore.postSignal(
            'delete-project-element',
            {
                id: 'so-task-3',
                taskName: 'Leaving Home',
                elem: {
                    labelStyle: 'task-label',
                    colour: '60',
                    tooltip: 'It runs the blocks are included in this task.'
                },
                mission: 'smart-objects-task'
            },
            'ProjectWSPManager'
        );
    };

    document.getElementById("btnRemoveHomeTask").onclick = function (evt) {
        IDECore.postSignal(
            'delete-project-element',
            {
                id: 'so-task-2',
                taskName: 'Tidying Home',
                elem: {
                    labelStyle: 'task-label',
                    colour: '60',
                    tooltip: 'It runs the blocks are included in this task.'
                },
                mission: 'smart-objects-task'
            },
            'ProjectWSPManager'
        );
    };

    document.getElementById("btnRemoveSOAirCondition").onclick = function (evt) {
        ViSmaOE.deleteSmartObject('AirCondition', '');
    };

    document.getElementById("btnUpdateLeavingTask").onclick = function (evt) {
        IDECore.postSignal(
            'update-project-element',
            {
                id: 'so-task-3',
                taskName: 'Leaving Home',
                elem: {
                    labelStyle: 'task-label',
                    colour: '60',
                    tooltip: 'It runs the blocks are included in this task.'
                },
                mission: 'smart-objects-task'
            },
            'ProjectWSPManager'
        );
    };

    document.getElementById("btnUpdateHomeTask").onclick = function (evt) {
        IDECore.postSignal(
            'update-project-element',
            {
                id: 'so-task-2',
                taskName: 'Tidying Home',
                elem: {
                    labelStyle: 'task-label',
                    colour: '60',
                    tooltip: 'It runs the blocks are included in this task.'
                },
                mission: 'smart-objects-task'
            },
            'ProjectWSPManager'
        );
    };

    document.getElementById("btnUpdateSOAirCondition").onclick = function (evt) {
        ViSmaOE.renameSmartObject('AirCondition', '');
    };
});
