const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  deleteFirestoreData,
  getDocFieldData,
} = require("../../firebase/firestoreObserver");
const { captainId, channelId_ann, auth, logo_url } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reject")
    .setDescription("reject and remove the form")
    .addStringOption((option) =>
      option.setName("reg-id").setDescription("input Reg ID").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for the reject.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const allowedUserIds = [auth.role.admin, auth.role.officer];
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }

    const ann_channel = interaction.client.channels.cache.get(channelId_ann); // Replace with the ID of the first channel

    const documentId = interaction.options.getString("reg-id");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";
    try {
      await interaction.options.getString("reg-id");
      const discordId = await getDocFieldData(documentId);
      const username = await JSON.parse(discordId);
      await deleteFirestoreData(documentId);
      const embed = new EmbedBuilder()
        .setTitle(`Application Rejected`)
        .setDescription(`application for join has been rejected`)
        .setColor(0xff0000)

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
            name: `Discord Tag:`,
            value: `${username}`,
            inline: true,
          },
          {
            name: `Rejected by:`,
            value: `<@${interaction.user.id}>`,
            inline: true,
          },

          {
            name: `For Reason`,
            value: `${reason}`,
          },
        ]);
      await ann_channel.send({ embeds: [embed] });
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
