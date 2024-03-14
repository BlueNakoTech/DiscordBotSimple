const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { captainId, chiefId_1, chiefId_2, chiefId_3, adminId, comchannel, logo_url, wtRoleId } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Create an announcement')
    .addStringOption(option =>
      option
        .setName('br')
        .setDescription('add BR for SRB')
        .setRequired(false))
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
    const allowedUserIds = [auth.role.admin, auth.role.officer, auth.role.captain];
    const channel = interaction.client.channels.cache.get(comchannel);
    if (!allowedUserIds.includes(interaction.user.id)) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Sorry, you're not allowed to use this command.",
        ephemeral: true,
      });
    }



    let time = interaction.options.getString('time');

    // Check if the 'time' option was not provided or empty
    if (!time) {
      // Use the default time (e.g., 21.00 WIB)
      time = '21.00';
    }

    let br = interaction.options.getString('br');

    if (!br) {
      br = '12.3';
    }
    let description = interaction.options.getString('content');
   
    // Check if the 'content' option was not provided or empty
    if (!description) {
      // Use the template announcement
      description =
        `Assalamualaikum warahmatullahi wabarakatuh , Salam sejahtera bagi kita semua , Shalom , Om Swastyastu , Namo Buddhaya , dan Salam Kebajikan.\n` +
        `Diberitahukan kepada seluruh anggota squadron QED, agar diharapkan hadir pada malam hari ini pukul **${time} WIB** dalam rangka melaksanakan "**Squadron Realistic Battle/SRB**".\n` +
        `untuk yg mempunyai vehicle dengan **Battle Rating ${br}**.\n` +
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
          value: `<@&${wtRoleId}>`,
          inline: true,
        },
      ])
      .setFooter({
        iconURL: interaction.client.user.displayAvatarURL(),
        text: `${interaction.client.user.username}`,
      });

    setTimeout(() => { channel.send(`<@&${wtRoleId}>`) }, 2000);
    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    message.react('✅')
    .then(() => message.react('❌'));
  },
};
