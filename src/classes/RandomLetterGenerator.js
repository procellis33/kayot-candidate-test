import {letters} from "../constants.js";
export default class RandomLetterGenerator {
    #letter;
    #cubeSize;
    #letterSize;
    #letterElement;
    constructor() {
        this.#letter = this.#generateRandomLetter();
        this.#cubeSize = this.#generateRandomCubeSize();
        this.#letterSize = this.#calculateLetterSize();
        this.#letterElement = this.#createLetterElement();
    }

    #generateRandomLetter() {
        const randomIndex = Math.floor(Math.random() * letters.length);
        return letters.charAt(randomIndex);
    }

    #generateRandomCubeSize() {
        const minSize = 30;
        const maxSize = 100;
        const randomSize = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
        return `${randomSize}px`;
    }

    #calculateLetterSize() {
        const cubeSizeNumber = parseInt(this.#cubeSize, 10);
        const maxLetterSize = Math.floor(cubeSizeNumber * 0.8);
        const minLetterSize = Math.floor(cubeSizeNumber * 0.3);
        const randomLetterSize = Math.floor(Math.random() * (maxLetterSize - minLetterSize + 1) + minLetterSize);
        return `${randomLetterSize}px`;
    }

    #createLetterElement() {
        const div = document.createElement('div');

        div.className = 'movingLetter'
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.alignItems = 'center';
        div.style.height = this.#cubeSize;
        div.style.width = this.#cubeSize;
        div.style.position = 'absolute';
        div.style.backgroundColor = 'rgba(0,0,0,0.5)';
        div.style.userSelect = 'none';
        div.style.fontSize = this.#letterSize;
        div.style.lineHeight = this.#cubeSize;
        div.style.fontWeight = '500';
        div.textContent = this.#letter;

        return div;
    }

    getCubeSize() {
        return parseInt(this.#cubeSize, 10);
    }
    getLetterElement() {
        return this.#letterElement;
    }
}