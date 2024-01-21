const { EmbedBuilder } = require('discord.js');
const check_cooldown = require('../utils/check_cooldown.js');
const db = require('orio.db');
const Embeds = require('../utils/embeds.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {import('discord.js').Client} client 
     * @param {import('discord.js').ChatInputCommandInteraction} interaction 
     */
    execute: function (client, interaction) {

        if (interaction.customId?.startsWith('commands:')) require('../komutlar/Genel/komutlar.js').buttons[interaction.customId.split(':')[1]](interaction);
        if (interaction.customId === 'checklist-show-old') require('../utils/checklist.js').showOld(interaction);
        if (interaction.customId === 'checklist-show-recent') require('../utils/checklist.js').showRecent(interaction);
        if (interaction.customId === 'temprole-create') require('../utils/temprole.js').createNew(interaction);
        if (interaction.customId === 'not-seç') require('../utils/notes.js').display_note(interaction);
        if (interaction.customId == 'show-notes') require('../utils/notes.js').main(interaction);
        if (interaction.customId == 'create-note-modal') require('../utils/notes.js').add_note(interaction);
        if (interaction.customId?.startsWith('edit-note-btn')) require('../utils/notes.js').clicked_edit_note(interaction);
        if (interaction.customId?.startsWith('edit-note-modal')) require('../utils/notes.js').edit_note_modal(interaction);
        if (interaction.customId?.startsWith('delete-note-btn')) require('../utils/notes.js').delete_note(interaction);
        if (interaction.customId == 'create-note-button') require('../utils/notes.js').add_note_modal(interaction);
        if (interaction.customId === 'eval') { try { const evaluation = eval(interaction.fields.getTextInputValue('code')); return interaction.reply({ embeds: [new EmbedBuilder().addFields({ name: 'Code', value: `\`\`\`js\n${interaction.fields.getTextInputValue('code')}\`\`\`` }, { name: 'Output', value: `\`\`\`js\n${evaluation}\`\`\`` })] }) } catch (e) { return interaction.reply({ embeds: [new EmbedBuilder().addFields({ name: 'Code', value: `\`\`\`js\n${interaction.fields.getTextInputValue('code')}\`\`\`` }, { name: 'Error', value: `\`\`\`js\n${e}\`\`\`` })] }) }; };
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return interaction.reply({ content: '❌ Komut bulunamadı.', ephemeral: true }).catch(() => { });

        // Cooldown check
        const cooldown = check_cooldown(command, interaction.user.id);
        if (cooldown) return interaction.reply({ embeds: [Embeds.cooldown(cooldown)], ephemeral: true, fetchReply: true })
            .then(() => setTimeout(() => interaction?.deleteReply()?.catch(() => { }), (cooldown * 1000) - 500));

        try {
            command.execute(client, interaction);
        } catch (err) {
            console.log(err);
            interaction.reply({ embeds: [Embeds.err('Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.')], ephemeral: true }).catch(() => { });
        };

    }
};