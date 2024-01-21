const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports.data = new SlashCommandBuilder()
    .setName('herkese-rol-ver')
    .setDescription('Herkese rol ver.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8)
    .addRoleOption(option => option
        .setName('rol')
        .setDescription('Bir rol gir.')
        .setRequired(true));

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {

    const role = interaction.options.getRole('rol');

    const target = interaction.guild.members.cache.filter(m => !m.roles.cache.has(role.id)).size;

    let data = {
        total: target,
        completed: 0,
        est: target * 2,
        rt: target * 2,
        finished: false,
        error: 0,
        cancel: false
    };

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Herkese rol veriliyor...' })
        .setFields(
            { name: 'Verilen Rol', value: `${role}`, inline: true },
            { name: 'Verilecek Sayı', value: `${target}`, inline: true },
            { name: 'Toplam Süre', value: `${validate(data.est)}`, inline: true },
            { name: 'Tamamlanan', value: `%0`, inline: true },
            { name: 'Kalan Sayı', value: `${target}`, inline: true },
            { name: 'Verilen Sayı', value: `0`, inline: true },
            { name: 'Geçen Süre', value: `00:00`, inline: true },
            { name: 'Kalan Süre', value: `${validate(data.rt)}`, inline: true }
        )
        .setColor('Red')
        .setTimestamp();

    if (target === 0) return interaction.reply('Rol verebileceğim kimse yok.');
    else interaction.reply({ embeds: [embed] });

    let index = 0;

    const intervalId = setInterval(async () => {
        if (data.cancel) return clearInterval(intervalId);
        const memberArray = Array.from(interaction.guild.members.cache.values());
        if (index >= memberArray.length) {
            clearInterval(intervalId);
            data.finished = true;
            finish();
            return;
        };
        const member = memberArray[index];
        try {
            await member.roles.add(role)
            data.rt -= 2;
            data.completed++;
            if (data.completed === target) {
                clearInterval(intervalId); // İşlem tamamlandı, zamanlayıcıyı durdur
                data.finished = true;
                finish();
            };
        } catch (e) {
            data.error++;
            if (!interaction.guild.roles.cache.has(role.id)) {
                interaction.editReply({ embeds: [], content: `❌ Rol silindiği için işlem iptal edildi.` });
                data.cancel = true;
                clearInterval(intervalId);
            };
        };
        index++;
    }, 2000);
    const intervalId1 = setInterval(() => {
        if (data.cancel) return clearInterval(intervalId1);
        if (data.finished) {
            clearInterval(intervalId1);
            data.finished = true;
            finish();
        } else {
            update();
        };
    }, 5000);

    function update() {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Herkese rol veriliyor...' })
            .setFields(
                { name: 'Verilen Rol', value: `${role}`, inline: true },
                { name: 'Verilecek Sayı', value: `${data.total}`, inline: true },
                { name: 'Toplam Süre', value: `${validate(data.est)}`, inline: true },
                { name: 'Tamamlanan', value: `%${(data.completed / data.total * 100).toFixed()}`, inline: true },
                { name: 'Kalan Sayı', value: `${data.total - data.completed}`, inline: true },
                { name: 'Verilen Sayı', value: `${data.completed}`, inline: true },
                { name: 'Geçen Süre', value: `${validate(data.est - data.rt)}`, inline: true },
                { name: 'Kalan Süre', value: `${validate(data.rt)}`, inline: true }
            )
            .setColor('Blurple')
            .setTimestamp();
        if (data.error > 0) embed.setFooter({ text: `${data.error} kişiye rol verilemedi.` });
        interaction.editReply({ embeds: [embed] });
    };
    function finish() {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Herkese rol verildi.' })
            .setFields(
                { name: 'Verilen Rol', value: `${role}`, inline: true },
                { name: 'Verilen Sayı', value: `${data.completed}`, inline: true },
                { name: 'Verilen Süre', value: `${validate(data.est)}`, inline: false },
            )
            .setColor('Green')
            .setTimestamp();
        if (data.error > 0) embed.setFooter({ text: `${data.error} kişiye rol verilemedi.` });
        return interaction.editReply({ embeds: [embed] });
    };
    function validate(seconds) {
        return moment.utc(seconds * 1000).format("mm:ss");
    };

};