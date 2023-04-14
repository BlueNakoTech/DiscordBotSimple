// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { token, channelId, guildId, captainId } = require("./config.json");
const firestoreListener = require("./firebase/firestoreListener");

// Create a new client instance
const client = new Client({
  intents: 32767
});
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.once(Events.ClientReady, (c) => {
  console.log(`Firebase Ready`);
  firestoreListener.on("newDocument", (dataString) => {
    console.log(`New document added`);
    
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);

    channel.send(

      `Sensei!! <@${captainId}>  \nThere is new Recruit form for War Thunder \nPlease type /form to view`
      
      
      // `Sensei!! There is new Recruit form for War Thunder. 
      // \nFrom 
      // \nDiscord User: ${dataString.Discord} 
      // \nIn-game Name: ${dataString.nickname}
      // \nMain Nation: ${dataString.Negara}
      // \nName: ${dataString.Nama}`
    );
  });
});


 


// Log in to Discord with your client's token
client.login(token);
