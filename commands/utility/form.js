const { SlashCommandBuilder,ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle,StringSelectMenuBuilder,StringSelectMenuOptionBuilder} = require("discord.js");
const { getFirestoreData } = require("../../firebase/firestoreObserver");


const { captainId, chiefId_1, chiefId_2, logo_url, threadId ,channelId_ann} = require("../../config.json");

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
    if (interaction.customId === 'approved'){

    }
    const threadChannel = await interaction.guild.channels.fetch(threadId);
    const data = await getFirestoreData();
    const approveButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setLabel('Approve')
      .setCustomId('approved');
    
    const rejectButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setLabel('Reject')
      .setCustomId('rejected');

      const options = data.map((doc) => {
        const option = new StringSelectMenuOptionBuilder()
          .setLabel(doc.Nama.toString()) // Set the label
          .setDescription(doc.id) // Set the description (if needed)
          .setValue(doc.id.toString()); // Set the value
      
        return option;
      });

    const select = new StringSelectMenuBuilder()
      .setCustomId('regid')
      .setPlaceholder('Nama')
      .addOptions( 
        options
      )
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

       
        // await threadChannel.send({ mbeds });
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
    const row1 = new ActionRowBuilder()
    .addComponents( select);
    const row2 = new ActionRowBuilder()
    .addComponents(  approveButton, rejectButton);
   
    await interaction.followUp({
      content: '**[WIP]** - Not yet Functional',
      components : [row1,row2]});
  },
};
