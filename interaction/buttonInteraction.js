const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require('discord.js');

module.exports = async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  if (interaction.customId === 'web') {




    
      const modal = new ModalBuilder()
      .setCustomId('FormRequest')
      .setTitle('Formulir Request Join');

    // Create the text input components
    const usernameInput = new TextInputBuilder()
      .setCustomId('usernameInput')
      .setLabel("Discord Username")
      .setStyle(TextInputStyle.Short);

    const inGameNameInput = new TextInputBuilder()
      .setCustomId('ignInput')
      .setLabel("War Thunder In-game Name")
      .setStyle(TextInputStyle.Short);

    const panggilanNameInput = new TextInputBuilder()
      .setCustomId('panggilanInput')
      .setLabel("Nama Panggilan")
      .setStyle(TextInputStyle.Short);

    const techTreeInput = new TextInputBuilder()
      .setCustomId('techTreeInput')
      .setLabel("Tech Tree Utama / Nation")
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(inGameNameInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(panggilanNameInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(techTreeInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

    await interaction.showModal(modal);
    // Show the modal to the user
    } 
    // Perform the desired action when the "Send Command" button is clicked
   
    
  
};
