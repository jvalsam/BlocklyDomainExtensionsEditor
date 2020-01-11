export const SmartObjectsTask = {
    name: 'SmartObjectsTask',
    blocklyElems: [
        {
            name: 'run_task',
            blockDef: (data) => ({
                init: function() {
                    this.appendDummyInput()
                        .appendField(
                            new Blockly.FieldImage(
                                data.elem.image,
                                15,
                                15,
                                {
                                    alt: "*",
                                    flipRtl: "FALSE"
                                }
                            )
                        )
                        .appendField("Run task:")
                        .appendField(
                            new Blockly.FieldLabel(
                                data.taskName,
                                data.elem.labelStyle //TODO: fix style
                            )
                        );
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setColour(data.elem.colour || 223);
                    this.setTooltip(data.elem.tooltip || '');
                    this.setHelpUrl(data.elem.tooltip || '');
                }
            }),
            codeGen: (data) => (function(block) {
                var code = 'tasks [' + data.taskName + ']();';
                return [code, Blockly.JavaScript.ORDER_NONE];
            })
            //, debugGen: (data) => open VISMA view UI of the smart
            // object
        }
    ],
    signals: [
        {
            action: 'onCreate',
            name: 'create-smart-objects-task'
        },
        {
            action: 'onDelete',
            name: 'delete-smart-objects-task'
        },
        {
            action: 'onRename',
            name: 'rename-smart-objects-task'
        }
    ]
};
