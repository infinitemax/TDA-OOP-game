let time = new Date()

console.log(`we are online at ${time}!`)

//#region THE PEOPLE

// basic character class, containing properties that all characters need to have.
class Character {
  constructor(name, descripion, strength, wisdom) {
    this.name = name;
    this.descripion = age;
    this.strength = strength;
    this.wisdom = wisdom;
  }
}

// the player of the game - a character with a health property, and an array for storing weapons.
class Player extends Character {
  constructor(name, descripion, strength, wisdom, currency) {
    super(name, descripion, height, strength, wisdom);
    this.health = 100;
    this.items = [];
    this.currency = currency;
  }
}

// a class of enemies that we might meet
class Enemy extends Character {
  constructor(name, descripion, strength, wisdom, isEnemy, species, weapon) {
    super(name, descripion, strength, wisdom);
    this.isEnemy = isEnemy;
    this.species = species;
    this.weapon = weapon;
  }
}

// a class of non-enemies/friends
class Friend extends Character {
  constructor(
    name,
    descripion,
    strength,
    wisdom,
    isEnemy,
    species,
    itemToGive,
    knowledgeToGive
  ) {
    super(name, descripion, strength, wisdom);
    this.isEnemy = isEnemy;
    this.species = species;
    this.itemToGive = itemToGive;
    this.knowledgeToGive = knowledgeToGive;
  }
}

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

  describe() {
    return `You are in a ${this.name}, which is ${this.description}.`
  }

  move(direction) {
    if (this.linkedPlaces[direction]){
      console.log("direction valid")
      return this.linkedPlaces[direction]
    } else {
      return this
    }
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
    return this._weather
  }
}

class SecretPlace extends Place {
  constructor(name, description) {
    // TODO - make secret place
  }
}
//#endregion

//make some places

const garden = new OutsidePlace("Garden", "not too large, but with lots of lush plants, an ideal home for a slug", "A fine rain is falling")

// garden.weather = "sunshine" ====== this is how we use the setter method to change the weather.

const kitchen = new Place("Kitchen", "reasonablt tidy, with plenty of nooks to explore")
const hallway = new Place("Hallway", "brightly lit, painted white, and with a wobbly wooden floor")
const staircase = new Place("Staircase", "steep and long, covered with a rough carpet made of some kind of plant fibre")
const diningRoom = new Place("Dining Room", "long, with blue walls, a dining set, more than a few cobwebs")
const livingRoom = new Place("Living Room", "dark blue, with a tired looking sofa")


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


const populatePlaceDetails = (place) => {
  // character speaks:
  // check if linked characters obj is empty!
  // if it is, say the room is empty
  // if not, the character says something.
  let characterMessage = "";

  if (Object.keys(place.linkedCharacters).length === 0) {
    characterMessage = `The ${place.name} is empty`
  } else {
    characterMessage = `The ${place.name} contains a .... who looks at you and says ....`
  }

  const placeDetails = "<p>" + place.describe() + "</p>"

  document.getElementById("placeDescription").innerHTML = placeDetails;

}


const startGame = () => {
  let currentRoom = "";
  populatePlaceDetails(garden);

  let command = "";

  const userInput = document.getElementById("userText")

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      command = userInput.value
      console.log(command)
    }
  })

}

startGame()