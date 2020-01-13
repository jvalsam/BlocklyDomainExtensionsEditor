var SmartObject = {
    "name" : "AirCondition",
    "environment" : "dasdsda",
    "object" : {
        "properties" : {
            "AirConditionTemperature" : 0,
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
            "AirConditionTemperature" : {
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
    "user" : "5ac8e06dac135912cc2314ac",
    "image" : "http://147.52.17.129/smart_object_images\\heater.png"
};


