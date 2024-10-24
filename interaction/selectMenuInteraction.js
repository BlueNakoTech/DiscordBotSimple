const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { captainId, logo_url, threadId, channelId_ann, auth } = require("../config.json");
const { getFieldData, deleteFirestoreData, getDocFieldData, writeData, moveDocument, writeCloneData } = require("../firebase/firestoreObserver");
module.exports = async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'regid') {
    try {
      var selectedValue = interaction.values[0];
      console.log(`Selected Value: ${selectedValue}`);

      const doc = await getFieldData(selectedValue);
      const channel = interaction.client.channels.cache.get(channelId_ann);

      // Create the embed and buttons
      const secondEmbed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("Form of Application")
        .setThumbnail(logo_url)
        .addFields(
          { name: "Discord", value: doc.Discord.toString() },
          { name: "Nama", value: doc.Nama.toString() },
          { name: "In-game Name", value: doc.nickname.toString(), inline: true },
          { name: "Reg. ID", value: selectedValue, inline: true },
          { name: "Negara Utama", value: `${doc.Negara.toString()}` }
        )
        .setFooter({
          iconURL: interaction.client.user.displayAvatarURL(),
          text: `${interaction.client.user.username} - Squadron Secretary`,
        });

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

      const row2 = new ActionRowBuilder().addComponents(button1, button2, button3);

      // Defer reply to handle interaction properly
      await interaction.deferReply();
      const reply = await interaction.editReply({
        embeds: [secondEmbed],
        components: [row2],
      });

      // Set up a filter for the buttons
      const filter = (i) => {
        return ['approved', 'rejected', 'hold'].includes(i.customId) && i.user.id === interaction.user.id;
      };

      // Create the collector for button interactions (2 minutes time)
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 120000, // 2 minutes
      });

      // Collect interactions (button clicks)
      collector.on('collect', async (buttonInteraction) => {
        // Stop the collector once the first button is clicked
        collector.stop();

        if (buttonInteraction.customId === 'approved') {
          // Handle "Approve"
          const discordId = await getDocFieldData(selectedValue);
          await writeData(discordId);
          await writeCloneData(discordId);
          await moveDocument(selectedValue, "Formulir", "approved");
          await deleteFirestoreData(selectedValue);

          const embed = new EmbedBuilder()
            .setTitle('Application Approved')
            .setColor(0x00ff00)
            .setThumbnail(logo_url)
            .setFooter({
              iconURL: interaction.client.user.displayAvatarURL(),
              text: `${interaction.client.user.username} - Squadron Secretary`,
            })
            .addFields(
              { name: 'Approved by:', value: `<@${interaction.user.id}>`, inline: true },
              { name: 'Discord User:', value: `${JSON.parse(discordId)}`, inline: true }
            );
          await channel.send({
            embeds: [embed],
            components: [], // Disable buttons after interaction
          });
          await reply.edit({
            embeds: [embed],
            components: [], // Disable buttons after interaction
          });
        } else if (buttonInteraction.customId === 'hold') {
          // Handle "On Hold"
          const discordId = await getDocFieldData(selectedValue);
          const embed = new EmbedBuilder()
            .setTitle('Application On-Hold')
            .setColor(0x0000ff)
            .setThumbnail(logo_url)
            .setFooter({
              iconURL: interaction.client.user.displayAvatarURL(),
              text: `${interaction.client.user.username} - Squadron Secretary`,
            })
            .addFields(
              { name: 'On-Hold by:', value: `<@${interaction.user.id}>`, inline: true },
              { name: 'Discord User:', value: `${JSON.parse(discordId)}`, inline: true }
            );

          await reply.edit({
            embeds: [embed],
            components: [], // Disable buttons after interaction
          });
        } else if (buttonInteraction.customId === 'rejected') {
          // Handle "Reject"
          const discordId = await getDocFieldData(selectedValue);
          await deleteFirestoreData(selectedValue);

          const embed = new EmbedBuilder()
            .setTitle('Application Rejected')
            .setColor(0xff0000)
            .setThumbnail(logo_url)
            .setFooter({
              iconURL: interaction.client.user.displayAvatarURL(),
              text: `${interaction.client.user.username} - Squadron Secretary`,
            })
            .addFields(
              { name: 'Rejected by:', value: `<@${interaction.user.id}>`, inline: true },
              { name: 'Discord User:', value: `${JSON.parse(discordId)}`, inline: true }
            );

          await reply.edit({
            embeds: [embed],
            components: [], // Disable buttons after interaction
          });
        }
      });

      // Handle collector end (e.g., time runs out)
      collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
          console.log('Collector timed out');
          // Disable buttons after timeout
          await reply.edit({
            components: [],
          });
        }
      });

    } catch (error) {
      console.error('Error handling interaction:', error);
      await interaction.reply({
        content: 'An error occurred while processing the interaction.',
        ephemeral: true,
      });
    }
  }
};

