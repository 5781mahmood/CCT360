// Lab 6 - Who Shows Up?
// fetch() a niche food-web API, then drive the DOM / visuals / audio with the JSON

let apiURL = "https://wildwillows.app/GameData";

let allAnimals = [];
let filteredAnimals = [];
let currentAnimal = null;

let selectedBiome = "none";
let selectedKind = "any";
let findsCount = 0;
let soundOn = false;

let statusEl = document.getElementById("status");
let biomePick = document.getElementById("biomePick");
let kindPick = document.getElementById("kindPick");
let animalName = document.getElementById("animalName");
let scientific = document.getElementById("scientific");
let animalFact = document.getElementById("animalFact");
let dietLine = document.getElementById("dietLine");
let roleLine = document.getElementById("roleLine");
let resultBox = document.getElementById("resultBox");
let foodBar = document.getElementById("foodBar");
let barLabel = document.getElementById("barLabel");
let creature = document.getElementById("creature");
let listNote = document.getElementById("listNote");
let ambience = document.getElementById("ambience");

let meadowBtn = document.getElementById("meadowBtn");
let forestBtn = document.getElementById("forestBtn");
let wetlandBtn = document.getElementById("wetlandBtn");
let desertBtn = document.getElementById("desertBtn");
let alpineBtn = document.getElementById("alpineBtn");
let coastalBtn = document.getElementById("coastalBtn");

let anyKindBtn = document.getElementById("anyKindBtn");
let mammalBtn = document.getElementById("mammalBtn");
let birdBtn = document.getElementById("birdBtn");
let insectBtn = document.getElementById("insectBtn");

let findBtn = document.getElementById("findBtn");
let againBtn = document.getElementById("againBtn");
let soundBtn = document.getElementById("soundBtn");
let resetBtn = document.getElementById("resetBtn");

let biomeButtons = [meadowBtn, forestBtn, wetlandBtn, desertBtn, alpineBtn, coastalBtn];
let kindButtons = [anyKindBtn, mammalBtn, birdBtn, insectBtn];

// little labels so the circle isn't blank
let kindMarks = {
  mammal: "M",
  bird: "B",
  insect: "I",
  invertebrate: "V",
  reptile: "R",
  amphibian: "A",
  fish: "F"
};

async function getAnimals() {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();

    // the useful array from the JSON
    allAnimals = data.animals;

    statusEl.innerHTML = "Loaded " + allAnimals.length + " species from Wild Willows.";
    console.log("loaded animals:", allAnimals.length);
    console.log("first animal:", allAnimals[0].name);
  } catch (error) {
    statusEl.innerHTML = "Couldn't reach the API. Check your connection and refresh.";
    console.error("Error:", error);
  }
}

function resetBiomeButtons() {
  for (let i = 0; i < biomeButtons.length; i++) {
    biomeButtons[i].style.backgroundColor = "#eeeeee";
  }
}

function resetKindButtons() {
  for (let i = 0; i < kindButtons.length; i++) {
    kindButtons[i].style.backgroundColor = "#eeeeee";
  }
}

function setBiome(biome, btn) {
  selectedBiome = biome;
  biomePick.innerHTML = "Habitat: " + biome;
  resetBiomeButtons();
  btn.style.backgroundColor = "#c8d9c8";
  updateFilter();
  console.log("biome = " + selectedBiome);
}

function setKind(kind, btn) {
  selectedKind = kind;

  if (kind === "any") {
    kindPick.innerHTML = "Kind: any";
  } else {
    kindPick.innerHTML = "Kind: " + kind;
  }

  resetKindButtons();
  btn.style.backgroundColor = "#c8d9c8";
  updateFilter();
  console.log("kind = " + selectedKind);
}

function updateFilter() {
  filteredAnimals = [];

  // loop through the array from the API (class 6 vibes)
  for (let i = 0; i < allAnimals.length; i++) {
    let a = allAnimals[i];
    let biomeOk = false;
    let kindOk = false;

    if (selectedBiome === "none" || a.biome === selectedBiome) {
      biomeOk = true;
    }

    if (selectedKind === "any" || a.kind === selectedKind) {
      kindOk = true;
    }

    if (biomeOk === true && kindOk === true) {
      filteredAnimals.push(a);
    }
  }

  listNote.innerHTML = "Matching animals: " + filteredAnimals.length;
}

function countLinks(list) {
  // eats[] sometimes has objects mixed in, so count carefully
  let total = 0;

  if (!list) {
    return 0;
  }

  for (let i = 0; i < list.length; i++) {
    total = total + 1;
  }

  return total;
}

function showAnimal(animal) {
  currentAnimal = animal;
  findsCount = findsCount + 1;

  let eatsCount = countLinks(animal.eats) + countLinks(animal.eatsOther);
  let eatenCount = countLinks(animal.eatenBy);
  let webSize = eatsCount + eatenCount;

  animalName.innerHTML = animal.name + " (" + animal.rarity + ")";
  scientific.innerHTML = animal.scientificName;
  animalFact.innerHTML = animal.fact;
  dietLine.innerHTML = "Diet: " + animal.diet;
  roleLine.innerHTML = "Role: " + animal.trophic + " · " + animal.kind + " · shelter: " + animal.shelter;

  // Example 2 style - turn a number into a bar height/width
  let barWidth = webSize * 18;
  if (barWidth > 520) {
    barWidth = 520;
  }
  if (barWidth < 20) {
    barWidth = 20;
  }
  foodBar.style.width = barWidth + "px";
  barLabel.innerHTML = "eats: " + eatsCount + " | eaten by: " + eatenCount + " | food-web score: " + webSize;

  // Example 3 - swap body class from the biome in the JSON
  document.body.className = "biome-" + animal.biome;

  // result box colour by rarity
  if (animal.rarity === "rare") {
    resultBox.style.backgroundColor = "#e8e0ef";
  } else if (animal.rarity === "uncommon") {
    resultBox.style.backgroundColor = "#e7efe0";
  } else {
    resultBox.style.backgroundColor = "#f7f7f7";
  }

  // Example 4-ish - filter on the creature based on rarity / trophic
  let mark = kindMarks[animal.kind];
  if (!mark) {
    mark = "?";
  }
  creature.innerHTML = mark;

  if (animal.kind === "bird") {
    creature.style.backgroundColor = "#d7e6f5";
  } else if (animal.kind === "mammal") {
    creature.style.backgroundColor = "#e8dcc8";
  } else if (animal.kind === "insect") {
    creature.style.backgroundColor = "#e5efc8";
  } else {
    creature.style.backgroundColor = "#d9d9d9";
  }

  let gray = 0;
  let bright = 100;
  if (animal.rarity === "rare") {
    gray = 35;
    bright = 75;
  } else if (animal.rarity === "uncommon") {
    gray = 15;
    bright = 90;
  }
  creature.style.filter = "grayscale(" + gray + "%) brightness(" + bright + "%)";

  // Example 5 - motion from trophic level
  let shift = webSize * 8;
  if (shift > 160) {
    shift = 160;
  }

  let spin = 0;
  if (animal.trophic === "apex-predator") {
    spin = 180;
  } else if (animal.trophic === "mesopredator") {
    spin = 90;
  } else if (animal.trophic === "herbivore") {
    spin = 20;
  } else {
    spin = 45;
  }

  creature.style.transform = "translateX(" + shift + "px) rotate(" + spin + "deg)";

  // Example 6 - audio volume from food-web busyness
  // browsers block autoplay so this only matters after Play soundscape
  let volume = webSize / 25;
  if (volume > 1) {
    volume = 1;
  }
  if (volume < 0.15) {
    volume = 0.15;
  }
  ambience.volume = volume;

  // slightly change playback speed for predators
  let rate = 0.8;
  if (animal.trophic === "apex-predator") {
    rate = 1.35;
  } else if (animal.trophic === "mesopredator") {
    rate = 1.1;
  } else if (animal.trophic === "herbivore") {
    rate = 0.75;
  }
  ambience.playbackRate = rate;

  statusEl.innerHTML = "Showing visitor #" + findsCount + " · volume set to " + volume.toFixed(2);
  console.log("showing", animal.name, animal.biome, animal.trophic);
}

function findVisitor() {
  if (allAnimals.length === 0) {
    alert("Still loading (or the API failed). Wait a sec and try again.");
    return;
  }

  if (selectedBiome === "none") {
    alert("Pick a habitat first.");
    return;
  }

  updateFilter();

  if (filteredAnimals.length === 0) {
    alert("Nothing matched that combo. Try a different kind or habitat.");
    return;
  }

  // random pick from the filtered array
  let index = Math.floor(Math.random() * filteredAnimals.length);
  showAnimal(filteredAnimals[index]);
}

function toggleSound() {
  if (soundOn === false) {
    // set a starter volume if they haven't found anyone yet
    if (currentAnimal === null) {
      ambience.volume = 0.35;
      ambience.playbackRate = 1;
    }

    ambience.play();
    soundOn = true;
    soundBtn.innerHTML = "Stop soundscape";
    console.log("sound on, volume = " + ambience.volume);
  } else {
    ambience.pause();
    soundOn = false;
    soundBtn.innerHTML = "Play soundscape";
    console.log("sound off");
  }
}

function resetAll() {
  let answer = confirm("Clear the visitor and start over?");

  if (answer === false) {
    return;
  }

  selectedBiome = "none";
  selectedKind = "any";
  currentAnimal = null;
  findsCount = 0;
  filteredAnimals = [];

  biomePick.innerHTML = "Habitat: not picked yet";
  kindPick.innerHTML = "Kind: any";
  animalName.innerHTML = "Waiting...";
  scientific.innerHTML = "";
  animalFact.innerHTML = "Pick a habitat, then hit Find a visitor.";
  dietLine.innerHTML = "";
  roleLine.innerHTML = "";
  barLabel.innerHTML = "eats: 0 | eaten by: 0";
  listNote.innerHTML = "Matching animals: 0";
  statusEl.innerHTML = "Loaded " + allAnimals.length + " species from Wild Willows.";

  foodBar.style.width = "0px";
  resultBox.style.backgroundColor = "#f7f7f7";
  document.body.className = "biome-none";

  creature.innerHTML = "?";
  creature.style.backgroundColor = "#cfcfcf";
  creature.style.filter = "none";
  creature.style.transform = "translateX(0px) rotate(0deg)";

  resetBiomeButtons();
  resetKindButtons();
  anyKindBtn.style.backgroundColor = "#c8d9c8";

  if (soundOn === true) {
    ambience.pause();
    ambience.currentTime = 0;
    soundOn = false;
    soundBtn.innerHTML = "Play soundscape";
  }

  console.log("reset");
}

meadowBtn.addEventListener("click", function () {
  setBiome("meadow", meadowBtn);
});

forestBtn.addEventListener("click", function () {
  setBiome("forest", forestBtn);
});

wetlandBtn.addEventListener("click", function () {
  setBiome("wetland", wetlandBtn);
});

desertBtn.addEventListener("click", function () {
  setBiome("desert", desertBtn);
});

alpineBtn.addEventListener("click", function () {
  setBiome("alpine", alpineBtn);
});

coastalBtn.addEventListener("click", function () {
  setBiome("coastal", coastalBtn);
});

anyKindBtn.addEventListener("click", function () {
  setKind("any", anyKindBtn);
});

mammalBtn.addEventListener("click", function () {
  setKind("mammal", mammalBtn);
});

birdBtn.addEventListener("click", function () {
  setKind("bird", birdBtn);
});

insectBtn.addEventListener("click", function () {
  setKind("insect", insectBtn);
});

findBtn.addEventListener("click", findVisitor);
againBtn.addEventListener("click", findVisitor);
soundBtn.addEventListener("click", toggleSound);
resetBtn.addEventListener("click", resetAll);

// default kind button look
anyKindBtn.style.backgroundColor = "#c8d9c8";

// kick off the fetch when the page loads
getAnimals();
