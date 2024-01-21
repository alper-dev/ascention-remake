const { SlashCommandBuilder, ChannelType, EmbedBuilder, OverwriteType } = require('discord.js');
const updateOverwrite = require('../../utils/updateOverwrite');

module.exports.data = new SlashCommandBuilder()
    .setName('kilitle')
    .setDescription('Kanalı kilitle ya da kilidini aç.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(16)
    .addChannelOption(option => option
        .addChannelTypes(ChannelType.GuildText)
        .setName('kanal')
        .setDescription('Kanal girin. (varsayılan bu kanal)')
        .setRequired(false))
    .addStringOption(option => option
        .setName('sebep')
        .setDescription('Sebebi girin.')
        .setRequired(false))

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    const reason = interaction.options.getString('sebep') || 'Yok.';
    const deniedPerms = channel.permissionOverwrites.cache?.get(channel.guildId)?.deny?.toArray() || [];

    if (deniedPerms.includes('SendMessages')) { // unlock

        updateOverwrite(channel, interaction.guildId, ['SendMessages:true']);

        channel.send({
            embeds: [new EmbedBuilder()
                .setColor('#3a0779')
                .setTitle('Kanal Açıldı')
                .setDescription(`<a:onay:1108909260240326696> \`${channel.name}\` Kanalının Kilidi Açılmıştır.`)
                .setFooter({ text: `Ascention Team` })
            ]
        });

        interaction.reply({ ephemeral: true, content: `\`${channel.name}\` isimli kanal kilidi açılmıştır.` });

    } else { // lock

        updateOverwrite(channel, interaction.guildId, ['SendMessages:false']);

        channel.send({
            embeds: [new EmbedBuilder()
                .setColor('#ecfa24')
                .setTitle('Kanal Kilitlendi')
                .setDescription(`<a:onay:1108909260240326696> \`${channel.name}\` Kanalı Kapatılmıştır.\n<a:onay:1108909260240326696> Sebebi: ${reason}`)
                .setFooter({ text: `Ascention Team` })
            ]
        });

        interaction.reply({ ephemeral: true, content: `\`${channel.name}\` isimli kanal kilitlenmiştir.` });

    };

};