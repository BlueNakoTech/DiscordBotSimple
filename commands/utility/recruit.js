const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
const { logo_url, requestChannel } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruit')
    .setDescription('Set recruitment link'),
  async execute(interaction) {
    const channel = interaction.client.channels.cache.get(requestChannel);
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
      .setDescription('Gabung Squadron Kami')
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
          value: `1. Waras \n2. Patuhi peraturan server`
        },
        {
          name: 'Bagaimana Cara Join?',
          value: '1. Request join squadron via in-game (WAR THUNDER)\n2. Tekan Tombol Mana Saja dan Isi Formulirnya  \n(**NOTE:** click **via Website Form** jika Noa(Bot) tidak merespon)',
          inline: true,
        },
      ]);
      setTimeout(()=> {channel.send({
        embeds: [embed],
        components: [row],
      })} ,1000);
    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
