const { ApplicationCommandOptionType, SlashCommandUserOption } = require('discord.js');

/**
 * @param {import('discord.js').SlashCommandBuilder} command
 * @returns {string} 
 */
function handleCommand(command) {
    let list = [command.name];
    let type;
    for (const _option of command.options) {
        const option = _option.toJSON();
        let current_command = [];
        if (option.type === ApplicationCommandOptionType.SubcommandGroup) {
            type = 'group';
            current_command.push(handleSubcommandGroup(option));
        } else if (option.type === ApplicationCommandOptionType.Subcommand) {
            if (!type) type = 'subcmd';
            current_command.push(handleSubcommand(option));
        } else {
            type = 'option';
            current_command.push(handleOption(option));
        };
        list.push(current_command.join(' '));
    };
    if (type === 'group') {
        return list.join('\n');
    } else if (type === 'subcmd') {
        return list.join('\n');
    } else {
        return list.join(' ');
    };
};

/**
 * @param {import('discord.js').SlashCommandSubcommandGroupBuilder} subcommandGroup
 */
function handleSubcommandGroup(subcommandGroup) {
    let list = [`⤷ ${subcommandGroup.name}`];
    for (const subcommand of subcommandGroup.options) {
        list.push(handleSubcommand(subcommand, 2));
    };
    return list.join('\n');
};

/**
 * @param {import('discord.js').SlashCommandSubcommandBuilder} subcommand
 */
function handleSubcommand(subcommand, tabSize = 0) {
    const tabs = tabSize === 0 ? '' : ' '.repeat(tabSize);
    let options = [];
    for (const option of subcommand.options) {
        options.push(handleOption(option));
    };
    return `${tabs}⤷ ${subcommand.name} ${options.join(' ')}`;
};

function handleOption(option) {
    let cmdOption;
    switch (option.type) {
        case ApplicationCommandOptionType.Attachment:
            cmdOption = `${option.name}: <dosya>`;
            break;
        case ApplicationCommandOptionType.Boolean:
            cmdOption = `${option.name}: <Boolean>`;
            break;
        case ApplicationCommandOptionType.Channel:
            cmdOption = `${option.name}: <kanal>`;
            break;
        case ApplicationCommandOptionType.Integer:
            cmdOption = `${option.name}: <tam_sayı>`;
            break;
        case ApplicationCommandOptionType.Mentionable:
            cmdOption = `${option.name}: <etiketlenebilir>`;
            break;
        case ApplicationCommandOptionType.Number:
            cmdOption = `${option.name}: <sayı>`;
            break;
        case ApplicationCommandOptionType.Role:
            cmdOption = `${option.name}: <rol>`;
            break;
        case ApplicationCommandOptionType.String:
            cmdOption = `${option.name}: <yazı>`;
            break;
        case ApplicationCommandOptionType.User:
            cmdOption = `${option.name}: <kullanıcı>`;
            break;
    }
    return cmdOption;
};

module.exports = {
    handleCommand,
    handleSubcommandGroup,
    handleSubcommand,
    handleOption
};