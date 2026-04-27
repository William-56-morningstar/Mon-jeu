let countries = [];
let usedIndices = [];
let currentCountry = null;
let score = 0;

const flagImg = document.getElementById('flag-img');
const countryInput = document.getElementById('country-input');
const capitalInput = document.getElementById('capital-input');
const scoreDisplay = document.getElementById('current-score');
const gameContent = document.getElementById('game-content');
const gameOverDiv = document.getElementById('game-over');

// 1. Charger les pays avec une meilleure gestion d'erreur
async function loadCountries() {
    try {
        // On utilise l'API complète
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,translations');
        const data = await response.json();
        
        // Filtrer les pays qui ont bien une capitale et un drapeau
        countries = data.filter(c => c.capital && c.capital.length > 0 && c.flags);
        
        console.log("Pays chargés :", countries.length);
        startGame();
    } catch (error) {
        console.error("Erreur API :", error);
        alert("Erreur de connexion à l'API des drapeaux.");
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
    if (countries.length === 0) return;

    if (usedIndices.length >= countries.length || usedIndices.length >= 124) {
        alert("Incroyable ! Tu as parcouru tous les drapeaux !");
        startGame();
        return;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * countries.length);
    } while (usedIndices.includes(randomIndex));

    usedIndices.push(randomIndex);
    currentCountry = countries[randomIndex];
    
    // Priorité au SVG pour la netteté, sinon PNG
    flagImg.src = currentCountry.flags.svg || currentCountry.flags.png;
    
    // Réinitialiser les champs
    countryInput.value = "";
    capitalInput.value = "";
    countryInput.focus();
}

// 2. Vérification flexible (Anglais ou Français)
function checkAnswer() {
    const userCountry = countryInput.value.trim().toLowerCase();
    const userCapital = capitalInput.value.trim().toLowerCase();
    
    if (!currentCountry) return;

    // Noms possibles en Français et Anglais
    const nameFR = currentCountry.translations?.fra?.common?.toLowerCase();
    const nameEN = currentCountry.name.common.toLowerCase();
    const capitalCorrect = currentCountry.capital[0].toLowerCase();

    // On gagne si le nom est bon (FR ou EN) ET la capitale est bonne
    const isCountryCorrect = (userCountry === nameFR || userCountry === nameEN);
    const isCapitalCorrect = (userCapital === capitalCorrect);

    if (isCountryCorrect && isCapitalCorrect) {
        score++;
        scoreDisplay.textContent = score;
        nextQuestion();
    } else {
        // Affichage de l'écran de défaite
        gameContent.classList.add('hidden');
        gameOverDiv.classList.remove('hidden');
        document.getElementById('final-score').textContent = score;
    }
}

// Écouteur sur le bouton
document.getElementById('submit-btn').addEventListener('click', checkAnswer);

// Permettre de valider avec la touche "Entrée"
window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") checkAnswer();
});

loadCountries();
