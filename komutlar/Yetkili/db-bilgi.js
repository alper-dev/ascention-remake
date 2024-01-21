const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setName('bilgi')
    .setDescription('db bilgi')
    .setDMPermission(false)
    .addStringOption(option => option
        .setRequired(true)
        .setName('seçenek')
        .setDescription('Bilgi almak istediğiniz konuyu seçin.')
        .addChoices(
            { name: 'kayıt_ayarları', value: 'kayıt_ayarları' },
            { name: 'kayıt_komut', value: 'kayıt_komut' },
            { name: 'uyarı_ayarları', value: 'uyarı_ayarları' },
            { name: 'uyarı_komut', value: 'uyarı_komut' },
            { name: 'rank_komut', value: 'rank_komut' },
            { name: 'rank_ayarları', value: 'rank_ayarları' },
            { name: 'mute_komut', value: 'mute_komut' },
            { name: 'mute_ayarları', value: 'mute_ayarları' },
            { name: 'akademi_komut', value: 'akademi_komut' },
            { name: 'akademi_ayarları', value: 'akademi_ayarları' },
            { name: 'jail_ayarları', value: 'jail_ayarları' },
            { name: 'jail_komut', value: 'jail_komut' },
            { name: 'tag_ayarları', value: 'tag_ayarları' },
            { name: 'tag_komut', value: 'tag_komut' }
        ))

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const option = interaction.options.getString('seçenek');
    const kayıtsız = db.get("kayıtsızrolu." + interaction.guildId);
    const erkek = db.get("erkekrolu." + interaction.guildId);
    const kadın = db.get("bayanrolu." + interaction.guildId);
    const yetkili = db.get("kayıtyetkilirol." + interaction.guildId);
    const logs = db.get("kayıtlog." + interaction.guildId);
    const kayıtchat = db.get("kayıtchat." + interaction.guildId);
    const uyarı1 = db.get("uyarı1rolu." + interaction.guildId);
    const uyarı2 = db.get("uyarı2rolu." + interaction.guildId);
    const uyarı3 = db.get("uyarı3rolu." + interaction.guildId);
    const uyarılog = db.get("uyarılog." + interaction.guildId);
    const demir = db.get("demir." + interaction.guildId);
    const bronz = db.get("bronz." + interaction.guildId);
    const gümüş = db.get("gümüş." + interaction.guildId);
    const altın = db.get("altın." + interaction.guildId);
    const plat = db.get("plat." + interaction.guildId);
    const elmas = db.get("elmas." + interaction.guildId);
    const yücelik = db.get("yücelik." + interaction.guildId);
    const immortal = db.get("immortal." + interaction.guildId);
    const radiant = db.get("radiant." + interaction.guildId);
    const akademiyetkili = db.get("akademiyetkili." + interaction.guildId);
    const akademi = db.get("akademi." + interaction.guildId);
    const muteyetkili = db.get("muteyetkili." + interaction.guildId);
    const muterol = db.get("mute." + interaction.guildId);
    const mutelog = db.get("mutelog." + interaction.guildId);
    const jaillog = db.get("jaillog." + interaction.guildId);
    const jailoda = db.get("jailoda." + interaction.guildId);
    const jailrol = db.get("jailrol." + interaction.guildId);
    const jailyetkili = db.get("jailyetkili." + interaction.guildId);
    const praccyetkili = db.get("praccyetkili." + interaction.guildId);
    const tagrol = db.get("tagrol." + interaction.guildId);

    if (option === "kayıt_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Kayıt Bilgilendirme`)
            .setDescription(`Erkek Rolü: <@&${erkek}>\n\nBayan Rolü: <@&${kadın}>\n\nKayıtsız Rolü: <@&${kayıtsız}>\n\nKayıt Yetkili Rolü: <@&${yetkili}>\n\nKayıt Log Kanalı: <#${logs}>\n\nKayıt Chat Kanalı: <#${kayıtchat}>\n`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }
    if (option === "kayıt_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Kayıt Bilgilendirme`)
            .setDescription(`Erkek Rol ayarla: ayarla erkek <@etiket> \n\nBayan Rol ayarla: ayarla bayan <@etiket>\n\nKayıtsız Rol ayarla: ayarla kayıtsız <@etiket>\n\nKayıt Yetkili Rolü ayarla: ayarla kayıt_yetkili <@etiket>\n\nKayıt Log kanalı ayarla: ayarla kayıt_log <#etiket>\n\nKayıt chat kanalı ayarla: ayarla kayıt_chat <#etiket>\n`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "uyarı_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Uyarı Bilgilendirme`)
            .setDescription(`Uyarı 1 Rolü: <@&${uyarı1}>\n\nUyarı 2 Rolü: <@&${uyarı2}>\n\nUyarı 3 Rolü: <@&${uyarı3}>\n\nUyarı Log Kanalı: <#${uyarılog}>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }
    if (option === "uyarı_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Uyarı Bilgilendirme`)
            .setDescription(`Uyarı 1 ayarlamak için: ayarla uyarı1 <@etiket>\n\nUyarı 2 ayarlamak için: ayarla uyarı2 <@etiket>\n\nUyarı 3 ayarlamak için: ayarla uyarı3 <@etiket>\n\nUyarı Log ayarlamak için: ayarla uyarı_log <#etiket>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "rank_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Rank Bilgilendirme`)
            .setDescription(`Demir rank rolü ayarlamak için: ayarla demir <@etiket>\n\nBronz rank rolü ayarlamak için: ayarla bronz <@etiket>\n\nGümüş rank rolü ayarlamak için: ayarla gümüş <@etiket>\n\nAltın rank rolü ayarlamak için: ayarla altın <@etiket>\n\nPlat rank rolü ayarlamak için: ayarla plat <@etiket>\n\nElmas rank rolü ayarlamak için: ayarla elmas <@etiket>\n\nYücelik rank rolü ayarlamak için: ayarla yücelik <@etiket>\n\nİmmortal rank rolü ayarlamak için: ayarla immortal <@etiket>\n\nRadiant rank rolü ayarlamak için: ayarla radiant <@etiket>\n\n`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "rank_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Rank Bilgilendirme`)
            .setDescription(`Akademi Rolü: <@&${akademi}>\n\nDemir Rolü: <@&${demir}>\n\nBronz Rolü: <@&${bronz}>\n\nGümüş Rolü: <@&${gümüş}>\n\nAltın Rolü: <@&${altın}>\n\nPlat Rolü: <@&${plat}>\n\nElmas Rolü: <@&${elmas}>\n\nYücelik Rolü: <@&${yücelik}>\n\nİmmortal Rolü: <@&${immortal}>\n\nRadiant Rolü: <@&${radiant}>\n\n`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "mute_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Mute Bilgilendirme`)
            .setDescription(`Mute yetkili rolü ayarlamak için: ayarla muteyetkili <@etiket>\n\nMute  rolü ayarlamak için: ayarla mute <@etiket>\n\n<@&${muterol}>\n\nMute Log kanalı ayarla: ayarla mute_log <#etiket>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "mute_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Mute Bilgilendirme`)
            .setDescription(`Mute yetkili Rolü: <@&${muteyetkili}>\n\nMute Rolü: <@&${muterol}>\n\nMute Log: <#&${mutelog}>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "akademi_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Akademi & Pracc Bilgilendirme`)
            .setDescription(`Akademi yetkili rolü ayarlamak için: ayarla akademiyetkili <@etiket>\n\nAkademi rolü ayarlamak için: ayarla akademi <@etiket>\n\nPracc yetkili rolü ayarlamak için: ayarla praccyetkili <@etiket>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "akademi_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Akademi & Pracc Bilgilendirme`)
            .setDescription(`Akademi yetkili Rolü: <@&${akademiyetkili}>\n\nAkademi Rolü: <@&${akademi}>\n\nPracc Yetkili Rolü: <@&${praccyetkili}>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "jail_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Jail Bilgilendirme`)
            .setDescription(`Jail Yetkili Rolü: <@&${jailyetkili}>\nJail Rolü: <@&${jailrol}>\n\nJail Log Kanalı: <#${jaillog}>\nJail oda Kanalı: <#${jailoda}>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }
    if (option === "jail_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Jail Bilgilendirme`)
            .setDescription(`Jail Rol ayarla: ayarla jail_rol <@etiket>\nJail yetkili ayarla: ayarla jail_yetkili <@etiket>\n\nKayıt Log kanalı ayarla: ayarla jail_log <#etiket>\nKayıt oda kanalı ayarla: ayarla jail_oda <#etiket>`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "tag_ayarları") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Tag Bilgilendirme`)
            .setDescription(`Tag Rol: <@&${tagrol}>\n`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

    if (option === "tag_komut") {
        let kayıtbilgi = new EmbedBuilder()
            .setTitle(`Tag Bilgilendirme`)
            .setDescription(`Tag Rol ayarla: ayarla tag_rol <@etiket>\n`)
            .setFooter({ text: interaction.guild.name })
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();
        interaction.reply({ ephemeral: true, embeds: [kayıtbilgi] });
    }

};