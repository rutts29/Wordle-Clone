const letters = document.querySelectorAll('.gameboard-word');
const loadingDiv = document.querySelector('.loading-bar');
const ANSWER_LENGTH = 5;
async function init() {
    let currentGuess = ''; //buffer variable to store current guess which is empty at first
    let currentRow = 0; //tracker variable to keep track of current row

    const res = await fetch('https://words.dev-apis.com/word-of-the-day');  //fetches the word of the day from the api
    const resObj = await res.json(); //converts the response to json and extracts the word from it
    const word = resObj.word.toUpperCase(); //converts the word to uppercase


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
        currentRow++;
        currentGuess = '';







    }

    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1); //removes the last letter from the current guess
        letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = ''; //updates the letter(s) on the screen}
    }








    document.addEventListener('keydown', function handleKeyPress(event) {
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
init();