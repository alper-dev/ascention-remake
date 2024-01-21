const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('komut-ayarları')
    .setDescription('Komut ayarları')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    interaction.reply({
        embeds: [new EmbedBuilder()
            .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
            .setColor('003fff')
            .setDescription(`**/bilgi kayıt_ayarları:** Ayarlanmış kayıt ayarlarını gösterir.\n\n**/bilgi kayıt_komut:** Kayıt ayarlama kodları.\n\n**/bilgi uyarı_ayarları:** Ayarlanmış uyarı ayarlarını gösterir.\n\n**/bilgi uyarı_komut:** Uyarı ayarlama kodları.\n\n**/bilgi rank_ayarları:** Ayarlanmış rank ayarlarını gösterir.\n\n**/bilgi rank_komut:** Rank ayarlama kodları.\n\n**/bilgi mute_ayarları:** Ayarlanmış mute ayarlarını gösterir.\n\n**/bilgi mute_komut:** Mute ayarlama kodları.\n\n**/bilgi jail_ayarları:** Ayarlanmış Jail ayarlarını gösterir.\n\n**/bilgi jail_komut:** Jail ayarlama kodları.\n\n**/bilgi akademi_ayarları:** Ayarlanmış Akademi ve Pracc Yetkili ayarlarını gösterir.\n\n**/bilgi akademi_komut:** Akademi ve Pracc Yetkili ayarlama kodları.`)
            .setTimestamp()
            .setFooter({ text: 'Ascention Team' })
            .setThumbnail(interaction.guild.iconURL())
            //.setImage(`https://cdn.discordapp.com/attachments/1116325602341945384/1116325801118416916/TLF_Esp_650_290_piksel_1080_1080_piksel_1920_1080_piksel_1.png`)
        ]
    });

};