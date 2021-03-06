import { IDECore } from './ide-core';

var SO_AirCondition = {
    "id": "so-air-condition-1",
    "name" : "Air-Condition",
    "colour": 236,
    "object" : {
        "properties" : {
            "DeviceTemperature" : 0,
            "EnvironmentTemperature" : 0,
            "Turn" : "off"
        },
        "resourcePath" : "/AirConditionResURI",
        "deviceId" : "f887ac02-771a-4cb9-b254-718ecec42ac8",
        "interfaces" : [ 
            "oic.if.baseline", 
            "oic.if.a"
        ],
        "resourceTypes" : [ 
            "aircondition"
        ],
        "discoverable" : true,
        "slow" : false,
        "secure" : false,
        "observable" : true,
        "active" : false,
        "_eventsCount" : 2,
        "meta_properties" : {
            "DeviceTemperature" : {
                "type" : "number",
                "readonly" : false,
                "possible_values" : []
            },
            "EnvironmentTemperature" : {
                "type" : "number",
                "readonly" : true,
                "possible_values" : []
            },
            "Turn" : {
                "type" : "enum",
                "readonly" : false,
                "possible_values" : [ 
                    "on", 
                    "off"
                ]
            }
        }
    },
    "helpUrl": "Air-Conditioning device",
    "user" : "5ac8e06dac135912cc2314ac",
    "image" : "https://img.icons8.com/ios-filled/50/000000/air-conditioner.png"
};

var SO_aircond = {
    "id": "so-air-condition-1",
    "name" : "Air-Condition",
    "user" : "5ac8e06dac135912cc2314ac",
    "image" : "https://img.icons8.com/ios-filled/50/000000/air-conditioner.png",
    "properties": [
        "Temperature",
        "State",
        "Fan",
        "Swings"
    ],
    "colour": 236,
    "helpUrl": "Air-Conditioning device"
};

var SmartEnvironment = {};


class _ViSmaOE {
    constructor() {

    }

    initialize() {}

    get name() {
        return 'ViSmaOE';
    }

    receiveSignal(signal, data, compTr) {
        
    }

    createSmartObject(name, img) {
        IDECore.postSignal(
            'create-smart-object',
            SO_AirCondition,
            this.name
        );
    }

    createSmartEnvironment() {
        IDECore.postSignal(
            'create-smart-environment',
            SmartEnvironment,
            this.name
        );
    }

    deleteSmartObject() {
        IDECore.postSignal(
            'delete-smart-object',
            SO_AirCondition,
            this.name
        );
    }

    deleteSmartEnvironment() {
        IDECore.postSignal(
            'delete-smart-environment',
            SmartEnvironment,
            this.name
        );
    }

    renameSmartObject() {
        SO_AirCondition.name = 'air conditioning';
        IDECore.postSignal(
            'rename-smart-object',
            SO_AirCondition,
            this.name
        );
    }

    renameSmartEnvironment() {
        IDECore.postSignal(
            'rename-smart-environment',
            SmartEnvironment,
            this.name
        );
    }

    editSmartObject() {
        IDECore.postSignal(
            'edit-smart-object',
            SmartObject,
            this.name
        );
    }

    editSmartEnvironment() {
        IDECore.postSignal(
            'edit-smart-environment',
            SmartEnvironment,
            this.name
        );
    }
}
export const ViSmaOE = new _ViSmaOE();
