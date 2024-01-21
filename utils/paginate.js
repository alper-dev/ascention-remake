const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, ModalBuilder } = require("discord.js");
const { err } = require("./embeds");

/**
 * @param {Array} array 
 * @param {number} pageSize 
 * @param {string} seperator
 * @returns {Array<[]>}
 */
function paginate(array = [], pageSize = 4096, seperator = '\n') {
    let pages = [[]];
    let pageIndex = 0;
    for (const item of array) {
        const currentPage = pages[pageIndex];
        if ((currentPage.join(seperator) + seperator + item).length <= pageSize) {
            currentPage.push(item);
        } else {
            pages.push([item]);
            pageIndex++;
        };
    };
    return pages;
};


/**
 * @typedef {object} CollectorOptions
 * @property {Array} pages
 * @property {number} percent
 * @property {import('discord.js').ButtonInteraction} interaction
 */
/**
 * @param {CollectorOptions} options - Collectora geçilecek seçenekler.
 */
async function collector({ pages, percent, interaction } = {}) {
    let currentPage = 0;
    const previous = new ButtonBuilder()
        .setCustomId('previous')
        .setEmoji('1197903336393953320')
        .setLabel('\u200b')
        .setStyle(ButtonStyle.Success);
    const search = new ButtonBuilder()
        .setCustomId('search')
        .setEmoji('1197907462410489886')
        .setLabel('\u200b')
        .setStyle(ButtonStyle.Secondary);
    const next = new ButtonBuilder()
        .setCustomId('next')
        .setEmoji('1197903357176729634')
        .setLabel('\u200b')
        .setStyle(ButtonStyle.Success);
    var embed = () => new EmbedBuilder()
        .setAuthor({ name: `%${Math.round(percent)} Tamamlandı.`, iconURL: interaction.guild.iconURL() })
        .setColor('Random')
        .setDescription(pages[currentPage].join('\n'))
        .setFooter({ text: `Sayfa ${currentPage + 1}/${pages.length} - ${pages[currentPage].length} kişi` });

    interaction.reply({ embeds: [embed()], components: [new ActionRowBuilder().addComponents(previous.setDisabled(true), search, next)], fetchReply: true }).then(async message => {
        const collector = message.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id && ['previous', 'search', 'next'].includes(i.customId),
            time: 5 * 60 * 1000, // 5 dk
            componentType: ComponentType.Button
        });
        collector.on('collect', async collectedInteraction => {
            if (collectedInteraction.customId === 'previous') {
                currentPage--;
                collectedInteraction.deferUpdate();
                let components;
                if (currentPage === 0) components = [new ActionRowBuilder().addComponents(previous.setDisabled(true), search, next)];
                else components = [new ActionRowBuilder().addComponents(previous, search, next.setDisabled(false))];
                message.edit({ embeds: [embed()], components });
            } else if (collectedInteraction.customId === 'next') {
                currentPage++;
                collectedInteraction.deferUpdate();
                let components;
                if (currentPage === (pages.length - 1)) components = [new ActionRowBuilder().addComponents(previous, search, next.setDisabled(true))];
                else components = [new ActionRowBuilder().addComponents(previous.setDisabled(false), search, next)];
                message.edit({ embeds: [embed()], components });
            } else {
                const messagecol = collectedInteraction.channel.createMessageCollector({
                    filter: m => m.author.id === collectedInteraction.user.id,
                    max: 1,
                    time: 30_000
                });
                collectedInteraction.deferUpdate();
                const sendbybot = await collectedInteraction.channel.send('Bir üyeyi etiketleyin...');
                messagecol.on('collect', msg => {
                    const mentioned = msg?.mentions?.users?.first();
                    if (!mentioned) collectedInteraction.followUp({ ephemeral: true, embeds: [err('Bir üyeyi etiketleyin!')] });
                    sendbybot.delete().catch(() => { });
                    msg.delete().catch(() => { });
                    let result = { pageNumber: undefined, text: '' };
                    for (let pindex = 0; pindex < pages.length; pindex++) {
                        if (result.pageNumber) break;
                        for (const value of pages[pindex]) {
                            if (value.includes(mentioned.tag)) {
                                result.pageNumber = pindex;
                                result.text = value;
                                break;
                            };
                        };
                    };
                    if (result.pageNumber !== undefined) collectedInteraction.followUp({ content: collectedInteraction.user.toString(), embeds: [new EmbedBuilder().setDescription(result.text).setColor('Random').setFooter({ text: `Bulunan Sayfa ${result.pageNumber}/${pages.length}` })] });
                    else collectedInteraction.followUp({ content: collectedInteraction.user.toString(), embeds: [err('Kullanıcı bulunamadı.')] });
                });
            };
        });
        collector.on('end', () => {
            message.edit({ components: [new ActionRowBuilder().addComponents(previous.setDisabled(true), search.setDisabled(true), next.setDisabled(true))] });
        });
    });
};

module.exports = { paginate, collector };