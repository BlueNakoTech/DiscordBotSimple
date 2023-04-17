const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getFirestoreData } = require("../../firebase/firestoreObserver");
const { captainId, channelId_ann, } = require("../../config.json")


module.exports = {
  data: new SlashCommandBuilder()
    .setName("form")
    .setDescription("View"),
  async execute(interaction) {
    if (interaction.user.id !== captainId) {
      
			return interaction.reply({content:'You do not have permission to use this command.', ephemeral: true});
		  }
    try {
      const data = await getFirestoreData();
      if (data.length === 0) {
        await interaction.reply({ content: 'No data available.', ephemeral: true });
      } else {
        const embeds = data.map((doc) => {
          const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('New Recruit for T.K.R.I')
            .setThumbnail('https://cdn.discordapp.com/attachments/654304946447056899/1095208877953384469/Logo_tKRI.png')
            .addFields(
              { name: 'Discord', value: doc.Discord.toString()},
              { name: 'Name', value: doc.Nama.toString() },
              
              { name: 'In-game Name', value: doc.nickname.toString(), inline: true  },
              { name: 'Reg. ID', value: doc.id, inline: true },
              { name: 'Main Nation', value: `${doc.Negara.toString()}`},
              
              
              
            )
           

            .setFooter({
              iconURL: interaction.client.user.displayAvatarURL(),
              text: "Squadron Secretary",
            })
          return embed;
        });
        
        await interaction.reply({ embeds });
      }
      
      
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while retrieving the data. please contact admin', ephemeral: true });
    }
    
  },
};
