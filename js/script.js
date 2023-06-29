const answerLength = 5;
const rounds = 6;
const letters = document.querySelectorAll('.game-board__word');
const loadingSign = document.querySelector('.loading-sign');

let currentRow = 0;
let currentGuess = "";
let done = false;
let isLoading = true;

const red = await fetch("https://words.dev-apis.com/word-of-the-day");
const { word: wordRes } = await res.json();
const word = wordRes.toUpperCase();
const wordParts = word.split("");
setLoading(isLoading);

function addLetter(letter) {
    if (currentGuess.length < answerLength) {
        currentGuess += letter;
        letters[currentRow].innerText = currentGuess;
    }
    else {
        current = currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[currentRow * answerLength + currentGuess.length - 1].innerText = letter;
}

async function commit() {
    if (currentGuess.length != answerLength) return;
}

isLoading = true;
