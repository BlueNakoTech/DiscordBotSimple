const { SlashCommandBuilder } = require('discord.js');
const { removeRole } = require('../../function/removeRole')
const { wtRoleId, channelId_ann } = require('../../config_dev.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove_role')
		.setDescription('Manually Remove Role from User')
		.addUserOption(option => option.setName('target').setDescription('The user\'s to remove')),
	async execute(interaction) {
       
		const member = interaction.options.getMember('target');
    if (!member) {
      return interaction.reply('Please provide a valid member.');
    }
    try {
      await removeRole(member);
      const channel = interaction.guild.channels.cache.find(c => c.id === channelId_ann);
            if (channel) {
                channel.send(`<@&${wtRoleId}>\n**${member.user.username}** is No longer With Us , \nHe Already Free From the Snail`);
            }
      return interaction.reply(`remove role to ${member.user.username}`);
    } catch (error) {
      console.error(error);
      return interaction.reply('An error occurred while adding the role.');
    }
  },
};