const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
    .setName('harita-seç')
    .setDescription('Rastgele Valorant haritası seç')
    .setDMPermission(false);

/**
 * @param {import('discord.js').Client} client 
 * @param {import('discord.js').ChatInputCommandInteraction} interaction 
 */
module.exports.execute = function (client, interaction) {

    var list = [
        { name: "Split", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130076483130507274/split.png' },
        { name: "Bind", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130076429300805652/Bind.png' },
        { name: "Ascent", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130076257162366977/Ascent.png' },
        { name: "Icebox", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130076677926572052/Icebox.png' },
        { name: "Haven", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130076489480679434/Haven.png' },
        { name: "Lotus", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130076864988328006/lotus.png' },
        { name: "Pearl", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130078318725709854/Pearl.png' },
        { name: "Fracture", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1130078313478619298/fracture.png' },
        { name: "Sunset", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1146870263103885372/sunset.png' },
        { name: "Breeze", image: 'https://cdn.discordapp.com/attachments/1129404677780422757/1146870546764681378/Breeze.png' },
    ];
    var maps = list[Math.floor(Math.random() * list.length)];

    interaction.reply({
        ephemeral: true, embeds: [
            new EmbedBuilder()
                .setAuthor({ name: "Ascetion Team", iconURL: interaction.guild.iconURL() })
                .setTitle("Oynanacak map seçiliyor...")
                .setTimestamp()
                .setFooter({ text: interaction.guild.name })
        ]
    }).then(() => {
        setTimeout(function () {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Ascetion Team", iconURL: interaction.guild.iconURL() })
                        .setTitle(`**Map seçildi:** ${maps.name}`)
                        .setColor("Random")
                        .setImage(`${maps.image}`)
                        .setTimestamp()
                        .setFooter({ text: interaction.guild.name })
                ]
            });
        }, 3000);
    });

};