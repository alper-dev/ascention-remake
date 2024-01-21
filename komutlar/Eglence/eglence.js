const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('eğlence')
    .setDescription('Eğlence komutlarını görüntüle.')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    interaction.reply({
        ephemeral: true, embeds: [new EmbedBuilder()
            .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
            .setColor('003fff')
            .setDescription(`
**/vp:** Belli bir oranla valorant points kazanırsınız.

**/sayıtahmin:** Sayı Tahmin etmeye çalışırsınız.

**/mapseç:** Pracc için random Valorant map'ı seçer.
`)
            .setTimestamp()
            .setFooter({ text: 'Ascention Team' })
            .setThumbnail(interaction.guild.iconURL())]
    });

};