import * as Blockly from 'blockly';

export const SmartObject = {
    name: 'SmartObject',
    blocklyElems: [
        {
            name: 'getValue',
            multiBlocksDef: (data) => {
                let blocks = {};

                for (let prop in data.object.properties) {
                    blocks[prop] = {
                        init: function() {
                            this.jsonInit({
                                "type": "getter",
                                "message0": "%1 get" + prop + "()",
                                "args0": [
                                    {
                                        "type": "field_image",
                                        "src": data.image,
                                        "width": 15,
                                        "height": 15,
                                        "alt": "*"
                                    }
                                ],
                                "output": "getter",
                                "colour": data.colour || 210,
                                "tooltip": data.name,
                                "helpUrl": data.helpUrl || ''
                            });
                        }
                    };
                }

                return blocks;
            },
            codeGen: (data) => {
                let codes = {};
                
                for (let prop in data.object.properties) {
                    let code = 'await SmartObjects["' + data.name + '"]' +
                        '.getValue("' + prop + '");';
                    codes[prop] = [code, Blockly.JavaScript.ORDER_NONE];
                }
                
                return codes;
            }
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
        }
        // ,
        // {
        //     name: 'setValue',
        //     blockDef: (data) => ({/* TODO*/ }),
        //     codeGen: (data) => (function(block) {/* TODO */})
        // },
        // { // block that end-user builds the condition event
        //     name: "condition_event_so",
        //     blockDef: (data) => ({/* TODO */}),
        //     codeGen: (data) => (function(block) {/* TODO */})
        // }
    ],
    // reteElements: [
    //     {
    //         nodeDef: (data) => { /** */ },
    //         codeGen: (data) => {},
    //         debugGen: (data) => {}
    //     }

    // ],
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
