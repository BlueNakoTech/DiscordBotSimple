const { SlashCommandBuilder } = require('discord.js');
const { getFirestoreData } = require("../../firebase/firestoreObserver");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('approve')
		.setDescription('approve and remove the form')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
        try {
            await getFirestoreData.getFirestoreData()
            await getFirestoreData.deleteFirestoreData(id);
            await interaction.reply(`Successfully deleted document with ID ${id}.`);
          } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while deleting the document.', ephemeral: true });
          }
	},
};