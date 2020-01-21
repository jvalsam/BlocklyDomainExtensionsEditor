import * as Blockly from 'blockly';
import Runtime from '../../dummy/run-time';

const GEN_CODE_MODE = {
    'RELEASE': 'codeGen',
    'DEBUG': 'debugGen'
};

function codeGenMethodName(mode) {
    return GEN_CODE_MODE[mode];
}

function codeGenName() {
    return codeGenMethodName(Runtime.getMode());
}

/**
 * Used only by statically blockly elements exist in the domain
 */
class VPLBlocklyElement {
    // TODO: complete functions that have to be supported...
    constructor(ctor, name) {
        this._ctor = ctor;
        this._name = name;
    }
}

/**
 * Abstract Class VPLElement
 * 
 * @class VPLElement
 */
class VPLElementHandler {
    constructor(
        ctor /* { blockDef, codeGen, debGen =codeGen } */,
        name,
        parent =null
    ) {
        if (new.target === VPLElementHandler) {
            throw new TypeError('Error: Cannot construct abstract class.');
        }

        this._ctor = ctor;
        this._name = name;
        this._parent = parent;
    }

    get name() {
        return this._name;
    }

    get parent() {
        return this._parent;
    }

    addMission(mission) {
        this.parent.addMission(mission, )
    }
}

export class VPLBlocklyElementHandler extends VPLElementHandler {
    // blockDef, codeGen and debGen* are functions or objects include func key 
    // that includes method which gets data and return function
    // this happens in case the domain author would like to tranform the 
    // VPLBlocklyElement on load.
    constructor(
        ctor /* { blockDef, codeGen, debGen =codeGen } */,
        name,
        parent =null
    ) {
        super(ctor, name, parent);

        // blockly blocks added map with references in missions and wsps
        this._blocklyElems = {};
    }

    _elemName(data) {
        return data.id + '_' + this._name;
    }

    _blockDef(data) {
        return (typeof this._ctor.blockDef === 'object')
            ? this._ctor.blockDef.func(data)
            : this._ctor.blockDef(data);
    }

    _codeGen(data) {
        let modeGen = this._ctor[codeGenName()];

        return (typeof modeGen === 'object')
            ? modeGen.func(data)
            : modeGen;
    }

    onCreate(data) {
        let elemName = this._elemName(data);
        
        Blockly.Blocks[elemName] = this._blockDef(data);
        Blockly.JavaScript[elemName] = this._codeGen(data);
        this._blocklyElems[elemName] = {};

        return [elemName];
    }

    onDelete(elems) {
        elems.forEach((elemName) => {
                //TODO: search references of the blocks and delete them??
                Blockly.Blocks[elemName] = null;
                Blockly.JavaScript[elemName] = null;
            }
        );
    }

    onEdit(data) {

    }

    onChangeRuntimeMode(data) {
        Object.keys(this._blocklyElems)
            .forEach((blocklyElem) =>
                    Blockly.JavaScript[blocklyElem] = this._codeGen(data)
            );
    }

    get blocklyElemNames() {
        return Object.keys(this._blocklyElems);
    }

    blocklyElemInstanceNames(parentInstanceId) {
        return this._parent.getBlocklyElemInstanceNames(
            parentInstanceId,
            this.name
        );
    }
}

export class VPLBlocklyMultiElementHandler extends VPLBlocklyElementHandler {

    _blockDef(data) {
        return (typeof this._ctor.multiBlocksDef === 'object') ?
            this._ctor.multiBlocksDef.func(data):
            this._ctor.multiBlocksDef(data);
    }

    _codeGen(data) {
        let modeGen = this._ctor[codeGenName()];

        return (typeof modeGen === 'object') ?
            modeGen.func(data) :
            modeGen(data);
    }

    onCreate(data) {
        let elems = [];
        let elemName = super._elemName(data);
        this._blocklyElems[elemName] = [];
        
        let blocks = this._blockDef(data);
        let codes = this._codeGen(data);

        for (let elem in blocks) {
            let itemName = elemName + elem;

            Blockly.Blocks[itemName] = blocks[elem];
            Blockly.JavaScript[itemName] = codes[elem];

            let obj = {};
            obj[itemName] = {}
            this._blocklyElems[elemName].push(obj);

            elems.push(itemName);
        }
        
        return elems;
    }

    onDelete(elems) {
        elems.forEach((elemName) => {
                //TODO: search references of the blocks and delete them??
                Blockly.Blocks[elemName] = null;
                Blockly.JavaScript[elemName] = null;
            }
        );
    }

    onEdit(data) {

    }

    get blocklyElemNames() {
        let names = {};
        
        for (elem in this._blocklyElems) {
            names[elem] = [ ...names, Object.keys(this._blocklyElems[elem])];
        }
        
        return names;
    }
}

export class VPLDomainElementHandler {
    constructor(
        name,
        blocklyElems,
        signals
    ) {
        this._name = name;
        this._items = {};
        this._vplBlocklyElems = {};
        this._missionsRef = {};

        blocklyElems.forEach((blocklyElem) => {
            let ctor = {
                codeGen: blocklyElem.codeGen,
                debGen: blocklyElem.debGen
            };

            if ('multiBlocksDef' in blocklyElem) {
                ctor.multiBlocksDef = blocklyElem.multiBlocksDef;
                
                this._vplBlocklyElems[blocklyElem.name] =
                    new VPLBlocklyMultiElementHandler(
                        ctor,
                        blocklyElem.name,
                        this
                    );
            }
            else {
                ctor.blockDef = blocklyElem.blockDef;

                this._vplBlocklyElems[blocklyElem.name] =
                    new VPLBlocklyElementHandler(
                        ctor,
                        blocklyElem.name,
                        this
                    );
            }
        });

        this._signals = {};

        signals.forEach((signal) => this._signals[signal.name] =
                this.getAction(signal.action)
        );

        this.onActionNotiFyMissionsRef = (action) => {
            this.missionsRef.forEach((mission) => mission[action](this.name))
        };
    }

    get name() {
        return this.name;
    }

    getVPLElement(name) {
        return this._vplBlocklyElems[name] || null;
    }

    onCreate(data) {
        this._items[data.id] = {
            name: data.name || data.id,
            _domainElementData: data,
            elements: {}
        };

        for(let blocklyElem in this._vplBlocklyElems) {
            let createdItems = this._vplBlocklyElems[blocklyElem]
                    .onCreate(data);
            
            //TODO: check to categorize in separate 
            this._items[data.id].elements[blocklyElem] = createdItems;
        }
        
        for (let mission in this._missionsRef) {
            this._missionsRef[mission].onCreate(this._items[data.id]);
        }
    }

    getBlocklyElemInstanceNames(instanceId, elemName) {
        return this._items[instanceId].elements[elemName];
    }

    onEdit(data) {

    }

    onDelete(data) {
        let delItem = this._items[data.id];

        for(let blocklyElem in this._vplBlocklyElems) {
                this._vplBlocklyElems[blocklyElem].onDelete(
                    delItem.elements[blocklyElem]
                );
        }

        for (let mission in this._missionsRef) {
            this._missionsRef[mission].onDelete(delItem);
        }

        for(let blocklyElem in this._vplBlocklyElems) {
            delItem.elements[blocklyElem].length = 0;
            delete delItem.elements[blocklyElem];
        }
    }

    onRuntimeChangeMode() {
        for (let domainElementInst in this._items) {
            let data = this._items[domainElementInst]._domainElementData;

            for (let vplBlocklyElem in this._vplBlocklyElems) {
                    vplBlocklyElem.onRuntimeChangeMode(data)
            }
        }
    }

    getAction(action) {
        return typeof action === 'string'
            ? (data) => this[action](data)
            : action;
    }

    get signals() {
        return this._signals;
    }

    get vplBlocklyElems() {
        return this._vplBlocklyElems;
    }

    get vplDomainElemInstanceIds() {
        return Object.keys(this._items);
    }

    vplDomainElemInstanceName(id) {
        return this._items[id].name;
    }

    _initMissionRef(mission) {
        this._missionsRef[mission.name] = {
            name: mission.name,
            refElems: [],
            refDomainElem: false,
            onCreate: (data) => mission.onCreateElement(data),
            onDelete: (data) => mission.onDeleteElement(data),
            onRename: (data) => mission.onRenameElement(data)
        };
    }

    addMission(mission, element) {
        if (!(mission.name in this._missionsRef)) this._initMissionRef(mission);
        
        if (element) {
            this._missionsRef[mission.name].refElems.push(element);
        }
        else {
            this._missionsRef[mission.name].refDomainElem = true;
        }
    }
}
