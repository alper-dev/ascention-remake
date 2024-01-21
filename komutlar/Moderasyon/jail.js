const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');
const { err } = require('../../utils/embeds');

module.exports.data = new SlashCommandBuilder()
    .setName('jail')
    .setDescription('alper.dev')
    .addSubcommand(subcommand => subcommand
        .setName('ekle')
        .setDescription('Kullanıcıyı jaile sok.')
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Bir üye gir.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setRequired(true)
            .setName('neden')
            .setDescription('Bir neden girin.')
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('çıkar')
        .setDescription('Kullanıcıyı jailden çıkar.')
        .addUserOption(option => option
            .setName('üye')
            .setDescription('Bir üye gir.')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand => subcommand
        .setName('liste')
        .setDescription('Jaildeki üyeleri listele.')
    );

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'ekle') {

        const user = interaction.options.getUser('üye');
        const member = interaction.guild.members.cache.get(user.id);
        if (member.user.bot) return interaction.reply({ ephemeral: true, embeds: [err('Şakanın sırası değil, bir insanı etiketle.')] });
        const reason = interaction.options.getString('neden');

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setAuthor({ name: 'Jail', iconURL: 'https://cdn.discordapp.com/emojis/1198604729836642394' })
            .setFields(
                { name: 'Yetkili', value: interaction.member.displayName, inline: true },
                { name: 'Üye', value: member.toString(), inline: true },
                { name: 'Neden', value: reason, inline: false }
            )
            .setDescription('Üye karantinaya alındı.');

        try {
            const oldRoles = member.roles.cache.map(r => r.id);
            const jailedRole = interaction.guild.roles.cache.get(db.get('jailrol.' + interaction.guildId));
            member.roles.set([jailedRole]);
            db.push('jail.list', member.id);
            db.set(`jail.data.${member.id}`, {
                date: Date.now(),
                adminId: interaction.user.id,
                reason,
                oldRoles
            });
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.reply({ ephemeral: true, embeds: [err(`Beklenmeyen bir hata oluştu: ${e?.message || e}`)] });
        };

    } else if (subcommand === 'çıkar') {

        const user = interaction.options.getUser('üye');
        const member = interaction.guild.members.cache.get(user.id);
        if (member.user.bot) return interaction.reply({ ephemeral: true, embeds: [err('Şakanın sırası değil, bir insanı etiketle.')] });

        const embed = new EmbedBuilder()
            .setColor('Red')
            .setAuthor({ name: 'Jail', iconURL: 'https://cdn.discordapp.com/emojis/1198604729836642394' })
            .setFields(
                { name: 'Yetkili', value: interaction.member.displayName, inline: true },
                { name: 'Üye', value: member.toString(), inline: true }
            )
            .setDescription('Üye karantinadan çıkarıldı.');

        try {
            const oldRoles = (db.get(`jail.data.${member.id}.oldRoles`) || []).map(roleId => interaction.guild.roles.cache.get(roleId) || null);
            member.roles.set(oldRoles || []);
            db.unpush('jail.list', member.id);
            db.delete(`jail.data.${member.id}`);
            db.set(`jail.unjailed.${member.id}`, {
                date: Date.now(),
                by: interaction.user.id
            });
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.reply({ ephemeral: true, embeds: [err(`Beklenmeyen bir hata oluştu: ${e?.message || e}`)] });
        };

    } else if (subcommand === 'liste') {

        const jailedRole = db.get('jailrol.' + interaction.guildId);
        const jailedMembers = interaction.guild.members.cache.filter(m => m.roles.cache.has(jailedRole))
        const list = jailedMembers.map(m => `<:banhammer:1198604729836642394> ${m}\n<:yetkili:1198324102285504606> <@${db.get(`jail.data.${m.id}.adminId`)}>`)

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setDescription(list.join('\n'));

        interaction.reply({ embeds: [embed] });

    };

};