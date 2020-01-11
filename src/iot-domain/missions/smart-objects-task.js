export const SmartObjectsTask =
{
    name: 'SmartObjectsTask',
    items: [
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
            ],
            path: []
        }
    ]
};
