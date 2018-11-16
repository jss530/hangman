const WORD_API_URL = 'http://app.linkedin-reach.io/words';
const maxTries = 6;
var currentWord;
let guessedLetters = [];
let guessingWord = [];
let remainingGuesses = 0;
let gameStarted = false;
let hasFinished = false;
let wins = 0;

//need to call the API and store it in a variable, call variable throughout functions.

function get(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    var params = "difficulty=1&minLength=5";

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

    req.open('GET', url+"?"+params);
    req.send();
  });
}

function resetGame() {
    remainingGuesses = maxTries;
    gameStarted = false;
    guessedLetters = [];
    guessingWord = [];

    for (var i = 0; i < currentWord.length; i++) {
      guessingWord.push(" _ ");
    }
    document.getElementById("hangman-image").src = "";
    document.getElementById("you-lose").style.display = "none";
    document.getElementById("you-win").style.display = "none";

    updateDisplay();
};

function getWord() {
  get(WORD_API_URL)
  .then(function(response) {
    //then, want to randomly select words from the full response here
    let wordResponse = response.split("\n");
    let word = wordResponse[Math.floor(Math.random() * wordResponse.length)];
    currentWord = word;
    console.log(currentWord)
    resetGame();
  }, function(error) {
    console.error("Failed!", error);
  })
}

function updateDisplay() {

    document.getElementById("total-wins").innerText = "Total wins:" + " " + wins;
    document.getElementById("current-word").innerText = "";

    for (var i = 0; i < guessingWord.length; i++) {
        document.getElementById("current-word").innerText += guessingWord[i];
    }

    document.getElementById("guesses-left").innerText = remainingGuesses;
    document.getElementById("wrong-guesses").innerText = "Already used:" + " " + guessedLetters;

    if(remainingGuesses <= 0) {
        document.getElementById("guesses-remaining").style.display = "none";
        document.getElementById("you-lose").style.display = "block";
        hasFinished = true;
    }
};

function makeGuess(letter) {
    if (remainingGuesses > 0) {
        if (!gameStarted) {
            gameStarted = true;
        }

     // Make sure we didn't use this letter yet
        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        } else {
          alert("Letter already used. Try another one.")
        }
    }
    updateDisplay();
    checkWin();
};

function evaluateGuess(letter) {
    let positions = [];

    // Loop through word finding all instances of guessed letter, store the indicies in an array.
    for (var i = 0; i < currentWord.length; i++) {
        if(currentWord[i] === letter) {
            positions.push(i);
        }
    }

    if (positions.length <= 0) {
        remainingGuesses--;
    } else {
        for(var i = 0; i < positions.length; i++) {
            guessingWord[positions[i]] = letter;
        }
    }
};

function checkWin() {
    if(guessingWord.indexOf(" _ ") === -1) {
        document.getElementById("you-lose").style.display = "none";
        document.getElementById("guesses-remaining").style.display = "none";
        document.getElementById("you-win").style.display = "block";
        wins++;
        hasFinished = true;
    }
};

function resetWins() {
  wins = 0;

  document.getElementById("total-wins").innerText + wins;
  getWord();
}

document.onkeydown = function(event) {
  if(event.keyCode >= 65 && event.keyCode <= 90) {
      makeGuess(event.key.toLowerCase());
  }
};
