const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('maç')
    .setDescription('Maç')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    // if (!interaction.member.roles.cache.has("1106353320475504710")) return interaction.reply("Yalnızca yetkililer kullanabilir.");

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Ascention Team E-Spor' })
        .setColor('003fff')
        .setDescription("<:TLF:1111024311239725076> İlk dostluk maçmızı **Rorestus E-Sport** ile oynayacağız. \n<:TLF:1111024311239725076> Bu maçı yakından takip etmek için linkteki **TikTok** ve **Twitch** yayınına davetlisiniz.")
        .addFields(
            { name: 'GL HF <:riotyumruk:1116319293131460632> Rorestus E-Sport', value: '<@&1113271123853971456> <@&1113270518280372265>' }
        )
        .setTimestamp()
        .setFooter({ text: 'Maç Saati: 𝟐𝟎:𝟎𝟎' })
        .setImage(`https://cdn.discordapp.com/attachments/1116325602341945384/1116325801118416916/TLF_Esp_650_290_piksel_1080_1080_piksel_1920_1080_piksel_1.png`)

    interaction.reply({ embeds: [embed] });

};