const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const db = require('orio.db');
const { err } = require("./embeds");
const { paginate, collector } = require('./paginate.js');

module.exports.buttons = {
    showOld: new ButtonBuilder()
        .setCustomId('checklist-show-old')
        .setEmoji('1197846890125991967')
        .setLabel('Eski Kayıtları Görüntüle')
        .setStyle(ButtonStyle.Secondary),
    showRecent: new ButtonBuilder()
        .setCustomId('checklist-show-recent')
        .setEmoji('1197849549776109571')
        .setLabel('Güncel Kayıtları Görüntüle')
        .setStyle(ButtonStyle.Secondary)
};

/** * @param {import('discord.js').ButtonInteraction} interaction */
module.exports.showOld = interaction => {
    const records = db.get('checklist.old') || {};
    if (Object.keys(records).length === 0) {
        interaction.deferUpdate();
        interaction.message.edit({ embeds: [err('Veritabanında hiç eski kayıt yok.')], components: [new ActionRowBuilder().addComponents(this.buttons.showRecent)] });
        return;
    };

};

/** * @param {import('discord.js').ChatInputCommandInteraction | import('discord.js').ButtonInteraction} interaction */
module.exports.showRecent = interaction => {

    const records = db.get('checklist.recent') || {};

    const erropt = { embeds: [err('Veritabanında hiç güncel kayıt yok.')], components: [new ActionRowBuilder().addComponents(this.buttons.showOld)] };
    if (Object.keys(records).length == 0) {
        try {
            interaction.message.edit(erropt);
            interaction.deferUpdate();
        } catch {
            interaction.reply(erropt);
        };
        return;
    };

    const percent = Object.values(records).filter(value => value).length / Object.keys(records).length * 100;
    let decription = [];
    for (const userID of Object.keys(records)) {
        const emoji = records[userID] ? '<:success:1196863034782666773>' : '<:cross:1196862206319530105>';
        const tag = interaction.client.users.cache.get(userID)?.tag || 'Bilinmeyen';
        decription.push(`${emoji} ${tag.replace('_', '\\_')}`);
    };
    const pages = paginate(decription, 4096, '\n');
    if (pages.length > 1) {
        collector({ pages, percent, interaction });
    } else {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `%${percent} Tamamlandı.`, iconURL: interaction.guild.iconURL() })
            .setColor('Random')
            .setDescription(decription.join('\n'));

        try {
            interaction.message.edit({ embeds: [embed] });
            interaction.deferUpdate();
        } catch {
            interaction.reply({ embeds: [embed] });
        };
    };

};