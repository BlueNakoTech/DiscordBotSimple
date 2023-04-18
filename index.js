// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, EmbedBuilder } = require("discord.js");
const { channelId_dev, guildId_DEV, captainId } = require("./config.json");
const { token } = require("./tokenId.json");
const firestoreListener = require("./firebase/firestoreListener");
const { google } = require("googleapis");
const admin = require('firebase-admin');
const db = admin.firestore;

// Create a new client instance
const client = new Client({
  intents: 32767,
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

const youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyAJ6-Qi-0hSKuMG-k4EZXwBRmhnWuwGHCM",
});
client.on("message", async (message) => {
  const responseid = youtube.channels.list({
    part: "id",
    forUsername: "Warthunder",
  });

  // Extract the channelId from the response
  const channelId = await responseid.data.items[0].id;
  if (message.content === "!live") {
    
    // Make a request to the YouTube API to get the live stream details
    const response = await youtube.liveBroadcasts.list({
      part: "snippet",
      broadcastType: "all",
      eventType: "live",
      channelId: channelId,
    });

    // Extract the live stream details from the response
    const liveBroadcast = response.data.items[0];
    

    // Create a new message embed with information about the live stream
    const embed = new EmbedBuilder()
      .setTitle(liveBroadcast.snippet.title)
      .setDescription(liveBroadcast.snippet.description)
      .setURL(`https://www.youtube.com/watch?v=${liveBroadcast.id}`)
      .setThumbnail(liveBroadcast.snippet.thumbnails.default.url)
      .addField("Channel", liveBroadcast.snippet.channelTitle)
      .addField("Viewers", liveBroadcast.statistics.concurrentViewers, true)
      .addField("Likes", liveBroadcast.statistics.likeCount, true)
      .setFooter(
        `${client.user.username} - ${liveBroadcast.snippet.publishedAt}`
      );

    // Send the embed message to the Discord channel
    const channel = message.channel;
    channel.send(embed);

    // Listen for new messages in the live stream chat
   
  }
});
// Set up the YouTube API client



client.once(Events.ClientReady, (c) => {
  console.log(`Firebase Ready`);
  firestoreListener.on("newDocument", (dataString) => {
    console.log(`New document added`);

    const guild = client.guilds.cache.get(guildId_DEV);
    const channel = guild.channels.cache.get(channelId_dev);

    channel.send(
      `<@${captainId}>-Sensei!!   \nThere is new **Recruit** form for **War Thunder** \nPlease type "**/form**" to view`

      // `Sensei!! There is new Recruit form for War Thunder.
      // \nFrom
      // \nDiscord User: ${dataString.Discord}
      // \nIn-game Name: ${dataString.nickname}
      // \nMain Nation: ${dataString.Negara}
      // \nName: ${dataString.Nama}`
    );
  });
});

client.on('ready', () => {
  console.log(`AutoRole Set`);
});

// Start the Firestore observer

// Function to assign a role to a member
async function assignRole(member) {
  const role = member.guild.roles.cache.find(r => r.name === 'War Thunder');
  if (!role) {
    console.log(`Could not find role with name ROLE_NAME`);
    return;
  }
  try {
    await member.roles.add(role);
    console.log(`Added role ${role.name} to member ${member.user.tag}`);
  } catch (error) {
    console.error(`Error assigning role to member ${member.user.tag}: ${error}`);
  }
}
// Log in to Discord with your client's token
client.login(token);
