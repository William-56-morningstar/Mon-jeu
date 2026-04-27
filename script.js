let countries = [];
let usedIndices = [];
let currentCountry = null;
let score = 0;

// Éléments du DOM
const flagImg = document.getElementById('flag-img');
const countryInput = document.getElementById('country-input');
const capitalInput = document.getElementById('capital-input');
const scoreDisplay = document.getElementById('current-score');
const gameContent = document.getElementById('game-content');
const gameOverDiv = document.getElementById('game-over');

// Charger les données des pays
async function loadCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        // On ne garde que les pays qui ont une capitale
        countries = data.filter(c => c.capital && c.name.common);
        startGame();
    } catch (error) {
        console.error("Erreur de chargement :", error);
    }
}

function startGame() {
    score = 0;
    usedIndices = [];
    scoreDisplay.textContent = score;
    gameOverDiv.classList.add('hidden');
    gameContent.classList.remove('hidden');
    nextQuestion();
}

function nextQuestion() {
    if (usedIndices.length === countries.length) {
        alert("Félicitations ! Tu as fini tous les pays !");
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * countries.length);
    } while (usedIndices.includes(randomIndex));

    usedIndices.push(randomIndex);
    currentCountry = countries[randomIndex];
    
    flagImg.src = currentCountry.flags.png;
    countryInput.value = "";
    capitalInput.value = "";
    countryInput.focus();
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);

function checkAnswer() {
    const userCountry = countryInput.value.trim().toLowerCase();
    const userCapital = capitalInput.value.trim().toLowerCase();
    
    // Noms officiels (en anglais par défaut via cette API, ou traductions)
    const correctCountry = currentCountry.name.common.toLowerCase();
    const correctCapital = currentCountry.capital[0].toLowerCase();

    if (userCountry === correctCountry && userCapital === correctCapital) {
        score++;
        scoreDisplay.textContent = score;
        nextQuestion();
    } else {
        // PERDU
        gameContent.classList.add('hidden');
        gameOverDiv.classList.remove('hidden');
        document.getElementById('final-score').textContent = score;
    }
}

// Lancer le chargement
loadCountries();
