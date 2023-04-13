const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("recruit")
      .setDescription("Set recruitment link"),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle(`War Thunder Squadron`)
        .setDescription(`Join our squadron at War Thunder`)
        .setColor(0x18e1ee)
        
        .setThumbnail('https://cdn.discordapp.com/attachments/654304946447056899/1095208877953384469/Logo_tKRI.png')
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
  