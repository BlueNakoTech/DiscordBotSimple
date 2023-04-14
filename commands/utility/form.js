const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getFirestoreData } = require("../../firebase/firestoreObserver");



module.exports = {
  data: new SlashCommandBuilder()
    .setName("form")
    .setDescription("View"),
  async execute(interaction) {
    try {
      const data = await getFirestoreData();
      if (data.length === 0) {
        await interaction.reply({ content: 'No data available.', ephemeral: true });
      } else {
        const embeds = data.map((doc) => {
          const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('New Recruit for T.K.R.I')
            .addFields(
              { name: 'Discord', value: doc.Discord.toString() },
              { name: 'Name', value: doc.Nama.toString() },
              { name: 'Ingame Name', value: doc.nickname.toString() },
              { name: 'Main Nation', value: doc.Negara.toString() }
            );
          return embed;
        });
        
        await interaction.reply({ embeds });
      }
      
      
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while retrieving the data.', ephemeral: true });
    }
    
  },
};
