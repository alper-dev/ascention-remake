const { EmbedBuilder } = require("discord.js");

module.exports.err = msg => new EmbedBuilder()
    .setColor('Red')
    .setDescription(`<:cross:1196862206319530105> ${msg}`);

module.exports.warn = msg => new EmbedBuilder()
    .setColor('Yellow')
    .setDescription(`<:warning:1196862377707184250> ${msg}`);

module.exports.success = msg => new EmbedBuilder()
    .setColor('Green')
    .setDescription(`<:success:1196863034782666773> ${msg}`);

module.exports.cooldown = seconds => new EmbedBuilder()
    .setColor('Red')
    .setDescription(`<:timeout:1197831079105667114> Çok hızlısın! <t:${Math.floor(Date.now() / 1000 + seconds)}:R> tekrar dene.`);