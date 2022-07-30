
export interface multiplyDataItem {
    value: number[];
    first: string[];
    second: string[];
}

interface dataInterface {
    [template: string]: multiplyDataItem;
}

const multiplyData: dataInterface = {
    'A * B': {
        value: [1, 1],
        first: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '*',
        ],
        second: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '*',
        ]
    },
    'AB * C': {
        value: [2, 1],
        first: [
            'AA',
            'AB',
            'A0',
            '10',
            '*'
        ],
        second: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '*',
        ]
    },
    'ABC * D': {
        value: [3, 1],
        first: [
            'AAA',
            'A0B',
            'AB0',
            '100',
            '*'
        ],
        second: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '*',
        ]
    },
    'ABCD * E': {
        value: [4, 1],
        first: [
            'A00A',
            'ABC0',
            'AB0C',
            'AAAA',
            'A0BC',
            'AB00',
            'A0B0',
            '*'
        ],
        second: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '*',
        ]
    },
    'AB * CD': {
        value: [2, 2],
        first: [
            'AA',
            'AB',
            'A0',
            '10',
            '*'
        ],
        second: [
            'AA',
            'AB',
            'A0',
            '10',
            '*'
        ]
    },
    'ABC * DE': {
        value: [3, 2],
        first: [
            'AAA',
            'A0B',
            'AB0',
            '100',
            '*'
        ],
        second: [
            'AA',
            'AB',
            'A0',
            '10',
            '*'
        ]
    },
    'ABCD * EF': {
        value: [4, 2],
        first: [
            'A00A',
            'ABC0',
            'AB0C',
            'AAAA',
            'A0BC',
            'AB00',
            'A0B0',
            '*'
        ],
        second: [
            'AA',
            'AB',
            'A0',
            '10',
            '*'
        ]
    },
}

export default multiplyData