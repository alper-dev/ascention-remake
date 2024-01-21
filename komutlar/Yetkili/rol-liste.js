const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setName('rol-liste')
    .setDescription('Etiketlenen roldeki kullanıcıları sayfalandırılmış bir şekilde listeleyerek gösterir.')
    .setDMPermission(false)
    .addRoleOption(option => option
        .setName('rol')
        .setDescription('Bir rol girin.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const kayıtyetkili = db.get("kayıtyetkilirol." + interaction.guildId);
    if (!interaction.member.roles.cache.has(kayıtyetkili))
        return interaction.reply({
            ephemeral: true, embeds: [new EmbedBuilder()
                .setDescription("Komutu kullanmak için yetkin yok.")]
        });
    // Etiketlenen rolü alın
    const taggedRole = interaction.guild.roles.cache.get(interaction.options.getRole('rol').id);

    // Sayfalandırma işlemi için kullanılacak sayfa boyutunu belirleyin
    const pageSize = 50; // Her sayfada gösterilecek kullanıcı sayısı

    // Etiketlenen roldeki kullanıcıları alın
    const roleMembers = Array.from(taggedRole.members);

    // Sayfaları oluşturun
    const pages = [];
    for (let i = 0; i < roleMembers.length; i += pageSize) {
        const pageMembers = roleMembers.slice(i, i + pageSize);
        const pageText = pageMembers.map((member, index) => `${i + index + 1}. ${member[1].user.tag}`).join('\n');
        pages.push(pageText);
    }

    if (roleMembers.length === 0) return interaction.reply(`\`${taggedRole.name}\` rolüne sahip hiçbir üye yok.`);

    // İlk sayfayı gönderin
    let currentPage = 0;
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`@${taggedRole.name} Rolündeki Kullanıcılar`)
        .setFooter({ text: `Sayfa ${currentPage + 1}/${pages.length}` })
        .setDescription(pages[currentPage] || '???')
        .addFields({ name: 'Üye Sayısı', value: roleMembers.length.toString() })
        .setTimestamp();
    interaction.reply({ fetchReply: true, embeds: [embed] }).then(msg => {
        // Emoji tepkileri ekleyerek sayfayı değiştirmek için
        if (pages.length > 1) {
            msg.react('⬅️');
            msg.react('➡️');

            const filter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === interaction.user.id;
            const collector = msg.createReactionCollector({ filter, time: 60000 });

            collector.on('collect', reaction => {
                reaction.users.remove(interaction.user);
                if (reaction.emoji.name === '⬅️' && currentPage > 0) {
                    currentPage--;
                } else if (reaction.emoji.name === '➡️' && currentPage < pages.length - 1) {
                    currentPage++;
                };
                embed.setDescription(pages[currentPage]);
                embed.setTitle(`@${taggedRole.name} Rolündeki Kullanıcılar`);
                embed.setFooter({ text: `Sayfa ${currentPage + 1}/${pages.length}` });
                msg.edit({ embeds: [embed] });
            });
            collector.on('end', () => {
                msg.reactions.removeAll();
                msg.react('❌');
            });
        }
    });

};