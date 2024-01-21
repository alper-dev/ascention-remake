const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const Embeds = require('../../utils/embeds');

module.exports.data = new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Kullanıcıyı sustur.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
    .addUserOption(option => option
        .setRequired(true)
        .setName('üye')
        .setDescription('Bir üye gir.'))
    .addStringOption(option => option
        .setRequired(true)
        .setName('süre')
        .setDescription('d = gün | h = saat | m = dakika (Örnek: "1h 30m" = 1 saat 30 dakika)'))
    .addStringOption(option => option
        .setName('neden')
        .setDescription('Bir neden girin.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const member = interaction.guild.members.cache.get(interaction.options.getUser('üye').id);
    const rawDuration = interaction.options.getString('süre');
    const reason = interaction.options.getString('neden');
    const duration = ms(rawDuration);

    if (isNaN(duration) || duration < 5000 || duration > 2.419e9) return interaction.reply({ embeds: [Embeds.err('Geçerli bir süre belirtin. (Örnek: 30m)')] });
    if (member.user.bot) return interaction.reply({ ephemeral: true, embeds: [Embeds.err('Botlara zamanaşımı uygulayamam!')] });

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: 'Zamanaşımı', iconURL: 'https://cdn.discordapp.com/emojis/1197831079105667114' })
        .setFields(
            { name: 'Yetkili', value: interaction.member.displayName, inline: true },
            { name: 'Üye', value: member.toString(), inline: true },
            { name: 'Bitiş', value: `<t:${Math.floor((Date.now() + duration) / 1000)}:R>`, inline: true },
            { name: 'Neden', value: reason }
        );

    member.timeout(duration, reason)
        .catch(e => interaction.reply({ embeds: [Embeds.err(`Beklenmeyen bir hata oluştu: ${e?.message || e}`)] }))
        .then(() => interaction.reply({ embeds: [embed] }));


};