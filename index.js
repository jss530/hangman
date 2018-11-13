const WORD_API_URL = 'http://app.linkedin-reach.io/words';
const maxTries = 6;
let guessedLetters = [];
let guessingWord = [];   
let remainingGuesses = 0;
let gameStarted = false;
let hasFinished = false;

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

function startGame() {

}
