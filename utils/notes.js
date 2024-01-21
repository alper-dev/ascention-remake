const { StringSelectMenuBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const db = require('orio.db')
const { v4: uuidv4 } = require('uuid');
const Embeds = require('./embeds.js');

const emojis = {
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣'
};

exports.main_menu = {
    embed: interaction => {
        const noteIDS = Object.keys(db.get(`notes.${interaction.user.id}`) || {});
        if (noteIDS.length === 0) throw null;
        let index = 1;
        let description = [];
        for (const noteId of noteIDS) {
            const note = db.get(`notes.${interaction.user.id}.${noteId}`);
            description.push(`
${emojis[index]} <t:${note.date}:R>
 ⤷ **${decodeURI(note.title)}**
            `);
            index++;
        };
        return new EmbedBuilder()
            .setAuthor({ name: `Notlarınız: ${noteIDS.length}`, iconURL: interaction.user.avatarURL() })
            .setDescription(description.join('\n'))
            .setColor('Blurple');
    },
    buttons: {
        delete: noteId => new ButtonBuilder()
            .setCustomId(`delete-note-btn:${noteId}`)
            .setEmoji('<:trash:1196475668733640926>')
            .setLabel('Sil')
            .setStyle(ButtonStyle.Secondary),
        edit: noteId => new ButtonBuilder()
            .setCustomId(`edit-note-btn:${noteId}`)
            .setEmoji('<:edit:1196781754510495824>')
            .setLabel('Düzenle')
            .setStyle(ButtonStyle.Secondary),
        create: new ButtonBuilder()
            .setCustomId('create-note-button')
            .setEmoji('<:edit:1196781754510495824>')
            .setLabel('Not Oluştur')
            .setStyle(ButtonStyle.Secondary),
        show: new ButtonBuilder()
            .setCustomId('show-notes')
            .setEmoji('<:edit:1196781754510495824>')
            .setLabel('Notları Görüntüle')
            .setStyle(ButtonStyle.Secondary)
    },
    select_menu: interaction => {
        const noteIDS = Object.keys(db.get(`notes.${interaction.user.id}`) || {});
        if (noteIDS.length === 0) throw null;
        let index = 1;
        const menu = new StringSelectMenuBuilder()
            .setCustomId('not-seç')
            .setMaxValues(1)
            .setPlaceholder('Yönetmek istediğin notu seç...');
        for (const noteId of noteIDS) {
            const note = db.get(`notes.${interaction.user.id}.${noteId}`);
            menu.addOptions(new StringSelectMenuOptionBuilder()
                .setDescription('\u200b')
                .setEmoji(emojis[index])
                .setLabel(decodeURI(note.title))
                .setValue(noteId));
            index++;
        };
        return new ActionRowBuilder().addComponents(menu);
    }
};

/** * @param {import('discord.js').BaseInteraction} interaction */
exports.main = interaction => {
    try {
        const opt = {
            ephemeral: true,
            embeds: [this.main_menu.embed(interaction)],
            components: [this.main_menu.select_menu(interaction), new ActionRowBuilder().addComponents(this.main_menu.buttons.create)]
        };
        if (interaction.isRepliable()) interaction.reply(opt).catch(() => { });
        else interaction.editReply(opt).catch(() => { })
    } catch {
        interaction.reply({ ephemeral: true, embeds: [Embeds.err('Hiç notunuz yok.')], components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.create)] }).catch(() => { });
    };
};

/** * @param {import('discord.js').BaseInteraction} interaction */
exports.add_note_modal = interaction => {
    const notsayisi = Object.keys(db.get(`notes.${interaction.user.id}`) || {}).length;
    if (notsayisi === 9) return interaction.reply({ ephemeral: true, embeds: [Embeds.err(`Maksimum not sayısına ulaştınız.`)], components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)] })
    const modal = new ModalBuilder()
        .setCustomId('create-note-modal')
        .setTitle('Yeni Not Oluştur')
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('title')
                    .setLabel('Başlık')
                    .setPlaceholder('Notun başlığını girin...')
                    .setRequired(true)
                    .setValue(`Not [${notsayisi + 1}]`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(50)
                    .setMinLength(1)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId('text')
                    .setLabel('Not')
                    .setPlaceholder('Notunuzu girin...')
                    .setRequired(true)
                    .setStyle(TextInputStyle.Paragraph)
                    .setMinLength(1)
            )
        );
    interaction.showModal(modal);
};

/** * @param {import('discord.js').ModalSubmitInteraction} interaction */
exports.add_note = interaction => {
    const notsayisi = Object.keys(db.get(`notes.${interaction.user.id}`) || {}).length;
    if (notsayisi === 9) return interaction.reply({ ephemeral: true, embeds: [Embeds.err(`Maksimum not sayısına ulaştınız.`)], components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)] })
    const id = uuidv4();
    const title = interaction.fields.getTextInputValue('title');
    const text = interaction.fields.getTextInputValue('text');
    db.set(`notes.${interaction.user.id}.${id}`, {
        title: encodeURI(title),
        text: encodeURI(text),
        date: Math.floor(Date.now() / 1000)
    });
    interaction.reply({
        ephemeral: true, embeds: [
            new EmbedBuilder()
                .setAuthor({ name: 'Yeni Not Eklendi!' })
                .setTitle(title)
                .setDescription(text)
                .setColor('Green')
                .setFooter({ text: `Mevcut not sayısı: ${Object.keys(db.get(`notes.${interaction.user.id}`)).length}/10` })
        ],
        components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)]
    });
};

/** * @param {import('discord.js').StringSelectMenuInteraction} interaction */
exports.display_note = interaction => {
    const selected = interaction.values[0];
    const note = db.get(`notes.${interaction.user.id}.${selected}`);
    if (!note) interaction.reply({
        ephemeral: true,
        embeds: [Embeds.err('Bu not silinmiş.')],
        components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)]
    });
    else {
        const embed = new EmbedBuilder()
            .setAuthor({ name: decodeURI(note.title), iconURL: interaction.user.avatarURL() })
            .setFields({ name: '<:takvim:1196775370016440420> Oluşturulma Tarihi', value: `<t:${note.date}:F>` })
            .setDescription(decodeURI(note.text))
        interaction.reply({
            ephemeral: true,
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.edit(selected), this.main_menu.buttons.delete(selected))]
        });
    };
};

exports.clicked_edit_note = interaction => {
    const noteId = interaction.customId.split(':')[1];
    const note = db.get(`notes.${interaction.user.id}.${noteId}`);
    if (!note) interaction.reply({
        ephemeral: true,
        embeds: [Embeds.err('Bu not silinmiş.')],
        components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)]
    });
    else {
        const modal = new ModalBuilder()
            .setCustomId(`edit-note-modal:${noteId}`)
            .setTitle('Yeni Not Oluştur')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('title')
                        .setLabel('Başlık')
                        .setPlaceholder('Notun başlığını girin...')
                        .setRequired(true)
                        .setValue(decodeURI(note.title))
                        .setStyle(TextInputStyle.Short)
                        .setMaxLength(50)
                        .setMinLength(1)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('text')
                        .setLabel('Not')
                        .setPlaceholder('Notunuzu girin...')
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                        .setMinLength(1)
                        .setValue(decodeURI(note.text))
                )
            );
        interaction.showModal(modal);
    };
};

/** * @param {import('discord.js').ModalSubmitInteraction} interaction */
exports.edit_note_modal = interaction => {
    const noteId = interaction.customId.split(':')[1];
    const newtitle = interaction.fields.getTextInputValue('title');
    const newtext = interaction.fields.getTextInputValue('text');
    const oldnote = db.get(`notes.${interaction.user.id}.${noteId}`);
    if (!oldnote) interaction.reply({
        ephemeral: true,
        embeds: [Embeds.err('Bu not silinmiş.')],
        components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)]
    });
    else {
        const newnote = {
            title: encodeURI(newtitle),
            text: encodeURI(newtext),
            date: oldnote.date
        };
        db.set(`notes.${interaction.user.id}.${noteId}`, newnote);
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Not Düzenlendi!', iconURL: interaction.user.avatarURL() })
            .setTitle(decodeURI(newnote.title))
            .setDescription(decodeURI(newnote.text));
        interaction.reply({
            ephemeral: true,
            embeds: [embed],
            components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.edit(noteId), this.main_menu.buttons.delete(noteId))]
        });
    };
};

exports.delete_note = interaction => {
    const noteId = interaction.customId.split(':')[1];
    const oldnote = db.get(`notes.${interaction.user.id}.${noteId}`);
    if (!oldnote) interaction.reply({
        ephemeral: true,
        embeds: [Embeds.err('Bu not silinmiş.')],
        components: [new ActionRowBuilder().addComponents(this.main_menu.buttons.show)]
    });
    else {
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Not Silindi!', iconURL: interaction.user.avatarURL() })
            .setTitle(decodeURI(oldnote.title))
            .setDescription(decodeURI(oldnote.text));
        db.delete(`notes.${interaction.user.id}.${noteId}`);
        interaction.reply({ ephemeral: true, embeds: [embed] });
    };
};