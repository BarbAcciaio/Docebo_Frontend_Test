class Utility {
    static getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    static noun = new Array(
        "Dream", "Dreamer", "Dreams", "Waves",
        "Sword", "Kiss", "Sex", "Lover",
        "Slave", "Slaves", "Pleasure", "Servant",
        "Servants", "Snake", "Soul", "Touch",
        "Men", "Women", "Gift", "Scent",
        "Ice", "Snow", "Night", "Silk", "Secret", "Secrets",
        "Game", "Fire", "Flame", "Flames",
        "Husband", "Wife", "Man", "Woman", "Boy", "Girl",
        "Truth", "Edge", "Boyfriend", "Girlfriend",
        "Body", "Captive", "Male", "Wave", "Predator",
        "Female", "Healer", "Trainer", "Teacher",
        "Hunter", "Obsession", "Hustler", "Consort",
        "Dream", "Dreamer", "Dreams", "Rainbow",
        "Dreaming", "Flight", "Flying", "Soaring",
        "Wings", "Mist", "Sky", "Wind",
        "Winter", "Misty", "River", "Door",
        "Gate", "Cloud", "Fairy", "Dragon",
        "End", "Blade", "Beginning", "Tale",
        "Tales", "Emperor", "Prince", "Princess",
        "Willow", "Birch", "Petals", "Destiny",
        "Theft", "Thief", "Legend", "Prophecy",
        "Spark", "Sparks", "Stream", "Streams", "Waves",
        "Sword", "Darkness", "Swords", "Silence", "Kiss",
        "Butterfly", "Shadow", "Ring", "Rings", "Emerald",
        "Storm", "Storms", "Mists", "World", "Worlds",
        "Alien", "Lord", "Lords", "Ship", "Ships", "Star",
        "Stars", "Force", "Visions", "Vision", "Magic",
        "Wizards", "Wizard", "Heart", "Heat", "Twins",
        "Twilight", "Moon", "Moons", "Planet", "Shores",
        "Pirates", "Courage", "Time", "Academy",
        "School", "Rose", "Roses", "Stone", "Stones",
        "Sorcerer", "Shard", "Shards", "Slave", "Slaves",
        "Servant", "Servants", "Serpent", "Serpents",
        "Snake", "Soul", "Souls", "Savior", "Spirit",
        "Spirits", "Voyage", "Voyages", "Voyager", "Voyagers",
        "Return", "Legacy", "Birth", "Healer", "Healing",
        "Year", "Years", "Death", "Dying", "Luck", "Elves",
        "Tears", "Touch", "Son", "Sons", "Child", "Children",
        "Illusion", "Sliver", "Destruction", "Crying", "Weeping",
        "Gift", "Word", "Words", "Thought", "Thoughts", "Scent",
        "Ice", "Snow", "Night", "Silk", "Guardian", "Angel",
        "Angels", "Secret", "Secrets", "Search", "Eye", "Eyes",
        "Danger", "Game", "Fire", "Flame", "Flames", "Bride",
        "Husband", "Wife", "Time", "Flower", "Flowers",
        "Light", "Lights", "Door", "Doors", "Window", "Windows",
        "Bridge", "Bridges", "Ashes", "Memory", "Thorn",
        "Thorns", "Name", "Names", "Future", "Past",
        "History", "Something", "Nothing", "Someone",
        "Nobody", "Person", "Man", "Woman", "Boy", "Girl",
        "Way", "Mage", "Witch", "Witches", "Lover",
        "Tower", "Valley", "Abyss", "Hunter",
        "Truth", "Edge"
    );

    static adjective = new Array(
        "Lost", "Only", "Last", "First",
        "Third", "Sacred", "Bold", "Lovely",
        "Final", "Missing", "Shadowy", "Seventh",
        "Dwindling", "Missing", "Absent",
        "Vacant", "Cold", "Hot", "Burning", "Forgotten",
        "Weeping", "Dying", "Lonely", "Silent",
        "Laughing", "Whispering", "Forgotten", "Smooth",
        "Silken", "Rough", "Frozen", "Wild",
        "Trembling", "Fallen", "Ragged", "Broken",
        "Cracked", "Splintered", "Slithering", "Silky",
        "Wet", "Magnificent", "Luscious", "Swollen",
        "Erect", "Bare", "Naked", "Stripped",
        "Captured", "Stolen", "Sucking", "Licking",
        "Growing", "Kissing", "Green", "Red", "Blue",
        "Azure", "Rising", "Falling", "Elemental",
        "Bound", "Prized", "Obsessed", "Unwilling",
        "Hard", "Eager", "Ravaged", "Sleeping",
        "Wanton", "Professional", "Willing", "Devoted",
        "Misty", "Lost", "Only", "Last", "First",
        "Final", "Missing", "Shadowy", "Seventh",
        "Dark", "Darkest", "Silver", "Silvery", "Living",
        "Black", "White", "Hidden", "Entwined", "Invisible",
        "Next", "Seventh", "Red", "Green", "Blue",
        "Purple", "Grey", "Bloody", "Emerald", "Diamond",
        "Frozen", "Sharp", "Delicious", "Dangerous",
        "Deep", "Twinkling", "Dwindling", "Missing", "Absent",
        "Vacant", "Cold", "Hot", "Burning", "Forgotten",
        "Some", "No", "All", "Every", "Each", "Which", "What",
        "Playful", "Silent", "Weeping", "Dying", "Lonely", "Silent",
        "Laughing", "Whispering", "Forgotten", "Smooth", "Silken",
        "Rough", "Frozen", "Wild", "Trembling", "Fallen",
        "Ragged", "Broken", "Cracked", "Splintered"
    );

    static typesList = {
        video: 'single',
        elearning: 'single',
        learning_plan: 'collection',
        playlist: 'collection'
    };

    static image = 'https://thispersondoesnotexist.com/image';

    static getImage = (size) => `https://picsum.photos/${size}`;

    static getCardConfiguration() {
        const image = this.getImage(this.getRandomInt(300, 1000));
        const rnd = this.getRandomInt(0, 3);
        const duration = this.getRandomInt(10, 3600);
        const type = Object.keys(this.typesList)[rnd];
        const cardinality = this.typesList[type];

        return { image, type, duration, title: this.getRandomTitle(), cardinality };
    }

    static getRandomTitle(){
        const a = this.getRandomInt(0, this.noun.length);
        const b = this.getRandomInt(0, this.adjective.length);

        return this.adjective[b] + " " + this.noun[a];
    }

    static createGuid(){
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
}