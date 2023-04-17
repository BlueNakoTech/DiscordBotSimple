const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
      .setName("command")
      .setDescription("set list of (/) command"),
    async execute(interaction) {
      const embed = new EmbedBuilder()
        .setTitle(`Command List For Noa`)
        .setDescription(`List of (/) command for Noa`)
        .setColor(0x18e1ee)
        
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setTimestamp(Date.now())
       
        .setFooter({
          iconURL: interaction.client.user.displayAvatarURL(),
          text: interaction.client.user.username,
        })
        
        .addFields([
          {
            name: `/form`,
            value: `view/Check Form`,
            
          },
          {
            name: `/recruit`,
            value: `show form recruitment link`,
            
          },
          {
            name: `/approve`,
            value: `approve form application`,
            
          },
          {
            name: `/reject`,
            value: `reject user application`,
            
          },
          {
            name: `/reload`,
            value: `dev-only, reload command`,
            
          },
          {
            name: `/command`,
            value: `show this list of command`,
            
          },
          
        ]);
  
      await interaction.reply({
        embeds: [embed],
      });
    },
  };
  