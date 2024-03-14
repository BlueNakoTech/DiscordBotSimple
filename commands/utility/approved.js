const {
  SlashCommandBuilder,
  EmbedBuilder,

} = require("discord.js");
const {
  deleteFirestoreData,
  getDocFieldData,
  writeData,
  moveDocument,
} = require("../../firebase/firestoreObserver");
const { captainId, auth, channelId_ann, logo_url} = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("approve")

    .setDescription("approve and remove the form")
    .addStringOption((option) =>
      option.setName("reg-id").setDescription("input Reg ID").setRequired(true)
    ),

  async execute(interaction, client) {
    const allowedUserIds = [auth.role.admin, auth.role.officer, auth.role.captain];
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }
    const ann_channel = interaction.client.channels.cache.get(channelId_ann); // Replace with the ID of the first channel

    const documentId = interaction.options.getString("reg-id");
    try {
      await interaction.options.getString("reg-id");
      const discordId = await getDocFieldData(documentId);
      await writeData(discordId);
      await moveDocument(documentId, "Formulir", "approved");
      const username = JSON.parse(discordId);

    
     
      
      

      await deleteFirestoreData(documentId);
      const embed = new EmbedBuilder()
        .setTitle(`Application Approved`)
        .setColor(0x00ff00)

        .setThumbnail(
          logo_url
        )
        .setTimestamp(Date.now())

        .setFooter({
          iconURL: interaction.client.user.displayAvatarURL(),
          text: `${interaction.client.user.username} - Squadron Secretary`,
        })
        .addFields([

          {
            name: `Approved by:`,
            value: `<@${interaction.user.id}>`,
            inline: true,
          },
          {
            name: `Discord User:`,
            value: `${username}`,
            inline: true,
          },
         
        ]);

        const embed_1 = new EmbedBuilder()
        .setTitle(`Application Approved`)
        .setDescription(`application for join has been approved`)
        .setColor(0x00ff00)

        .setThumbnail(
          logo_url
        )
        .setTimestamp(Date.now())

        .setFooter({
          iconURL: interaction.client.user.displayAvatarURL(),
          text: `${interaction.client.user.username} - Squadron Secretary`,
        })
        .addFields([
          {
            name: `Discord user:`,
            value: `${username}`,
            inline: true,
          },
          {
            name: `Approved by:`,
            value: `<@${interaction.user.id}>`,
            inline: true,
          },
        ]);
      await ann_channel.send({ embeds: [embed_1] });
      await interaction.reply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: `Terjadi Kesalahan, Silahkan kontak <@${captainId}>.`,
        ephemeral: true,
      });
    }
  },
};
