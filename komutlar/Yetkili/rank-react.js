const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setName('rank-react')
    .setDescription('Rank react')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const praccyetkili = db.get("praccyetkili." + interaction.guildId);

    if (!interaction.member.roles.cache.has(praccyetkili))
        return interaction.reply({ ephemeral: true, content: "Yalnızca yetkililer kullanabilir." });

    let rank = new EmbedBuilder()

        .setAuthor({ name: "Ascention Team E-Spor", iconURL: interaction.guild.iconURL() })
        .setColor("003fff")
        .setDescription("Pracc dağılımı için hangi güncel ranka sahipseniz o rank emojisine basınız.")
        .setTimestamp()
        .setFooter({ text: "Ascention Team" })
        .setThumbnail(interaction.guild.iconURL())
    //.setImage(`https://cdn.discordapp.com/attachments/1116325602341945384/1116325801118416916/TLF_Esp_650_290_piksel_1080_1080_piksel_1920_1080_piksel_1.png`)//tenor linki

    interaction.reply({ embeds: [rank], fetchReply: true })
        .then((embedMessage) => {
            embedMessage.react("<:iron:1108327923989106729>") &&
                embedMessage.react("<:bronz:1108327946634154005>") &&
                embedMessage.react("<:silver:1108327963843366934>") &&
                embedMessage.react("<:gold:1108327979119034408>") &&
                embedMessage.react("<:plat:1108327992511442966>") &&
                embedMessage.react("<:dia:1108328007745163324>") &&
                embedMessage.react("<:asce:1108328020915273831>") &&
                embedMessage.react("<:immo:1108328042843082846>") &&
                embedMessage.react("<:radiant:1108328060043927635>");
        });

};