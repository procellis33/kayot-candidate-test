import RandomLetterGenerator from "./RandomLetterGenerator.js";
import {letters} from "../constants.js";

export default class Game {
    #canvas;
    #canvasWidth;
    #canvasHeight;

    #scoreInput;
    #currentScore;
    #desiredScore;

    #isGameStarted;
    #isPaused;

    #keyboardEventListener;

    #createLetterInterval;
    #startStopButton;
    #gameSpeed;
    #gameWon;


    constructor() {
        this.#canvas = document.getElementById("gameCanvas");
        this.#canvasWidth = null;
        this.#canvasHeight = null;
        this.#keyboardEventListener = null;
        this.#createLetterInterval = null;
        this.#scoreInput = document.querySelector(".scoreContainer input");
        this.#startStopButton = document.querySelector(".button");
        this.#gameSpeed = 17;
        this.#isGameStarted = false;
        this.#isPaused = false;
        this.#currentScore = 0;
        this.#desiredScore = 50;
        this.#gameWon = false;
    }

    runGame() {

        //* Start/Stop button event listener
        const buttonEventListener = () => {
            if (this.#isGameStarted && !this.#isPaused) {
                this.#startStopButton.innerHTML = 'Continue';
                this.#isPaused = true;
                clearInterval(this.#createLetterInterval);
                this.#stopGame();

            } else if (this.#isGameStarted && this.#isPaused) {
                this.#startStopButton.innerHTML = 'Pause';
                this.#isPaused = false;
                this.#continueGame();
                this.#createNewLetter();

            } else {
                const inputNumber = parseInt(this.#scoreInput.value);
                if (inputNumber > 0) {
                    this.#startGame(inputNumber);
                } else {
                    alert("Please enter a number greater than 0 in the input field.");
                }
            }
        }

        const debounce = (func) => {
            let timer;
            return function (event) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(func, 100, event);
            };
        }

        const resizeEventListener = () => {
            this.#calculateCanvasStyles()
        }

        window.addEventListener("resize", debounce(resizeEventListener));
        this.#startStopButton.addEventListener("click", buttonEventListener);
    }

    // * To make custom score
    // #toggleInput() {
    //     const isDisabled = document.getElementById('inputScore').disabled;
    //     isDisabled ? document.getElementById('inputScore').disabled = false : document.getElementById('inputScore').disabled = true;
    // }

    #removeMatchingLetters(key) {
        if (this.#isPaused || !letters.includes(key))
            return

        const allLetter = document.querySelectorAll('.movingLetter')
        let letterMatchesCounter = 0;

        allLetter.forEach((letter) => {
            if (letter.innerHTML === key) {
                letterMatchesCounter += 1;
                letter.remove()
            }
        })
        this.#updateCurrentScore(letterMatchesCounter)
    }

    #updateCurrentScore(letterMatchesCounter) {
        if (letterMatchesCounter >= 2) {
            this.#currentScore += 1;
            document.getElementById('currentScore').innerHTML = this.#currentScore;
        } else {
            this.#currentScore -= 2;
            document.getElementById('currentScore').innerHTML = this.#currentScore;
        }

        this.#speedIncrease();

        if (this.#currentScore === this.#desiredScore) {
            this.#gameWon = true;
            this.#checkIfGameEnds();
            alert('Congrats you won!')
        }
    }

    #speedIncrease() {
        const changeSpeed = () => {
            this.#stopGame()
            this.#continueGame()
        }

        if (this.#currentScore >= 10 && this.#currentScore <= 20) {
            this.#gameSpeed = 13
            changeSpeed()
        } else if (this.#currentScore >= 20 && this.#currentScore <= 30) {
            this.#gameSpeed = 9
            changeSpeed()
        } else if (this.#currentScore >= 30 && this.#currentScore <= 40) {
            this.#gameSpeed = 5
            changeSpeed()
        } else if (this.#currentScore >= 40 && this.#currentScore <= 50) {
            this.#gameSpeed = 1
            changeSpeed()
        }
    }

    #continueGame() {
        document.querySelectorAll('.movingLetter').forEach(letterElement => {
            letterElement.movementInterval = setInterval(() => {

                const computedStyle = getComputedStyle(letterElement);
                const top = parseInt(computedStyle.top, 10);
                const cubeSize = parseInt(computedStyle.height, 10);

                this.#checkIfGameEnds(top, cubeSize);

                letterElement.style.top = `${top + 1}px`;
            }, this.#gameSpeed)
        })
    }

    // * Clear current intervals
    #stopGame() {
        const allLetter = document.querySelectorAll('.movingLetter')
        allLetter.forEach((element) => {
            clearInterval(element.movementInterval)
        })
    }

    #checkIfGameEnds(topPosition, cubeSize) {
        if (topPosition >= (this.#canvasHeight - cubeSize - 1) || this.#gameWon) {

            // * Clear event listener
            document.removeEventListener("keydown", this.#keyboardEventListener);

            // * Stop spawning
            clearInterval(this.#createLetterInterval);

            // * Stop current letters from movement
            this.#stopGame();

            // this.#toggleInput();

            // * Reset values
            this.#startStopButton.innerHTML = 'Start';
            this.#isGameStarted = false;
            this.#isPaused = false;
            this.#gameWon = false;
        }
    }

    #calculateCanvasStyles() {
        const computedStyle = getComputedStyle(this.#canvas);
        this.#canvasWidth = parseInt(computedStyle.width, 10);
        this.#canvasHeight = parseInt(computedStyle.height, 10);
    }

    #createNewLetter() {
        this.#createLetterInterval = setInterval(() => {
            const letterObject = new RandomLetterGenerator();
            const cubeSize = letterObject.getCubeSize();
            const letterElement = letterObject.getLetterElement();

            letterElement.style.top = `-${cubeSize}px`;

            const min = 0;
            const max = `${this.#canvasWidth - cubeSize - 1}`;

            letterElement.style.right = `${Math.floor(Math.random() * (max - min + 1) + min)}px`;

            this.#canvas.append(letterElement);

            this.#startMovingLetter(letterElement, cubeSize);

        }, 300)
    }

    #startMovingLetter(letterElement, cubeSize) {
        letterElement.movementInterval = setInterval(() => {

            const computedStyle = getComputedStyle(letterElement);
            const top = parseInt(computedStyle.top, 10);

            this.#checkIfGameEnds(top, cubeSize);

            letterElement.style.top = `${top + 1}px`;
        }, this.#gameSpeed)
    }

    #clearAllMovingLetters() {
        document.querySelectorAll('.movingLetter').forEach(letter => {
            letter.remove();
        })
    }

    #startGame(inputNumber) {
        this.#currentScore = 0;
        document.getElementById('currentScore').innerHTML = this.#currentScore;

        // * Make custom score
        // this.#toggleInput();
        this.#desiredScore = inputNumber;

        this.#startStopButton.innerHTML = 'Pause';
        this.#isGameStarted = true;

        //* Keyboard event listener
        this.#keyboardEventListener = (event) => {
            const key = event.key.toUpperCase();
            this.#removeMatchingLetters(key);
        };
        document.addEventListener("keydown", this.#keyboardEventListener);

        this.#clearAllMovingLetters();
        this.#calculateCanvasStyles();
        this.#createNewLetter();
    }
}