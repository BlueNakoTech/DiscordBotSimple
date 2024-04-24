const { SlashCommandBuilder } = require('discord.js');
const { fetchDataAndGenerateExcel } = require('../../firebase/firestoreObserver'); // Adjust the path accordingly
const { auth } = require("../../config.json");
const { Fireauth } = require('firebase-admin');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('exportdata')
		.setDescription('Export data to Excel'),
	async execute(interaction) {
		const officerIds = auth.role.officer;
        const allowedUserIds = [...officerIds, auth.role.admin];
        const allowedRoleIds = [auth.role.admin];
        if (!allowedUserIds.includes(interaction.user.id) &&
        !interaction.member.roles.cache.some((role) => allowedRoleIds.includes(role.id))) {
          console.log('Unrestricted Command');
          return await interaction.reply({
            content: "Maaf, anda tidak diperpolehkan menggunakan perintah ini",
            ephemeral: true, // Only the user who triggered the command can see this response
            
          });
          
        }

		try {
			await fetchDataAndGenerateExcel();
			const file = './squadron_data.xlsx';

			// Send the Excel file as a reply
			await interaction.reply({
				files: [file],
				content: 'This is the sheet of Q.E.D Squadron member data',
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({content:'An error occurred while exporting data.', ephemeral: true});
		}
	},
};