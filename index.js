// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  EmbedBuilder,
  UserManager,
} = require("discord.js");
const {
  wtRoleId,
  channelId,
  clientId,
  chiefId_1,
  chiefId_2,
  guildId,
  comchannel,
  captainId,
  channelId_ann,
} = require("./config.json");
const {
  assignRole
} = require("./function/assignRole");
const { token } = require("./tokenId.json");
const firestoreListenerUser = require("./firebase/firestoreListenerUsers");
const firestoreListener = require("./firebase/firestoreListener");
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
    const channel = guild.channels.cache.get(comchannel);

    channel.send(
      `<@${captainId}> <@${chiefId_1}> <@${chiefId_2}>  \nThere is new **Recruit** form for **War Thunder** \nPlease type "**/form**" to view`


    );
  });

  firestoreListenerUser.on("newUsers", async (dataString) => {

    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId_ann);
    const channel_2 = guild.channels.cache.get(comchannel);
    const jsonData = dataString.discord;
    const jsonString = JSON.parse(jsonData);

    const member = guild.members.cache.find(
      (member) => member.user.username === jsonString
    );

    if (!member) {
      console.log(`Member with user tag ${jsonString} not found in guild.`);
      setTimeout(() => {
        channel_2.send({
          content: `<@${clientId}> unable to assign role for ${jsonString}, member has not found in server.\n<@${captainId}>-sensei, please check and proceed accordingly `,
          ephemeral: true
        });
      }, 5000);
      
      
    }else{
    const mentionString = member.toString();
    assignRole(member);

    setTimeout(() => {
      channel.send(
        `<@&${wtRoleId}> new member has joined \n${mentionString} Welcome to Squadron, \nMay the snail bless upon you`
      );
    }, 5000); // 5000ms or 5 seconds delay
  }});

});


client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isModalSubmit()) return;

	// Get the data entered by the user
	const username = interaction.fields.getTextInputValue('usernameInput');
	const ign = interaction.fields.getTextInputValue('ignInput');
  const name = interaction.fields.getTextInputValue('panggilanInput');
  const nation = interaction.fields.getTextInputValue('techtreeInput');

  const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("New Recruit for Q.E.D")
            .setThumbnail(
              logo_url
            )
            .addFields(
              { name: "Discord", value: username},
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
          return embed;

}

);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'FormRequest') {
		await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
	}
});

// Log in to Discord with your client's token
client.login(token);
