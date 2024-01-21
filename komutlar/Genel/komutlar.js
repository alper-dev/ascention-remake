const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const { handleCommand } = require('../../utils/listCommand');
const Embeds = require('../../utils/embeds');

module.exports.data = new SlashCommandBuilder()
    .setName('komutlar')
    .setDescription('Komutları görüntüle')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    const embed = new EmbedBuilder()
        .setColor('003fff')
        .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
        .setDescription('Selam! Nasıl yardımcı olabilirim?');
    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('commands:bilgi')
            .setLabel('Bilgi')
            .setEmoji('1198324899106791524')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('commands:eglence')
            .setLabel('Eğlence')
            .setEmoji('1198326116109254706')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('commands:genel')
            .setLabel('Genel')
            .setEmoji('1198326306455158884')
            .setStyle(ButtonStyle.Secondary),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('commands:yetkili')
            .setLabel('Yetkili')
            .setEmoji('1198328866377322516')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('commands:kayit')
            .setLabel('Kayıt')
            .setEmoji('1198327669889171466')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('commands:moderasyon')
            .setLabel('Moderasyon')
            .setEmoji('1198328590878650549')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('commands:admin')
            .setLabel('Admin')
            .setEmoji('1198326513578299463')
            .setStyle(ButtonStyle.Secondary),
    );

    interaction.reply({ embeds: [embed], components: [row1, row2] });

};

function embed(description, interaction) {
    return new EmbedBuilder()
        .setColor('Blurple')
        .setAuthor({ name: 'Ascention Team E-Spor', iconURL: interaction.guild.iconURL() })
        .setDescription('```\n' + description + '```')
        .setFooter({ text: 'Ascention Team' });
};
module.exports.buttons = {
    bilgi: interaction => {
        const commands = interaction.client.commands.filter(c => c.category === 'Bilgi').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    },
    eglence: interaction => {
        const commands = interaction.client.commands.filter(c => c.category === 'Eglence').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    },
    genel: interaction => {
        const commands = interaction.client.commands.filter(c => c.category === 'Genel').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    },
    yetkili: interaction => {
        const commands = interaction.client.commands.filter(c => c.category === 'Yetkili').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    },
    kayit: interaction => {
        const commands = interaction.client.commands.filter(c => c.category === 'Kayit').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    },
    moderasyon: interaction => {
        const commands = interaction.client.commands.filter(c => c.category === 'Moderasyon').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    },
    admin: interaction => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ ephemeral: true, embeds: [Embeds.err('Bu komutları görüntüleme izniniz yok.')] });
        const commands = interaction.client.commands.filter(c => c.category === 'Admin').map(c => '/' + handleCommand(c.data)).join('\n\n');
        return interaction.reply({ ephemeral: true, embeds: [embed(commands, interaction)] });
    }
};