const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setName('vp-sayısı')
    .setDescription('vp komutunun kullanım sayısını göster.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const veri = db.get(`vpsayısı_`);
    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
        .setColor('003fff')
        .setDescription(`Valorant points komutunun toplamda kullanım adeti: ` + veri)
        .setTimestamp()
        .setFooter({ text: "Ascention Team" })
        .setThumbnail(interaction.user.avatarURL());
    interaction.reply({ embeds: [embed] });

};