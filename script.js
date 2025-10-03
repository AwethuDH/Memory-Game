const cardsArray = [
    { name: "pokemon1", img: "./media/pokemon1.png" },
    { name: "pokemon2", img: "./media/pokemon2.png" },
    { name: "pokemon3", img: "./media/pokemon3.png" },
    { name: "pokemon4", img: "./media/pokemon4.png" },
    { name: "pokemon5", img: "./media/pokemon5.png" },
    { name: "pokemon6", img: "./media/pokemon6.png" },
    { name: "pokemon7", img: "./media/pokemon7.png" },
    { name: "pokemon8", img: "./media/pokemon8.png" },
    { name: "pokemon9", img: "./media/pokemon9.png" },
    { name: "pokemon10", img: "./media/pokemon10.png" },
    { name: "pokemon11", img: "./media/pokemon11.png" },
    { name: "pokemon12", img: "./media/pokemon12.png" },
];


let gameStarted = false;
let firstGuess = "";
let secondGuess = "";
let previousTarget = null;
let count = 0;
let delay = 1200;
let currentPlayer = 1; 
let player1Score = 0;
let player2Score = 0;
let player1Turns = 0;
let player2Turns = 0;
let player1Timer = 6;
let player2Timer = 6;
let player1Name = "";
let player2Name = "";
let winner = "";


const createGameGrid = () => {
    const game = document.getElementById("game");
    const grid = document.createElement("section");
    grid.classList.add("grid");
    game.appendChild(grid);

    let gameGrid = cardsArray.concat(cardsArray);
    gameGrid.sort(() => 0.5 - Math.random());

  
    gameGrid.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card", `${item.name}`);
        card.dataset.name = item.name;
        const front = document.createElement("div");
        front.classList.add("front");
        const back = document.createElement("div");
        back.classList.add("back");
        back.style.backgroundImage = `url(${item.img})`;
        grid.appendChild(card);
        card.appendChild(front);
        card.appendChild(back);
    });

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", handleClick);
    });
};

let sec = 0;
let timeInSec;
let min = 0;
function secCount() {
    sec = sec + 1;
    document.querySelector(".sec-count").innerText = Math.floor(sec % 60);
    timeInSec = setTimeout(secCount, 1000);
    min = Math.floor(sec / 60);
    document.querySelector(".min-count").innerText = min;
}
let timeStarted = false;

const updateScoreboard = () => {
    document.getElementById("player1Score").innerText = player1Score;
    document.getElementById("player2Score").innerText = player2Score;
    document.getElementById("player1Turns").innerText = player1Turns;
    document.getElementById("player2Turns").innerText = player2Turns;
    document.getElementById("player1Timer").innerText = player1Timer;
    document.getElementById("player2Timer").innerText = player2Timer;
};

const updateTimer = () => {
    if (currentPlayer === 1) {
        player1Timer--;
        document.getElementById("player1Timer").innerText = player1Timer;
    } else {
        player2Timer--;
        document.getElementById("player2Timer").innerText = player2Timer;
    }
    if (player1Timer === 0 || player2Timer === 0) {
        switchPlayer();
    }
};

let timerInterval;

const switchPlayer = () => {
    clearInterval(timerInterval);
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    if (currentPlayer === 1) {
        player1Turns++;
        player1Timer = 6;
        document.querySelector(".player1").style.background = "green";
        document.querySelector(".player2").style.background = "#abbcff";
    } else {
        player2Turns++;
        player2Timer = 6;
        document.querySelector(".player2").style.background = "green";
        document.querySelector(".player1").style.background = "#abbcff";
    }
    updateScoreboard();
};

const handleClick = (event) => {
    if (!gameStarted) return;

    if (!timeStarted) {
        secCount();
        timeStarted = true;
    }
    const clicked = event.target;
    if (
        clicked.nodeName === "SECTION" ||
        clicked === previousTarget ||
        clicked.parentNode.classList.contains("selected")
    ) {
        return;
    }
    if (count < 2) {
        count++;
        if (count === 1) {
            firstGuess = clicked.parentNode.dataset.name;
            clicked.parentNode.classList.add("selected");
        } else {
            secondGuess = clicked.parentNode.dataset.name;
            clicked.parentNode.classList.add("selected");
        }
        if (firstGuess !== "" && secondGuess !== "") {
            if (firstGuess === secondGuess) {
                setTimeout(match, delay);
                setTimeout(resetGuesses, delay);
                if (currentPlayer === 1) {
                    player1Score++;
                } else {
                    player2Score++;
                }
                updateScoreboard();
            } else {
                setTimeout(resetGuesses, delay);
                switchPlayer();
            }
        }
    }
    previousTarget = clicked;
};

const match = () => {
    const selected = document.querySelectorAll(".selected");
    selected.forEach((card) => {
        card.classList.add("match");
        card.removeEventListener("click", handleClick);
    });
    checkEndGame();
};

const resetGuesses = () => {
    firstGuess = "";
    secondGuess = "";
    count = 0;
    const selected = document.querySelectorAll(".selected");
    selected.forEach((card) => {
        card.classList.remove("selected");
    });
};

const checkEndGame = () => {
    const matchedCards = document.querySelectorAll('.match');
    if (matchedCards.length === cardsArray.length * 2) {
        endGame();
    }
};

const endGame = () => {
    clearInterval(timerInterval);
    timeStarted = false;
    if (player1Score > player2Score) {
        winner = player1Name;
    } else if (player2Score > player1Score) {
        winner = player2Name;
    } else {
        winner = "Tie";
    }
    Swal.fire({
        title: "Game Over!",
        text: `${winner} wins!`,
        icon: "success",
        confirmButtonText: "Play Again",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        }
    });

    const winnersBoard = document.querySelector(".winners-board");
    const newRow = document.createElement("tr");
    const newData = document.createElement("td");
    newData.innerText = winner;
    newRow.appendChild(newData);
    winnersBoard.appendChild(newRow);
};

const reset = document.querySelector(".reset");
reset.addEventListener("click", () => {
    clearTimeout(timeInSec);
    window.location.reload();
});

document.getElementById("startBtn").addEventListener("click", () => {
    player1Name = document.getElementById("player1Name").value;
    player2Name = document.getElementById("player2Name").value;
    if (player1Name && player2Name) {
        document.querySelector(".player1").innerText = player1Name;
        document.querySelector(".player2").innerText = player2Name;
        document.querySelector(".player1").style.color = "Black";
        document.querySelector(".player1").style.background = "green";
        document.querySelector(".player2").style.background = "#abbcff";
        document.querySelector(".player1").style.border = "2px solid black";
        document.querySelector(".player2").style.border = "none";
        gameStarted = true;
        createGameGrid();
    } else {
        alert("Please enter names for both players.");
    }
});
