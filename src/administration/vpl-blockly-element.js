import Blockly from 'blockly';
import Runtime from '../../dummy/run-time';

const GEN_CODE_MODE = {
    'RELEASE': 'codeGen',
    'DEBUG': 'debugGen'
};

function codeGenMethodName(mode) {
    return GEN_CODE_MODE[mode];
}

function codeGenName() {
    return codeGenMethodName(Runtime.mode);
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
        if (new.target === VPLElement) {
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
            : this._ctor.blockDef;
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

    onDelete(data) {
        let elemName = this._elemName(data);

        // TODO: notify all refer in this item...
        this._blocklyElems[elemName];

        // undefine block of the Blockly Editor
        Blockly.Blocks[elemName] = null;
        Blockly.JavaScript[elemName] = null;
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
    constructor(
        ctor /* {block, codeGen, debGen =codeGen} */,
        name,
        keyElems,
        parent =null
    ) {
        super(ctor, name, parent);

        this._keyElems = keyElems;
    }

    _blockDef(elem, data) {
        return (typeof this._ctor.blockDef === 'object') ?
            this._ctor.blockDef.func(elem, data):
            this._ctor.blockDef;
    }

    _codeGen(elem, data) {
        let modeGen = this._ctor[codeGenMethodName()];

        return (typeof modeGen === 'object') ?
            modeGen.func(elem, data) :
            modeGen;
    }

    onCreate(data) {
        let elems = [];
        let elemName = super._elemName(data);
        this._blocklyElems[elemName] = [];
        
        data[this._keyElems].forEach((elem) => {
            let itemName = elemName + elem;
            
            Blockly.Blocks[elemName] = this._blockDef(itemName, data);
            Blockly.JavaScript[elemName] = this._codeGen(itemName, data);
            let obj = {};
            obj[itemName] = {}
            this._blocklyElems[elemName].push(obj);

            elems.push(elemName);
        });
        
        return elems;
    }

    onDelete(data) {
        data[this._keyElems].forEach(
            (element) => {
                let elemName = data.id + '_' + this._name + '_' + element;
                // TODO: search references of the blocks and delete them??
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
                init: blocklyElem.init,
                codeGen: blocklyElem.codeGen,
                debGen: blocklyElem.debGen
            };

            this._vplBlocklyElems[blocklyElem.name] =
                ('keyElems' in blocklyElem)
                    ? new VPLBlocklyMultiElementHandler(
                        ctor,
                        blocklyElem.name,
                        blockly.keyElems,
                        this
                      )
                    : new VPLBlocklyElementHandler(
                        ctor,
                        blocklyElem.name,
                        this
                      );
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

    __findVPLElement(name) {
        return this._vplBlocklyElems[index] || null;
    }

    onCreate(data) {
        this._items[data.id] = {
            _domainElementData: data
        };

        for(blocklyElem in this._vplBlocklyElems) {
            let createdItems = this._vplBlocklyElems[blocklyElem]
                    .onCreate(data);
            
            this._items[data.id][blocklyElem] = createdItems;
        }
        
        for (mission in this._missionsRef) {
            this._missionsRef[mission].onLoadElement
        }
    }

    getBlocklyElemInstanceNames(instanceId, elemName) {
        return this._items[instanceId][elemName];
    }

    onEdit(data) {

    }

    onDelete(data) {
        Object.keys(this._vplBlocklyElems)
            .forEach((blocklyElem) => {
                this._vplBlocklyElems[blocklyElem].onDelete();

                // free items data map
                this._items[data.id][blocklyElem].length = 0;
                delete this._items[data.id][blocklyElem];
            });
        // TODO: dialog box ask for deletion
        // TODO: add functionality book the vplblocks are designed by the 
        // end-user

        this._vplBlocklyElems.forEach((blocklyElem) => {
            blocklyElem.onUnload(data);
            
        });

        //TODO: notify missions...
    }

    onRuntimeChangeMode() {
        Object.keys(this._items)
            .forEach((domainElementInst) => {
                let data = this._items[domainElementInst]._domainElementData;

                Object.keys(this._vplBlocklyElems)
                    .forEach((vplBlocklyElem) =>
                        vplBlocklyElem.onRuntimeChangeMode(data)
                    );
            })
    }

    getAction(action) {
        return typeof action === 'string' ? this[action] : action;
    }

    get signals() {
        return this._signals;
    }

    get vplBlocklyElems() {
        return this._vplBlocklyElems;
    }

    get vplDomainElemInstanceNames() {
        return Object.keys(this._items);
    }

    _initMissionRef(mission) {
        this._missionsRef[mission.name] = {
            name: mission.name,
            refElems: [],
            refDomainElem: false,
            onCreate: mission.onCreateElement,
            onDelete: mission.onDeleteElement,
            onRename: mission.onRenameElement
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
