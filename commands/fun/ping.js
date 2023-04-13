const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('return my ping!'),
    async execute(interaction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const newMessage = `Client Ping: ${message.createdTimestamp -  interaction.createdTimestamp}`
        await interaction.editReply({
            content: newMessage
        });
    }
}