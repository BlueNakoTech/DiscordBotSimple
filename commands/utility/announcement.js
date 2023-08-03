const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { captainId, chiefId_1, chiefId_2, comchannel, logo_url, wtRoleId } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Create an announcement')
    .addUserOption(option => option.setName('target').setDescription('user to tag'))
    .addStringOption(option =>
      option
        .setName('content')
        .setDescription('Tulis Pengumuman')
        .setRequired(false))
        .addStringOption(option =>
            option
              .setName('time')
              .setDescription('Specific time for the announcement')
              .setRequired(false)),

  async execute(interaction) {
    const allowedUserIds = [captainId, chiefId_1, chiefId_2];
    const channel = interaction.client.channels.cache.get(comchannel);
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true,
      });
    }

    const member = interaction.options.getMember('target');
    if (!member) {
      member = `<@&${wtRoleId}>`;
    }

    let time = interaction.options.getString('time');

    // Check if the 'time' option was not provided or empty
    if (!time) {
      // Use the default time (e.g., 21.00 WIB)
      time = '21.00';
    }

    let description = interaction.options.getString('content');

    // Check if the 'content' option was not provided or empty
    if (!description) {
      // Use the template announcement
      description =
        `Assalamualaikum warahmatullahi wabarakatuh , Salam sejahtera bagi kita semua , Shalom , Om Swastyastu , Namo Buddhaya , dan Salam Kebajikan\n` +
        `diberitahukan kepada seluruh anggota squadron QED, agar diharapkan hadir pada malam hari ini pukul ${time} WIB dalam rangka melaksanakan "**Squadron Realistic Battle/SRB**".\n` +
        `sekian dan terimakasih`;
    }

    const embed = new EmbedBuilder()
      .setTitle('**Announcement**')
      .setDescription(description)
      .setColor(0x18e1ee)
      .setThumbnail(logo_url)
      .setTimestamp(Date.now())
      .addFields([
        {
          name: 'From:',
          value: `<@${interaction.user.id}>`,
          inline: true,
        },
        {
          name: 'To:',
          value: `${member}`,
          inline: true,
        },
      ])
      .setFooter({
        iconURL: interaction.client.user.displayAvatarURL(),
        text: `${interaction.client.user.username}`,
      });
    
    setTimeout(()=> {channel.send(`${member}`)} ,2000);
    await interaction.reply({ embeds: [embed] });
  },
};
