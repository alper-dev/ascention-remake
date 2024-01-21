const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Embeds = require('../../utils/embeds.js');

module.exports.data = new SlashCommandBuilder()
    .setName('top-10-davet')
    .setDescription('Top 10 davet sayısını gösterir.')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {

    const invites = (await interaction.guild.invites.fetch()).filter(invite => invite.uses && invite.uses !== 0);
    let userInvs = [];
    for (const invite of invites) {
        console.log(userInvs)
        if (userInvs.find(data => data.memberName === invite[1].inviter.tag) !== undefined) {
            userInvs[userInvs.findIndex(data => data.memberName === invite[1].inviterId)].count += (invite[1].uses);
        } else userInvs.push({
            memberName: invite[1].inviter.tag,
            count: invite[1].uses
        });
    };
    if (userInvs.length === 0) interaction.reply({ embeds: [Embeds.err('Herhangi bir davet bilgisi bulunamadı.')] });
    else post();

    async function post() {
        const output = userInvs.sort((a, b) => b.count - a.count).slice(0, 10);
        const indexes = output.map((value, index) => (`${index + 1}.`)).join('\n');
        const users = output.map(value => (`${value.memberName}`)).join('\n');
        const uses = output.map(value => (`${value.count}`)).join('\n');

        const embed = new EmbedBuilder()
            .addFields(
                { name: 'Sıra', value: '```\n' + indexes + '```', inline: true },
                { name: 'Kullanıcı Adı', value: '```\n' + users + '```', inline: true },
                { name: 'Davet Sayısı', value: '```\n' + uses + '```', inline: true }
            )
            .setColor('Blurple');

        interaction.reply({ embeds: [embed] });
    };

};