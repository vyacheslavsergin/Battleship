import './scss/index.scss';
import Battleship from './js/battleship.component';

const battleship = [...document.querySelectorAll('[data-component="battleship"]')].map(instance => new Battleship(instance));
