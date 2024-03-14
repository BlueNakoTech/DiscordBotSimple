const { SlashCommandBuilder,ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle,StringSelectMenuBuilder,StringSelectMenuOptionBuilder} = require("discord.js");
const { getFirestoreData } = require("../../firebase/firestoreObserver");


const { captainId, auth, logo_url, threadId ,channelId_ann} = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("form").setDescription("View"),
  async execute(interaction) {
    const allowedUserIds = [auth.role.officer, auth.role.admin];
    const allowedRoleIds = [auth.role.admin];
    if (!allowedUserIds.includes(interaction.user.id) &&
    !interaction.member.roles.cache.some((role) => allowedRoleIds.includes(role.id))) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Maaf, anda tidak diperpolehkan menggunakan perintah ini",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }
    const viewButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('View Form')
      .setCustomId('viewForm');
      // <@${chiefId_1}> <@${chiefId_2}>
    const row = new ActionRowBuilder()
    .addComponents(viewButton);
   await interaction.reply({
      content : `Check Form`,
      components : [row]
    });
  }
}
