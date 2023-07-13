

const { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription('show form to request Join xQ.E.Dx Squadron'),
		
	async execute(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('FormRequest')
	
			.setTitle('Formulir Request Join ');
			

		// Add components to modal

		// Create the text input components
		const usernameInput = new TextInputBuilder()
			.setCustomId('usernameInput')
		    // The label is the prompt the user sees for this input
			.setLabel("Discord Username")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const inGameNameInput = new TextInputBuilder()
			.setCustomId('ignInput')
			.setLabel("War Thunder In-game Name")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

        const panggilanNameInput = new TextInputBuilder()
			.setCustomId('panggilanInput')
			.setLabel("Nama Panggilan")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Short);

        const techTreeInput = new TextInputBuilder()
			.setCustomId('techTreeInput')
			.setLabel("Tech Tree Utama / Nation")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);    

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
		const secondActionRow = new ActionRowBuilder().addComponents(inGameNameInput);
        const thirdActionRow = new ActionRowBuilder().addComponents(panggilanNameInput);
        const fourthActionRow = new ActionRowBuilder().addComponents(techTreeInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
        
        

        

	},
   
};

