import { DefineVPLDomainElements } from '../administration/vpl-domain-elements';

import { SmartObject } from './elems/smart-object';
import { SmartEnvironment } from './elems/smart-environment';
import {
    SmartObjectsTask as SmartObjectsTaskElem
} from './elems/smart-objects-task';
import {
    SmartObjectsTasksGroup as SmartObjectsTasksGroupElem
} from './elems/smart-objects-tasks-group';

import { SmartObjectsTask } from './missions/smart-objects-task';
import { SmartObjectsTasksGroup } from './missions/smart-objects-tasks-group';


DefineVPLDomainElements(
    'IoTAutomations',
    () => ({
        elements: [
            SmartObjectElem,
            SmartEnvironmentElem,
            SmartObjectsTaskElem,
            SmartObjectsTasksGroupElem
        ],
        missions: [
            SmartObject,
            SmartEnvironment,
            SmartObjectsTask,
            SmartObjectsTasksGroup
        ]
    })
);
