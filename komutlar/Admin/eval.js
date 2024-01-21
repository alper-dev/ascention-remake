const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { err } = require('../../utils/embeds');

module.exports.data = new SlashCommandBuilder()
    .setName('eval')
    .setDescription('eval');

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    if (!['1128265219978825788', '925508916064956516'].includes(interaction.user.id)) return interaction.reply({ ephemeral: true, embeds: [err('Bu komutu yalnızca geliştiricim kullanabilir.')] });

    const modal = new ModalBuilder()
        .setCustomId('eval')
        .setTitle('Evaluation')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('code')
                    .setLabel('Code')
                    .setPlaceholder('Enter your code...')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
            )
        );

    interaction.showModal(modal);

};