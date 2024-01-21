const { addMinutes } = require('date-fns');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, ActionRowBuilder, ComponentType, RoleSelectMenuBuilder } = require('discord.js');
const cron = require('node-cron');
const db = require('orio.db');
const { v4: uuidv4 } = require('uuid');
const Embeds = require('./embeds.js');

/**
 * @param {import('discord.js').GuildMember} member 
 * @param {import('discord.js').Role} role 
 * @param {number} duration 
 */
module.exports.create = async (interaction, memberId, roleId, duration) => {
    try {
        const _now = Date.now();
        const member = interaction.guild.members.cache.get(memberId);
        const role = interaction.guild.roles.cache.get(roleId);
        await member.roles.add(role);
        const now = new Date();
        const until = addMinutes(now, duration);
        const cronSyntax = `${until.getSeconds()} ${until.getMinutes()} ${until.getHours()} ${until.getDate()} ${until.getMonth() + 1} *`;
        const log = member.client.channels.cache.get(db.get(`temprole.${member.guild.id}.log`));
        console.log(cronSyntax);
        cron.schedule(cronSyntax, async () => {
            await member.roles.remove(role);
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription('Kullanıcının rolü alındı.')
                .addFields(
                    { name: 'Üye', value: memberId ? `<@${memberId}>` : 'Bilinmeyen', inline: true },
                    { name: 'Rol', value: roleId ? `<@&${roleId}>` : 'Bilinmeyen', inline: true },
                    { name: 'Süre', value: duration ? `${duration} dk` : 'Bilinmeyen', inline: false }
                );
            log.send({ embeds: [embed] });
        }, { recoverMissedExecutions: true });
        db.push(`temproles`, {
            guildId: member.guild.id,
            memberId: member.id,
            roleId: role.id,
            duration,
            orderDate: _now,
        });
    } catch (err) {
        console.log('Süreli rol oluşturulurken hata oluştu: ', err);
    };
};


module.exports.buttons = {
    create: new ButtonBuilder()
        .setCustomId('temprole-create')
        .setEmoji('1197164015105880176')
        .setLabel('Süreli Rol Oluştur')
        .setStyle(ButtonStyle.Secondary)
};


module.exports.selectMenus = {
    selectUser: new UserSelectMenuBuilder()
        .setCustomId('temprole-select-user')
        .setMaxValues(1)
        .setPlaceholder('Bir üye seç...'),
    selectRole: new RoleSelectMenuBuilder()
        .setCustomId('temprole-select-role')
        .setMaxValues(1)
        .setPlaceholder('Bir rol seç...'),
};


/**
 * @param {import('discord.js').ButtonInteraction} interaction 
 */
module.exports.createNew = async interaction => {
    const log = interaction.client.channels.cache.get(db.get(`temprole.${interaction.guildId}.log`));
    const embed = new EmbedBuilder()
        .setColor('Blurple')
        .setDescription('Süreli rol vereceğiniz kullanıcıyı seçin.');
    const row = new ActionRowBuilder().addComponents(this.selectMenus.selectUser);
    interaction.deferUpdate();
    interaction.message.edit({ embeds: [embed], components: [row] }).then(async msg => {
        const userCollector = msg.channel.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            componentType: ComponentType.UserSelect,
            max: 1,
            time: 30_000
        });
        userCollector.on('collect', collected => {
            const selectedUserID = collected.values[0];
            collected.deferUpdate();
            collected.message.edit({ embeds: [embed.setDescription('Kullanıcıya vermek istediğiniz rolü seçin.')], components: [new ActionRowBuilder().addComponents(this.selectMenus.selectRole)] })
            const roleCollector = msg.channel.createMessageComponentCollector({
                filter: i => i.user.id === interaction.user.id,
                componentType: ComponentType.RoleSelect,
                max: 1,
                time: 30_000
            });
            roleCollector.on('collect', collected2 => {
                const selectedRoleID = collected2.values[0];
                const role = interaction.guild.roles.cache.get(selectedRoleID);
                if (role.managed) {
                    collected2.deferUpdate();
                    collected2.message.edit({ embeds: [Embeds.err('Bu rol harici bir hizmet tarafından yönetiliyor.')], components: [] });
                    return;
                };
                collected2.deferUpdate();
                collected2.message.edit({ embeds: [embed.setDescription('Dakika cinsinden süreyi girin.')], components: [] })
                const messageCollector = collected2.channel.createMessageCollector({
                    filter: m => m.author.id === interaction.user.id,
                    max: 1,
                    time: 30_000
                });
                messageCollector.on('collect', collectedMessage => {
                    const duration = Number(collectedMessage.content);
                    if (isNaN(duration)) return collected2.message.edit({ embeds: [Embeds.err('Geçersiz süre!')], components: [] });
                    const until = Math.floor(Date.now() / 1000 + duration * 60);
                    collectedMessage.delete().catch(() => { });
                    const newEmbed = new EmbedBuilder()
                        .setColor('Random')
                        .setDescription(`${interaction.user} bir süreli rol işlemi oluşturdu.`)
                        .addFields(
                            { name: 'Üye', value: `<@${selectedUserID}>`, inline: true },
                            { name: 'Rol', value: `<@&${selectedRoleID}>`, inline: true },
                            { name: 'Rolün Alınacağı Zaman', value: `<t:${until}:F> (<t:${until}:R>)`, inline: false }
                        );
                    log.send({ embeds: [newEmbed] });
                    collected2.message.edit({ embeds: [newEmbed] });
                    this.create(interaction, selectedUserID, selectedRoleID, duration);
                });
                messageCollector.on('end', (assdad, reason) => {
                    if (reason === 'time') return interaction.message.edit({ components: [], embeds: [Embeds.err('Verilen süre içerisinde işlem yapmadığınız için işlem iptal edildi.')] });
                });
            });
            roleCollector.on('end', (collected, reason) => {
                if (reason === 'time') return interaction.message.edit({ components: [], embeds: [Embeds.err('Verilen süre içerisinde işlem yapmadığınız için işlem iptal edildi.')] });
            });
        });
        userCollector.on('end', (collected, reason) => {
            if (reason === 'time') return interaction.message.edit({ components: [], embeds: [Embeds.err('Verilen süre içerisinde işlem yapmadığınız için işlem iptal edildi.')] });
        });
    });
};