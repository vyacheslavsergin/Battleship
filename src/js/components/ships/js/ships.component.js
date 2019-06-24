const shipsData = [];

export default class Ships {
    constructor() {
        this.shipSide = 33;
    }

    init = (field, matrix, fc) => {
        this.field = field;
        this.matrix = matrix;
        this.fc = fc;
        this.shipName = this.fc.shipName;
        this.decks = this.fc.decks;
        this.x = this.fc.x;
        this.y = this.fc.y;
        this.kx = this.fc.kx;
        this.ky = this.fc.ky;
        this.hits = 0;
        this.m = [];
    }

    createShip = () => {
        let k = 0;

        while (k < this.decks) {
            this.matrix[this.x + k * this.kx][this.y + k * this.ky] = 1;
            this.m.push([this.x + k * this.kx, this.y + k * this.ky]);
            k++;
        }

        shipsData.push({
            matrix: this.m,
            hits: 0,
            decks: this.decks
        });

        this.showShip();
    }

    showShip = () => {
        const div = document.createElement('div');
        const dir = (this.kx === 1) ? ' is-vertical' : '';
        const className = this.shipName.slice(0, -1);

        div.className = 'battleship__ship ' + className + dir;
        div.style.cssText = `
            left: ${this.y * this.shipSide}px;
            top: ${this.x * this.shipSide}px;
        `;

        this.field.appendChild(div);
    }

    getData = () => {
        return {
            shipsData: shipsData,
            matrix: this.matrix
        }
    }
}
