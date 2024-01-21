const { SlashCommandBuilder } = require('discord.js');
const db = require('orio.db');
const Embeds = require('../../utils/embeds.js');

module.exports.data = new SlashCommandBuilder()
    .setName('check')
    .setDescription('Yetkili kontrol komutu.')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    //TODO: Yetkili olup olmadığı kontrol edilmeli.

    if (db.get(`checklist.recent.${interaction.user.id}`))
        return interaction.reply({ ephemeral: true, embeds: [Embeds.err().setDescription('<:timeout:1197831079105667114> Bu komutu tekrar yarın saat 10:00\'da kullanabilirsin.')] });

    db.set(`checklist.recent.${interaction.user.id}`, true);
    interaction.reply({ ephemeral: true, embeds: [Embeds.success('Aktifliğiniz için teşekkürler! Yarın bu komutu tekrar kullanmayı unutmayın.')] });

};