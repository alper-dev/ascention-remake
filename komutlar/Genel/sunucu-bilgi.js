const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('sunucu-bilgi')
    .setDescription('Sunucu bilgilerini görüntüle.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(32);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {

    let guild = interaction.guild;
    let serverSize = guild.memberCount;
    let botCount = guild.members.cache.filter(m => m.user.bot).size;
    let humanCount = serverSize - botCount;
    let region = {
        'en-US': 'İngilizce (ABD) 🇺🇸',
        'en-GB': 'İngilizce (Birleşik Krallık) 🇬🇧',
        'bg': 'Bulgarca 🇧🇬',
        'zh-CN': 'Çince (Çin) 🇨🇳',
        'zh-TW': 'Çince (Tayvan) 🇹🇼',
        'hr': 'Hırvatça 🇭🇷',
        'cs': 'Çekçe 🇨🇿',
        'da': 'Danca 🇩🇰',
        'nl': 'Felemenkçe 🇳🇱',
        'fi': 'Fince 🇫🇮',
        'fr': 'Fransızca 🇫🇷',
        'de': 'Almanca 🇩🇪',
        'el': 'Yunanca 🇬🇷',
        'hi': 'Hintçe 🇮🇳',
        'hu': 'Macarca 🇭🇺',
        'it': 'İtalyanca 🇮🇹',
        'ja': 'Japonca 🇯🇵',
        'ko': 'Korece 🇰🇷',
        'lt': 'Litvanca 🇱🇹',
        'no': 'Norveççe 🇳🇴',
        'pl': 'Lehçe 🇵🇱',
        'pt-BR': 'Portekizce (Brezilya) 🇧🇷',
        'ro': 'Romence (Romanya) 🇷🇴',
        'ru': 'Rusça 🇷🇺',
        'es-ES': 'İspanyolca (İspanya) 🇪🇸',
        'sv-SE': 'İsveççe 🇸🇪',
        'th': 'Tayca 🇹🇭',
        'tr': 'Türkçe 🇹🇷',
        'uk': 'Ukraynaca 🇺🇦',
        'vi': 'Vietnamca 🇻🇳',
    };

    let sunucu = new EmbedBuilder()
        .setAuthor({ name: 'Sunucu Bilgi', iconURL: interaction.guild.iconURL() })
        .setThumbnail(interaction.guild.iconURL())
        .addFields(
            {
                name: 'Sunucu Bilgileri',
                value: `
Sunucu İsmi: **${guild.name}**
Sunucu ID: **${guild.id}**
Sunucu Sahibi: **${(await guild.fetchOwner()).user.tag}**
Sunucu Ana Dili: **${region[guild.preferredLocale]}**
Kuruluş Tarihi: **<t:${Math.floor(guild.createdTimestamp / 1000)}:F>**`
            },
            {
                name: 'Üye Bilgileri',
                value: `
Toplam Üye: **${humanCount}**
Toplam Bot: **${botCount}**
Rol Sayısı: **${guild.roles.cache.size}**
                `
            },
            {
                name: 'Kanallar',
                value: `
Yazı: **${guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size}**
Sesli: **${guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size}**
Kategori: **${guild.channels.cache.filter(c => c.type == ChannelType.GuildCategory).size}**`
            }
        )
        .setTimestamp()
        .setColor('#04001f')
        .setFooter({ text: 'Ascention Team' })

    interaction.reply({ embeds: [sunucu] });

};