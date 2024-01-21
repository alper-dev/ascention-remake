const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');

const kayitlarPerPage = 10;

module.exports.data = new SlashCommandBuilder()
    .setName('kayıt')
    .setDescription('alper.dev')
    .setDMPermission(false)
    .addSubcommand(option => option
        .setName('top')
        .setDescription('Kayıt sayısını sıralar.'))
    .addSubcommand(option => option
        .setName('yardım')
        .setDescription('Yeni üyeler için kayıt olma rehberini görüntüler.'));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async (client, interaction) => {
    let subcmd = interaction.options.getSubcommand();

    if (subcmd === 'top') {

        const kayitlar = db.all().filter(data => data.ID.startsWith("kayıtsayısı_"));
        const sorted = kayitlar.sort((a, b) => b.data - a.data);

        let page = 1;

        const maxPages = Math.ceil(sorted.length / kayitlarPerPage);
        if (page > maxPages) return interaction.reply(`Bu sayfada kayıt bulunmuyor. Toplam sayfa sayısı: ${maxPages}`);

        let startIndex = (page - 1) * kayitlarPerPage;
        let endIndex = startIndex + kayitlarPerPage;
        let paginatedData = sorted.slice(startIndex, endIndex);

        const embed = new EmbedBuilder()
            .setTitle("Kayıt Sayısı Sıralaması")
            .setColor("#ff0035");

        let fields_ = [];
        paginatedData.forEach((data, index) => {
            const userID = data.ID.replace("kayıtsayısı_", "");
            const user = client.users.cache.get(userID);
            fields_.push({
                name: `${startIndex + index + 1}. ${user?.tag || 'Bilinmeyen Kullanıcı'}`,
                value: `Kullanıcı ID: ${userID}\nKayıt Sayısı: ${data.data}`
            });
        });

        embed.addFields(fields_);
        embed.setFooter({ text: `Sayfa ${page}/${maxPages}` });

        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

        if (maxPages > 1) {
            await msg.react("◀️");
            await msg.react("▶️");

            const filter = (reaction, user) => ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === interaction.user.id;

            const collector = msg.createReactionCollector({ filter, time: 60000 });

            collector.on("collect", (reaction, user) => {
                reaction.users.remove(user);

                if (reaction.emoji.name === "◀️" && page > 1) {
                    showPage(page - 1);
                } else if (reaction.emoji.name === "▶️" && page < maxPages) {
                    showPage(page + 1);
                }
            });
            collector.on('end', () => {
                msg.reactions.removeAll();
                msg.react('❌');
            });

            async function showPage(newPage) {
                page = newPage;
                startIndex = (page - 1) * kayitlarPerPage;
                endIndex = startIndex + kayitlarPerPage;
                paginatedData = sorted.slice(startIndex, endIndex);

                const newEmbed = new EmbedBuilder()
                    .setTitle("Kayıt Sayısı Sıralaması")
                    .setColor("#ff0035");

                let fields = [];
                paginatedData.forEach((data, index) => {
                    const userID = data.ID.replace("kayıtsayısı_", "");
                    const user = client.users.cache.get(userID);
                    fields.push({
                        name: `${startIndex + index + 1}. ${user?.tag || 'Bilinmeyen Kullanıcı'}`,
                        value: `Kullanıcı ID: ${userID}\nKayıt Sayısı: ${data.data}`
                    });
                });

                newEmbed.addFields(fields);
                newEmbed.setFooter({ text: `Sayfa ${page}/${maxPages}` });
                msg.edit({ embeds: [newEmbed] });
            }
        }

    } else if (subcmd === 'yardım') {

        const yetkili = db.get("kayıtyetkilirol." + interaction.guildId);
        const kayıtsız = db.get("kayıtsızrolu." + interaction.guildId);
        if (!interaction.member.roles.cache.get(yetkili)) return interaction.reply({ ephemeral: true, content: "Yalnızca yetkililer kullanabilir." })

        interaction.channel.send(`<@&${kayıtsız}>`)
        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setAuthor({ name: 'Sunucumuza Hoş Geldiniz!', iconURL: interaction.guild.iconURL() })
                .setColor("Blue")
                .setDescription(`Ascention Team ailesine katıldığınız için teşekkür ederiz! Sunucumuzun aktif ve rekabet dolu dünyasına hoş geldiniz.\n\n<a:onay:1108909260240326696> **Kayıt Olmak İçin Ne Yapmalısınız?**\n\n1. Sunucumuza katıldığınızda, lütfen sese girin. Sesli kanallarımızda aktif olmak, topluluğumuza hızlı bir şekilde katılmanız için önemlidir.\n2. Ses teyit vermek için bir yetkiliyle görüşmeniz gerekecek. ${interaction.user} sizinle iletişim kuracak ve kayıt işleminizi tamamlamanıza yardımcı olacaktır.\n\n<a:onay:1108909260240326696> **Hazır Olması Gereken Bilgiler:**\n- İsminiz ve Yaşınız : Kayıt olurken kullanacağınız adınız ve yaşınız.\n- Rankınız: Oyun içindeki rankınız.\n\nHazırlıklı olmak, kayıt sürecinizi hızlandıracak ve sunucumuzdaki deneyiminizi daha keyifli hale getirecektir.\nDaha fazla bilgi veya yardım için <#1117515681668272228> kanalından bir yetkiliye ulaşabilirsiniz.\nTekrar hoş geldiniz ve Ascention Team ailesinin bir parçası olduğunuz için mutluyuz!\n\nSaygılarımla,\n**Ascention Team Yönetim Ekibi <:ATELOGO:1137894264039280750>**`)
                .setTimestamp()
                .setFooter({ text: interaction.guild.name })
                .setThumbnail(interaction.guild.iconURL())
                //.setImage(``)
            ]
        })

    };

};