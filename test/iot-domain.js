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
                        name: 'getValue',
                        blockDef: (data) => ({
                            init: function() {
                                this.jsonInit({
                                    "type": "getter",
                                    "message0": "%1 get"+data.functionName+"()",
                                    "args0": [
                                        {
                                            "type": "field_image",
                                            "src": data.device.image,
                                            "width": 15,
                                            "height": 15,
                                            "alt": "*"
                                        }
                                    ],
                                    "output": "getter",
                                    "colour": data.colours.getValue || 210,
                                    "tooltip": data.device.LocalName,
                                    "helpUrl": data.helpUrl || ''
                                });
                            }
                        }),
                        codeGen: (data) => (function(block) {
                            var code = "await _.get(devicesIneed,'" +
                                data.deviceName +
                                "')['" +
                                data.functionName +
                                "']()"
                            ;
                            var name = data.deviceName;
                            return [code, Blockly.JavaScript.ORDER_NONE];
                        })
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
