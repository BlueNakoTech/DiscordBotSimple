const { SlashCommandBuilder } = require('discord.js');
const { fetchDataAndGenerateExcel } = require('../../firebase/firestoreObserver'); // Adjust the path accordingly
const { captainId, chiefId_1, chiefId_2, chiefId_3, adminId, logo_url, threadId } = require("../../config.json");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('exportdata')
		.setDescription('Export data to Excel'),
	async execute(interaction) {
        const allowedUserIds = [captainId, chiefId_1, chiefId_2, chiefId_3];
        const allowedRoleIds = [adminId];
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