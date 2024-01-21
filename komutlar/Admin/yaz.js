const { SlashCommandBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('yaz')
    .setDescription('Admin yazı yazdırma komutu')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)
    .addStringOption(option => option
        .setName('mesaj')
        .setDescription('Gönderilecek mesajı girin.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const msg = interaction.options.getString('mesaj');

    interaction.channel.send(msg);

    interaction.reply({ content: '✅ Mesaj gönderildi.', ephemeral: true });

};