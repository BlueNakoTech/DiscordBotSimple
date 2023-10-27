const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { captainId, chiefId_1, chiefId_2, comchannel, logo_url, wtRoleId } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nonsense')
    .setDescription('create nonsense')
    .addUserOption(option => option.setName('target').setDescription('The user\'s to add'))
    .addStringOption(option =>
      option
        .setName('content')
        .setDescription('text nonsense')
        .setRequired(false)),
        

  async execute(interaction) {
    const allowedUserIds = [captainId];
    const channel = interaction.channel;
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true,
      });
    }

    
    let user = interaction.options.getMember('target');
  

    let description = interaction.options.getString('content');

    await channel.send({content: `${user}${description}`, ephemeral:true})
    await interaction.reply({content:"interaction send", ephemeral:true})
  },
};
