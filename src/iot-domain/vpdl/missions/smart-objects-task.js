export const SmartObjectsTask =
{
    name: 'smart-objects-task',
    items: [
        {
            type: 'Predefined',
            elements: 'ALL' // select: [{category:'catName',elems:[...]}, ...]
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
    ]
};
