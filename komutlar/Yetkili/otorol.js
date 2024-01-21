const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setDMPermission(false)
    .setDefaultMemberPermissions(268435456)
    .setName('otorol')
    .setDescription('alper.dev')
    .addSubcommand(option => option
        .setName('ayarla')
        .setDescription('Otorol ayarla.')
        .addRoleOption(option => option
            .setRequired(true)
            .setName('rol')
            .setDescription('Bir rol girin.')
        )
    )
    .addSubcommand(option => option
        .setName('sıfırla')
        .setDescription('Otorol sıfırla.')
        .addRoleOption(option => option
            .setRequired(true)
            .setName('rol')
            .setDescription('Bir rol girin.')
        )
    );

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = (client, interaction) => {

    const subcmd = interaction.options.getSubcommand();
    const role = interaction.options.getRole('rol');

    if (subcmd === 'ayarla') {

        db.set("csotorol." + interaction.guild.id, role.id);

        let cse = new EmbedBuilder()
            .setTitle("Otorol Sistemi")
            .setThumbnail(interaction.guild.iconURL())
            .setColor("Blue")
            .setDescription(`${role} İsimli Rol Üye Oto Rolü Olarak Ayarlandı!`)
            .setTimestamp()
            .setFooter({ text: "Ascention Team" });
        interaction.reply({ embeds: [cse] });

    } else {

        db.delete("csotorol." + interaction.guild.id);
        interaction.reply("Sistem Başarı İle Sıfırlandı!");

    };

};