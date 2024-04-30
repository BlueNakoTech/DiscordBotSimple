// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const buttonHandler = require(`./interaction/buttonInteraction`);
const selectHandler = require(`./interaction/selectMenuInteraction`);
const fetch = require('node-fetch');
const {
  Client,
  Collection,
  Events,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle


} = require("discord.js");
const {

  wtRoleId,

  clientId,
 
  guildId,
  kantorId,
  auyh,
  captainId,
  channelId_ann,
  logo_url,
  auth
} = require("./config.json");
const {
  assignRole
} = require("./function/assignRole");
const { token } = require("./tokenId.json");
const firestoreListenerUser = require("./firebase/firestoreListenerUsers");
const firestoreListener = require("./firebase/firestoreListener");
const firestoreObserver = require("./firebase/firestoreObserver");
const { google } = require("googleapis");
const admin = require("firebase-admin");
const { channel } = require("node:diagnostics_channel");
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


// Set up the YouTube API client

client.once(Events.ClientReady, (c) => {
  console.log(`Firebase Ready`);
  firestoreListener.on("newDocument", (dataString) => {
    console.log(`New Form added`);

    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(kantorId);
    const viewButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('View Form')
      .setCustomId('viewForm');

    const officerRoleIDs = auth.role.officer;

    // Creating an array to store officer mentions
    const officerMentions = officerRoleIDs.map(id => `<@${id}>`);

    const row = new ActionRowBuilder()
      .addComponents(viewButton);
    channel.send({
      content: `There is a new **Recruit** form for **War Thunder**\nClick button below to view\nOfficers: ${officerMentions.join(', ')}`,
      components: [row]
    });

  });

  firestoreListenerUser.on("newUsers", async (dataString) => {

    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId_ann);
    const channel_2 = guild.channels.cache.get(kantorId);
    const jsonData = dataString.discord;
    const jsonString = JSON.parse(jsonData);

    const member = guild.members.cache.find(
      (member) => member.user.username === jsonString
    );

    if (!member) {
      console.log(`Member with user tag ${jsonString} not found in guild.`);
      setTimeout(() => {
        channel_2.send({
          content: `<@${clientId}> unable to assign role for ${jsonString}, si tolol salah tulis username.\n<@${captainId}>-sensei, tolong kasih role sendiri`,
          ephemeral: true
        });
      }, 5000);


    } else {
      const mentionString = member.toString();
      assignRole(member);

      setTimeout(() => {
        channel.send(
          `<@&${wtRoleId}> new member has joined \n${mentionString} Welcome to Squadron, \nMay the snail bless upon you`
        );
      }, 5000); // 5000ms or 5 seconds delay
    }
  });

});





client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isModalSubmit()) return;

  if (interaction.customId === 'FormRequest') {
    const username = interaction.fields.getTextInputValue('usernameInput').toLowerCase();
    const ign = interaction.fields.getTextInputValue('ignInput');
    const name = interaction.fields.getTextInputValue('panggilanInput');
    const nation = interaction.fields.getTextInputValue('techTreeInput');
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get('1098293055855018044');
    const threadChannel = await interaction.guild.channels.fetch(kantorId);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("New Recruit for Q.E.D")
      .setDescription("Apply via Discord Form (TEST)")
      .setThumbnail(
        logo_url
      )
      .addFields(
        { name: "Discord", value: username },
        { name: "Nama", value: name },

        {
          name: "In-game Name",
          value: ign,
          inline: true,
        },

        { name: "Negara Utama", value: nation }
      )

      .setFooter({
        iconURL: interaction.client.user.displayAvatarURL(),
        text: `${interaction.client.user.username} - Squadron Secretary`,
      });

    // await channel.send({ embeds: [embed] });
    await firestoreObserver.writeSubmittedData(name, username, ign, nation);
    await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
  }
  if (interaction.customId === 'FormEditrtr') {
    const username = interaction.fields.getTextInputValue('usernameInput').toLowerCase();
    const ign = interaction.fields.getTextInputValue('ignInput');
    const token = interaction.fields.getTextInputValue('tokenInput');
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get('1098293055855018044');
    const threadChannel = await interaction.guild.channels.fetch(kantorId);
    const doc = await firestoreObserver.getDocbyID(token);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("New Recruit for Q.E.D")
      .setDescription("Apply via Discord Form (TEST)")
      .setThumbnail(
        logo_url
      )
      .addFields(
        { name: "Discord", value: doc.Discord },
        { name: "Nama", value: doc.Nama },

        {
          name: "In-game Name",
          value: doc.nickname,
          inline: true,
        },

        { name: "Negara Utama", value: doc.Negara }
      )

      .setFooter({
        iconURL: interaction.client.user.displayAvatarURL(),
        text: `${interaction.client.user.username} - Squadron Secretary`,
      });

    // await channel.send({ embeds: [embed] });
    await firestoreObserver.upDocument(token, ign, username);
    await interaction.reply({ content: 'The data sucessfully change', components: [embed] });
  }
});



fetch.defaults = {
  ...fetch.defaults,
  follow: 1000, // Change this to your desired maximum number of redirects
};

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const { commandName } = interaction;

//   if (commandName === 'url') {
//     const urlString = interaction.options.getString('source');
//     const imageUrl = urlString; // Use the provided URL as the image URL
//     const formattedUrlString = `\`${urlString}\``
//     try {
//       // Fetch the image
//       const response = await fetch(imageUrl);
//       if (!response.ok) {
//         throw new Error('Failed to fetch image');
//       }

//       // Read the image as a buffer
//       const imageBuffer = await response.buffer();

//       // Send the image as an attachment
//       await interaction.editReply({
//         files: [{
//           attachment: imageBuffer,
//           name: 'image.jpg', // You can change the filename if needed
//         }],
//       });
//     } catch (error) {
//       console.error(error);
//       await interaction.editReply(formattedUrlString);
//     }
//   }
// });

client.on('interactionCreate', buttonHandler);
client.on('interactionCreate', selectHandler);


// Log in to Discord with your client's token
client.login(token);
