const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const Embeds = require('../../utils/embeds');

module.exports.data = new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Kullanıcının susturmasını kaldır.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
    .addUserOption(option => option
        .setRequired(true)
        .setName('üye')
        .setDescription('Bir üye gir.'));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const member = interaction.guild.members.cache.get(interaction.options.getUser('üye').id);

    if (member.user.bot) return interaction.reply({ ephemeral: true, embeds: [Embeds.err('Şakanın zamanı değil, bir insanı etiketle.')] });

    const embed = new EmbedBuilder()
        .setColor('Green')
        .setAuthor({ name: 'Zamanaşımı İptali', iconURL: 'https://cdn.discordapp.com/emojis/1197831079105667114' })
        .setFields(
            { name: 'Yetkili', value: interaction.member.displayName, inline: true },
            { name: 'Üye', value: member.toString(), inline: true }
        )
        .setDescription('Üyenin zamanaşımı kaldırıldı.');

    member.timeout(null)
        .catch(e => interaction.reply({ embeds: [Embeds.err(`Beklenmeyen bir hata oluştu: ${e?.message || e}`)] }))
        .then(() => interaction.reply({ embeds: [embed] }));


};