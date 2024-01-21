const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('bilgilendirme')
    .setDescription('Bilgilendirme')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const embed = new EmbedBuilder()
    .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
    .setColor('003fff')
    .setDescription(`
**/hakkımızda:** Biz kimiz?.
    
**/tag:** Tagımızı gösterir.

**/tagnasılalınır:** Tagımızı nasıl alacağınızı gösterir.
`)
    .setTimestamp()
    .setFooter({ text: 'Ascention Team' })
    .setThumbnail(interaction.guild.iconURL())

    interaction.reply({ ephemeral: true, embeds: [embed] });

};