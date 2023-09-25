let time = new Date();
console.log(`we are online at ${time}!`);

const alertArea = document.getElementById("alertText");

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
    this.actions = ["move", "collect", "ask", "wait"];
    this.hasDiscoBall = false;
    this.hasPartyLight = false;
    this.endConditions = {
      driedOut:
        "You ran out of moisture, causing you to fall into a state of suspended animation. Later that evening a human picks you up and puts you back in the garden.",
      captured:
        "You were seen by the human, who scooped you up and took you outside. You will need to recuperate before trying again. Time for some sleep",
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

// create friends

const mouse = new Friend(
  "mouse",
  "a small brown mouse",
  10,
  10,
  "mouse",
  [],
  "I think you shouldn't go outside when it's sunny, make sure to check the weather first! You can <strong>wait here</strong> for a while, if you need to.",
)

const spider = new Friend(
  "spider",
  "a delicate yet sturdy spider",
  10,
  10,
  "spider",
  [],
  "Sometimes you need to be extra quiet - if there's a human around, try to <strong>sneak</strong>"
)

// create baddie

const programmer = new Enemy(
  "human",
  "hunched over a computer, furiously writing code",
  10,
  10,
  "human",
  ""
)


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
    this.directions = ["north", "south", "east", "west"];
  }

  linkPlace(direction, place) {
    this.linkedPlaces[direction] = place;
  }

  linkItem(item) {
    this.linkedItems.push(item);
  }

  linkCharacater(character) {
    this.linkedCharacters.push(character);
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

  describeCharacters(character) {
    if (Object.keys(this.linkedCharacters).length === 0) {
      return `You are alone`;
    }
    //add if statement here to see if char is an enemy or a friend
    if (!character.isEnemy) {
      return `Nearby, you can see a <strong>${character.name}</strong>. They seem friendly so you could <strong>ask</strong> them something.`;
    }

    
    else {
      return `Nearby, you can see a <strong>${character.name}</strong> ${character.description}. Be careful to avoid them seeing you: consider your commands wisely.`
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
      if (this.name === "staircase" || placeThroughExit === "staircase") {
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
          alertArea.innerHTML = "You entered an invalid command, you must include an <strong>action</strong> and a <strong>target</strong>, e.g. 'move west' etc.";
        } else if (!player.actions.includes(action)) {
          alertArea.innerHTML = "That was an invalid action, try 'move' or 'collect'";
        } else if (
          currentRoom.name === "kitchen" &&
          focus === "west" &&
          garden.weather["canGoOutside"] === false
        ) {
          alertArea.innerHTML = 
            "You cannot go outside in this weather, you'll get too dry."
          ;
        } else if (currentRoom.linkedCharacters.length > 0 && currentRoom.linkedCharacters[0].isEnemy && action != "sneak") {

            gameOver(player.endConditions.captured)
        

          // 
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
          currentRoom.name === "garden" &&
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
    alertArea.innerHTML = "";
    if (!this.directions.includes(direction)) {
      alertArea.innerHTML = 
        "That was an invalid direction, please use 'north', 'south', 'east' or 'west'"
      ;
      userInput.value = "";
      return this;
    }

    if (this.linkedPlaces[direction]) {
      currentRoom = this.linkedPlaces[direction];
      currentRoom.hasBeenVisited = true;
    } else {
      alertArea.innerHTML = "That way is blocked, try a different direction";
      return this;
    }

    if (this.linkedPlaces[direction].name === "garden" && garden.weather["canGoOutside"] === true) {
      player.moisture += 15;
    }
    return this;
  }

  // A function to collect an item and instigate its action, either it goes into our items array or it does something to the player.
  collect() {
    if (currentRoom.linkedItems.length === 0) {
      alertArea.innerHTML = "There are no items that you can collect";
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

      if(collectedItemArray[0].name === "small drip") {
        player.moisture += 10;
      }

      if (collectedItemArray[0].name === "disco ball") {
        player.hasDiscoBall = true;
        if (player.hasPartyLight) {
          discoBall.message += " Now I just need to get back to the <strong>garden</strong>."
        }
      }

      if (collectedItemArray[0].name === "party light") {
        player.hasPartyLight = true;
        if (player.hasDiscoBall) {
          partyLight.message += " Now I just need to get back to the <strong>garden</strong>."
        }
      }

      // alert to say we've collected it and what the impact is
      alertArea.innerHTML = collectedItemArray[0].message;
      // push it to player's items array
      player.items.push(collectedItemArray[0]);
    }
  }

  ask(person) {

    if (this.linkedCharacters.length === 0) {
      alertArea.innerHTML = "There is no one here to talk to."
    } else if (person != this.linkedCharacters[0].name){
      alertArea.innerHTML = "Are you sure you're asking the right person?";
    } else {
      alertArea.innerHTML = `<strong>The ${person} says:</strong> '${this.linkedCharacters[0].knowledgeToGive}'`
    }

    if (person === "spider") {
      player.actions.push("sneak");
    }
  }

  wait(here) {
    if (here === "here") {
      alertArea.innerHTML = "I guess I'll just wait here for a bit."
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

    const characterDetails = "<p>" + this.describeCharacters(this.linkedCharacters[0]) + "</p>";

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
  "garden",
  "not large, but contains many lush plants: an ideal home for a slug.",
  "doorway"
);
const kitchen = new Place(
  "kitchen",
  "reasonably tidy, with plenty of nooks to explore.",
  "doorway"
);
const hallway = new Place(
  "hallway",
  "brightly lit, painted white, with a wobbly wooden floor.",
  "doorway"
);
const staircase = new Place(
  "staircase",
  "steep and long, covered with a rough carpet made of some kind of plant fibre.",
  "staircase"
);
const diningRoom = new Place(
  "dining room",
  "long, with blue walls, a dining set, more than a few cobwebs.",
  "doorway"
);
const livingRoom = new Place(
  "living room",
  "dark blue, with a tired looking sofa.",
  "doorway"
);
const landing = new Place(
  "landing",
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
  "quite large, with dark blue walls and a big window overlooking a quiet road.",
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

// link characters to rooms

kitchen.linkCharacater(mouse);
office.linkCharacater(programmer);
bedroom.linkCharacater(spider);


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

const hat = new Item(
  "hat",
  "intriguing",
  "Oh, it's a lovely hat! Perfect to wear on this mission."
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
  "Yes! This is the disco ball that I was looking for!"
);
const partyLight = new Item(
  "party light",
  "flashing",
  "Brilliant! Now we can get the party started!"
);
const smallDrip = new Item(
  "small drip",
  "small, wet",
  "Aha, this drip has helped to replenish my moisture."
)

// link the items
garden.linkItem(hat);
kitchen.linkItem(salt);
diningRoom.linkItem(water);
livingRoom.linkItem(discoBall);
office.linkItem(partyLight);
bedroom.linkItem(smallDrip);
bathroom.linkItem(water);

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
      break;
    case "ask":
      currentRoom.ask(focus);
      break;
    case "sneak":
      if (currentRoom.directions.includes(focus)) {
        currentRoom.move(focus)
      } else if (focus === "thing") {
        currentRoom.collect(focus)
      };
      break;
    case "wait":
        currentRoom.wait(focus);
        break;
    default:
      console.log(action);
  }
};

// set userInput field
const userInput = document.getElementById("userText");

// 
const userNameInput = document.getElementById("nameInput");
let userName = "";

// a function to take the user's name input
const changeName = (name) => {
  userName = name;

}

// a function to show the game area and populate player name.
const startButtonPush = () => {
  
  if (userName.length < 1) {
    alert("Please name your slug")
    return
  }

  player.name = userName;
  player.populatePlayerDetails();

  document.getElementById("welcomePage").classList.add("hidden")
  document.getElementById("gamearea").classList.remove("hidden")

};

startGame();


// all done :-)

