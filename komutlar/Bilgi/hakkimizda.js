const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('hakkımızda')
    .setDescription('Hakkımızda bilgi mesajını gönderir.')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    interaction.reply({
        ephemeral: true, embeds: [
            new EmbedBuilder()
                .setColor('Purple')
                .setAuthor({ name: 'Merhaba ve Hoş Geldin!', iconURL: interaction.guild.iconURL() })
                .setFields(
                    { name: 'Hakkımızda', value: 'Biz, sadece bir oyun topluluğu değil, aynı zamanda profesyonel bir e-spor ekibi olarak bu yolda ilerliyoruz. Valorant sahnesindeki başarılarımızı hedefliyor ve bu hedeflere ulaşmak için çalışıyoruz.' },
                    { name: 'Topluluğumuz', value: 'Bu sunucu, sadece yeni dostlar edinmekle kalmaz, aynı zamanda kendini geliştirmen için birçok fırsat sunar. Valorant ile ilgili güncel bilgilere ulaşabilir, oyun arkadaşları bulabilir ve büyüleyici deneyimler yaşayabilirsin. Burası, her seviyeden oyuncunun bir araya geldiği bir ailedir.' },
                    { name: 'Son Sözler', value: 'Umarız aradığın her şeyi burada bulabilirsin. Yeni dostluklar kurarken bol şanslar dileriz ve unutma, burası güçlü ve dayanışma içinde bir topluluğun parçası olma fırsatı sunuyor.\n\n**Ascention Team Yönetim ekibi <:ATELOGO:1137894264039280750>**' }
                )
                .setDescription('Seni burada görmekten büyük bir mutluluk duyuyoruz!\n\nAscention Team, Valorant aşkı ile yola çıkarak 2022 yılında kuruldu. Burası, sadece bir oyun sunucusu olmanın ötesinde, bir topluluğun kalbinin attığı yerdir. Amacımız, Valorant severlerin bir araya gelerek deneyimlerini paylaşabileceği, bilgi ve becerilerini artırabileceği ve rekabetçi bir atmosferde birlikte oyunlar oynayabileceği bir ev yaratmaktır.')
                .setTimestamp()
                .setFooter({text:interaction.guild.name})
                .setThumbnail(interaction.guild.iconURL())
        ]
    });

};