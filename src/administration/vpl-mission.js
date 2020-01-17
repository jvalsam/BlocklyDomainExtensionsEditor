import { assert } from './../common/assert';
import { VPLBlocklyMultiElementHandler } from './vpl-blockly-element';
import { genPredefinedCategoriesToolbox } from '../common/general-blockly-toolbox';

class VPLToolbox {
    constructor(items, domainElems, mission) {
        this._mission = mission;
        this.__domainElems = domainElems;
        this._categories = [];
        this._blocklyToolbox = {};

        items.forEach((item) => {
            item.path = [];
            this.addToolboxElement(item);
        });

        this._currGenDomainElemInstanceId = null;

        this.generateBlocklyToolbox();
    }

    _findCategory(path) {
        let tree = this._categories;
        path.forEach((name) => {
            let index = tree.findIndex((element) =>
                element.name === name ||
                ( typeof element.name === 'object' &&
                  element.name.domainElem === name )
            );

            assert(
                index !== -1,
                'Category ' + name + ' in path '+path.join('/')
            );
            assert(
                'elements' in tree[index],
                name + ' is type of Block (i.e. string) not Category '
                     + '(i.e. object) expected.'
            );
            
            tree = tree[index].elements;
        });
        return tree;
    }

    newCategory(item) {
        return {
            type: item.type,
            name: item.name,
            colour: item.colour,
            elements: [],
            path: [...item.path]
        };
    }

    addDomainBlocklyElement(newElement, parent, separators) {
        let category = this._findCategory(newElement.path);

        if (separators.up) category.push({type: 'Separator'});
        category.push(newElement);
        if (separators.down) category.push({type: 'Separator'});

        this.__domainElems.bookMission(
            this._mission,
            {
                domainElem: parent.name.domainElem,
                item: newElement.name
            }
        );
    }

    _needsSeparators(elementsLength) {
        return (elem, index) => {
            // no multi element or just one element
            if (elementsLength === 1 ||
                elem.constructor !== VPLBlocklyMultiElementHandler
            ) {
                return {
                    up: false,
                    down: false
                };
            }
            // 1st element
            if (index === 0) {
                return {
                    up: false,
                    down: true
                };
            }
            // last element
            if (index === elementsLength-1) {
                return {
                    up: true,
                    down: false
                };
            }
            // in between
            return {
                up: true,
                down: true
            };
        }
    }

    // constructs all the elements of the domain element
    addAllDomainElements(item, path) {
        // retrieve all the elements of the domain element
        let elems = this.__domainElems
            .getDomainElementItems(item.name.domainElem);

        let names = Object.keys(elems);
        let needsSeparators = this._needsSeparators(names.length);

        names.forEach((name, index)=> {
            let elem = elems[name];

            let newElement = {
                type: 'Element',
                name: elem.name,
                path: [...path]
            };

            this.addDomainBlocklyElement(
                newElement,
                item,
                needsSeparators(elem, index)
            );
        });
    }

    addDomainElements(item) {
        let childrenPath = [...item.path, item.name.domainElem];

        if (item.elements === 'ALL') {
            this.addAllDomainElements(item, childrenPath);
        }
        else {
            item.elements.forEach((elem) => {
                elem.name = {
                    domainElem: item.name.domainElem,
                    item: elem.name
                };
                elem.path = [...childrenPath];
                
                this.addElement(elem);
            });
        }
    }

    newDomainElementCategory(item) {
        let category = this.newCategory(item);
        category.type = 'DomainCategory';
        return category;
    }

    addCategoryDomainElements(item) {
        this._findCategory(item.path)
            .push(this.newDomainElementCategory(item));
        
        this.__domainElems.bookMission(
            this._mission,
            item.name
        );
        
        this.addDomainElements(item);
    }

    addCategoryAndElements(item) {
        this._findCategory(item.path)
            .push(this.newCategory(item));

        item.elements.forEach((element) => {
            element.path = [...item.path, item.name];
            this.addToolboxElement(element);
        });
    }

    addCategory(item) {
        if (typeof item.name === 'string') {
            this.addCategoryAndElements(item);
        }
        else {
            this.addCategoryDomainElements(item);
        }
    }

    newElement(item) {
        return {
            type: item.type,
            name: item.name,
            values: item.values,
            path: [...item.path]
        };
    }

    addElement(item) {
        this._findCategory(item.path)
            .push(this.newElement(item));
        
        this.__domainElems.bookMission(this._mission, item.name);
    }

    newBlock(item) {
        return {
            type: item.type,
            name: item.name,
            values: item.values,
            path: [...item.path]
        };
    }

    addBlock(item) {
        this._findCategory(item.path)
            .push(this.newBlock(item));
    }

    newSeparator(item) {
        return {
            type: item.type,
            gap: item.gap
        };
    }

    addSeparator(item) {
        this._findCategory(item.path)
            .push(this.newSeparator(item));
    }

    newButton(item) {
        return {
            type: item.type,
            text: item.text,
            callback: item.callback,
            style: item.style
        };
    }

    addButton(item) {
        this._findCategory(item.path)
            .push(this.newButton(item));
    }

    newLabel(item) {
        return {
            type: item.type,
            text: item.text,
            style: item.style
        }
    }

    addLabel(item) {
        this._findCategory(item.path)
            .push(this.newLabel(item));
    }

    addPredefined(item) {
        this._findCategory(item.path)
            .push({
                type: item.type,
                category: item.category,
                choices: (typeof item.elements === 'string')
                    ? item.elements
                    : [...item.elements]
            });
    }

    notSupportedToolboxElement(item) {
        throw new Error(
            item.type +
            ' element type is not supported by the system in the toolbox.'
        );
    }

    addToolboxElement(item) {
        let methodName = 'add' + item.type;
        
        if (!(methodName in this)) this.notSupportedToolboxElement(item);

        this[methodName](item);
    }

    deleteElement(elemName, tree) {
        let index = tree.findIndex((element) => element.name === elemName);
        // find in this category
        if (index !== -1) {
            tree.splice(index, 1);
            return true;
        }
        
        // look up inner categories of tree
        tree.forEach((node) => {
            if ('elements' in node) {
                if (this.findElement(elemName, node)) {
                    return true;
                }
            }
        });
        return false;
    }

    // STARTS: TOOLBOX GENERATOR OF THE MISSION

    _genDomainCategoryToolbox(item) {
        let toolbox = {
            gen: '',
            extra: []
        };

        // retrieve domain element instances
        let domainElement = this.__domainElems.__findVPLElement(item.name);
        domainElement.vplDomainElemInstanceNames.forEach(
            domainElemInstanceName => {
                this._currGenDomainElemInstanceId = domainElemInstanceName;

                toolbox.gen += '<category'
                // TODO: user's choice of colour in domain element could be 
                // the category of the colour...
                toolbox.gen += ' name="' + domainElemInstanceName + '">';

                // all the inner elements
                let elemsToolbox = this._genCategoryElements(item.elements);
                toolbox.gen += elemsToolbox.gen;
                toolbox.extra.push(...elemsToolbox.extra);

                toolbox.gen += '</category>';
            }
        );
        
        this._currGenDomainElemInstanceId = null;
        return toolbox;
    }

    _genCategoryToolbox(item) {
        let toolbox = {
            gen: '<category',
            extra: []
        };

        toolbox.gen += ' name="' + item.name + '">';

        let elemsToolbox = this._genCategoryElements(item.elements);
        toolbox.gen += elemsToolbox.gen;
        toolbox.extra.push(...elemsToolbox.extra);

        toolbox.gen += '</category>';

        return toolbox;
    }

    _genBlocksToolbox(blocks) {
        let toolbox = {
            gen: '',
            extra: []
        };

        blocks.forEach((block) => {
            toolbox.gen += '<block type="' + block + '"></block>';
        });

        return toolbox;
    }

    // generate all the elements are instantiated by handler has this name
    _genElementToolbox(item) {
        let toolbox = {
            gen: '',
            extra: []
        };

        let vplElementHandler = this.__domainElems.__findVPLElement(item.name);
        let blocklyElems = (this._currGenDomainElemInstanceId === null)
            ? vplElementHandler.blocklyElemNames
            : vplElementHandler.blocklyElemInstanceNames(
                this._currGenDomainElemInstanceId
              );
        
        // multi element handler
        if (typeof blocklyElems === 'object') {
            for (key in blocklyElems) {
                let blocks = this._genBlocksToolbox(blocklyElems[key]);
                
                toolbox.gen += blocks.gen;
                toolbox.extra.push(...blocks.extra);
            }
        }
        else {
            let blocks = this._genBlocksToolbox(blocklyElems[key]);
            
            toolbox.gen += blocks.gen;
            toolbox.extra.push(...blocks.extra);
        }
        
        return toolbox;
    }

    _genBlockToolbox(item) {
        let toolbox = {
            gen: '<block',
            extra: []
        };

        toolbox.gen = ' type="' + item.name + '">';
        // inject values in the block if they are defined by the domain author
        toolbox.gen += item.values || '';
        toolbox.gen += '</block>';

        return toolbox;
    }

    _genSeparatorToolbox(item) {
        let toolbox = {
            gen: '<sep',
            extra: []
        };
        
        toolbox.gen = '<sep';
        toolbox.gen += item.gap ? ' gap="' + item.gap + '"': '';
        toolbox.gen += '></sep>';

        return toolbox;
    }

    _genButtonToolbox(item) {
        let toolbox = {
            gen: '<button',
            extra: []
        };
        
        toolbox.gen += ' test="' + item.text + '"';
        toolbox.gen += ' callbackKey="' + item.callback.name + '">'
        toolbox.gen += '</button>';

        toolbox.extra.push({
            callback: callback,
            style: {...item.style}
        });

        return toolbox;
    }

    _genLabelToolbox(item) {
        let toolbox = {
            gen: '<label',
            extra: []
        };
        
        toolbox.gen += ' text="' + item.text + '"';
        toolbox.gen += item.style
            ? ' web-class="' + item.style.webClass + '"'
            : '';
        toolbox.gen += '></label>';

        toolbox.extra.push({
            style: {...item.style}
        });

        return toolbox;
    }

    _genPredefinedToolbox(item) {
        return genPredefinedCategoriesToolbox(item);
    }

    _genCategoryElements(elements) {
        let toolbox = {
            gen: '',
            extra: []
        };

        elements.forEach((element) => {
            let toolObj = this['_gen' + element.type + 'Toolbox'](element);

            toolbox.gen += toolObj.gen;
            toolbox.extra.push(...toolObj.extra);
        });

        return toolbox;
    }

    generateBlocklyToolbox() {
        this._blocklyToolbox = {
            gen: '<xml>',
            extra: []
        };

        let catToolbox = this._genCategoryElements(this._categories);
        this._blocklyToolbox.gen += catToolbox.gen;
        this._blocklyToolbox.extra.push(...catToolbox.extra);

        this._blocklyToolbox.gen += '</xml>';
    }

    // ENDS: TOOLBOX GENERATOR OF THE MISSION

    get blocklyToolbox () {
        return this._blocklyToolbox;
    }
}

export class VPLMission {
    constructor(
        name,
        items, // [ {name, colour*, elements*, path}, ... ]
        domainElems,
        domainController
    ) {
        this._name = name;
        this._toolbox = new VPLToolbox(items, domainElems, this);
        this._domainController = domainController;
    }

    get name() {
        return this._name;
    }

    get toolbox() {
        return this._toolbox.blocklyToolbox;
    }

    loadToolbox(wsp) {

    }

    updateToolbox() {

    }

    // callback notifications for element actions...
    onCreateElement(element) {
        // regenerate the toolbox
        this._toolbox.generateBlocklyToolbox();

        this._domainController.updateToolbox(
            this._name,
            this._toolbox.blocklyToolbox
        );
    }

    onDeleteElement(element) {

    }

    onRenameElement(element) {

    }
}


