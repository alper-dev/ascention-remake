const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');
const { main_menu, main } = require('../../utils/notes.js');
const Embeds = require('../../utils/embeds.js');

module.exports.data = new SlashCommandBuilder()
    .setName('not')
    .setDescription('Not sistemi')
    .setDMPermission(false)
// .addSubcommand(option => option
//     .setName('ekle')
//     .setDescription('Not ekle'))
// .addSubcommand(option => option
//     .setName('göster')
//     .setDescription('Notu göster'))
// .addSubcommand(option => option
//     .setName('sil')
//     .setDescription('Notu sil'));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const noteCount = Object.keys(db.get(`notes.${interaction.user.id}`) || {}).length;
    if (noteCount == 0) return interaction.reply({
        ephemeral: true,
        embeds: [Embeds.err('Hiç notunuz yok.')],
        components: [new ActionRowBuilder().addComponents(main_menu.buttons.create)]
    });
    if (noteCount == 9) return interaction.reply({
        ephemeral: true,
        embeds: [Embeds.err('Maksimum not sayısına ulaştınız.')],
        components: [new ActionRowBuilder().addComponents(main_menu.buttons.show)]
    });

    main(interaction);

};