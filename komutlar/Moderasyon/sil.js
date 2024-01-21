const { SlashCommandBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('sil')
    .setDescription('Kanaldaki mesajları sil.')
    .addIntegerOption(option => option
        .setMaxValue(100)
        .setMinValue(1)
        .setDescription('Silinecek mesaj sayısını gir.')
        .setName('mesaj_sayısı')
        .setRequired(true))
    .setDMPermission(false)
    .setDefaultMemberPermissions(8192);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const count = interaction.options.getInteger('mesaj_sayısı');

    interaction.channel.bulkDelete(count, true)
        .then(messages => {
            if (messages.size != 0) interaction.reply(`\`${messages.size}\` adet mesaj sildim.`);
            else interaction.reply(`Hiç mesaj silemedim be.`);
        })
        .catch(err => {
            interaction.reply('Beklenmeyen bir hata oluştu!');
            console.log('Mesajlar silinirken bir hata olustu', err);
        });

};