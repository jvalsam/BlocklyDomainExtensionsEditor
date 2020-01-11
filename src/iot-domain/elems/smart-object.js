export const SmartObject = {
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
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
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
};
