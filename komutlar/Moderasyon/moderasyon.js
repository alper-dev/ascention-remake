const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('moderasyon')
    .setDescription('Moderasyon komutlarını görüntüler.')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    interaction.reply({
        ephemeral: true, embeds: [new EmbedBuilder()
            .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
            .setColor('003fff')
            .setDescription(`
**/uyar:** Kullanıcılara uyarı atar.

**/uyarı-liste:** Uyarısı olan kullanıcıları listeler.

**/uyarı_sil:** Etiketlenen kişinin 1 adet uyarısı silinir.

**/sunucuinfo:** Sunucu hakkında bilgi verir

**/sesver:** Sestekilere rol verir.

**/ver(rank):** Etiketlenen üyeye rol verir.

**/al mute:** Etiketlenen üyenin susturmasını kaldırır.

**/kayıtsayısı:** Kayıt sorumlularının kayıt sayılarını gösterir.

**/kyg:** Kayıt sorumlularının yazması gereken text kısayolu.

**/sil:** Sohbeti temizler.

**/ping:** Botun gecikmesini gösterir.

**/lock & unlock:** Kanalı kilitler & açar.

**/jail-liste:** Jaildeki kişileri listeler.

**/jail-çıkar:** Etiketlediğiniz kişiyi jailden çıkartır.

**/jail-ekle:** Etiketlediğiniz kişiyi jaile ekler.

**/avatar** kendinizin veya etiketlediğiniz kişinin avatarını gösterir
`)
            .setTimestamp()
            .setFooter({ text: 'Ascention Team' })
            .setThumbnail(interaction.guild.iconURL())
            // .setImage(`https://cdn.discordapp.com/attachments/1116325602341945384/1116325801118416916/TLF_Esp_650_290_piksel_1080_1080_piksel_1920_1080_piksel_1.png`)
        ]
    });

};