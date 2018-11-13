const WORD_API_URL = 'http://app.linkedin-reach.io/words';
const maxTries = 6;
let guessedLetters = [];
let guessingWord = [];
let currentWordIndex;
let remainingGuesses = 0;
let gameStarted = false;
let hasFinished = false;
let wins = 0;

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };
    req.onerror = function() {
      reject(Error("Network Error"));
    };
    req.send();
  });
}

function resetGame() {
  //note - may need to update this later if you want to clear out more things to reset the game
    remainingGuesses = maxTries;
    gameStarted = false;

    guessedLetters = [];
    guessingWord = [];

    document.getElementById("hangman-image").src = "";

    document.getElementById("gameover").style.cssText = "display: none";
    document.getElementById("youwin").style.cssText = "display: none";

    updateDisplay();
};

function updateDisplay() {

    document.getElementById("total-wines").innerText = wins;
    document.getElementById("current-word").innerText = "";

    for (var i = 0; i < guessingWord.length; i++) {
        document.getElementById("current-word").innerText += guessingWord[i];
    }

    document.getElementById("guesses-remaining").innerText = remainingGuesses;
    document.getElementById("wrong-guesses").innerText = guessedLetters;

    if(remainingGuesses <= 0) {
        document.getElementById("you-lose").style.cssText = "display: block";
        hasFinished = true;
    }
};
