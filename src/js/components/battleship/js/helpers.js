export function createMatrix() {
    const x = 10;
    const y = 10;
    const arr = [10];

    for (let i = 0; i < x; i++) {
        arr[i] = [10];

        for (let j = 0; j < y; j++) {
            arr[i][j] = 0;
        }
    }

    return arr;
}

export function getRandom(n) {
    return Math.floor(Math.random() * (n + 1));
}
