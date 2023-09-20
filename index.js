let time = new Date();

console.log(`we are online at ${time}!`);

//#region THE PEOPLE

// basic character class, containing properties that all characters need to have.
class Character {
  constructor(name, description, strength, wisdom) {
    this.name = name;
    this.description = description;
    this.strength = strength;
    this.wisdom = wisdom;
    this.isEnemy;
  }
}

// the player of the game - a character with a health property, and an array for storing weapons.
class Player extends Character {
  constructor(name, description, strength, wisdom, currency) {
    super(name, description, strength, wisdom);
    this.moisture = 10;
    this.items = [];
    this.currency = currency;
    this.isEnemy = false;
    this.dryOutRate = 5;
    this.endConditions = {
      driedOut: "You ran out of moisture, causing you to fall into a state of suspended animation. Later that evening a human picks you up and puts you back in the garden.",
      captured : "You were unable to escape the human, who scooped you up and took you back outside."
    }
  }


  // methods

  giveName() {
    return this.name;
  }

  giveMoisture() {
    return this.moisture.toString();
  }

  giveDescription() {
    return this.description;
  }

  // giveItems() {
  //   let itemList = "";
  //   if (this.items.length < 2) {
  //     itemList += this.items[0].name;
  //   } else {
  //     this.items.forEach(item => {
        
  //     })
  //   }
  // }

  populatePlayerDetails() {
    
  // display name
    const playerName = this.giveName();

    document.getElementById("playerName").innerHTML = playerName;

    // display moisture level
    document.getElementById("playerMoisture").innerHTML = this.giveMoisture();

    // display items
    // TODO......

    // display description
    document.getElementById("playerDescription").innerHTML = this.giveDescription();
  }

  dryOut() {
    this.moisture -= this.dryOutRate;
    
    if (this.moisture === 0) {
      gameOver(this.endConditions.driedOut);
    }


  }




}

// a class of enemies that we might meet
class Enemy extends Character {
  constructor(name, description, strength, wisdom, species, weapon) {
    super(name, description, strength, wisdom);
    this.isEnemy = true;
    this.species = species;
    this.weapon = weapon;
  }
}

// a class of non-enemies/friends
class Friend extends Character {
  constructor(
    name,
    description,
    strength,
    wisdom,
    species,
    itemToGive,
    knowledgeToGive
  ) {
    super(name, description, strength, wisdom);
    this.isEnemy = false;
    this.species = species;
    this.itemToGive = itemToGive;
    this.knowledgeToGive = knowledgeToGive;
  }
}

// create people

const player = new Player("Aspen", "An optimistic slug with a head full of dreams", 10, 10, 10)

//#endregion

//#region THE PLACES AND THINGS

class Place {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.linkedPlaces = {};
    this.linkedItems = [];
    this.linkedCharacters = [];
  }

  linkPlace(direction, place) {
    this.linkedPlaces[direction] = place;
  }

  linkItem(item) {
    this.linkedItems.push(item);
  }

  describePlace() {
    return `You are in a ${this.name}, which is ${this.description}.`;
  }

  describeItems() {
    if (this.linkedItems.length === 0) {
      return "There appears to be nothing of value here.";
    } else {
      return `You can see a ${this.linkedItems[0].name} which looks like it might be useful.`;
    }
  }

  describeCharacters() {
    if (Object.keys(this.linkedCharacters).length === 0) {
      return `You are alone`;
    } else {
      return `The ${this.name} contains a .... who looks at you and says ....`;
    }
  }

  describeExits() {
    let exits = Object.keys(this.linkedPlaces);
    let exitDescription = "";

    exits.forEach((exit) => {
      let placeFromExit = this.linkedPlaces[exit].name;
      exitDescription += `<p>To the <strong>${exit}</strong> there is a ${placeFromExit}</p>`;
    });

    return exitDescription;
  }

  // a command method that takes the player input and uses it to move() the player.
  command() {

    let command = "";
    const directions = ["north", "south", "east", "west"];

    const userInput = document.getElementById("userText");

    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        command = userInput.value.toLowerCase();
        console.log(command);
        if (directions.includes(command)) {
          currentRoom = currentRoom.move(command);
          currentRoom.populatePlaceDetails();
          player.populatePlayerDetails();
          userInput.value = "";
        } else {
          alert(
            "Invalid command, please input 'north', 'south', 'east' or 'west'"
          );
          userInput.value = "";
        }
      }
    });
  }

  // a move method, moves the player to a valid place, called by command() method.
  move(direction) {
    if (this.linkedPlaces[direction]) {
      console.log("direction valid");
      player.dryOut();
      return this.linkedPlaces[direction];
    } else {
      alert("the way is blocked, try again");
      player.dryOut();
      return this;
    }
    
  }

  // a method to populate the html, based on the current place
  populatePlaceDetails() {
    // describe the place
    const placeDetails = "<p>" + this.describePlace() + "</p>";

    document.getElementById("placeDescription").innerHTML = placeDetails;

    //describe the items

    const itemDetails = "<p>" + this.describeItems() + "</p>";

    document.getElementById("itemDescription").innerHTML = itemDetails;

    // describe the characters

    const characterDetails = "<p>" + this.describeCharacters() + "</p>";

    document.getElementById("characterDescription").innerHTML =
      characterDetails;

    // describe the exits

    const exitDetails = this.describeExits();

    document.getElementById("exitsDescription").innerHTML = exitDetails;
  }
}

class OutsidePlace extends Place {
  constructor(name, description, weather) {
    super(name, description);
    this._weather = weather;
  }

  set weather(value) {
    this._weather = value;
  }

  get weather() {
    return this._weather;
  }
}

class SecretPlace extends Place {
  constructor(name, description) {
    // TODO - make secret place
  }
}

//make some places

const garden = new OutsidePlace(
  "Garden",
  "not large, but contains many lush plants: an ideal home for a slug",
  "A fine rain is falling"
);

// garden.weather = "sunshine" ====== this is how we use the setter method to change the weather.

const kitchen = new Place(
  "Kitchen",
  "reasonably tidy, with plenty of nooks to explore"
);
const hallway = new Place(
  "Hallway",
  "brightly lit, painted white, with a wobbly wooden floor"
);
const staircase = new Place(
  "Staircase",
  "steep and long, covered with a rough carpet made of some kind of plant fibre"
);
const diningRoom = new Place(
  "Dining Room",
  "long, with blue walls, a dining set, more than a few cobwebs"
);
const livingRoom = new Place(
  "Living Room",
  "dark blue, with a tired looking sofa"
);

// link the places

garden.linkPlace("east", kitchen);
kitchen.linkPlace("west", garden);
kitchen.linkPlace("south", hallway);
hallway.linkPlace("north", kitchen);
hallway.linkPlace("west", diningRoom);
hallway.linkPlace("east", staircase);
staircase.linkPlace("west", hallway);
diningRoom.linkPlace("east", hallway);
diningRoom.linkPlace("south", livingRoom);
livingRoom.linkPlace("north", diningRoom);

//#endregion

//#region THE ITEMS

class Item {
  constructor(name, effect) {
    this.name = name;
    this.effect = effect;
  }
}

// make some items

const key = new Item("key", "unlocking");
const salt = new Item("sparkling substance", "fatal")

// link the items
garden.linkItem(key);
kitchen.linkItem(salt);


//#endregion

// PLAYING THE GAME

let currentRoom = garden;

const startGame = () => {
  // populate the screen
  currentRoom.populatePlaceDetails();
  player.populatePlayerDetails();
  

  currentRoom.command();
};

const gameOver = (condition) => {
  const gameText = document.querySelectorAll(".gamePlay")

  gameText.forEach(e => {
    e.classList.add("hidden");
  })
  
  document.getElementById("gameEndText").innerHTML = `Your game is over. ${condition}`
  
  document.getElementById("restartButton").classList.remove("hidden");

  
}


startGame();

