const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getFirestoreData } = require("../../firebase/firestoreObserver");
const { captainId, chiefId_1, chiefId_2 } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("form").setDescription("View"),
  async execute(interaction) {
    const allowedUserIds = [captainId, chiefId_1, chiefId_2];
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }
    try {
      const data = await getFirestoreData();
      if (data.length === 0) {
        await interaction.reply({
          content: "No data available.",
          ephemeral: true,
        });
      } else {
        const embeds = data.map((doc) => {
          const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("New Recruit for T.K.R.I")
            .setThumbnail(
              "https://cdn.discordapp.com/attachments/654304946447056899/1095208877953384469/Logo_tKRI.png"
            )
            .addFields(
              { name: "Discord", value: doc.Discord.toString() },
              { name: "Name", value: doc.Nama.toString() },

              {
                name: "In-game Name",
                value: doc.nickname.toString(),
                inline: true,
              },
              { name: "Reg. ID", value: doc.id, inline: true },
              { name: "Main Nation", value: `${doc.Negara.toString()}` }
            )

            .setFooter({
              iconURL: interaction.client.user.displayAvatarURL(),
              text: `${interaction.client.user.username} - Squadron Secretary`,
            });
          return embed;
        });

        await interaction.reply({ embeds });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content:
          "An error occurred while retrieving the data. please contact admin",
        ephemeral: true,
      });
    }
  },
};
