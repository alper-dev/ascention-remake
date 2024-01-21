const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Bir üyenin profil fotoğrafını görüntüle.')
    .setDMPermission(false)
    .addUserOption(option => option
        .setName('üye')
        .setDescription('Bir üye girin.'));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    let kullanıcı = interaction.options.getUser('üye');

    if (kullanıcı) {
        const $adista = new EmbedBuilder()
            .setDescription(`${kullanıcı} **etiketlediğin kullanıcının avatarı...**`)
            .setColor('#36393F')
            .setImage(kullanıcı.avatarURL({ forceStatic: false, size: 2048 }))
        interaction.reply({ embeds: [$adista], fetchReply: true }).then(msg => setTimeout(() => msg.delete(), 10000));
    } else {
        const $adista = new EmbedBuilder()
            .setDescription(`${interaction.user} **Buyur avatarın...**`)
            .setColor('#36393F')
            .setImage(interaction.user.avatarURL({ forceStatic: false, size: 2048 }))
        interaction.reply({ embeds: [$adista], fetchReply: true }).then(msg => setTimeout(() => msg.delete(), 10000));
    };

};