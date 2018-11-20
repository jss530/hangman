const WORD_API_URL = 'http://app.linkedin-reach.io/words';
const maxTries = 6;
var currentWord;
let guessedLetters = [];
let incorrectLetters = [];
let guessingWord = [];
let remainingGuesses = 0;
let gameStarted = false;
let hasFinished = false;
let wins = 0;
let consecutiveWins = 0;

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

    req.open('GET', url+"?"+params+"&callback=?");
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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

    document.getElementById("guesses-remaining").style.display = "block";
    document.getElementById("you-lose").style.display = "none";
    document.getElementById("you-win").style.display = "none";

    updateDisplay();
};

function getWord() {
  return get(WORD_API_URL)
  .then(function(response) {
    let wordResponse = response.split("\n");
    return wordResponse[Math.floor(Math.random() * wordResponse.length)];
    // currentWord = word;
    // console.log(currentWord);
  }, function(error) {
    console.error("Failed!", error);
  })
}

function updateDisplay() {
    document.getElementById("current-word").innerText = "";

    for (var i = 0; i < guessingWord.length; i++) {
        document.getElementById("current-word").innerText += guessingWord[i];
    }

    document.getElementById("guesses-left").innerText = remainingGuesses;
    document.getElementById("wrong-guesses").innerText = "Already used:" + " " + guessedLetters;

};

function makeGuess(letter) {
    if (remainingGuesses > 0) {
        if (!gameStarted) {
            gameStarted = true;
        }

        if (guessedLetters.indexOf(letter) === -1) {
            guessedLetters.push(letter);
            evaluateGuess(letter);
        } else {
          alert("CHIP SAYS: You already used this letter. Try again!!")
        }
    }
    updateDisplay();
    endGame();
};

function evaluateGuess(letter) {
    let positions = [];

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

function endGame() {
    if(guessingWord.indexOf(" _ ") === -1) {
        document.getElementById("you-lose").style.display = "none";
        document.getElementById("guesses-remaining").style.display = "none";
        document.getElementById("you-win").style.display = "block";
        wins++;
        consecutiveWins++;
        hasFinished = true;
        document.getElementById("play-again").style.display = "block";
        document.getElementById("total-wins").innerText = "Total wins:" + " " + wins;
        document.getElementById("streak").innerText = "Consecutive wins:" + " " + consecutiveWins;
    } else if (remainingGuesses <= 0) {
      document.getElementById("guesses-remaining").style.display = "none";
      document.getElementById("you-lose").style.display = "block";
      document.getElementById("current-word").innerText = currentWord;
      document.getElementById("play-again").style.display = "block";
      consecutiveWins = 0;
      hasFinished = true;
    }
};

function resetWins() {
  wins = 0;

  document.getElementById("total-wins").innerText + wins;
  getWord();
}

function gameManager() {
  getWord()
  .then(function(newWord) {
    currentWord = newWord;
    console.log(currentWord);
    resetGame();
  })
}

document.onkeydown = function(event) {
  if(event.keyCode >= 65 && event.keyCode <= 90) {
      makeGuess(event.key.toLowerCase());
  }
};

document.addEventListener("DOMContentLoaded", getWord);
