const answerLength = 5;
const rounds = 6;
const letters = document.querySelectorAll(`.game-board__word`);
const loadingSign = document.querySelector(`.loading-sign`);
async function init() {
    let currentRow = 0;
    let currentGuess = "";
    let done = false;
    let isLoading = true;

    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const { word: wordRes } = await res.json();
    const word = wordRes.toUpperCase();
    const wordParts = word.split("");
    isLoading = false;
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
        if (currentGuess.length !== answerLength) return;


        isLoading = true;
        setLoading(isLoading);
        const res = await fetch("https://words.dev-apis.com/validate-word", {
            method: "POST",
            body: JSON.stringify({ word: currentGuess }),
        });
        const { validWord } = await res.json();
        isLoading = false;
        setLoading(isLoading);

        if (!validWord) {
            markInvalidWord();
            return;
        }
        const guessParts = currentGuess.split("");
        const map = makeMap(wordParts);
        let allRight = true;

        for (let i = 0; i < answerLength; i++) {
            if (guessParts[i] === wordParts[i]) {
                letters[currentRow * answerLength + i].classList.add("correct");
                map[guessParts[i]]--;
            }
        }

        for (let i = 0; i < answerLength; i++) {
            if (guessParts[i] === wordParts[i]) {

            } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
                allRight = false;
                letters[currentRow * answerLength + i].classList.add("close");
                map[guessParts[i]]--;
            } else {
                allRight = false;
                letters[currentRow * answerLength + i].classList.add("wrong");
            }
        }
        currentRow++;
        currentGuess = "";
        if (allRight) {
            alert("You won!");
            document.querySelector(".title").classList.add("winner");
            done = true;
        } else if (currentRow === rounds) {
            alert("You lost!");
            done = true;
        }
    }
    function backspace() {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1);
        letters[currentRow * answerLength + currentGuess.length].innerText = "";
    }

    function markInvalidWord() {
        letters[currentRow * answerLength + i].classList.remove("invalid");

        setTimeout(() => letters[currentRow * answerLength + i].classList.add("invalid"), 10);
    }


    document.addEventListener("keydown", function handleKeyPress(event) {
        if (done || isLoading) {
            // do nothing;
            return;
        }

        const action = event.key;

        if (action === "Enter") {
            commit();
        } else if (action === "Backspace") {
            backspace();
        } else if (isLetter(action)) {
            addLetter(action.toUpperCase());
        } else {
            // do nothing
        }
    });
    function isLetter(letter) {
        return /^[a-zA-Z]$/.test(letter);
    }

    // show the loading spinner when needed
    function setLoading(isLoading) {
        loadingSign.classList.toggle("hidden", !isLoading);
    }

    // takes an array of letters (like ['E', 'L', 'I', 'T', 'E']) and creates
    // an object out of it (like {E: 2, L: 1, T: 1}) so we can use that to
    // make sure we get the correct amount of letters marked close instead
    // of just wrong or correct
    function makeMap(array) {
        const obj = {};
        for (let i = 0; i < array.length; i++) {
            if (obj[array[i]]) {
                obj[array[i]]++;
            } else {
                obj[array[i]] = 1;
            }
        }
        return obj;

    }
}
init();
