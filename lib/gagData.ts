// Grow a Garden — Plant, Mutation & Pet Data
// Sources: community wikis, in-game testing. Fanmade — not affiliated with the game.

export interface Plant {
  id: string; name: string; emoji: string; baseValue: number;
  category: "seed-shop" | "easter" | "night" | "bee" | "summer" | "prehistoric" | "zen" | "cooking" | "beanstalk" | "fairy" | "fall" | "seed-tiers" | "halloween" | "safari" | "smithing" | "trading" | "christmas" | "new-years" | "buttercup" | "limited";
  isMultiHarvest?: boolean;
}

export interface Mutation {
  id: string; name: string; emoji: string; multiplier: number;
  source: string; tier: "common" | "uncommon" | "rare" | "legendary" | "mythic";
  comboFrom?: string[];
}

export interface Pet {
  id: string; name: string; emoji: string; ability: string;
  mutationGranted?: string; mutationMultiplier?: number;
  baseXpRate: number; hatchTimeMin: number;
}

// ─── PLANTS ───
export const PLANTS: Plant[] = [
  // Seed Shop
  { id:"carrot", name:"Carrot", emoji:"🥕", baseValue:18, category:"seed-shop" },
  { id:"strawberry", name:"Strawberry", emoji:"🍓", baseValue:18, category:"seed-shop", isMultiHarvest:true },
  { id:"blueberry", name:"Blueberry", emoji:"🫐", baseValue:18, category:"seed-shop", isMultiHarvest:true },
  { id:"tomato", name:"Tomato", emoji:"🍅", baseValue:36, category:"seed-shop", isMultiHarvest:true },
  { id:"corn", name:"Corn", emoji:"🌽", baseValue:72, category:"seed-shop" },
  { id:"daffodil", name:"Daffodil", emoji:"🌼", baseValue:90, category:"seed-shop" },
  { id:"watermelon", name:"Watermelon", emoji:"🍉", baseValue:2708, category:"seed-shop" },
  { id:"pumpkin", name:"Pumpkin", emoji:"🎃", baseValue:903, category:"seed-shop" },
  { id:"bamboo", name:"Bamboo", emoji:"🎋", baseValue:451, category:"seed-shop" },
  { id:"cactus", name:"Cactus", emoji:"🌵", baseValue:180, category:"seed-shop" },
  { id:"sunflower", name:"Sunflower", emoji:"🌻", baseValue:360, category:"seed-shop" },
  { id:"tulip", name:"Tulip", emoji:"🌷", baseValue:541, category:"seed-shop" },
  { id:"rose", name:"Rose", emoji:"🌹", baseValue:722, category:"seed-shop" },
  { id:"pineapple", name:"Pineapple", emoji:"🍍", baseValue:1805, category:"seed-shop" },
  { id:"coconut", name:"Coconut", emoji:"🥥", baseValue:1354, category:"seed-shop" },
  { id:"mango", name:"Mango", emoji:"🥭", baseValue:2257, category:"seed-shop" },
  { id:"dragonfruit", name:"Dragon Fruit", emoji:"🐉", baseValue:3610, category:"seed-shop" },
  { id:"bellpepper", name:"Bell Pepper", emoji:"🫑", baseValue:4964, category:"seed-shop" },
  { id:"grape", name:"Grape", emoji:"🍇", baseValue:6770, category:"seed-shop", isMultiHarvest:true },
  { id:"peach", name:"Peach", emoji:"🍑", baseValue:9025, category:"seed-shop" },
  { id:"cherry", name:"Cherry", emoji:"🍒", baseValue:13538, category:"seed-shop", isMultiHarvest:true },
  { id:"apple", name:"Apple", emoji:"🍎", baseValue:18050, category:"seed-shop", isMultiHarvest:true },
  { id:"orange", name:"Orange", emoji:"🍊", baseValue:22563, category:"seed-shop" },
  { id:"lemon", name:"Lemon", emoji:"🍋", baseValue:27075, category:"seed-shop" },
  { id:"sugarapple", name:"Sugar Apple", emoji:"🍏", baseValue:43320, category:"seed-shop" },
  { id:"moonmango", name:"Moon Mango", emoji:"🌙", baseValue:45125, category:"seed-shop" },
  { id:"feijoa", name:"Feijoa", emoji:"🥝", baseValue:27075, category:"seed-shop" },
  // Easter Event
  { id:"easteregg", name:"Easter Egg Plant", emoji:"🥚", baseValue:5000, category:"easter" },
  { id:"bunnycarrot", name:"Bunny Carrot", emoji:"🐰", baseValue:8500, category:"easter" },
  // Night Event
  { id:"moonflower", name:"Moon Flower", emoji:"🌙", baseValue:12000, category:"night" },
  { id:"nightshade", name:"Nightshade", emoji:"🌑", baseValue:15000, category:"night" },
  // Bee Event
  { id:"honeybloom", name:"Honey Bloom", emoji:"🍯", baseValue:9500, category:"bee" },
  { id:"beeflower", name:"Bee Flower", emoji:"🐝", baseValue:7500, category:"bee" },
  // Summer Event
  { id:"palmtree", name:"Palm Tree", emoji:"🌴", baseValue:18000, category:"summer" },
  { id:"tropicfruit", name:"Tropic Fruit", emoji:"🏝️", baseValue:22000, category:"summer" },
  // Prehistoric Event
  { id:"dinosaurfern", name:"Dinosaur Fern", emoji:"🦕", baseValue:25000, category:"prehistoric" },
  { id:"ambertree", name:"Amber Tree", emoji:"🪨", baseValue:30000, category:"prehistoric" },
  // Zen Update
  { id:"bonsai", name:"Bonsai", emoji:"🌳", baseValue:20000, category:"zen" },
  { id:"lotusflower", name:"Lotus Flower", emoji:"🪷", baseValue:28000, category:"zen" },
  // Cooking Event
  { id:"chili", name:"Chili Pepper", emoji:"🌶️", baseValue:11000, category:"cooking" },
  { id:"garlic", name:"Garlic", emoji:"🧄", baseValue:8000, category:"cooking" },
  // Beanstalk Event
  { id:"beanstalk", name:"Beanstalk", emoji:"🫘", baseValue:35000, category:"beanstalk" },
  { id:"magicbean", name:"Magic Bean", emoji:"✨", baseValue:50000, category:"beanstalk" },
  // Fairy Event
  { id:"fairyrose", name:"Fairy Rose", emoji:"🧚", baseValue:42000, category:"fairy" },
  // Fall Event
  { id:"mapleleaf", name:"Maple Leaf", emoji:"🍁", baseValue:16000, category:"fall" },
  { id:"mapleapple", name:"Maple Apple", emoji:"🍂", baseValue:24000, category:"fall" },
  // Halloween Event
  { id:"ghostpumpkin", name:"Ghost Pumpkin", emoji:"👻", baseValue:38000, category:"halloween" },
  { id:"boneblossom", name:"Bone Blossom", emoji:"💀", baseValue:45000, category:"halloween" },
  // Safari Event
  { id:"savannatree", name:"Savanna Tree", emoji:"🦁", baseValue:32000, category:"safari" },
  { id:"trinityplant", name:"Trinity Plant", emoji:"🌿", baseValue:55000, category:"safari" },
  // Smithing Event
  { id:"ironbloom", name:"Iron Bloom", emoji:"⚒️", baseValue:40000, category:"smithing" },
  // Trading Update
  { id:"tradervine", name:"Trader Vine", emoji:"🤝", baseValue:28000, category:"trading" },
  // Christmas Update
  { id:"christmastree", name:"Christmas Tree", emoji:"🎄", baseValue:48000, category:"christmas" },
  { id:"mistletoe", name:"Mistletoe", emoji:"❄️", baseValue:35000, category:"christmas" },
  // New Years
  { id:"fireworkflower", name:"Firework Flower", emoji:"🎆", baseValue:52000, category:"new-years" },
  // Buttercup Update
  { id:"buttercup", name:"Buttercup", emoji:"🌼", baseValue:60000, category:"buttercup" },
  // Limited / Ascension
  { id:"galaxyrose", name:"Galaxy Rose", emoji:"🌌", baseValue:100000, category:"limited" },
  { id:"voidfruit", name:"Void Fruit", emoji:"🕳️", baseValue:150000, category:"limited" },
  { id:"goldenfruit", name:"Golden Fruit", emoji:"✨", baseValue:200000, category:"limited" },
];

// ─── MUTATIONS ───
export const MUTATIONS: Mutation[] = [
  // Base Quality (Tier 1)
  { id:"silver", name:"Silver", emoji:"🔘", multiplier:5, source:"Fruit grows, fertilizer", tier:"common" },
  { id:"gold", name:"Gold", emoji:"🌟", multiplier:20, source:"Fruit grows, dragonfly, fertilizer", tier:"uncommon" },
  { id:"rainbow", name:"Rainbow", emoji:"🌈", multiplier:50, source:"Fruit grows, butterfly, fertilizer", tier:"rare" },
  // Weather (Tier 2)
  { id:"wet", name:"Wet", emoji:"💧", multiplier:2, source:"Rain weather, spray, pets", tier:"common" },
  { id:"chilled", name:"Chilled", emoji:"❄️", multiplier:2, source:"Snow weather, sprays", tier:"common" },
  { id:"frozen", name:"Frozen", emoji:"🧊", multiplier:10, source:"Wet + Chilled combo", tier:"uncommon", comboFrom:["wet","chilled"] },
  { id:"choc", name:"Choc", emoji:"🍫", multiplier:2, source:"Sprinklers, spray, admin weather", tier:"common" },
  { id:"shocked", name:"Shocked", emoji:"⚡", multiplier:100, source:"Thunder weather, Jandel event", tier:"rare" },
  { id:"moonlit", name:"Moonlit", emoji:"🌙", multiplier:2, source:"Night event", tier:"common" },
  { id:"bloodlit", name:"Bloodlit", emoji:"🩸", multiplier:4, source:"Blood Moon event", tier:"uncommon" },
  { id:"sandy", name:"Sandy", emoji:"🏜️", multiplier:3, source:"Sandstorm weather", tier:"common" },
  { id:"clay", name:"Clay", emoji:"🧱", multiplier:5, source:"Wet + Sandy combo", tier:"uncommon", comboFrom:["wet","sandy"] },
  { id:"ceramic", name:"Ceramic", emoji:"🏺", multiplier:32, source:"Clay + Burnt/Sundried combo", tier:"rare", comboFrom:["clay","burnt"] },
  { id:"sundried", name:"Sundried", emoji:"☀️", multiplier:85, source:"Heat Wave weather", tier:"rare" },
  { id:"windstruck", name:"Windstruck", emoji:"🌬️", multiplier:2, source:"Gale/windy events, pterodactyl, spray", tier:"common" },
  { id:"twisted", name:"Twisted", emoji:"🌪️", multiplier:5, source:"Tornado event, pterodactyl", tier:"uncommon" },
  { id:"drenched", name:"Drenched", emoji:"🌧️", multiplier:5, source:"Tropical Rain weather", tier:"uncommon" },
  { id:"moist", name:"Moist", emoji:"💧", multiplier:3, source:"Gentle Drizzle weather", tier:"common" },
  // Admin & Event (Tier 3)
  { id:"disco", name:"Disco", emoji:"🥳", multiplier:125, source:"Disco admin event, discobee, spray", tier:"legendary" },
  { id:"celestial", name:"Celestial", emoji:"☄️", multiplier:120, source:"Meteor Shower event", tier:"legendary" },
  { id:"plasma", name:"Plasma", emoji:"⚡", multiplier:5, source:"Admin Lazer Event", tier:"uncommon" },
  { id:"voidtouched", name:"Void Touched", emoji:"🌌", multiplier:135, source:"Admin Blackhole event, Space squirrel pet", tier:"legendary" },
  { id:"molten", name:"Molten", emoji:"🔥", multiplier:25, source:"Admin Volcano event", tier:"rare" },
  { id:"meteoric", name:"Meteoric", emoji:"🌠", multiplier:125, source:"Meteor Strike event", tier:"legendary" },
  { id:"heavenly", name:"Heavenly", emoji:"👼", multiplier:5, source:"Jandel admin event", tier:"uncommon" },
  { id:"dawnbound", name:"Dawnbound", emoji:"☀️", multiplier:150, source:"Sun god event, holding 4 sunflowers, Ascended pets", tier:"mythic" },
  { id:"galactic", name:"Galactic", emoji:"🌌", multiplier:120, source:"Admin event", tier:"legendary" },
  { id:"aurora", name:"Aurora", emoji:"🧊", multiplier:90, source:"Aurora Borealis weather", tier:"rare" },
  { id:"alienlike", name:"Alienlike", emoji:"👽", multiplier:100, source:"Alienlike admin event", tier:"rare" },
  { id:"fried", name:"Fried", emoji:"🍳", multiplier:8, source:"Fried rain admin event", tier:"uncommon" },
  { id:"radioactive", name:"Radioactive", emoji:"☢️", multiplier:55, source:"Carrot Rocket admin event", tier:"rare" },
  { id:"subzero", name:"Subzero", emoji:"🏈", multiplier:40, source:"Yeti/Travis Kelce admin event", tier:"rare" },
  { id:"jackpot", name:"Jackpot", emoji:"🏈", multiplier:15, source:"Travis Kelce admin event", tier:"uncommon" },
  { id:"blitzshock", name:"Blitzshock", emoji:"🏈", multiplier:50, source:"Travis Kelce admin event", tier:"rare" },
  { id:"touchdown", name:"Touchdown", emoji:"🏈", multiplier:105, source:"Travis Kelce admin event", tier:"legendary" },
  { id:"sliced", name:"Sliced", emoji:"🗡️", multiplier:50, source:"Jandel Admin Event", tier:"rare" },
  { id:"enchanted", name:"Enchanted", emoji:"🌌", multiplier:50, source:"Admin mutation", tier:"rare" },
  { id:"gilded", name:"Gilded", emoji:"🌟", multiplier:15, source:"Midas rain admin event", tier:"uncommon" },
  { id:"severed", name:"Severed", emoji:"🗡️", multiplier:40, source:"Admin Event", tier:"rare" },
  { id:"wiltproof", name:"Wiltproof", emoji:"🥀", multiplier:4, source:"Admin abuse event", tier:"uncommon" },
  { id:"warped", name:"Warped", emoji:"🌀", multiplier:75, source:"Admin event mutation", tier:"rare" },
  { id:"infected", name:"Infected", emoji:"🧟", multiplier:75, source:"Zombie Admin Mutation", tier:"rare" },
  { id:"glitched", name:"Glitched", emoji:"⚡", multiplier:85, source:"Jhai Admin Event", tier:"rare" },
  { id:"alienated", name:"Alienated", emoji:"👽", multiplier:25, source:"Admin weather", tier:"rare" },
  { id:"lightcycle", name:"Lightcycle", emoji:"🚦", multiplier:50, source:"Blood owl Stoplight Admin", tier:"rare" },
  { id:"brainrot", name:"Brainrot", emoji:"🧠", multiplier:100, source:"Admin event, Lemon Lion pet", tier:"legendary" },
  { id:"beanbound", name:"Beanbound", emoji:"🌿", multiplier:100, source:"Hold 4 Beanstalks during event", tier:"legendary" },
  { id:"blackout", name:"Blackout", emoji:"☠️", multiplier:95, source:"Grim Reaper event", tier:"legendary" },
  { id:"oil", name:"Oil", emoji:"🛢️", multiplier:15, source:"Flamingo Admin event, Oil rain", tier:"uncommon" },
  { id:"boil", name:"Boil", emoji:"♨️", multiplier:15, source:"Flamingo Admin event, Boil rain", tier:"uncommon" },
  { id:"junkshock", name:"Junkshock", emoji:"⚡", multiplier:45, source:"Flamingo Admin event", tier:"rare" },
  // Pet-Based (Tier 4)
  { id:"zombified", name:"Zombified", emoji:"🧟", multiplier:25, source:"Chicken Zombie passive", tier:"rare" },
  { id:"burnt", name:"Burnt", emoji:"🍗", multiplier:4, source:"Cooked owl pet, spray", tier:"uncommon" },
  { id:"verdant", name:"Verdant", emoji:"🌿", multiplier:4, source:"Scarlet Macaw, spray", tier:"uncommon" },
  { id:"pollinated", name:"Pollinated", emoji:"🐝", multiplier:3, source:"Bee swarm/bees", tier:"common" },
  { id:"honeyglazed", name:"HoneyGlazed", emoji:"🍯", multiplier:5, source:"Honey sprinkler, bear bee", tier:"uncommon" },
  { id:"cooked", name:"Cooked", emoji:"🍖", multiplier:10, source:"Cooked owl", tier:"uncommon" },
  { id:"amber", name:"Amber", emoji:"🧡", multiplier:10, source:"Raptor, amber spray", tier:"uncommon" },
  { id:"oldamber", name:"OldAmber", emoji:"🟠", multiplier:20, source:"Let Amber age", tier:"rare" },
  { id:"ancientamber", name:"AncientAmber", emoji:"🟠", multiplier:50, source:"Let OldAmber age", tier:"rare" },
  { id:"static", name:"Static", emoji:"⚡", multiplier:8, source:"Raiju Pet passive", tier:"uncommon" },
  { id:"bloom", name:"Bloom", emoji:"🌸", multiplier:8, source:"Spray or pet passive", tier:"uncommon" },
  { id:"fortune", name:"Fortune", emoji:"💰", multiplier:50, source:"Golden Goose, Golden Egg", tier:"rare" },
  { id:"cyclonic", name:"Cyclonic", emoji:"🌀", multiplier:50, source:"Griffin pet mutation", tier:"rare" },
  { id:"rot", name:"Rot", emoji:"🥀", multiplier:8, source:"Mandrake Pet Mutation", tier:"uncommon" },
  { id:"gnomed", name:"Gnomed", emoji:"🍄", multiplier:15, source:"Gnome pet mutation", tier:"uncommon" },
  { id:"glimmering", name:"Glimmering", emoji:"🌸", multiplier:2, source:"Fairy event, fairies", tier:"common" },
  { id:"luminous", name:"Luminous", emoji:"💡", multiplier:50, source:"Sprite pet, Spray, Pet shard", tier:"rare" },
  { id:"cracked", name:"Cracked", emoji:"🌎", multiplier:4, source:"Earthquake event", tier:"uncommon" },
  { id:"fall", name:"Fall", emoji:"🍂", multiplier:4, source:"Fall event mutation", tier:"uncommon" },
  { id:"graceful", name:"Graceful", emoji:"🦢", multiplier:77, source:"Swan Pet Mutation", tier:"rare" },
  { id:"azure", name:"Azure", emoji:"🌌", multiplier:75, source:"Mizuchi pet mutation", tier:"rare" },
  { id:"enlightened", name:"Enlightened", emoji:"💡", multiplier:35, source:"Tiger pet ability", tier:"rare" },
  { id:"flaming", name:"Flaming", emoji:"🔥", multiplier:25, source:"Phoenix pet", tier:"rare" },
  { id:"ghostly", name:"Ghostly", emoji:"👻", multiplier:25, source:"Great Pumpkin plant, ghostly pets", tier:"rare" },
  { id:"spooky", name:"Spooky", emoji:"👻", multiplier:8, source:"Ghostbear Pet ability", tier:"uncommon" },
  { id:"vamp", name:"Vamp", emoji:"🦇", multiplier:3, source:"Bat attack event", tier:"common" },
  { id:"blight", name:"Blight", emoji:"⚫", multiplier:8, source:"Dark Spriggan pet", tier:"uncommon" },
  { id:"pestilent", name:"Pestilent", emoji:"☢️", multiplier:8, source:"Hex Serpent pet", tier:"uncommon" },
  { id:"necrotic", name:"Necrotic", emoji:"⚫", multiplier:8, source:"Ghostly Dark Spriggan ability", tier:"uncommon" },
  { id:"terran", name:"Terran", emoji:"🏜️", multiplier:75, source:"Hydra pet ability", tier:"rare" },
  { id:"stampede", name:"Stampede", emoji:"🏜️", multiplier:50, source:"Zebra pet ability", tier:"rare" },
  { id:"arid", name:"Arid", emoji:"🏜️", multiplier:6, source:"Giraffe pet ability", tier:"uncommon" },
  { id:"mirage", name:"Mirage", emoji:"🌌", multiplier:25, source:"Rhino, Safari Oasis, Trinity Plant", tier:"rare" },
  { id:"monsoon", name:"Monsoon", emoji:"💨", multiplier:50, source:"Hippo Pet Ability", tier:"rare" },
  { id:"wildfast", name:"Wildfast", emoji:"💨", multiplier:5, source:"Cheetah pet ability", tier:"uncommon" },
  { id:"geode", name:"Geode", emoji:"💎", multiplier:5, source:"Geode turtle pet ability", tier:"uncommon" },
  { id:"crystalized", name:"Crystalized", emoji:"💎", multiplier:25, source:"Sapphire macaw pet ability", tier:"rare" },
  { id:"webbed", name:"Webbed", emoji:"🕸️", multiplier:8, source:"Trapdoor spider pet ability", tier:"uncommon" },
  { id:"tranquil", name:"Tranquil", emoji:"🧘", multiplier:20, source:"Zen Hourly Event, Tranquil pets", tier:"rare" },
  { id:"corrupt", name:"Corrupt", emoji:"😈", multiplier:20, source:"Corrupt tree Hourly, Corrupt pets", tier:"rare" },
  { id:"chakra", name:"Chakra", emoji:"☯️", multiplier:15, source:"Kitsune pet ability", tier:"uncommon" },
  { id:"foxfirechakra", name:"FoxfireChakra", emoji:"🦊", multiplier:90, source:"Rare from kitsune pet", tier:"legendary" },
  { id:"toxic", name:"Toxic", emoji:"☢️", multiplier:15, source:"Cockatrice Pet ability", tier:"uncommon" },
  { id:"acidic", name:"Acidic", emoji:"☢️", multiplier:15, source:"Acid rain weather", tier:"uncommon" },
  { id:"sauce", name:"Sauce", emoji:"🥣", multiplier:3, source:"Spaghetti Sloth", tier:"common" },
  { id:"pasta", name:"Pasta", emoji:"🍝", multiplier:3, source:"Spaghetti Sloth", tier:"common" },
  { id:"meatball", name:"Meatball", emoji:"🧆", multiplier:3, source:"Spaghetti Sloth", tier:"common" },
  { id:"aromatic", name:"Aromatic", emoji:"🌿", multiplier:3, source:"Kitchen storm event", tier:"common" },
  { id:"sleepy", name:"Sleepy", emoji:"💤", multiplier:3, source:"Calico cat pet ability", tier:"common" },
  { id:"whimsical", name:"Whimsical", emoji:"🎪", multiplier:6, source:"Bear on Bike pet ability", tier:"uncommon" },
  { id:"opulent", name:"Opulent", emoji:"💎", multiplier:5, source:"Galah Cockatoo pet ability", tier:"uncommon" },
  { id:"gale", name:"Gale", emoji:"🌬️", multiplier:25, source:"Wind Wyvern converts Windstruck → Gale", tier:"rare" },
  { id:"coin", name:"Coin", emoji:"💰", multiplier:3, source:"Sheckling pet + Coin Fruit", tier:"common" },
  { id:"nocturnal", name:"Nocturnal", emoji:"🌘", multiplier:4, source:"Safari Weather Event", tier:"uncommon" },
  { id:"twilight", name:"Twilight", emoji:"🌌", multiplier:4, source:"Safari Weather event", tier:"uncommon" },
  { id:"glacial", name:"Glacial", emoji:"🧊", multiplier:25, source:"Frost Dragon pet ability", tier:"rare" },
  { id:"arctic", name:"Arctic", emoji:"🧊", multiplier:12, source:"Penguin pet ability", tier:"uncommon" },
  { id:"whalebound", name:"Whalebound", emoji:"🐋", multiplier:50, source:"Whale pet ability", tier:"rare" },
  { id:"lush", name:"Lush", emoji:"🥀", multiplier:3, source:"Lush Sprinkler", tier:"common" },
  { id:"tempered", name:"Tempered", emoji:"🔥", multiplier:6, source:"Smithing Fever weather", tier:"uncommon" },
  { id:"charcoal", name:"Charcoal", emoji:"⚫", multiplier:6, source:"Charcoal sprinkler", tier:"uncommon" },
  { id:"moonbled", name:"Moonbled", emoji:"🔴", multiplier:25, source:"Moon Marrow event", tier:"rare" },
  { id:"wilted", name:"Wilted", emoji:"🥀", multiplier:10, source:"Weeping branch", tier:"uncommon" },
  { id:"withered", name:"Withered", emoji:"🥀", multiplier:20, source:"Weeping branch + time", tier:"rare" },
  { id:"desolate", name:"Desolate", emoji:"🥀", multiplier:50, source:"Weeping branch + more time", tier:"rare" },
  { id:"batty", name:"Batty", emoji:"🦇", multiplier:45, source:"Fruits bat attack", tier:"rare" },
  { id:"leeched", name:"Leeched", emoji:"🦇", multiplier:70, source:"Glass animals event", tier:"rare" },
  { id:"brewed", name:"Brewed", emoji:"🍵", multiplier:7, source:"Giant Cauldron Admin Event", tier:"uncommon" },
  { id:"eclipsed", name:"Eclipsed", emoji:"🌙", multiplier:20, source:"Eclipse weather event", tier:"rare" },
  { id:"peppermint", name:"Peppermint", emoji:"🍬", multiplier:4, source:"Peppermint event", tier:"uncommon" },
  { id:"snowy", name:"Snowy", emoji:"❄️", multiplier:2, source:"Snowfall weather", tier:"common" },
  { id:"snowtouched", name:"Snowtouched", emoji:"🎿", multiplier:5, source:"Snowball Fight event", tier:"uncommon" },
  { id:"ornamented", name:"Ornamented", emoji:"🎄", multiplier:10, source:"Festival Night event", tier:"uncommon" },
  { id:"fierywork", name:"Fierywork", emoji:"🎆", multiplier:30, source:"New Year mutation", tier:"rare" },
  { id:"firework", name:"Firework", emoji:"🎇", multiplier:26, source:"New Year mutation", tier:"rare" },
  { id:"eggnog", name:"Eggnog", emoji:"🥚", multiplier:6, source:"Eggnog pet/mutation", tier:"uncommon" },
  { id:"festive", name:"Festive", emoji:"🎄", multiplier:24, source:"Christmas event/pet abilities", tier:"rare" },
  { id:"clockwork", name:"Clockwork", emoji:"🕰️", multiplier:15, source:"Santa's Stocking", tier:"uncommon" },
  { id:"blizzard", name:"Blizzard", emoji:"🌨️", multiplier:40, source:"Yeti or Santa's Stocking", tier:"rare" },
  { id:"goldsparkle", name:"Goldsparkle", emoji:"✨", multiplier:500, source:"Goldfinch mutation", tier:"mythic" },
  // Combination (Tier 5)
  { id:"paradisal", name:"Paradisal", emoji:"🌴", multiplier:100, source:"Sundried + Verdant", tier:"legendary", comboFrom:["sundried","verdant"] },
  { id:"cosmic", name:"Cosmic", emoji:"🌌", multiplier:240, source:"Celestial + Aurora", tier:"mythic", comboFrom:["celestial","aurora"] },
  { id:"abyssal", name:"Abyssal", emoji:"🌌", multiplier:240, source:"Void Touched + Eclipsed", tier:"mythic", comboFrom:["voidtouched","eclipsed"] },
  { id:"stormcharged", name:"Stormcharged", emoji:"⚡", multiplier:180, source:"Shocked + Static + Tempestous", tier:"mythic", comboFrom:["shocked","static","tempestous"] },
  { id:"astral", name:"Astral", emoji:"🌌", multiplier:365, source:"Cosmic + Galactic", tier:"mythic", comboFrom:["cosmic","galactic"] },
  { id:"tempestous", name:"Tempestous", emoji:"💨", multiplier:12, source:"Windstruck + Twisted", tier:"uncommon", comboFrom:["windstruck","twisted"] },
  { id:"maelstrom", name:"Maelstrom", emoji:"💨", multiplier:100, source:"Tempestous + Cyclonic", tier:"legendary", comboFrom:["tempestous","cyclonic"] },
  { id:"friendbound", name:"Friendbound", emoji:"👬", multiplier:70, source:"Linked friendpots or 5 friends in-server", tier:"rare" },
  { id:"harmonisedchakra", name:"HarmonisedChakra", emoji:"☯️", multiplier:35, source:"Chakra + CorruptChakra", tier:"rare", comboFrom:["chakra","corrupt"] },
  { id:"harmonisedfoxfire", name:"HarmonisedFoxfireChakra", emoji:"🦊", multiplier:190, source:"Foxfire + CorruptFoxfire", tier:"mythic" },
  { id:"ascendedchakra", name:"AscendedChakra", emoji:"🦊", multiplier:230, source:"HarmonisedFoxfire + HarmonisedChakra", tier:"mythic", comboFrom:["harmonisedfoxfire","harmonisedchakra"] },
  { id:"corrosive", name:"Corrosive", emoji:"☢️", multiplier:40, source:"Toxic + Acidic", tier:"rare", comboFrom:["toxic","acidic"] },
  { id:"spaghetti", name:"Spaghetti", emoji:"🍝", multiplier:15, source:"Sauce + Pasta + Meatball", tier:"uncommon", comboFrom:["sauce","pasta","meatball"] },
  { id:"blazing", name:"Blazing", emoji:"🔥", multiplier:52, source:"Flaming + Molten", tier:"rare", comboFrom:["flaming","molten"] },
  { id:"infernal", name:"Infernal", emoji:"🔥", multiplier:180, source:"Blazing + Meteoric", tier:"mythic", comboFrom:["blazing","meteoric"] },
  { id:"sizzled", name:"Sizzled", emoji:"🔥", multiplier:18, source:"Cooked + Fried", tier:"uncommon", comboFrom:["cooked","fried"] },
  { id:"plagued", name:"Plagued", emoji:"☢️", multiplier:102, source:"Infected + Zombified", tier:"legendary", comboFrom:["infected","zombified"] },
  { id:"biohazard", name:"Biohazard", emoji:"☢️", multiplier:157, source:"Plagued + Radioactive", tier:"mythic", comboFrom:["plagued","radioactive"] },
  { id:"contagion", name:"Contagion", emoji:"☢️", multiplier:205, source:"Biohazard + Corrosive", tier:"mythic", comboFrom:["biohazard","corrosive"] },
  { id:"slashbound", name:"Slashbound", emoji:"🗡️", multiplier:95, source:"Severed + Sliced", tier:"legendary", comboFrom:["severed","sliced"] },
  { id:"gourmet", name:"Gourmet", emoji:"🌿", multiplier:37, source:"Spaghetti + Aromatic + Sizzled", tier:"rare", comboFrom:["spaghetti","aromatic","sizzled"] },
  { id:"oilboil", name:"Oilboil", emoji:"🛢️", multiplier:30, source:"Oil + Boil", tier:"rare", comboFrom:["oil","boil"] },
  { id:"umbral", name:"Umbral", emoji:"🌘", multiplier:30, source:"Blight + Pestilent", tier:"rare", comboFrom:["blight","pestilent"] },
  { id:"gloom", name:"Gloom", emoji:"🥀", multiplier:30, source:"Bloom + Rot", tier:"rare", comboFrom:["bloom","rot"] },
  { id:"shadowbound", name:"Shadowbound", emoji:"👥", multiplier:70, source:"Umbral + Gloom", tier:"rare", comboFrom:["umbral","gloom"] },
  { id:"supernatural", name:"Supernatural", emoji:"👻", multiplier:37, source:"Spooky + Vamp + Ghostly", tier:"rare", comboFrom:["spooky","vamp","ghostly"] },
  { id:"sunscorched", name:"Sunscorched", emoji:"☀️", multiplier:32, source:"Mirage + Arid", tier:"rare", comboFrom:["mirage","arid"] },
  { id:"fractured", name:"Fractured", emoji:"💔", multiplier:92, source:"Glitched + Plasma", tier:"legendary", comboFrom:["glitched","plasma"] },
  { id:"riptide", name:"Riptide", emoji:"🌊", multiplier:80, source:"Typhoon + Monsoon", tier:"legendary" },
  { id:"mindbender", name:"Mindbender", emoji:"🌀", multiplier:175, source:"Brainrot + Warped", tier:"mythic", comboFrom:["brainrot","warped"] },
  { id:"stormbound", name:"Stormbound", emoji:"⛈️", multiplier:270, source:"Riptide + Stormcharged", tier:"mythic", comboFrom:["riptide","stormcharged"] },
  { id:"mineral", name:"Mineral", emoji:"💎", multiplier:18, source:"Geode + Charcoal + Tempered", tier:"uncommon", comboFrom:["geode","charcoal","tempered"] },
  { id:"extraterrestrial", name:"Extraterrestrial", emoji:"🛸", multiplier:130, source:"Alienated + Alienlike", tier:"legendary", comboFrom:["alienated","alienlike"] },
  { id:"grim", name:"Grim", emoji:"☠️", multiplier:170, source:"Shadowbound + Blackout", tier:"mythic", comboFrom:["shadowbound","blackout"] },
];

// ─── PETS ───
export const PETS: Pet[] = [
  { id:"lobster", name:"Lobster", emoji:"🦞", ability:"Basic harvesting boost", baseXpRate:10, hatchTimeMin:5 },
  { id:"kiwi", name:"Kiwi", emoji:"🐦", ability:"Pollination chance boost", baseXpRate:12, hatchTimeMin:8 },
  { id:"capybara", name:"Capybara", emoji:"🦫", ability:"Relaxed growth boost", baseXpRate:15, hatchTimeMin:10 },
  { id:"sloth", name:"Sloth", emoji:"🦥", ability:"Slow steady XP gain", baseXpRate:8, hatchTimeMin:12 },
  { id:"dragonfly", name:"Dragonfly", emoji:"🪰", ability:"Triggers Gold mutation", mutationGranted:"Gold", mutationMultiplier:20, baseXpRate:20, hatchTimeMin:15 },
  { id:"butterfly", name:"Butterfly", emoji:"🦋", ability:"Triggers Rainbow mutation", mutationGranted:"Rainbow", mutationMultiplier:50, baseXpRate:25, hatchTimeMin:20 },
  { id:"phoenix", name:"Phoenix", emoji:"🐦‍🔥", ability:"Grants Flaming mutation (25x)", mutationGranted:"Flaming", mutationMultiplier:25, baseXpRate:30, hatchTimeMin:30 },
  { id:"chickenzombie", name:"Chicken Zombie", emoji:"🐔", ability:"Grants Zombified mutation (25x)", mutationGranted:"Zombified", mutationMultiplier:25, baseXpRate:22, hatchTimeMin:25 },
  { id:"cookedowl", name:"Cooked Owl", emoji:"🦉", ability:"Grants Burnt (4x) or Cooked (10x)", mutationGranted:"Cooked", mutationMultiplier:10, baseXpRate:18, hatchTimeMin:20 },
  { id:"scarletmacaw", name:"Scarlet Macaw", emoji:"🦜", ability:"Grants Verdant mutation (4x)", mutationGranted:"Verdant", mutationMultiplier:4, baseXpRate:20, hatchTimeMin:18 },
  { id:"griffin", name:"Griffin", emoji:"🦅", ability:"Grants Cyclonic mutation (50x)", mutationGranted:"Cyclonic", mutationMultiplier:50, baseXpRate:35, hatchTimeMin:45 },
  { id:"swan", name:"Swan", emoji:"🦢", ability:"Grants Graceful mutation (77x)", mutationGranted:"Graceful", mutationMultiplier:77, baseXpRate:32, hatchTimeMin:40 },
  { id:"mizuchi", name:"Mizuchi", emoji:"🐉", ability:"Grants Azure mutation (75x)", mutationGranted:"Azure", mutationMultiplier:75, baseXpRate:38, hatchTimeMin:50 },
  { id:"tiger", name:"Tiger", emoji:"🐅", ability:"Grants Enlightened mutation (35x)", mutationGranted:"Enlightened", mutationMultiplier:35, baseXpRate:28, hatchTimeMin:35 },
  { id:"raiju", name:"Raiju", emoji:"⚡", ability:"Grants Static mutation (8x)", mutationGranted:"Static", mutationMultiplier:8, baseXpRate:22, hatchTimeMin:20 },
  { id:"mandrake", name:"Mandrake", emoji:"🌱", ability:"Grants Rot mutation (8x)", mutationGranted:"Rot", mutationMultiplier:8, baseXpRate:16, hatchTimeMin:15 },
  { id:"gnome", name:"Gnome", emoji:"🍄", ability:"Grants Gnomed mutation (15x)", mutationGranted:"Gnomed", mutationMultiplier:15, baseXpRate:18, hatchTimeMin:18 },
  { id:"sprite", name:"Sprite", emoji:"✨", ability:"Grants Luminous mutation (50x)", mutationGranted:"Luminous", mutationMultiplier:50, baseXpRate:30, hatchTimeMin:35 },
  { id:"hydra", name:"Hydra", emoji:"🐍", ability:"Grants Terran mutation (75x)", mutationGranted:"Terran", mutationMultiplier:75, baseXpRate:40, hatchTimeMin:55 },
  { id:"zebra", name:"Zebra", emoji:"🦓", ability:"Grants Stampede mutation (50x)", mutationGranted:"Stampede", mutationMultiplier:50, baseXpRate:28, hatchTimeMin:30 },
  { id:"giraffe", name:"Giraffe", emoji:"🦒", ability:"Grants Arid mutation (6x)", mutationGranted:"Arid", mutationMultiplier:6, baseXpRate:20, hatchTimeMin:22 },
  { id:"hippo", name:"Hippo", emoji:"🦛", ability:"Grants Monsoon mutation (50x)", mutationGranted:"Monsoon", mutationMultiplier:50, baseXpRate:32, hatchTimeMin:38 },
  { id:"cheetah", name:"Cheetah", emoji:"🐆", ability:"Grants Wildfast mutation (5x)", mutationGranted:"Wildfast", mutationMultiplier:5, baseXpRate:24, hatchTimeMin:20 },
  { id:"geodeTurtle", name:"Geode Turtle", emoji:"🐢", ability:"Grants Geode mutation (5x)", mutationGranted:"Geode", mutationMultiplier:5, baseXpRate:14, hatchTimeMin:25 },
  { id:"sapphiremacaw", name:"Sapphire Macaw", emoji:"💎", ability:"Grants Crystalized mutation (25x)", mutationGranted:"Crystalized", mutationMultiplier:25, baseXpRate:26, hatchTimeMin:30 },
  { id:"trapdoorspider", name:"Trapdoor Spider", emoji:"🕷️", ability:"Grants Webbed mutation (8x)", mutationGranted:"Webbed", mutationMultiplier:8, baseXpRate:16, hatchTimeMin:15 },
  { id:"kitsune", name:"Kitsune", emoji:"🦊", ability:"Grants Chakra mutation (15x)", mutationGranted:"Chakra", mutationMultiplier:15, baseXpRate:30, hatchTimeMin:40 },
  { id:"cockatrice", name:"Cockatrice", emoji:"🐓", ability:"Grants Toxic mutation (15x)", mutationGranted:"Toxic", mutationMultiplier:15, baseXpRate:22, hatchTimeMin:25 },
  { id:"ghostbear", name:"Ghostbear", emoji:"🐻", ability:"Grants Spooky mutation (8x)", mutationGranted:"Spooky", mutationMultiplier:8, baseXpRate:20, hatchTimeMin:22 },
  { id:"darkspriggan", name:"Dark Spriggan", emoji:"🌑", ability:"Grants Blight mutation (8x)", mutationGranted:"Blight", mutationMultiplier:8, baseXpRate:18, hatchTimeMin:20 },
  { id:"hexserpent", name:"Hex Serpent", emoji:"🐍", ability:"Grants Pestilent mutation (8x)", mutationGranted:"Pestilent", mutationMultiplier:8, baseXpRate:18, hatchTimeMin:20 },
  { id:"whale", name:"Whale", emoji:"🐋", ability:"Grants Whalebound mutation (50x)", mutationGranted:"Whalebound", mutationMultiplier:50, baseXpRate:35, hatchTimeMin:50 },
  { id:"penguin", name:"Penguin", emoji:"🐧", ability:"Grants Arctic mutation (12x)", mutationGranted:"Arctic", mutationMultiplier:12, baseXpRate:20, hatchTimeMin:22 },
  { id:"frostdragon", name:"Frost Dragon", emoji:"🐲", ability:"Grants Glacial mutation (25x)", mutationGranted:"Glacial", mutationMultiplier:25, baseXpRate:35, hatchTimeMin:45 },
  { id:"goldengoose", name:"Golden Goose", emoji:"🪿", ability:"Grants Fortune mutation (50x)", mutationGranted:"Fortune", mutationMultiplier:50, baseXpRate:30, hatchTimeMin:40 },
  { id:"windwyvern", name:"Wind Wyvern", emoji:"🐉", ability:"Converts Windstruck → Gale (25x)", mutationGranted:"Gale", mutationMultiplier:25, baseXpRate:32, hatchTimeMin:42 },
  { id:"lemonlion", name:"Lemon Lion", emoji:"🦁", ability:"Grants Brainrot mutation (100x)", mutationGranted:"Brainrot", mutationMultiplier:100, baseXpRate:40, hatchTimeMin:55 },
  { id:"calico", name:"Calico Cat", emoji:"🐱", ability:"Grants Sleepy mutation (3x)", mutationGranted:"Sleepy", mutationMultiplier:3, baseXpRate:12, hatchTimeMin:10 },
  { id:"bearonbike", name:"Bear on Bike", emoji:"🐻", ability:"Grants Whimsical mutation (6x)", mutationGranted:"Whimsical", mutationMultiplier:6, baseXpRate:18, hatchTimeMin:20 },
  { id:"galahcockatoo", name:"Galah Cockatoo", emoji:"🦜", ability:"Grants Opulent mutation (5x)", mutationGranted:"Opulent", mutationMultiplier:5, baseXpRate:16, hatchTimeMin:18 },
  { id:"goldfinch", name:"Goldfinch", emoji:"🐤", ability:"Grants Goldsparkle mutation (500x)", mutationGranted:"Goldsparkle", mutationMultiplier:500, baseXpRate:50, hatchTimeMin:120 },
];

// ─── CATEGORY LABELS ───
export const PLANT_CATEGORIES: Record<string, string> = {
  "seed-shop": "🛒 Seed Shop",
  "easter": "🥚 Easter Event", "night": "🌙 Night Event", "bee": "🐝 Bee Event",
  "summer": "🏝️ Summer Event", "prehistoric": "🦕 Prehistoric Event",
  "zen": "🧘 Zen Update", "cooking": "🍳 Cooking Event",
  "beanstalk": "🫘 Beanstalk Event", "fairy": "🧚 Fairy Event",
  "fall": "🍂 Fall Event", "seed-tiers": "🌱 Seed Tiers",
  "halloween": "🎃 Halloween Event", "safari": "🦁 Safari Event",
  "smithing": "⚒️ Smithing Event", "trading": "🤝 Trading Update",
  "christmas": "🎄 Christmas Update", "new-years": "🎆 New Years",
  "buttercup": "🌼 Buttercup Update", "limited": "⭐ Limited / Ascension",
};

export const MUTATION_TIER_COLORS: Record<string, string> = {
  common: "#9ca3af", uncommon: "#22c55e", rare: "#3b82f6", legendary: "#a855f7", mythic: "#f59e0b",
};

// ─── HELPER FUNCTIONS ───
export function calcMutationMultiplier(selectedMutations: Mutation[]): number {
  if (selectedMutations.length === 0) return 1;
  const sum = selectedMutations.reduce((acc, m) => acc + m.multiplier, 0);
  return sum - selectedMutations.length + 1;
}

export function calcPlantValue(baseValue: number, weight: number, amount: number, mutMult: number): number {
  return baseValue * weight * mutMult * amount;
}

export function calcWeightFromValue(baseValue: number, targetValue: number, mutMult: number): number {
  if (baseValue <= 0 || mutMult <= 0) return 0;
  return targetValue / (baseValue * mutMult);
}

export function formatValue(val: number): string {
  if (val >= 1e12) return `${(val / 1e12).toFixed(3)} Trillion`;
  if (val >= 1e9) return `${(val / 1e9).toFixed(3)} Billion`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(3)} Million`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
  return val.toFixed(0);
}
