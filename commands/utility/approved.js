const {
  SlashCommandBuilder,
  EmbedBuilder,
  UserManager,
  Client,
} = require("discord.js");
const {
  deleteFirestoreData,
  getDocFieldData,
  writeData,
  getDiscordUserId,
  moveDocument,
  assignRole
} = require("../../firebase/firestoreObserver");
const { captainId, channelId_ann, guildId } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("approve")

    .setDescription("approve and remove the form")
    .addStringOption((option) =>
      option.setName("reg-id").setDescription("input Reg ID").setRequired(true)
    ),

  async execute(interaction, client) {
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
    try {
      await interaction.options.getString("reg-id");
      const discordId = await getDocFieldData(documentId);
      await writeData(discordId);
      await moveDocument(documentId, "Formulir", "approved");
      const username = JSON.parse(discordId);
      
    
     
      
      

      await deleteFirestoreData(documentId);
      const embed = new EmbedBuilder()
        .setTitle(`Application Approved`)
        .setDescription(`application for join has been approved`)
        .setColor(0x00ff00)

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
            name: `Discord Tag:`,
            value: `${username}`,
            inline: true,
          },
          {
            name: `Approved by:`,
            value: `<@${interaction.user.id}>`,
            inline: true,
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
