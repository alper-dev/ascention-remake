const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('tag-nasıl-alınır')
    .setDescription('Tag alma rehberi');

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const dcName = interaction.user.tag.startsWith('ate') ? interaction.user.tag.slice(3) : interaction.user.tag;
    const embed = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`
Kullanıcını adınızın başına **\`ate\`** yazmanız gerek.
Örneğin: **ate${dcName}**

Kullanıcı adı nasıl değiştirilir?
💻 → <:gear:1197126154222567455> → \`Hesabım\` → \`Kullanıcı Adı\`
📱 → \`Sağa Kaydır\` → \`Sen\` → <:gear:1197126154222567455> → \`Hesap\` → \`Kullanıcı Adı\`
`);

    interaction.reply({ embeds: [embed] });

};