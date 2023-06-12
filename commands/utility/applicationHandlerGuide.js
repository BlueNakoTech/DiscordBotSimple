const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const {logo_url} = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guide")
    .setDescription("Guide How to Process Application Form"),
  async execute(interaction) {
    // const requiredRole = interaction.guild.roles.cache.find(
    //   (role) => role.name === "Admin"
    // );
    // if (!interaction.member.roles.cache.has(requiredRole.id)) {
    //   return interaction.reply(
    //     "You do not have permission to use this command."
    //   );
    // }

    const embed = new EmbedBuilder()
      .setTitle(`GUIDE`)
      .setDescription(`Guide How to Process Application Form`)
      .setColor(0x18e1ee)

      .setThumbnail(
        logo_url
      )
      .setTimestamp(Date.now())

      .setFooter({
        iconURL: interaction.client.user.displayAvatarURL(),
        text: `${interaction.client.user.username} - Squadron Secretary`,
      })

      .addFields([
        {
          name: `What`,
          value: `War Thunder Form`,
        },
        {
          name: `When`,
          value: `When <@${interaction.client.user.id}> Notify New Form Added`,
        },
        {
          name: `How`,
          value: `1. View Form by using **/form** command \n2. Assess the data \n3. Copy the **Reg ID** \n4. If everything is **OK** \n5. Approve by Using **/approve** command and insert the **Reg ID**`,
        },
        {
          name: `Case Reject`,
          value: `1. Reject the application by using **/reject** command \n2. Provide **Reg ID** and **Reason** for rejection`,
        },
      ]);

    await interaction.reply({
      embeds: [embed],
    });
  },
};
