const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');
const Embeds = require('../../utils/embeds.js');

module.exports.data = new SlashCommandBuilder()
    .setName('not-alanlar')
    .setDescription('Not alan kişileri listele.')
    .setDefaultMemberPermissions(8)
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const idlist = Object.keys(db.get('notes') || {});

    if (idlist.length === 0) return interaction.reply({ embeds: [Embeds.err('Veritabanında hiç not yok.')] });

    const users = idlist.map(id => client.users.cache.get(id).tag || 'Bilinmeyen').join('\n');
    const noteCounts = idlist.map(id => Object.keys(db.get(`notes.${id}`) || {}).length.toString()).join('\n');
    const userIds = idlist.join('\n');

    const embed = new EmbedBuilder()
        .addFields(
            { name: 'Kullanıcı Adı', value: '```\n' + users + '```', inline: true },
            { name: 'Not Sayısı', value: '```\n' + noteCounts + '```', inline: true },
            { name: 'Kullanıcı ID', value: '```\n' + userIds + '```', inline: true }
        )
        .setColor('Random');

    interaction.reply({ embeds: [embed] });

};