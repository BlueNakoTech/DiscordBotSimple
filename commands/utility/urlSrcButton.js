const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('url')
    .setDescription('Make Url to a Button')
    .addBooleanOption(option =>
        option.setName('nsfw')
          .setDescription('Is the link contain nsfw content ?')
          .setRequired(true) // You can set this to false if the option is not required
      )
    .addStringOption((option) =>
    option.setName("source").setDescription("input source url").setRequired(true)
  ),
    
  async execute(interaction) {
    const channel = interaction.channel
    const urlString = interaction.options.getString("source")
    const nsfw = interaction.options.getBoolean('nsfw');
    const safeButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel('Sauce')
      .setURL(urlString);
    const nsfwButton = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
   
      .setLabel('Sauce')
      .setEmoji('⛔')
      .setURL(urlString);


    
    const row = new ActionRowBuilder()
      .addComponents(nsfw ? nsfwButton : safeButton  );
    const formattedUrlString = `\`${urlString}\``
    const nsfwUrlString = `||\`${urlString}\`||`
    await interaction.reply({
        content: "url send",
        ephemeral : true
    })
    await channel.send({
      content: nsfw ? nsfwUrlString : formattedUrlString,  
      components: [row],
    });
  },
};