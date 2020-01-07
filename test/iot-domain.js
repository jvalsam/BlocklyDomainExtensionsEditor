import {
    DefineVPLDomainElements
} from '../src/administration/vpl-domain-elements';

DefineVPLDomainElements(
    'IoTAutomations',
    () => ({
        elements: [
            {
                name: 'SmartObject',
                blocklyElems: [
                    {
                        name: 'getProperty',
                        blockDef: (data) => {

                        },
                        codeGen: (block) => {

                        }
                    }
                ],
                signals: [
                    {
                        action: 'onCreate',
                        name: 'create-smart-object'
                    },
                    {
                        action: 'onDelete',
                        name: 'delete-smart-object'
                    },
                    {
                        action: 'onRename',
                        name: 'rename-smart-object'
                    }
                ]
            },
            {
                name: 'SmartEnvironment',
                blocklyElems: [
                    //TODO: define vpl elements
                ],
                signals: [
                    {
                        action: 'onCreate',
                        name: 'create-smart-environment'
                    },
                    {
                        action: 'onDelete',
                        name: 'delete-smart-environment'
                    },
                    {
                        action: 'onRename',
                        name: 'rename-smart-environment'
                    }
                ]
            }
        ],
        missions: [
            {
                name: 'handlingSmartObjects',
                type: 'Category',
                items: [
                    {
                        name: 'Smart Objects',
                        type: 'Category',
                        colour: '210',
                        elements: [
                            {
                                name: {
                                    domainElem: 'SmartObject'
                                },
                                type: 'Category',
                                elements: 'ALL' // Array of objects to select
                            }
                        ],
                        path: []
                    }
                ]
            }
        ]
    })
);
