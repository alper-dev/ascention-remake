const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun gecikme süresini görüntüle');

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    let embed = new EmbedBuilder()
        .setColor("Random")
        .addFields({ name: "**__Gecikme Sürem__**", value: `**${Math.abs(client.ws.ping)}** ms Olarak Hesaplandı.` })

    interaction.reply({embeds:[embed]});

};