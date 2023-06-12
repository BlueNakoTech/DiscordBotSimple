const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getFirestoreData } = require("../../firebase/firestoreObserver");
const { captainId, chiefId_1, chiefId_2, logo_url } = require("../../config_dev.json");

module.exports = {
  data: new SlashCommandBuilder().setName("form").setDescription("View"),
  async execute(interaction) {
    const allowedUserIds = [captainId, chiefId_1, chiefId_2];
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Maaf, anda tidak diperpolehkan menggunakan perintah ini",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }
    try {
      const data = await getFirestoreData();
      if (data.length === 0) {
        await interaction.reply({
          content: "Tidak ada Data",
          ephemeral: true,
        });
      } else {
        const embeds = data.map((doc) => {
          const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("New Recruit for Q.E.D")
            .setThumbnail(
              logo_url
            )
            .addFields(
              { name: "Discord", value: doc.Discord.toString() },
              { name: "Nama", value: doc.Nama.toString() },

              {
                name: "In-game Name",
                value: doc.nickname.toString(),
                inline: true,
              },
              { name: "Reg. ID", value: doc.id, inline: true },
              { name: "Negara Utama", value: `${doc.Negara.toString()}` }
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
