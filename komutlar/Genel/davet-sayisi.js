const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('davet-sayısı')
    .setDescription('Üyelerin davet sayısını görüntüle.')
    .setDMPermission(false)
    .addUserOption(option => option
        .setRequired(false)
        .setName('üye')
        .setDescription('Bir üye gir.'));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {

    const member = interaction.guild.members.cache.get(interaction.options.getUser('üye')?.id || interaction.user.id);
    const invites = (await interaction.guild.invites.fetch()).filter(invite => invite.uses && invite.uses !== 0 && invite.inviterId === member.id);

    let total = 0;
    for (const invite of invites) {
        total += invite[1].uses;
    };

    if (total == 0) return interaction.reply({ embeds: [err('Davet bilgisi bulunamadı.')] });

    const embed = new EmbedBuilder()
        .setColor(member.displayColor || 'Blurple')
        .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
        .setDescription(`Toplam davet sayısı: **${total}**`);

    interaction.reply({ embeds: [embed] });

};