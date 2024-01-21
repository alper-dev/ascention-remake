const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('orio.db');
const { err } = require('../../utils/embeds.js');

module.exports.data = new SlashCommandBuilder()
    .setName('vp')
    .setDescription('Valorant Points şans oyunu.');

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    if (interaction.channel.id != "1124364060994060378") return interaction.reply({ ephemeral: true, embeds: [err('Valorant Points komutunu yalnızca <#1124364060994060378> kanalında kullanabilirsin.\nEğer nasıl oynayacağını bilmiyorsan <#1124363533774233761>.')] });
    if (!interaction.member.roles.cache.has("1128236274550067301")) return interaction.reply({ ephemeral: true, embeds: [err(`Valorant Points komutunu kullanabilmen için 'ate' tagımızı alman gerekiyor.\n\nNasıl alacağını bilmiyorsan komut olarak .tagnasılalınır komudunu kullan.`)] });
    const sayi = Math.floor(Math.random() * 20000);
    db.add(`vpsayısı_`, +1);
    if (sayi === 1) {
        const won = new EmbedBuilder()
            .setTitle('Ascention Team')
            .setDescription(`${interaction.user} **Tebrikler** Valorant Points özel mesaj olarak iletilmiştir.`)
            .setFooter({ text: "Valorant Vp kazanıldığı için oda şuanlık kilitlenmiştir." })
            .setColor('#00ff2e')
            .setTimestamp()
            .setThumbnail(interaction.user.avatarURL())
        interaction.reply({ embeds: [won] })

        const dm = new EmbedBuilder()
            .setTitle('Ascention Team')
            .setDescription(`${interaction.user} **Tebrikler** Valorant Points kazandınız.\n\n<@925508916064956516> ile iletişime geçiniz.\n Kod : Valo ATE`)
            .setFooter({ text: "Ascention Team" })
            .setColor('#00ff2e')
            .setTimestamp()
            .setThumbnail(interaction.user.avatarURL());
        interaction.user.send({ embeds: [dm] });

        const { channel } = interaction;
        updateOverwrite(channel, interaction.guildId, ['SendMessages:false']);

    } else {
        const lose = new EmbedBuilder()
            .setTitle('Ascention Team')
            .setDescription(`${interaction.user} Valorant Points kazanmak için tekrar dene.`)
            .setColor('Red')
            .setFooter({ text: interaction.guild.name })
            .setTimestamp();
        interaction.reply({ embeds: [lose] });
    };

};