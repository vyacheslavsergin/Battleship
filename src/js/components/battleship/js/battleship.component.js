import ships from '../../ships';
import {
    createMatrix,
    getRandom
} from './helpers';

export default class Battleship {
    constructor(element) {
        this.element = element;
        this.field = this.element.querySelector('[data-battleship-ref="ships"]');
        this.message = this.element.querySelector('[data-battleship-ref="message"]');

        this.shipSide = 33;

        this.shipsData = [
            '',
            [4, 'battleship__ship--fourdeck'],
            [3, 'battleship__ship--tripledeck'],
            [2, 'battleship__ship--doubledeck'],
            [1, 'battleship__ship--singledeck']
        ];

        this.fieldX = this.field.getBoundingClientRect().top + pageYOffset;
        this.fieldY = this.field.getBoundingClientRect().left + pageXOffset;

        this.matrix = [];

        this.init();
    }

    init() {
        this.field.addEventListener('click', this.shoot);

        this.randomLocationShips();
    }

    shoot = (event) => {
        const data = ships.getData();
        this.matrix = data.matrix;

        this.shipsData = data.shipsData;

        const coords = this.transformCoordinates(event);
        const val = data.matrix[coords.x][coords.y];

        switch (val) {
            case 0:
                this.matrix[coords.x][coords.y] = 3;
                break;

            case 1:
                this.matrix[coords.x][coords.y] = 4;
                this.showIcons(coords, 'is-visible');

                break;
        }

        let count = [];
        let miss = [];

        for (let i = 0; i < this.matrix.length; i++) {
            this.matrix[i].forEach((i) => {
                count.push(i);
            })
        }

        count.forEach((n) => {
            if (n === 3) {
                miss.push(n);
            }
        });

        for (let i = this.shipsData.length - 1; i >= 0; i--) {
            let warship = this.shipsData[i];
            let arrayDescks = warship.matrix;

            for (let j = 0, length = arrayDescks.length; j < length; j++) {
                if (arrayDescks[j][0] === coords.x && arrayDescks[j][1] === coords.y) {
                    warship.hits++;

                    if (warship.hits === warship.decks) {
                        this.shipsData.splice(i, 1);
                    }

                    break;
                }
            }

            if (this.shipsData.length === 0) {
                this.message.innerHTML = `
                    <div>The game is over</div>
                    <div>shots off target: ${miss.length}</div>
                `;
            }
        }
    }

    showIcons = (coords, iconClass) => {
        const div = document.createElement('div');
        div.className = 'battleship__wrecked ' + iconClass;
        div.style.cssText = `
            left: ${coords.y * this.shipSide}px;
            top: ${coords.x * this.shipSide}px;
        `;
        this.field.appendChild(div);
    }

    transformCoordinates = (event) => {
        const obj = {};

        obj.x = Math.trunc((event.pageY - this.fieldX) / this.shipSide);
        obj.y = Math.trunc((event.pageX - this.fieldY) / this.shipSide);

        return obj;
    }

    randomLocationShips = () => {
        this.matrix = createMatrix();

        for (let i = 1, length = this.shipsData.length; i < length; i++) {
            const decks = this.shipsData[i][0];

            for (let j = 0; j < i; j++) {
                const fc = this.getCoordinatesDecks(decks);

                fc.decks = decks;
                fc.shipName = this.shipsData[i][1] + String(j + 1);

                ships.init(this.field, this.matrix, fc);
                ships.createShip();
            }
        }
    }

    getCoordinatesDecks = (decks) => {
        const kx = getRandom(1);
        const ky = (kx === 0) ? 1 : 0;
        let x = null;
        let y = null;

        if (kx === 0) {
            x = getRandom(9);
            y = getRandom(10 - decks);
        } else {
            x = getRandom(10 - decks);
            y = getRandom(9);
        }

        const result = this.checkLocationShip(x, y, kx, ky, decks);
        if (!result) return this.getCoordinatesDecks(decks);

        const obj = {
            x: x,
            y: y,
            kx: kx,
            ky: ky
        };

        return obj;
    }

    checkLocationShip = (x, y, kx, ky, decks) => {
        let fromX;
        let toX;
        let fromY;
        let toY;

        fromX = (x === 0) ? x : x - 1;

        if (x + kx * decks === 10 && kx === 1) {
            toX = x + kx * decks;
        }

        else if (x + kx * decks < 10 && kx === 1) {
            toX = x + kx * decks + 1;
        }

        else if (x === 9 && kx === 0) {
            toX = x + 1;
        }

        else if (x < 9 && kx === 0) {
            toX = x + 2;
        }

        fromY = (y === 0) ? y : y - 1;

        if (y + ky * decks === 10 && ky === 1) {
            toY = y + ky * decks;
        }

        else if (y + ky * decks < 10 && ky === 1) {
            toY = y + ky * decks + 1;
        }

        else if (y === 9 && ky === 0) {
            toY = y + 1;
        }

        else if (y < 9 && ky === 0) {
            toY = y + 2;
        }

        if (toX === undefined || toY === undefined) {
            return false;
        }

        for (let i = fromX; i < toX; i++) {
            for (let j = fromY; j < toY; j++) {
                if (this.matrix[i][j] === 1) {
                    return false;
                }
            }
        }

        return true;
    }
}
