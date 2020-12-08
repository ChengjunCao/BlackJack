/*----- constants -----*/
const suits = ["c", "d", "h", "s"];
const ranks = ["02", "03", "04", "05", "06", "07", "08", "09", "10", "J", "Q", "K", "A"];
const deck = [];


/*----- app's state (variables) -----*/

let playerValue;
let dealerValue;
let winner;
let newCard;
let playerCard1;
let playerCard2;
let dealerCard1;
let newDeck = [];

/*----- cached element references -----*/

let playButton = document.getElementById("play");
let board = document.getElementById("board");
let hitButton = document.getElementById("hit");
let standButton = document.getElementById("stand");
let restartButton = document.getElementById("restart");
let statusMessage = document.getElementById("status-message");
let currentValue = document.getElementById("current-value");
let winnerMessage = document.getElementById("winner");
let playerCards = document.getElementById("player-cards");
let dealerCards = document.getElementById("dealer-cards");
let playerscard1 = document.getElementById("player-card1");
let playerscard2 = document.getElementById("player-card2");
let dealerscard1 = document.getElementById("dealer-card1");
let dealerscard2 = document.getElementById("dealer-card2");

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
                value = 11;
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
    for (let x=0; x<deck.length; x++) {
        newDeck.push(deck[Math.floor(Math.random() * deck.length)])
    }
    return newDeck;
}

function play(){
    createDeck();
    playButton.classList.add("hidden");
    board.classList.remove("hidden");
    deal();
};

function deal(){
    shuffleCards();

    playerCard1 = newDeck.pop();
    playerCard2 = newDeck.pop();
    dealerCard1 = newDeck.pop();

    playerscard1.classList.add(playerCard1["name"])
    playerscard2.classList.add(playerCard2["name"])
    dealerscard1.classList.add(dealerCard1["name"])
    
    playerValue = playerCard1["value"] + playerCard2["value"];
    dealerValue = dealerCard1["value"];
    currentValue.innerHTML = playerValue;

    checkWinnerPlayer()
}

function hit(){
    newCard = newDeck.pop();
    let hitCard = document.createElement("div");
    hitCard.setAttribute("class", "card");
    hitCard.classList.add(newCard["name"], "new");
    playerCards.appendChild(hitCard);
    playerValue += newCard["value"];
    currentValue.innerHTML = playerValue;
    checkWinnerPlayer()
};

function stand(){
    dealerscard2.classList.remove("back-blue");
    newCard = newDeck.pop();
    dealerscard2.classList.add(newCard["name"]);
    dealerValue += newCard["value"];
    if (dealerValue < 17) {
        newCard = newDeck.pop();
        let dealerhitCard = document.createElement("div");
        dealerhitCard.setAttribute("class", "card");
        dealerhitCard.classList.add(newCard["name"], "new");
        dealerCards.appendChild(dealerhitCard);
        dealerValue += newCard["value"];
    }
    checkWinnerDealer();
};

function restart(){
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
    newDeck = [];
    playerValue = 0;
    dealerValue = 0;
    winnerMessage.innerHTML = "";

    deal();
};

function checkWinnerPlayer(){
    if (playerValue === 21){
        winnerMessage.innerHTML = "Player"
    } else if (playerValue > 21){
        winnerMessage.innerHTML = "Dealer"
    }
};

function checkWinnerDealer(){
    if (dealerValue > 21 || (playerValue < 21 && dealerValue < 21 && playerValue > dealerValue)) {
        winnerMessage.innerHTML = "Player"
    } else if (dealerValue === 21 || (playerValue < 21 && dealerValue < 21 && playerValue < dealerValue)) {
        winnerMessage.innerHTML = "Dealer"
    } else if (playerValue < 21 && dealerValue < 21 && playerValue === dealerValue) {
        winnerMessage.innerHTML = "Tie"
    }
};