export const SmartObjectsTask =
{
    name: 'smart-objects-task',
    items: [
        {
            type: 'Predefined',
            elements: 'ALL', // select: [{category:'catName',elems:[...]}, ...]
            category: {
                name: 'Built-in',
                expanded: true
            }
        },
        {
            name: 'Smart Objects',
            type: 'Category',
            colour: '210',
            elements: [
                {
                    name: {
                        domainElem: 'SmartObject'
                    },
                    type: 'Category',
                    elements: 'ALL' // Array of objects to select
                }
            ]
        }
    ],
    // at least one editor handles the mission
    // in case of more the end-user choose which
    // this action does not include undo (converter is required)
    editors: [
        {
            name: 'BlocklyEditor',
            src: ``
        }
    ]
};
