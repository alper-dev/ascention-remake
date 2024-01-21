const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('yönetim-komutları')
    .setDescription('Yönetim komutlarını görüntüle.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
        .setColor('003fff')
        .setDescription(`
**/yetkilioda:** Etiketlenen kullanıcıya yetkili sunucusunda özel odaları açar.

**/kayıt-liste:** kayıtsayıları listeler.

**/rol-liste:** etiketlenen roldeki kullanıcıları listeler.

**/not:** Not sistemi.
**/not-alanlar:** Not tutan kişileri listeler.
**/yaz:** Bota yazı yazdırır.
**/vp-sayısı:** .vp komutunun kullanım sayısını gösterir.
**/komut-ayarları:** DataBase Ekli rol bilgilendirmesi.
`)
        .setTimestamp()
        .setFooter({ text: 'Ascention Team' })
        .setThumbnail(interaction.guild.iconURL())

};