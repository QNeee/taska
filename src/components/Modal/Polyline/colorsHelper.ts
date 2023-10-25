
export const colorsUSA = [
    'blue',
    'orange',
    'green',
    'brown',
    'gray',
    'white',
    'red',
    'black',
    'yellow',
    'purple',
    'pink',
    'turquoise',
];
export const colorsNKT = [
    'red',
    'green',
    'blue',
    'yellow',
    '#228b22',
    'gray',
    'brown',
    'purple',
    'turquoise',
    'white',
    'pink',
    'orange',
];
export const colorsRandM = [
    'red',
    'green',
    'blue',
    'yellow',
    'white',
    'gray',
    'brown',
    'purple',
    'turquoise',
    'black',
    'pink',
    'orange',
]
export const Ukraine = [
    'red',
    'green',
    'blue',
    'yellow',
    'white',
    'gray',
    'brown',
    'purple',
    'orange',
    'black',
    'pink',
    'turquoise',
]
export const colorsFD19 = [
    'white',
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'brown',
    'turquoise',
    'pink',
    'gray',
    'black',

]
export const colorsRosTelekom = [
    '#228b22',
    'red',
    'blue',
    'green',
    'yellow',
    'purple',
    'orange',
    'brown',
    'turquoise',
    'pink',
    'gray',
    'black',

]
export const colorsDraka = {
    standart6: [
        'blue',
        'white',
        'yellow',
        'green',
        'gray',
        'red',
    ],
    standrat12: [
        'blue',
        'white',
        'yellow',
        'green',
        'gray',
        'orange',
        'brown',
        'turquoise',
        'black',
        'purple',
        'pink',
        'red',
    ],
    optional4: [
        'blue',
        'white',
        'yellow',
        'red'
    ],
    optional8: [
        'blue',
        'white',
        'yellow',
        'green',
        'gray',
        'orange',
        'brown',
        'red'
    ],
}
export const getColors = (standart: string) => {
    switch (standart) {
        case 'АМЕРИКА':
            return colorsUSA;
        case 'ЮЖКАБЕЛЬ (ЄВРОПА)':
            return Ukraine;
        case 'NKT (НІМЕЧЧИНА)':
            return colorsNKT;
        case 'R&M (ШВЕЙЦАРІЯ)':
            return colorsRandM;
        case 'ФД 19':
            return colorsFD19;
        case 'РОСТЕЛЕКОМ':
            return colorsRosTelekom;
        case 'DRAKA 4':
            return colorsDraka.optional4;
        case 'DRAKA 6':
            return colorsDraka.standart6;
        case 'DRAKA 8':
            return colorsDraka.optional8;
        case 'DRAKA 12':
            return colorsDraka.standrat12;
        default:
            return colorsUSA;
    }
}