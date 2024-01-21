/**
 * @param {import('discord.js').GuildBasedChannel} channel 
 * @param {object} newPermissions
 */
module.exports = function (channel, roleOrUserID, newPermissions) {
    const deniedPerms = channel.permissionOverwrites.cache?.get(channel.guildId)?.deny?.toArray() || [];
    const allowedPerms = channel.permissionOverwrites.cache?.get(channel.guildId)?.allow?.toArray() || [];
    let deny = {},
        allow = {},
        allPerms = {};
    Array.from(deniedPerms).forEach(str => deny[str] = false);
    Array.from(allowedPerms).forEach(str => allow[str] = true);
    allPerms = Object.assign(allow, deny);
    for (const value of newPermissions) {
        const name = value.split(':')[0].trim();
        const bool = JSON.parse(value.split(':')[1].trim());
        allPerms[name] = bool;
    };
    channel.permissionOverwrites.edit(roleOrUserID, allPerms);
};