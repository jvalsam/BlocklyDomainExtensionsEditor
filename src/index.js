import * as Blockly from 'blockly';

import { InitializeVPDL } from './iot-domain/vpdl/iot-domain';

document.addEventListener("DOMContentLoaded", function () {
    const workspace = Blockly.inject('blocklyDiv',
        {
            toolbox: document.getElementById('toolbox'),
            media: 'media/'
        });

        InitializeVPDL();
});