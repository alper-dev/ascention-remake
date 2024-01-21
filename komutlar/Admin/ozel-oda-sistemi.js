const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('özel-oda-sistemi')
    .setDescription('Özel oda sistemi')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    if (interaction.guild.channels.cache.find((channel) => channel.name === "Sınırsız Oda"))
        return interaction.reply("Özel Oda Sistemi Zaten kurulu.");

    interaction.reply("Özel Oda Sistemi Kuruluyor").then(() => {
        interaction.guild.channels.create({ name: `Sınırsız Oda`, type: ChannelType.GuildCategory }).then((category) => {
            interaction.guild.channels
                .create({ name: `➕ 1 Kişilik Oda`, type: ChannelType.GuildVoice, parent: category })
            interaction.guild.channels
                .create({ name: `➕ 2 Kişilik Oda`, type: ChannelType.GuildVoice, parent: category })
            interaction.guild.channels
                .create({ name: `➕ 3 Kişilik Oda`, type: ChannelType.GuildVoice, parent: category })
            interaction.guild.channels
                .create({ name: `➕ 4 Kişilik Oda`, type: ChannelType.GuildVoice, parent: category })
            interaction.guild.channels
                .create({ name: `➕ 5 Kişilik Oda`, type: ChannelType.GuildVoice, parent: category })
            interaction.guild.channels
                .create({ name: `➕ Kalabalık Oda`, type: ChannelType.GuildVoice, parent: category })
        });
    });

};