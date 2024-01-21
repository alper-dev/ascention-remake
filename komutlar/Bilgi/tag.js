const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('tag')
    .setDescription('Sunucunu tagını görüntüle.');

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const dcName = interaction.user.tag.startsWith('ate') ? interaction.user.tag.slice(3) : interaction.user.tag;
    const valoName = interaction.user.displayName.replace(/[^a-zA-Z0-9]/g, '');
    const disc = interaction.user.discriminator;

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor('Random')
                .addFields(
                    { name: '<:discord:1197115789468250183> Discord Tagımız', value: '```ate```', inline: true },
                    { name: '<:valorant:1197115921190371409> VALORANT Tagımız', value: '```ATE```', inline: true },
                    { name: 'Örnek', value: `<:discord:1197115789468250183> ate${dcName}\n<:valorant:1197115921190371409> ATE ${valoName}#${disc}`, inline: false },
                )
        ]
    });

};