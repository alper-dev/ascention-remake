const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const db = require("orio.db");

module.exports.data = new SlashCommandBuilder()
    .setName('takım')
    .setDescription('aynen ondan işte')
    .setDefaultMemberPermissions(8)
    .setDMPermission(false)
    .addStringOption(option => option
        .setName('takım_adı')
        .setDescription('Takımın ismini girin.')
        .setRequired(true))
    .addStringOption(option => option
        .setName('kaptan_rolü')
        .setDescription('Takım kaptanı rolünün ismini ve rengini girin. (isim :: #renkKodu)')
        .setRequired(true))
    .addStringOption(option => option
        .setName('oyuncu_rolü')
        .setDescription('Oyuncu rolünün ismini ve rengini girin. (isim :: #renkKodu)')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {
    interaction.deferReply();

    const teamName = 'Ate・' +interaction.options.getString('takım_adı');
    const rawRole1 = interaction.options.getString('kaptan_rolü');
    const rawRole2 = interaction.options.getString('oyuncu_rolü');

    let roleName1,
        roleColor1 = '#000000',
        roleName2,
        roleColor2 = '#000000';

    if (rawRole1.includes('::')) {
        roleName1 = 'Ate・' + rawRole1.split('::')[0].trim();
        roleColor1 = rawRole1.split('::')[1].trim();
    } else roleName1 = rawRole1;

    if (rawRole2.includes('::')) {
        roleName2 = 'Ate・' + rawRole2.split('::')[0].trim();
        roleColor2 = rawRole2.split('::')[1].trim();
    } else roleName2 = rawRole2;

    const captainRole = await interaction.guild.roles.create({ name: roleName1, color: roleColor1 });
    const playerRole = await interaction.guild.roles.create({ name: roleName2, color: roleColor2 });

    const category = await interaction.guild.channels.create({
        name: teamName,
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: role1.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: role2.id,
                allow: [PermissionsBitField.Flags.ViewChannel],
            },
        ],
    });

    const textChannels = [`✯・duyuru`, `✯・program`, `✯・chat`, `✯・media`, `✯・pracc-ss`];

    for (const channelName of textChannels) {
        await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category,
        });
    };

    const existingCategory = interaction.guild.channels.cache.find(
        (channel) => channel.type === ChannelType.GuildCategory && channel.name.toLowerCase() === 'alt takımlar'
    );

    if (existingCategory) {
        await interaction.guild.channels.create({
            name: teamName,
            type: ChannelType.GuildVoice,
            parent: existingCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.Connect],
                },
                {
                    id: role1.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
                {
                    id: role2.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.Connect],
                },
                {
                    id: erkek,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },
            ],
        });
    } else {
        interaction.editReply('Sesli kanal oluşturulamadı: "alt takım" kategorisi bulunamadı.');
    };

    interaction.editReply('Takım kategorisi ve kanalları oluşturuldu.');

};