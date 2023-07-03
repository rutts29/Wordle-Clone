const letters = document.querySelectorAll('.gameboard-word');
const loadingDiv = document.querySelector('.loading-bar');
const ANSWER_LENGTH = 5;
async function init() {
    let currentGuess = ''; //buffer variable to store current guess which is empty at first
    let currentRow = 0; //tracker variable to keep track of current row
    let isLoading = true;

    const res = await fetch('https://words.dev-apis.com/word-of-the-day');  //fetches the word of the day from the api
    const resObj = await res.json(); //converts the response to json and extracts the word from it
    const word = resObj.word.toUpperCase(); //converts the word to uppercase
    const wordParts = word.split(''); //splits the actual word from API into an array of letters
    let done = false;
    isLoading = false;
    setLoading(false); //sets the loading to false once the word is fetched so that the loading bar disappears

    function addLetter(letter) {
        if (currentGuess.length < ANSWER_LENGTH) {
            currentGuess += letter; /*adds the letter to the current guess and checks if the length of the current guess is less
             than the answer length */
        } else {
            currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter; /*otherwise, it removes the last letter and 
            adds the new letter */
        }
        letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText = letter; /*updates letter(s) on the screen each time a 
        letter is added/removed/changed using the calculation: answer length * current row + current guess length - 1 */
    }

    async function commit() {
        if (currentGuess.length != ANSWER_LENGTH) {  // if the current guess length is not equal to the answer length, then it does nothing.
            return;
        }
        isLoading = true;
        setLoading(true);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: 'POST',
            body: JSON.stringify({ word: currentGuess })
        });

        const resObj = await res.json();
        const { validWord } = resObj;
        isLoading = false;
        setLoading(false);

        if (!validWord) {
            showMessage('INVALID WORD!', 'invalidword', 1250);
            return;
        }
        const guessParts = currentGuess.split(''); //splits the current guess into an array of letters
        const map = makeMap(wordParts); //creates a map of the actual word letters

        for (let i = 0; i < ANSWER_LENGTH; i++) { //loops through the answer length
            if (guessParts[i] === wordParts[i]) { //checks if the current guess letter is equal to the actual word letter
                letters[currentRow * ANSWER_LENGTH + i].classList.add('correct'); //if it is, then it adds the correct class to the letter
                map[guessParts[i]]--; //decrements the count of the letter in the map to keep track of the letters that are already guessed
            }
        }

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (guessParts[i] === wordParts[i]) {
            } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
                map[guessParts[i]]--;
            } else {
                letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
            }
        }

        currentRow++;
        if (currentGuess === word) { //if the current guess is equal to the actual word, then it adds the correct class to the letters
            showMessage('YOU WIN!', 'winner');
            done = true;
            return;
        } else if (currentRow === 6) {
            showMessage(`YOU LOSE! THE WORD WAS: ${word} `, 'invalidword');
            done = true;
        }
        currentGuess = '';

    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1); //removes the last letter from the current guess
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ''; //updates the letter(s) on the screen}
    }

    document.addEventListener('keydown', function handleKeyPress(event) {
        if (done || isLoading) {
            return;
        }
        const action = event.key;
        if (action === 'Enter') {
            commit();
        } else if (action === 'Backspace') {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else { }
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
    loadingDiv.classList.toggle('hidden', !isLoading);
}

function showMessage(message, className, timeout) {
    const messageBox = document.getElementById('message-box');
    const messageText = document.querySelector('.message');

    messageText.innerText = message;
    messageBox.classList.add(className);
    messageBox.classList.remove('hidden');
    if (timeout) {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, timeout);
    }
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i];
        if (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] = 1;
        }
    }
    return obj;
}
init();