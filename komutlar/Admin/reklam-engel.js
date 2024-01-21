const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setName('reklam-engel')
    .setDescription('alper.dev')
    .setDefaultMemberPermissions(8)
    .setDMPermission(false)
    .addSubcommand(option => option
        .setName('aç')
        .setDescription('Reklam engelleme sistemini aç.'))
    .addSubcommand(option => option
        .setName('kapat')
        .setDescription('Reklam engelleme sistemini kapat.'))
    .addSubcommandGroup(option => option
        .setName('muaf-roller')
        .setDescription('alper.dev')
        .addSubcommand(option => option
            .setName('ekle')
            .setDescription('Muaf rol ekle.')
            .addRoleOption(option => option
                .setRequired(true)
                .setName('rol')
                .setDescription('Bir rol gir.')))
        .addSubcommand(option => option
            .setName('sil')
            .setDescription('Muaf rol sil.')
            .addRoleOption(option => option
                .setRequired(true)
                .setName('rol')
                .setDescription('Bir rol gir.')))
        .addSubcommand(option => option
            .setName('göster')
            .setDescription('Muaf rolleri göster.')))
    .addSubcommandGroup(option => option
        .setName('muaf-linkler')
        .setDescription('alper.dev')
        .addSubcommand(option => option
            .setName('ekle')
            .setDescription('Muaf link ekle.')
            .addStringOption(option => option
                .setRequired(true)
                .setName('link')
                .setDescription('Bir link gir.')))
        .addSubcommand(option => option
            .setName('sil')
            .setDescription('Muaf link sil.')
            .addStringOption(option => option
                .setRequired(true)
                .setName('link')
                .setDescription('Bir link gir.')))
        .addSubcommand(option => option
            .setName('göster')
            .setDescription('Muaf linkleri göster.')));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {
    const subcmd_group = interaction.options.getSubcommandGroup();
    const subcmd = interaction.options.getSubcommand();

    if (!subcmd_group) {
        if (subcmd === 'aç') {
            db.set(`reklam-engel.${interaction.guildId}.active`, true);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Green')
                        .setDescription('Reklam engelleme sistemi açıldı.')
                ]
            });
        } else if (subcmd === 'kapat') {
            db.set(`reklam-engel.${interaction.guildId}.active`, false);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('Reklam engelleme sistemi kapatıldı.')
                ]
            });
        };
    } else {
        if (subcmd_group === 'muaf-roller') {
            const role = interaction.options.getRole('rol');
            if (subcmd === 'ekle') {
                db.push(`reklam-engel.${interaction.guildId}.exempt-roles`, role.id);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`${role} muaf rollere eklendi.`)
                    ]
                });
            } else if (subcmd === 'sil') {
                const newroles = (db.get(`reklam-engel.${interaction.guildId}.exempt-roles`) || []).filter(id => id != role.id);
                db.set(`reklam-engel.${interaction.guildId}.exempt-roles`, newroles);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`${role} muaf rollerden çıkarıldı.`)
                    ]
                });
            } else if (subcmd === 'göster') {
                const roles = db.get(`reklam-engel.${interaction.guildId}.exempt-roles`);
                if (!roles || (roles || []).length === 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('Hiç muaf rol yok.')] })
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Blurple')
                            .setDescription(roles.map(r => interaction.guild.roles.cache.get(r).toString()).join('\n'))
                    ]
                });
            };
        } else if (subcmd_group === 'muaf-linkler') {
            const link = interaction.options.getString('link');
            if (subcmd === 'ekle') {
                db.push(`reklam-engel.${interaction.guildId}.exempt-links`, link);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setDescription(`\`${link}\` muaf linklere eklendi.`)
                    ]
                });
            } else if (subcmd === 'sil') {
                const newroles = (db.get(`reklam-engel.${interaction.guildId}.exempt-links`) || []).filter(id => id != link);
                db.set(`reklam-engel.${interaction.guildId}.exempt-links`, newroles);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription(`\`${link}\` muaf linklerden çıkarıldı.`)
                    ]
                });
            } else if (subcmd === 'göster') {
                const roles = db.get(`reklam-engel.${interaction.guildId}.exempt-links`);
                if (!roles || (roles || []).length === 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor('Red').setDescription('Hiç muaf link yok.')] })
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Blurple')
                            .setDescription(roles.join('\n'))
                    ]
                });
            };
        };
    };

};