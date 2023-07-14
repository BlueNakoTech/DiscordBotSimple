const { SlashCommandBuilder, ActionRowBuilder, MessageSelectMenu, MessageEmbed, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Create a voting poll')
    .addStringOption(option => option
      .setName('question')
      .setDescription('The voting question')
      .setRequired(true))
    .addStringOption(option => option
      .setName('options')
      .setDescription('The voting options, separated by commas')
      .setRequired(true)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const optionsString = interaction.options.getString('options');
    const options = optionsString.split(',').map(option => option.trim());

    const menuOptions = options.map((option, index) => ({
      label: option,
      description: `Vote for ${option}`,
      value: index.toString(),
    }));

    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('vote')
          .setPlaceholder('Make a selection!')
          .addOptions(menuOptions)
      );

    await interaction.reply({
      content: question,
      components: [row],
    });

    const votes = Array(options.length).fill(0);

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 60000, // 60 seconds
    });

    collector.on('collect', async interaction => {
      if (interaction.customId === 'vote') {
        const selectedOption = Number(interaction.values[0]);
        if (isNaN(selectedOption) || selectedOption < 0 || selectedOption >= options.length) return;

        votes[selectedOption]++;
        await interaction.update({
          components: [row],
        });
      }
    });

    collector.on('end', async () => {
      const totalVotes = votes.reduce((total, vote) => total + vote, 0);

      const embed = new EmbedBuilder()
        .setTitle('Voting Results')
        .setDescription(question)
        .setColor('BLUE')
        .addFields(
          votes.map((voteCount, index) => ({
            name: options[index],
            value: `${voteCount} vote(s) (${((voteCount / totalVotes) * 100).toFixed(2)}%)`,
            inline: true,
          }))
        );

      await interaction.followUp({ embeds: [embed] });
    });
  },
};
