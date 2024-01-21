const { SlashCommandBuilder, ChannelType } = require('discord.js');
const updateOverwrite = require('../../utils/updateOverwrite.js');
const { success } = require('../../utils/embeds.js');

module.exports.data = new SlashCommandBuilder()
    .setName('yetkili-oda')
    .setDescription('Yetkiliye özel kanallar aç.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)
    .addUserOption(option => option
        .setName('yetkili')
        .setDescription('Bir üye girin.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {

    const user = interaction.options.getUser('yetkili');

    const roles = {
        'aktiflik denetimcisi': '',
        mod: '',
        admin: '',
        'kayit modu': ''
    };

    const category = await interaction.guild.channels.create({
        name: user.displayName,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: user.id,
                allow: ['ViewChannel']
            },
            {
                id: roles['aktiflik denetimcisi'],
                allow: ['ViewChannel']
            },
            {
                id: roles.mod,
                allow: ['ViewChannel']
            },
            {
                id: roles.admin,
                allow: ['ViewChannel']
            }
        ]
    });

    interaction.guild.channels.create({
        name: 'kayıt-sayım',
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [{
            id: roles['kayit modu'],
            allow: ['ViewChannel']
        }],
    });
    interaction.guild.channels.create({
        name: 'kaç-text-attım',
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [{
            id: roles['kayit modu'],
            allow: ['ViewChannel']
        }],
    });
    interaction.guild.channels.create({
        name: 'soru',
        type: ChannelType.GuildText,
        parent: category
    });

    interaction.reply({ embeds: [success('Kategori ve odalar oluşturuldu.')] });

};