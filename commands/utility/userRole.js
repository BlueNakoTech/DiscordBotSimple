const { SlashCommandBuilder, ApplicationCommandPermissionsManager } = require('discord.js');
const { assignRole } = require('../../function/assignRole')

const { wtRoleId, channelId_ann, captainId, chiefId_1, chiefId_2 } = require('../../config.json')


module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_role')
		.setDescription('Manually Set Role on User')
		.addUserOption(option => option.setName('target').setDescription('The user\'s to add')),
	async execute(interaction) {

     
    const allowedUserIds = [captainId, chiefId_1, chiefId_2];
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log(`Unrestricted Command by ${interaction.user.username}`);
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }

		const member = interaction.options.getMember('target');
    if (!member) {
      return interaction.reply('Please provide a valid member.');
    }
    try {
      await assignRole(member);
      setTimeout(() => {
        const channel = interaction.guild.channels.cache.find(c => c.id === channelId_ann);
            if (channel) {
                channel.send(`<@&${wtRoleId}> new member has joined \n${member.user.id} Welcome to Squadron, \nMay the snail bless upon you`);
            }
      }, 5000);
      return interaction.reply( {content:`Added role to ${member.user.username}`,
      ephemeral: true});
    } catch (error) {
      console.error(error);
      return interaction.reply({content: 'An error occurred while adding the role.', ephemeral:true});
    }
  },


};