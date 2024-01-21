const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require('orio.db');

module.exports.data = new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('kayıtsız')
    .setDescription('Üyelerin kaydını silin.')
    .addUserOption(option => option
        .setRequired(true)
        .setName('üye')
        .setDescription('Kaydı silinecek üyeyi girin.'));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async (client, interaction) => {

    if (!interaction.member.roles.cache.has(db.get("kayıtyetkilirol." + interaction.guildId))) return interaction.reply({ ephemeral: true, content: "Bu role sahip olmadığın için maalesef komutu kullanamazsın!!" })
    //if (interaction.channelId != "1106695683349684334") return interaction.reply({ ephemeral: true, content: "Yalnızca Kayıt kanalında kullanabilirsin." });
    const teyitsiz = interaction.guild.members.cache.get(interaction.options.getUser('üye').id);

    teyitsiz.roles.set([db.get("kayıtsızrolu." + interaction.guildId)]);
    const embed = new EmbedBuilder()
        .setTitle('Ascention Team')
        .setDescription('Üyemizin tüm rolleri alınıp <@&1113258819435380806> rolü verildi.')
        .setFooter({ text: 'Ascention Team' })
        .setColor('#00F7FF')

    const log = new EmbedBuilder()
        .setTitle('Ascention Team')
        .setDescription(`<@!${teyitsiz.id}> adlı üye kayıtsıza düşürüldü.\n**Kodu kullanan yetkili : **${interaction.user}\n**Kayıtsıza düşen üye :** <@!${teyitsiz.id}>`)
        .setColor('#00F7FF')

    client.channels.cache.get("1122623584792232008")?.send({ embeds: [log] });

    interaction.reply({ ephemeral: true, embeds: [embed] });

};