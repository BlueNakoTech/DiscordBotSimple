const { ModalBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder, StringSelectMenuOptionBuilder,StringSelectMenuBuilder} = require('discord.js');
const { captainId, chiefId_1, chiefId_2, logo_url, adminId} = require("../config.json");
const { getFirestoreData } = require("../firebase/firestoreObserver");
module.exports = async (interaction) => {
  // if (!interaction.isButton()) return;

  if (interaction.customId === 'viewForm'){
    const allowedUserIds = [captainId, chiefId_1, chiefId_2];
    const allowedRoleIds = [adminId];
    if (!allowedUserIds.includes(interaction.user.id) &&
    !interaction.member.roles.cache.some((role) => allowedRoleIds.includes(role.id))) {
      console.log('Unrestricted Command');
      return await interaction.reply({
        content: "Maaf, anda tidak diperpolehkan menggunakan perintah ini",
        ephemeral: true, // Only the user who triggered the command can see this response
        
      });
      
    }
  try{
  const data = await getFirestoreData();
  if (data.length === 0) {
    await interaction.reply({
      content: "Tidak ada Data",
      ephemeral: true,
    });

  } else {
    const embedFields = [];

    // Format the data and add it to the embed fields
    data.map((document) => {
      const name = document.nickname.toString();
      const regId = document.Discord.toString(); // Replace 'name' with your actual field name
      embedFields.push({ name: name, value: `\`Discord User : ${regId}\``, inline:false });
    });
    const options = data.map((doc) => {
      const option = new StringSelectMenuOptionBuilder()
        .setLabel(doc.Nama.toString()) // Set the label
        .setDescription(doc.Discord.toString()) // Set the description (if needed)
        .setValue(doc.id.toString()); // Set the value
    
      return option;
    });
    const select = new StringSelectMenuBuilder()
    .setCustomId('regid')
    .setPlaceholder('Please choose which form to proccess')
    .addOptions( 
      options
    )
      const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("New Recruit for Q.E.D")
      .setThumbnail(
        logo_url
      )
      .setFooter({
        iconURL: interaction.client.user.displayAvatarURL(),
        text: `Please Confirm For In-Game Application before choosing the Form - Squadron Secretary`,
      })
      
      .addFields(embedFields)
  
      const row = new ActionRowBuilder().addComponents(select);
  
      const initialResponse = await interaction.reply({
        embeds: [embed],
        components: [row],
      });

      
      
  }
} catch (error) {
  console.error(error);
  await interaction.reply({
    content:
      "An error occurred while retrieving the data. please contact admin",
    ephemeral: true,
  });
}
 
     
} 

  if (interaction.customId === 'sendCommand') {
    // Perform the desired action when the "Send Command" button is clicked
    const modal = new ModalBuilder()
      .setCustomId('FormRequest')
      .setTitle('Formulir Request Join');

    // Create the text input components
    const usernameInput = new TextInputBuilder()
      .setCustomId('usernameInput')
      .setLabel("Discord Username")
      .setPlaceholder("Username (not server nickname) ")
      .setStyle(TextInputStyle.Short);

    const inGameNameInput = new TextInputBuilder()
      .setCustomId('ignInput')
      .setLabel("War Thunder In-game Name")
      .setStyle(TextInputStyle.Short);

    const panggilanNameInput = new TextInputBuilder()
      .setCustomId('panggilanInput')
      .setLabel("Nama Panggilan")
      .setStyle(TextInputStyle.Short);

    const techTreeInput = new TextInputBuilder()
      .setCustomId('techTreeInput')
      .setLabel("Tech Tree Utama / Nation")
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(usernameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(inGameNameInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(panggilanNameInput);
    const fourthActionRow = new ActionRowBuilder().addComponents(techTreeInput);

    // Add inputs to the modal
    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

    await interaction.showModal(modal);
    // Show the modal to the user
    
  }

  
};
