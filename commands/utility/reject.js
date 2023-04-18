const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {
  deleteFirestoreData,
  getDocFieldData,
  writeData,
  getDiscordUserId,
  moveDocument,
} = require("../../firebase/firestoreObserver");
const { captainId, channelId_ann } = require("../../config.json");

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
    // const requiredRole = interaction.guild.roles.cache.find(
    //   (role) => role.name === "Admin"
    // );
    // if (!interaction.member.roles.cache.has(requiredRole.id)) {
    //   return interaction.reply(
    //     "You do not have permission to use this command."
    //   );
    // }
    if (interaction.user.id !== captainId) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
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
      // await deleteFirestoreData(documentId);
      const embed = new EmbedBuilder()
        .setTitle(`Application Rejected`)
        .setDescription(`application for join has been rejected`)
        .setColor(0xff0000)

        .setThumbnail(
          "https://cdn.discordapp.com/attachments/654304946447056899/1095208877953384469/Logo_tKRI.png"
        )
        .setTimestamp(Date.now())

        .setFooter({
          iconURL: interaction.client.user.displayAvatarURL(),
          text: `${interaction.client.user.username} - Squadron Secretary`,
        })
        .addFields([
          {
            name: `Username:`,
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
