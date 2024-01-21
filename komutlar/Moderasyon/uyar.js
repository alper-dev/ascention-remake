const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');
const Embeds = require('../../utils/embeds');

module.exports.data = new SlashCommandBuilder()
    .setName('uyar')
    .setDescription('Kullanıcıyı uyarın.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8192)
    .addUserOption(option => option
        .setName('üye')
        .setDescription('Bir üye girin.')
        .setRequired(true))
    .addStringOption(option => option
        .setName('neden')
        .setDescription('Uyarı nedenini girin.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    let user = interaction.options.getUser('üye');
    let reason = interaction.options.getString('neden');
    let warn = db.get(`uyarılar_${user.id}`);
    let log = interaction.guild.channels.cache.get(db.get("uyarılog." + interaction.guildId));
    const u1 = db.get("uyarı1rolu." + interaction.guildId);
    const u2 = db.get("uyarı2rolu." + interaction.guildId);
    const u3 = db.get("uyarı3rolu." + interaction.guildId);

    if (user.id === interaction.user.id) return interaction.reply({ embeds: [Embeds.err('Kendini uyaramazsın.')] });
    if (interaction.guild.members.cache.get(user.id).roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ embeds: [Embeds.err(`Bu kişinin rolü senin rolünden daha yüksek veya eşit.`)] });

    const embed = new EmbedBuilder()
        .setColor("Random")
        .addFields(
            { name: 'Yapılan İşlem', value: 'Uyarma' },
            { name: 'Kullanıcı', value: `${user.tag} (${user.id})` },
            { name: 'Yetkili', value: interaction.user.tag },
            { name: 'Sebep', value: reason }
        )
    log.send({ embeds: [embed] });

    const wembed = Embeds.warn(`<@${user.id}> adlı kullanıcı **${reason}** sebebi ile uyarıldı ve başarıyla rolü verildi!`);

    interaction.guild.members.cache.get(user.id).send(`<@${user.id}>, \n**${interaction.guild.name}** adlı sunucuda **${reason}** sebebi ile uyarıldın! \nKuralları çiğnemeye devam edersen susturulabilir, atılabilir veya yasaklanabilirsin!`)
        .catch(() => wembed.setFooter({ text: 'Kullanıcıya DM gönderemedim.', iconURL: user.avatarURL() }));

    interaction.reply({ embeds: [wembed] });

    db.add(`uyarılar_${user.id}`, 1);

    if (!warn) {
        interaction.guild.members.cache.get(user.id).roles.add(u1);
    } else if (warn === 1) {
        interaction.guild.members.cache.get(user.id).roles.add(u2);
    } else if (warn === 2) {
        interaction.guild.members.cache.get(user.id).roles.set([u3]);
    };

};