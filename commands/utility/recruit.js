const { SlashCommandBuilder, EmbedBuilder,} = require("discord.js");
const {logo_url} = require("../../config_dev.json");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("recruit")
      .setDescription("Set recruitment link"),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle(`War Thunder Squadron`)
        .setDescription(`Join our squadron at War Thunder`)
        .setColor(0x18e1ee)
        
        .setThumbnail(logo_url)
        .setTimestamp(Date.now())
       
        .setFooter({
          iconURL: interaction.user.displayAvatarURL(),
          text: interaction.user.tag,
        })
        .setURL("https://bluenakotech.github.io/")
        .addFields([
          {
            name: `How to Join ?`,
            value: `click link above and fill the form`,
            inline: true,
          },
          
        ]);
  
      await interaction.reply({
        embeds: [embed],
      });
    },
  };
  