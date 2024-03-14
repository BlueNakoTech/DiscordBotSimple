const {
    SlashCommandBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonStyle,
  
} = require("discord.js");
const { findDocumentByField, removeDocumentData } = require("../../firebase/firestoreObserver");

const {
    captainId,
  
    
    logo_url,
    threadId,
    channelId_ann,
} = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("find_member")
        .setDescription("search member form on database")
        .addStringOption((option) =>
            option
                .setName("nickname")
                .setDescription("Member nickname")
                .setRequired(true)
        ),

    async execute(interaction) {
        const allowedUserIds = [auth.role.officer, auth.role.captain];
        const allowedRoleIds = [auth.role.admin];
        if (
            !allowedUserIds.includes(interaction.user.id) &&
            !interaction.member.roles.cache.some((role) =>
                allowedRoleIds.includes(role.id)
            )
        ) {
            console.log("Unrestricted Command");
            return await interaction.reply({
                content: "Maaf, anda tidak diperpolehkan menggunakan perintah ini",
                ephemeral: true, // Only the user who triggered the command can see this response
            });
        }

        try {
            const nickname = interaction.options.getString("nickname");
            const document = await findDocumentByField(nickname);
            const documentData = document.data();
            const documentID = document.id;
            const jsonFile = JSON.stringify(documentData);
            const doc = JSON.parse(jsonFile);
            console.log(jsonFile);
            const Embed = new EmbedBuilder()
                .setColor("#0099ff")
                .setTitle("Member File")
                .setThumbnail(logo_url)
                .addFields(
                    { name: "Discord", value: doc.Discord.toString() },
                    { name: "Nama", value: doc.Nama.toString() },

                    {
                        name: "In-game Name",
                        value: doc.nickname.toString(),
                        inline: true,
                    },
                    { name: "Negara Utama", value: `${doc.Negara.toString()}` }
                )

                .setFooter({
                    iconURL: interaction.client.user.displayAvatarURL(),
                    text: `${interaction.client.user.username} - Squadron Secretary`,
                });

            // Create buttons for the second embed (customize this part as needed)
            const button1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("Remove")
                .setCustomId("remove");

            const button2 = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel("Edit")
                .setCustomId("edit");

            const button3 = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel("OK")
                .setCustomId("cancel");

            const row = new ActionRowBuilder().addComponents(button3, button2, button1);

            // Send the second embed as a follow-up message
            const reply = await interaction.reply({
                embeds: [Embed],
                components: [row],
            });
            const filter = async (i) => {
                if (
                    ["remove", "edit", "cancel"].includes(i.customId) &&
                    i.user.id === interaction.user.id
                ) {
                    return true; // Interaction is valid
                } else {
                    // Handle the error here
                    console.log(
                        `Invalid interaction from user ${i.user.username} with custom ID ${i.customId}`
                    );
                    return false;
                }
            };

            const collected = interaction.channel.createMessageComponentCollector({
                filter,
                time: 120000,
            });

            collected.on("collect", async (buttonInteraction) => {
                if (buttonInteraction.customId === "remove") {

                    await removeDocumentData(nickname);
                    await reply.edit({ content: `member with the nickname **${nickname}** has been remove`, components: [] });
                    return true;
                } else if (buttonInteraction.customId === "cancel") {
                    await reply.edit({ content: `Squadron member data`, components: [] });
                    return true;
                } else if (buttonInteraction.customId === "edit") { }
                await reply.edit({ content: `Squadron member data`, components: [] });
                
                if (buttonInteraction.customId === "edit") {
                    const button1 = new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Database Edit")
                        .setCustomId("edited");
                    const row = new ActionRowBuilder().addComponents(button1);

                    await interaction.followUp({ content: `Use this token to edit the database: \`${documentID}\``, components: [row], ephemeral: true })
                }
                return true;

            });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: `Terjadi Kesalahan, Silahkan kontak <@${captainId}>.`,
                ephemeral: true,
            });
        }
    },
};
