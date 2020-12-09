/*----- constants -----*/
const suits = ["c", "d", "h", "s"];
const ranks = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "J", "Q", "K", "A"];

/*----- app's state (variables) -----*/

let playerValue;
let dealerValue;
let winner;
let newCard;
let playerCard1;
let playerCard2;
let dealerCard1;
let playerWin = 0;
let dealerWin = 0;
let tie = 0;
let deck = [];
let audio = new Audio('extra materials/dealing-card.wav');

/*----- cached element references -----*/

let playButton = document.getElementById("play");
let board = document.getElementById("board");
let hitButton = document.getElementById("hit");
let standButton = document.getElementById("stand");
let restartButton = document.getElementById("restart");
let statusMessage = document.getElementById("status-message");
let currentValue = document.getElementById("current-value");
let hintMessage = document.getElementById("hint-message");
let winnerMessage = document.getElementById("winner");
let playerCards = document.getElementById("player-cards");
let dealerCards = document.getElementById("dealer-cards");
let playerscard1 = document.getElementById("player-card1");
let playerscard2 = document.getElementById("player-card2");
let dealerscard1 = document.getElementById("dealer-card1");
let dealerscard2 = document.getElementById("dealer-card2");
let playerWins = document.getElementById("player-wins");
let dealerWins = document.getElementById("dealer-wins");
let ties = document.getElementById("ties");

/*----- event listeners -----*/

playButton.addEventListener("click", play);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
restartButton.addEventListener("click", restart);

/*----- functions -----*/

function createDeck(){
    for (let i=0; i<suits.length; i++) {
        for (let j=0; j<ranks.length; j++) {
            let value = parseInt(ranks[j]);
            if (ranks[j] === "J" || ranks[j] === "Q" || ranks[j] === "K") {
                value = 10;
            } else if (ranks[j] === "A") {
                value = 1;
            };
            let card = {
                name: suits[i]+ranks[j],
                value: value
            };
            deck.push(card);
        }
    }
    return deck;
};

function shuffleCards(){
    for (let x=deck.length-1; x>0; x--) {
      let y = Math.floor(Math.random() * (x+1));
      let temp = deck[x]; 
      deck[x] = deck[y]; 
      deck[y] = temp;

    }
    return deck;
}

function play(){
    playButton.classList.add("hidden");
    board.classList.remove("hidden");
    audio.play();
    deal();
};

function deal(){
    createDeck();
    shuffleCards();

    playerCard1 = deck.pop();
    playerCard2 = deck.pop();
    dealerCard1 = deck.pop();

    playerscard1.classList.add(playerCard1["name"])
    playerscard2.classList.add(playerCard2["name"])
    dealerscard1.classList.add(dealerCard1["name"])
    
    playerValue = playerCard1["value"] + playerCard2["value"];

    /*----- Make "A"'s value 1 or 11 -----*/
    if ((playerCard1["value"] === 1 || playerCard2["value"] === 1) && playerValue < 12) {
        playerValue += 10;
    }

    dealerValue = dealerCard1["value"];
    currentValue.innerHTML = playerValue;

    if (playerValue === 21) {
        hintMessage.innerHTML = "BLACKJACK!";
    } else if (playerValue > 21) {
        hintMessage.innerHTML = "Bust!"
    } else {
        hintMessage.innerHTML = "Hit or Stand?"
    }
    checkWinnerPlayer()
}

function hit(){
    audio.play();
    newCard = deck.pop();
    let hitCard = document.createElement("div");
    hitCard.setAttribute("class", "card");
    hitCard.classList.add(newCard["name"], "new");
    playerCards.appendChild(hitCard);

    /*----- Make "A"'s value 1 or 11 -----*/
    if ((playerCard1["value"] === 1 || playerCard2["value"] === 1 || newCard["value"] === 1) && playerValue < 12) {
        playerValue += 10;
    }

    playerValue += newCard["value"];
    currentValue.innerHTML = playerValue;
    if (playerValue === 21) {
        hintMessage.innerHTML = "BLACKJACK!";
    } else if (playerValue > 21) {
        hintMessage.innerHTML = "Bust!"
    } else {
        hintMessage.innerHTML = "Hit or Stand?"
    }
    checkWinnerPlayer()
};

function stand(){
    audio.play();
    dealerscard2.classList.remove("back-blue");
    newCard = deck.pop();
    dealerscard2.classList.add(newCard["name"]);
    dealerValue += newCard["value"];

    /*----- Make "A"'s value 1 or 11 -----*/
    if ((dealerscard1["value"] === 1 || newCard["value"] === 1) && dealerValue < 12) {
        dealerValue += 10;
    }
    
    if (dealerValue < 17) {
        newCard = deck.pop();
        let dealerhitCard = document.createElement("div");
        dealerhitCard.setAttribute("class", "card");
        dealerhitCard.classList.add(newCard["name"], "new");
        dealerCards.appendChild(dealerhitCard);
        dealerValue += newCard["value"];
    }
    checkWinnerDealer();
};

function restart(){
    audio.play();
    /*----- reset all cards -----*/
    playerscard1.removeAttribute("class");
    playerscard2.removeAttribute("class");
    dealerscard1.removeAttribute("class");
    playerscard1.setAttribute("class", "card");
    playerscard2.setAttribute("class", "card");
    dealerscard1.setAttribute("class", "card");
    dealerscard2.removeAttribute("class");
    dealerscard2.setAttribute("class", "card back-blue");
    
    document.querySelectorAll(".new").forEach(function(poker) {
        poker.remove()
    })
    playerValue = 0;
    dealerValue = 0;
    winnerMessage.innerHTML = "";
    deck = [];

    deal();
};

function checkWinnerPlayer(){
    if (playerValue === 21){
        winnerMessage.innerHTML = "Player";
        playerWin += 1;
        playerWins.innerHTML = playerWin;
    } else if (playerValue > 21){
        winnerMessage.innerHTML = "Dealer";
        dealerWin += 1;
        dealerWins.innerHTML = dealerWin;
    }
};

function checkWinnerDealer(){
    if (dealerValue > 21 || (playerValue < 21 && dealerValue < 21 && playerValue > dealerValue)) {
        winnerMessage.innerHTML = "Player";
        playerWin += 1;
        playerWins.innerHTML = playerWin;
    } else if (dealerValue === 21 || (playerValue < 21 && dealerValue < 21 && playerValue < dealerValue)) {
        winnerMessage.innerHTML = "Dealer";
        dealerWin += 1;
        dealerWins.innerHTML = dealerWin;
    } else if (playerValue < 21 && dealerValue < 21 && playerValue === dealerValue) {
        winnerMessage.innerHTML = "Tie";
        tie += 1;
        ties.innerHTML = tie;
    }
};