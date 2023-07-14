const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const { logo_url } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruit')
    .setDescription('Set recruitment link'),
  async execute(interaction) {
    const joinSquadronButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('via Website Form')
      .setURL('https://bluenakotech.github.io/');

    const sendCommandButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setLabel('via Discord Form')
      .setCustomId('sendCommand');

    const row = new ActionRowBuilder()
      .addComponents(joinSquadronButton, sendCommandButton);

    const embed = new EmbedBuilder()
      .setTitle('War Thunder Squadron')
      .setDescription('Join our squadron at War Thunder')
      .setColor(0x18e1ee)
      .setThumbnail(logo_url)
      .setTimestamp(Date.now())
      .setFooter({
        iconURL: interaction.user.displayAvatarURL(),
        text: interaction.user.username,
      })
      .addFields([

        {
          name: 'Squadron Rules',
          value: `1. Have enough Sanity \n2. Server Rules Apply`
        },
        {
          name: 'How to Join ?',
          value: '1. Request join squadron via in-game (WAR THUNDER)\n2. Click the either button below and fill the form',
          inline: true,
        },
      ]);

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
