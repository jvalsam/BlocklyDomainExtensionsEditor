import {
    VPLDomainElementHandler,
    VPLBlocklyElementHandler
} from './vpl-blockly-element';
import { VPLMission } from './vpl-mission';
import { VPLDomainElementsController } from './vpl-domain-elements-controller';

export class VPLDomainElements {
    constructor(domain) {
        this.domain = domain;
        this.missions = {};
        this.vplElems = {};
    }

    addElements(...vplElems) {
        vplElems.forEach(
            (vplElem) => this.vplElems[vplElem.name] =
                ('blocklyElems' in vplElem)
                    ? new VPLDomainElementHandler(
                        vplElem.name,
                        vplElem.blocklyElems,
                        vplElem.signals
                      )
                    : new VPLBlocklyElementHandler(
                                vplElem.name,
                                vplElem.init,
                                vplElem.codeGen,
                                vplElem.debGen
                      )
        );

        this.vplElems.__findVPLElement = (element) => {
            if (typeof element === 'object') {
                let domainElem = this.vplElems[element.domainElem];

                return element.item
                    ? domainElem.__findVPLElement(element.item)
                    : domainElem;
            }

            // outer look of VPLElements
            if (name in this.vplElems) {
                return this.vplElems[name];
            }

            // inner lookup in VPLElements
            Object.keys(this.vplElems).forEach(
                (key) => {
                    let vplElement = this.vplElems[key].__findVPLElement(name);
                    if (vplElement!==null) {
                        return vplElement;
                    }
                }
            );
            
            // not found
            return null;
        };
        
        this.getDomainElementItems = (name) => {
            let domainElem = this.vplElems.__findVPLElement(name);
            
            return domainElem.vplBlocklyElems;
        }

        this.vplElems.bookMission = (mission, element) =>
            this.vplElems.__findVPLElement(element).addMission(mission);
    }

    get signals() {
        let listenSignals = {};

        Object.keys(this.vplElems)
            .forEach((key) => {
                let vplElem = this.vplElems[key];
                
                if (vplElem.constructor !== VPLDomainElementHandler) continue;

                listenSignals = {
                    ...listenSignals,
                    ...vplElem.signals
                };
            });

        return listenSignals;
    }

    addMissions(...vplMissions) {
        vplMissions.forEach(
            (vplMission) => this.vplMissions[vplMission.name] =
                new VPLMission(
                    vplMission.name,
                    vplMission.items,
                    this.vplElems
                )
        );
    }

    // TODO: call all elements and missions to unload
    unload() {

    }
}

/**
 * 
 * @param { Name of the domain } domain 
 * @param { Function without args that returns object of VPL 
 *          Domain Elements } elemsLoader
 */
export function DefineVPLDomainElements(domain, elemsLoader) {
    VPLDomainElementsController.register(domain, elemsLoader);
}

/**
 * 
 * @param { Name of the domain } domain 
 * @param { Function without args that returns object of VPL 
 *          Domain Elements } elemsLoader
 */
export function LoadVPLDomainElements(domain, elemsLoader) {
    let vplDomainElemsData = elemsLoader();

    let vplDomainElems = new VPLDomainElements(domain);
    vplDomainElems.addElements(vplDomainElemsData.elements);
    vplDomainElems.addMissions(vplDomainElemsData.missions);

    return vplDomainElems;
}