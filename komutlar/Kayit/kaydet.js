const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('orio.db');
const fetchUser = require('../../utils/fetchUser.js');
const { success } = require("../../utils/embeds.js");

module.exports.data = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('kaydet')
    .setDescription('Üyeleri kaydedin.')
    .addUserOption(option => option
        .setRequired(true)
        .setName('üye')
        .setDescription('Kaydedilecek üyeyi girin.'))
    .addStringOption(option => option
        .setName('cinsiyet')
        .setDescription('Cinsiyeti seçin.')
        .setChoices({ name: 'Erkek', value: 'erkek' }, { name: 'Kadın', value: 'kadin' })
        .setRequired(true))
    .addStringOption(option => option
        .setName('isim')
        .setDescription('İsmi girin.')
        .setRequired(true))
    .addIntegerOption(option => option
        .setName('yaş')
        .setDescription('Yaşı girin.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async (client, interaction) => {

    const user = interaction.options.getUser('üye');
    const member = interaction.guild.members.cache.get(user.id);
    const gender = interaction.options.getString('cinsiyet');
    const name = interaction.options.getString('isim');
    const age = interaction.options.getInteger('yaş');

    const kayıtsız = interaction.guild.roles.cache.get(db.get("kayıtsızrolu." + interaction.guildId));
    const erkek = interaction.guild.roles.cache.get(db.get("erkekrolu." + interaction.guildId));
    const kadın = interaction.guild.roles.cache.get(db.get("bayanrolu." + interaction.guildId));
    const yetkili = db.get("kayıtyetkilirol." + interaction.guildId);
    const log = interaction.guild.channels.cache.get(db.get("kayıtlog." + interaction.guildId));

    if (!interaction.member.roles.cache.has(yetkili))
        return interaction.reply({ ephemeral: true, embeds: [new EmbedBuilder().setDescription("Komutu kullanmak için yetkin yok.")] });

    interaction.deferReply({ ephemeral: true });

    if (gender === 'erkek') {

        const embed01 = new EmbedBuilder()
            .setAuthor({ name: 'Sunucumuza Hoş Geldiniz.', iconURL: interaction.guild.iconURL() })
            .setTitle(`Erkek Kayıt Başarılı!`)
            .setDescription(`• Kişiye ${erkek} Rolü Başarıyla Verildi.\n• İsmi ${user} Şeklinde Değiştirildi.`)
            .setFooter({ text: interaction.user.tag })
            .setTimestamp();
        interaction.channel.send({ embeds: [embed01] });

        db.add(`kayıtsayısı_${interaction.user.id}`, 1);

        const embed02 = new EmbedBuilder()
            .setTitle(`Bir Erkek Kullanıcı Kayıt Edildi!`)
            .setDescription(`**Kayıt Eden Yetkili Adı:** ${interaction.user}  \n **Kayıt edilen kullanıcı :** ${user}  \n**Kayıt işleminde verilen rol:** ${erkek}  \n **Kayıt işleminde alınan rol:** ${kayıtsız}`)
            .setThumbnail(interaction.user.avatarURL())
        log?.send({ embeds: [embed02] });

        await member.setNickname("✯ " + name + " | " + age).catch(() => { });
        await member.roles.add(erkek)
        await member.roles.remove(kayıtsız);
        await interaction.editReply({ embeds: [success('Kayıt işlemi başarılı.')] });

    } else {

        const embed01 = new EmbedBuilder()
            .setAuthor({ name: 'Sunucumuza Hoş Geldiniz.', iconURL: interaction.guild.iconURL() })
            .setTitle(`Kadın Kayıt Başarılı!`)
            .setDescription(`• Kişiye ${kadın} Rolü Başarıyla Verildi.\n• İsmi ${user} Şeklinde Değiştirildi.`)
            .setFooter({ text: interaction.user.tag })
            .setTimestamp();
        interaction.channel.send({ embeds: [embed01] });

        db.add(`kayıtsayısı_${interaction.user.id}`, 1);

        const embed02 = new EmbedBuilder()
            .setTitle(`Bir Kadın Kullanıcı Kayıt Edildi!`)
            .setDescription(`**Kayıt Eden Yetkili Adı:** ${interaction.user}  \n **Kayıt edilen kullanıcı :** ${user}  \n**Kayıt işleminde verilen rol:** ${kadın}  \n **Kayıt işleminde alınan rol:** ${kayıtsız}`)
            .setThumbnail(interaction.user.avatarURL())
        log?.send({ embeds: [embed02] });

        await member.setNickname("✯ " + name + " | " + age).catch(() => { });
        await member.roles.add(kadın)
        await member.roles.remove(kayıtsız);
        await interaction.editReply({ embeds: [success('Kayıt işlemi başarılı.')] });

    };

};