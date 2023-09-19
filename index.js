let time = new Date()

console.log(`we are online at ${time}!`)

//#region THE PEOPLE

// basic character class, containing properties that all characters need to have.
class Character {
  constructor(name, descripion, strength, wisdom) {
    this.name = name;
    this.descripion = descripion;
    this.strength = strength;
    this.wisdom = wisdom;
    this.isEnemy;
  }
}

// the player of the game - a character with a health property, and an array for storing weapons.
class Player extends Character {
  constructor(name, descripion, strength, wisdom, currency) {
    super(name, descripion, height, strength, wisdom);
    this.health = 100;
    this.items = [];
    this.currency = currency;
    this.isEnemy = false;
  }
}

// a class of enemies that we might meet
class Enemy extends Character {
  constructor(name, descripion, strength, wisdom, species, weapon) {
    super(name, descripion, strength, wisdom);
    this.isEnemy = true;
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
    species,
    itemToGive,
    knowledgeToGive
  ) {
    super(name, descripion, strength, wisdom);
    this.isEnemy = false;
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

  linkItem(item) {
    this.linkedItems.push(item)
  }

  describePlace() {
    return `You are in a ${this.name}, which is ${this.description}.`
  }

  describeExits(place) {
    console.log(this.linkedPlaces)
  }

  

  // a command method that takes the player input and uses it to move() the player.
  command() {
    let command = "";
    const directions = ["north", "south", "east", "west"]
  
    const userInput = document.getElementById("userText")
    
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        command = userInput.value.toLowerCase()
        console.log(command)
        if (directions.includes(command)){
          currentRoom = currentRoom.move(command)
          currentRoom.populatePlaceDetails();
          userInput.value = "";
        } else {
          alert("Invalid command, please input 'north', 'south', 'east' or 'west'")
        }
      }
    })
  }

  // a move method, moves the player to a valid place, called by command() method.
  move(direction) {
    if (this.linkedPlaces[direction]){
      console.log("direction valid")
      return this.linkedPlaces[direction]
    } else {
      alert("the way is blocked, try again")
      return this
    }
  }

  // a method to populate the html, based on the current room
  populatePlaceDetails() {
    // describe the place
    const placeDetails = "<p>" + this.describePlace() + "</p>"
  
    document.getElementById("placeDescription").innerHTML = placeDetails;
  
    //describe the items




    // character speaks:
    // check if linked characters obj is empty!
    // if it is, say the room is empty
    // if not, the character says something.
    let characterMessage = "";
  
    if (Object.keys(this.linkedCharacters).length === 0) {
      characterMessage = `The ${this.name} is empty`
    } else {
      characterMessage = `The ${this.name} contains a .... who looks at you and says ....`
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

//#endregion


//#region THE ITEMS

class Item {
  constructor(name, power){
    this.name = name;
    this.powers = power;
  }
}

// make some items

const key = new Item ("key", "unlocking")


// link the items
garden.linkItem(key);


//#endregion



// PLAYING THE GAME

let currentRoom = garden;

const startGame = () => {
  currentRoom.populatePlaceDetails();

  currentRoom.command()

}

startGame()