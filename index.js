let time = new Date();
console.log(`we are online at ${time}!`);

// set userInput field
const userInput = document.getElementById("userText");

// 
const userNameInput = document.getElementById("nameInput");
let userName = "";

const startButtonPush = (name) => {
  
  document.getElementById("welcomePage").classList.add("hidden")
  document.getElementById("gamearea").classList.remove("hidden")

  // console.log(name)

  // if(name === "") {
  //   alert("Please enter your name")
  // }
  
  // username is saved
  // userName = name;
  // username is addd to relevant bits

  // intro screen hides

  // game is started
};

document.getElementById("goButton").addEventListener("click", startButtonPush)

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
    this.moisture = 100;
    this.items = [];
    this.currency = currency;
    this.isEnemy = false;
    this.dryOutRate = 5;
    this.hasDiscoBall = false;
    this.hasPartyLight = false;
    this.endConditions = {
      driedOut:
        "You run out of moisture, causing you to fall into a state of suspended animation. Later that evening a human picks you up and puts you back in the garden.",
      captured:
        "You were unable to escape the human, who scooped you up and took you outside. You will need to recuperate before trying again.",
    };
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

  giveItems() {
    let itemDescription = "";

    player.items.forEach((item) => {
      itemDescription += `<p>${item.name}</p>`;
    });

    return itemDescription;
  }

  populatePlayerDetails() {
    // display name
    const playerName = this.giveName();

    document.getElementById("playerName").innerHTML = playerName;

    // display moisture level
    document.getElementById("playerMoisture").innerHTML = this.giveMoisture();

    // display items
    // TODO......
    document.getElementById("playerItems").innerHTML = this.giveItems();

    // display description
    document.getElementById("playerDescription").innerHTML =
      this.giveDescription();
  }

  dryOut() {
    this.moisture -= this.dryOutRate;

    if (this.moisture <= 0) {
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

const player = new Player(
  "Aspen",
  "An optimistic slug with a head full of dreams",
  10,
  10,
  10
);

//#endregion

//#region THE PLACES AND THINGS

class Place {
  constructor(name, description, entrance) {
    this.name = name;
    this.description = description;
    this.entrance = entrance;
    this.hasBeenVisited = false;
    this.linkedPlaces = {};
    this.linkedItems = [];
    this.linkedCharacters = [];
    this.actions = ["move", "collect"];
    this.directions = ["north", "south", "east", "west"];
  }

  linkPlace(direction, place) {
    this.linkedPlaces[direction] = place;
  }

  linkItem(item) {
    this.linkedItems.push(item);
  }

  describePlace() {
    return `You are in a ${this.name}, which is ${this.description}`;
  }

  describeItems() {
    if (this.linkedItems.length === 0) {
      return "There appears to be nothing of value here.";
    } else {
      return `You can see a ${this.linkedItems[0].appearance} <strong>thing</strong>, which looks like it might be useful to <strong>collect</strong>.`;
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
      let entrance = this.linkedPlaces[exit].entrance;
      let furtherExitDetails = "";
      let placeThroughExit = this.linkedPlaces[exit].name;

      // if player is on staircase OR if linked place is staircase, don't use entrance words.
      if (this.name === "Staircase" || placeThroughExit === "Staircase") {
        exitDescription += `<p>To the <strong>${exit}</strong> there is a ${placeThroughExit}</p>`;
      } else {
        // if a place has been visited, use it's name in directions list
        if (this.linkedPlaces[exit].hasBeenVisited) {
          furtherExitDetails = ` to the ${placeThroughExit}`;
        }

        exitDescription += `<p>To the <strong>${exit}</strong> there is a ${entrance}${furtherExitDetails}</p>`;
      }
    });

    return exitDescription;
  }

  // a command method that takes the player input and uses it to control the player (move(), collect() etc). At the moment it sits within teh place object, which I think is wrong, it should probably sit in an overall game object which contains all the other objects as well as the overall controller methods.
  command() {
    // get command
    let command = "";
    userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // get command
        command = userInput.value.toLowerCase();

        //split into array of commands
        const commandArray = command.split(" ");
        const action = commandArray[0];
        const focus = commandArray[1];

        //check command has two words and if it does, whether it contains a valid action
        if (commandArray.length != 2) {
          alert(
            "invalid command, you must include an action and a target, e.g. 'move west' etc."
          );
        } else if (!this.actions.includes(action)) {
          alert("invalid action, try 'move' or 'collect'");
        } else if (
          currentRoom.name === "Kitchen" &&
          focus === "west" &&
          garden.weather["canGoOutside"] === false
        ) {
          alert(
            "You cannot go outside in this weather. You must wait until it starts raining."
          );
        } else {
          goController(action, focus);
        }

        // at end of turn, update place and player details.
        player.dryOut();
        garden.changeWeather();
        currentRoom.populatePlaceDetails();
        player.populatePlayerDetails();
        userInput.value = "";

        if (
          currentRoom.name === "Garden" &&
          player.hasDiscoBall === true &&
          player.hasPartyLight
        ) {
          youWin();
          return;
        }

        return this;
      }
    });
  }

  // a move method, moves the player to a valid place, called by command() method.
  move(direction) {
    if (!this.directions.includes(direction)) {
      alert(
        "Invalid direction, please input 'north', 'south', 'east' or 'west'"
      );
      userInput.value = "";
      return this;
    }

    if (this.linkedPlaces[direction]) {
      currentRoom = this.linkedPlaces[direction];
      currentRoom.hasBeenVisited = true;
    } else {
      alert("the way is blocked, try again");
    }
    return this;
  }

  // A function to collect an item and instigate its action, either it goes into our items array or it does something to the player.
  collect() {
    if (currentRoom.linkedItems.length === 0) {
      alert("there are no items that you can collect");
    } else {
      let collectedItemArray = currentRoom.linkedItems.splice(0);

      // if salt is collected, dry out rate increases
      if (collectedItemArray[0].name === "salt") {
        player.dryOutRate = 10;
      }

      // if water is collected, moisture replenished, dryout rate normal
      if (collectedItemArray[0].name === "water") {
        player.dryOutRate = 5;
        player.moisture += 25;

        // water removes salt from items
        const saltIndex = player.items.findIndex(
          (item) => item.name === "salt"
        );
        if (saltIndex != -1) {
          player.items.splice(saltIndex, 1);
        }
      }

      if (collectedItemArray[0].name === "disco ball") {
        player.hasDiscoBall = true;
      }

      if (collectedItemArray[0].name === "party light") {
        player.hasPartyLight = true;
      }

      // alert to say we've collected it and what the impact is
      alert(collectedItemArray[0].message);
      // push it to player's items array
      player.items.push(collectedItemArray[0]);
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

    // give weather report

    const weather = garden.weather["currentWeather"];

    document.getElementById("weatherReport").innerHTML = weather;
  }
}

class OutsidePlace extends Place {
  constructor(name, description, entrance) {
    super(name, description, entrance);
    this.hasBeenVisited = true;
    this.weatherOptions = [
      {
        currentWeather: "a fine rain is falling",
        canGoOutside: true,
      },
      {
        currentWeather: "the rain is comming down fast",
        canGoOutside: true,
      },
      {
        currentWeather: "the sun is shining",
        canGoOutside: false,
      },
      {
        currentWeather: "it is clear and bright",
        canGoOutside: false,
      },
    ];

    this.weather = this.weatherOptions[0];
  }

  changeWeather() {
    // generate random number
    let num = Math.floor(Math.random() * 4);

    // update this weather with random number
    this.weather = this.weatherOptions[num];
  }

  // set weather(value) {
  //   this._weather = value;
  // }

  // get weather() {
  //   return this._weather;
  // }
}

class SecretPlace extends Place {
  constructor(name, description) {
    // TODO - make secret place
  }
}

//make some places

const garden = new OutsidePlace(
  "Garden",
  "not large, but contains many lush plants: an ideal home for a slug.",
  "doorway"
);
const kitchen = new Place(
  "Kitchen",
  "reasonably tidy, with plenty of nooks to explore.",
  "doorway"
);
const hallway = new Place(
  "Hallway",
  "brightly lit, painted white, with a wobbly wooden floor.",
  "doorway"
);
const staircase = new Place(
  "Staircase",
  "steep and long, covered with a rough carpet made of some kind of plant fibre.",
  "staircase"
);
const diningRoom = new Place(
  "Dining Room",
  "long, with blue walls, a dining set, more than a few cobwebs.",
  "doorway"
);
const livingRoom = new Place(
  "Living Room",
  "dark blue, with a tired looking sofa.",
  "doorway"
);
const landing = new Place(
  "Landing",
  "long, with a high ceiling. There isn't much more to say about landings is there?",
  "doorway"
);
const bathroom = new Place(
  "bathroom",
  "well lit, with a bath, shower, basin and mirror, though you're not tall enough to look at your reflection.",
  "doorway"
);
const office = new Place(
  "office",
  "messy, with a desk, computer, laundry and all manner of other bits and pieces. How does anyone get any work done in here?",
  "doorway"
);
const bedroom = new Place(
  "bedroom",
  "a large bedroom, with dark blue walls and a big window overlooking a quiet road.",
  "doorway"
);

// link the places

garden.linkPlace("east", kitchen);
kitchen.linkPlace("west", garden);
kitchen.linkPlace("south", hallway);
hallway.linkPlace("north", kitchen);
hallway.linkPlace("west", diningRoom);
hallway.linkPlace("east", staircase);
staircase.linkPlace("west", hallway);
staircase.linkPlace("north", landing);
diningRoom.linkPlace("east", hallway);
diningRoom.linkPlace("south", livingRoom);
livingRoom.linkPlace("north", diningRoom);

landing.linkPlace("east", staircase);
landing.linkPlace("north", bathroom);
bathroom.linkPlace("south", landing);
landing.linkPlace("west", office);
office.linkPlace("east", landing);
landing.linkPlace("south", bedroom);
bedroom.linkPlace("north", landing);

//#endregion

//#region THE ITEMS

class Item {
  constructor(name, appearance, message) {
    this.name = name;
    this.appearance = appearance;
    this.message = message;
  }
}

// make some items

const key = new Item(
  "key",
  "metal",
  "Oh, it a key. It's heavy and I'm not sure whether I can lift it into a keyhole"
);
const salt = new Item(
  "salt",
  "sparkling",
  "Oh gosh, that was salt - I think I'm drying out faster, I'd better find some water"
);
const water = new Item("water", "wet and shiny", "Aha, some water! Yum!");
const discoBall = new Item(
  "disco ball",
  "glittering",
  "Yes! This is what I was looking for!"
);
const partyLight = new Item(
  "party light",
  "flashing",
  "Brilliant! Now we can get the party started!"
);

// link the items
garden.linkItem(key);
kitchen.linkItem(salt);
diningRoom.linkItem(water);
livingRoom.linkItem(discoBall);
office.linkItem(partyLight);

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
  const gameText = document.querySelectorAll(".gamePlay");

  gameText.forEach((e) => {
    e.classList.add("hidden");
  });

  document.getElementById("gameEndTitle").classList.remove("hidden");
  document.getElementById("gameEndTitle").innerHTML = `Your game is over.`;

  document.getElementById("gameEndText").classList.remove("hidden");
  document.getElementById("gameEndText").innerHTML = `${condition}`;

  document.getElementById("restartButton").classList.remove("hidden");
};

const youWin = () => {
  const gameText = document.querySelectorAll(".gamePlay");
  const gameEndContent = document.querySelectorAll(".gameEnd");

  gameText.forEach((e) => {
    e.classList.add("hidden");
  });

  gameEndContent.forEach((e) => {
    e.classList.remove("hidden");
  });

  document.getElementById("gameEndTitle").innerHTML = `You win!`;

  document.getElementById(
    "gameEndText"
  ).innerHTML = `Well done, you have successfully found the lost disco ball and party light. You have brought the party to the garden once more! Woooooo!`;

  document
    .getElementById("restartButton")
    .classList.remove("hidden").innerHTML = "Do it again?";
};

const goController = (action, focus) => {
  switch (action) {
    case "move":
      currentRoom.move(focus);
      break;
    case "collect":
      currentRoom.collect(focus);
    default:
      console.log(action);
  }
};

startGame();

// module.exports = startButtonPush;
