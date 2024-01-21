const { SlashCommandBuilder } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports.data = new SlashCommandBuilder()
    .setName('sayı-tahmin')
    .setDescription('Rastgele sayı belirler ve siz o rakamı bulmaya çalışırsınız.')
    .setDMPermission(false);
/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = async function (client, interaction) {

    this.games = new Set();
    if (this.games.has(interaction.channelId)) await interaction.reply('Kanal başına sadece bir oyun meydana gelebilir.');
    const islem = Math.floor(Math.random() * (100 - 1)) + 1
    const fixedlisonuç = islem
    let haklar = 10
    this.games.add(interaction.channelId);
    await interaction.reply(stripIndents`
					${interaction.user}, Numarayı tahmin et 0 ve 100 Arası
					\`${haklar}\` Deneme Hakkın Var.
				`);
    let uwu = false;
    while (!uwu && haklar !== 0) {
        const response = await interaction.channel.awaitMessages({ filter: neblm => neblm.author.id === interaction.user.id, max: 1, time: 15000 });
        if (!response.first()) {
            this.games.delete(interaction.channelId);
            interaction.channel.send(`${interaction.user}, Maalesef! Zaman doldu!`);
            interaction.channel.send(`${interaction.user}, :shrug: Kaybettin! Sayı: \`${fixedlisonuç}\` :shrug: `);
            uwu = true;
        };
        const choice = response?.first()?.content
        if (isNaN(choice)) {
            continue;
        }
        if (choice !== fixedlisonuç) {
            haklar -= 1
            if (fixedlisonuç > choice) {
                await interaction.channel.send(stripIndents`
					          ${interaction.user}, :small_red_triangle: Daha büyük numara söylemelisin!
					          \`${haklar}\` Deneme Hakkın Var.
				          `);
                continue;
            }
            if (fixedlisonuç < choice) {
                await interaction.channel.send(stripIndents`
					          ${interaction.user}, :small_red_triangle_down: Daha kücük numara söylemelisin!
					          \`${haklar}\` Deneme Hakkın Var.
				          `);
                continue;
            }
        }
        if (choice == fixedlisonuç) {
            uwu = true
        }
    }
    if (haklar == 0) {
        this.games.delete(interaction.channelId);
        await interaction.channel.send(`${interaction.user}, :shrug: Kaybettin! Sayı: \`${fixedlisonuç}\` :shrug:`)
    }
    if (uwu) {
        this.games.delete(interaction.channelId);
        await interaction.channel.send(`${interaction.user}, :tada:  Doğru Tahmin! Sayı: \`${fixedlisonuç}\` :tada:`)
        try {
        } catch (e) {
            this.games.delete(interaction.channelId);
            interaction.channel.send('Bir hata oluştu')
        }
    } else {
        this.games.delete(interaction.channelId);
        return console.log('Bir hata oluştu')
    }

};