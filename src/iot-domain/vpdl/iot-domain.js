import { DefineVPLDomainElements } from '../../administration/vpl-domain-elements';

import { SmartObject } from './elems/smart-object';
import {
    SmartObjectsTask as SmartObjectsTaskElem
} from './elems/smart-objects-task';

import { SmartObjectsTask } from './missions/smart-objects-task';

import {
    getPredefinedCategories,
    defineGeneralCategories
} from '../../common/general-blockly-toolbox';

let predefinedCategories = getPredefinedCategories();
// domain author is able to edit them...
defineGeneralCategories(predefinedCategories);

export function InitializeVPDL() {
    DefineVPLDomainElements(
        'IoTAutomations',
        () => ({
            elements: [
                SmartObject,
                SmartObjectsTaskElem,
            ],
            missions: [
                SmartObjectsTask
                //SmartObjectConditionEvent,
                //SmartObjectCalendarEvent
            ]
        })
    );
}