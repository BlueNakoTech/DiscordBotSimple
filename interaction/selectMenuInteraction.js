const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const { captainId, chiefId_1, chiefId_2, logo_url, threadId ,channelId_ann} = require("../config.json");
const { getFieldData, deleteFirestoreData, getDocFieldData, writeData, moveDocument} = require("../firebase/firestoreObserver");
module.exports = async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'regid') {
    
    try {
      // Handle the selection here and prepare the content for the second embed with buttons
      var selectedValue = interaction.values[0];
       // Get the selected value from the select menu
      const doc = await getFieldData(selectedValue);
      
      // Create the second embed with buttons based on the selected value
      const secondEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Form of Application")
        .setThumbnail(logo_url)
        .addFields(
          { name: "Discord", value: doc.Discord.toString() },
          { name: "Nama", value: doc.Nama.toString() },

          {
            name: "In-game Name",
            value: doc.nickname.toString(),
            inline: true,
          },
          { name: "Reg. ID", value: selectedValue, inline: true },
          { name: "Negara Utama", value: `${doc.Negara.toString()}` }
        )

        .setFooter({
          iconURL: interaction.client.user.displayAvatarURL(),
          text: `${interaction.client.user.username} - Squadron Secretary`,
        });
  
      // Create buttons for the second embed (customize this part as needed)
      const button1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel('Approve')
        .setCustomId('approved');
  
      const button2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Reject')
        .setCustomId('rejected');
  
        const button3 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel('On Hold')
        .setCustomId('hold');
      const row2 = new ActionRowBuilder()
        .addComponents(button1, button2, button3);
  
      // Send the second embed as a follow-up message
      const reply = await interaction.reply({
        embeds: [secondEmbed],
        components: [row2],
      });

     
      const filter = (i) => ['approved', 'rejected'].includes(i.customId) && i.user.id === interaction.user.id;
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });


      collector.on('collect', async (buttonInteraction) => {
      
      if (buttonInteraction.customId === 'approved') {
      const discordId = await getDocFieldData(selectedValue);
      await writeData(discordId);
      await moveDocument(selectedValue, "Formulir", "approved");
      const username = JSON.parse(discordId);
      await deleteFirestoreData(selectedValue);

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
        
        await reply.edit({
          
          embeds: [embed], 
          components: [], 
        });
      } else if (buttonInteraction.customId === 'rejected') {
        const allowedUserIds = [captainId, chiefId_1, chiefId_2];
        if (!allowedUserIds.includes(interaction.user.id)) {
          console.log('Unrestricted Command');
          return await interaction.reply({
            content: "Sorry, you're not allowed to use this command.",
            ephemeral: true, // Only the user who triggered the command can see this response
            
          });
          
        }
    

    
       
        
        try {
          
          const discordId = await getDocFieldData(selectedValue);
          const username = await JSON.parse(discordId);
          await deleteFirestoreData(selectedValue);
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
    
             
            ]);
          
          await reply.edit({
            embeds: [embed],
            components: [],
          });
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: `Terjadi Kesalahan, Silahkan kontak <@${captainId}>.`,
            ephemeral: true,
          });
        }
      }
      });
  

 
      
    } catch (error) {
      console.error('Error handling select menu interaction:', error);
      // You can log the error or send an error message as needed
    }

  }

    
  
};
