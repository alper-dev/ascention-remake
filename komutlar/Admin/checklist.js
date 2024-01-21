const { SlashCommandBuilder } = require('discord.js');
const { showRecent } = require('../../utils/checklist');

module.exports.data = new SlashCommandBuilder()
    .setName('checklist')
    .setDescription('checklist')
    .setDMPermission(false)
    .setDefaultMemberPermissions(8);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    showRecent(interaction);
 
};