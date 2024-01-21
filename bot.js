const { Partials, Client, Collection, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const ayarlar = require('./ayarlar.json');
const fs = require('fs');
const db = require('orio.db');
const moment = require('moment');
const cron = require('node-cron');
const linkify = require("linkifyjs");
const updateOverwrite = require('./utils/updateOverwrite.js');
require("dotenv/config");

const client = new Client({
    intents: 3276799,
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ]
});

global.client = client;

client.setMaxListeners(0);

client.on('ready', () => {
    console.log(`Bot suan bu isimle aktif: ${client.user.tag}`);
});

const log = (message) => {
    console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
};

client.commands = new Collection();
fs.readdir('./komutlar/', (err, folders) => {
    if (err) throw err;
    for (const folder of folders) {
        const files = fs.readdirSync(`./komutlar/${folder}`);
        for (const fileName of files) {
            const file = require(`./komutlar/${folder}/${fileName}`);
            client.commands.set(file.data.name, Object.assign(file, { category: folder }));
            log(`Yüklenen komut: ${file.data.name}`);
        };
    };
});

fs.readdir('./events/', (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./events/${f}`);
        client.on(props.name, (...args) => props.execute(client, ...args));
    });
});

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(e.replace(regToken, 'that was redacted');
// });

client.on("warn", (e) => {
    console.log(e.replace(regToken, "that was redacted"));
});

client.on("error", (e) => {
    console.log(e.message.replace(regToken, "that was redacted"));
});

client.login(process.env.token);

// client.on("ready", () => {
//     const channel = client.channels.cache.get("1117917564480274612");
//     joinVoiceChannel({
//         channelId: channel.id,
//         guildId: channel.guildId,
//         adapterCreator: channel.guild.voiceAdapterCreator
//     });
// });

const bilgimesajımızsohbete1 = new EmbedBuilder()
    .setAuthor({ name: 'Ascention Team e-Spor' })
    .setDescription("Sunucumuzda karşılaştığınız herhangi bir sorunda lütfen <#1117515681668272228> kanalından ticket açarak bizlere bildirin. ")
    .setFooter({ text: "Ascention Team" })
    .setColor("#00ff00");

const bilgimesajımızsohbete2 = new EmbedBuilder()
    .setAuthor({ name: 'Ascention Team e-Spor' })
    .setDescription("Sunucumuzda extra odalarımız bulunmaktadır. Bu odalar için <#1122625028773658695> kanalından rollerinizi alabilirsiniz.")
    .setFooter({ text: "Ascention Team" })
    .setColor("#00ff00");

const bilgimesajımızsohbete3 = new EmbedBuilder()
    .setAuthor({ name: 'Ascention Team e-Spor' })
    .setDescription("Sunucumuzda bulunan kuralları lütfen dikkatlice okuyunuz.\nSunucumuzda bulunan odaları amacı dışında kullanmanız durumunda bot üzerinden uyarı alırsınız.")
    .setFooter({ text: "Ascention Team" })
    .setColor("#00ff00");


setInterval(() => {
    client.channels.cache
        .get("1113260704686952558")
        .send(bilgimesajımızsohbete1)
        .then((msg) => setTimeout(() => msg.delete(), 15000)); //hangi kanalda mesaj döngüsü olustursun
}, 1600000);

setInterval(() => {
    client.channels.cache
        .get("1113260704686952558")
        .send(bilgimesajımızsohbete2)
        .then((msg) => setTimeout(() => msg.delete(), 30000)); //hangi kanalda mesaj döngüsü olustursun
}, 1800000);

setInterval(() => {
    client.channels.cache
        .get("1113260704686952558")
        .send(bilgimesajımızsohbete3)
        .then((msg) => setTimeout(() => msg.delete(), 45000)); //hangi kanalda mesaj döngüsü olustursun
}, 1800000);

/////////////////kanala tepki ekler/////////////////////

client.on("messageCreate", async (msg) => {
    const links = linkify.find(msg.content, 'url') || [];
    if (links.length === 0) return;
    const muafroller = db.get(`reklam-engel.${msg.guildId}.exempt-roles`) || [];
    if (muafroller.some(r => msg.member.roles.cache.has(r))) return;
    if (msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    const muaflinkler = db.get(`reklam-engel.${msg.guildId}.exempt-links`) || [];
    const filteredLinks = links.filter(link => !muaflinkler.some(muaflink => link.href.includes(muaflink)));
    if (filteredLinks.length === 0) return;
    let filteredAgain = filteredLinks;
    for (const link of filteredLinks) {
        if (!link.value.includes('discord.gg/')) continue;
        try {
            const inviteCode = link.href.split('/').pop();
            const guildId = (await client.fetchInvite(inviteCode))?.guild?.id;
            if (guildId === msg.guildId) { filteredAgain = filteredLinks.filter(asd => asd.href !== link.href); };
        } catch { };
    };
    if ((filteredAgain || []).length === 0) return;
    let jailrolu = db.get("jailrol." + msg.guild.id);
    msg.member.roles.set([jailrolu]); // Jail rol ID
    msg.delete();
    db.push("jail_" + msg.guild.id, msg.author.id);

    let jail = new EmbedBuilder()
        .setAuthor({ name: 'Ascention Team Jail Sistemi' })
        .setColor("#ff0035")
        .setDescription(`<@!${msg.author.id}> Reklam yaptığı için jail'e düştü`);
    msg.channel.send({ embeds: [jail] }).then((msg) => setTimeout(() => msg.delete(), 10000));

    let jaillogembed = new EmbedBuilder()
        .setAuthor({ name: 'Ascention Team Jail Sistemi' })
        .setColor("#ff0035")
        .setDescription(
            `<@!${msg.author.id}> reklam yaptığı için jail'e düştü\n\nJail düşmesine sebep olan metin:\n${msg.content}`
        );

    let jaillog = db.get("jaillog." + msg.guild.id);
    let channel = client.channels.cache.get(jaillog); // Log kanalı
    if (channel) channel.send({ embeds: [jaillogembed] });
});

client.on('messageCreate', async msg => {
    let reactionChannels = {
        "1113269951659257877": ["✔", "❌"],        // öneri reactionu
        "1122997856467431585": ["✔", "❌"],        // Etkinlik öneri reactionu
        "1113262504139821186": ["<a:onay:1108909260240326696>"], // yetkili bilgilendirme reactionu
        "1113261916547186699": ["<a:onay:1108909260240326696>"], // sunucu duyuru reactionu
        "1113264061203894355": ["<a:onay:1108909260240326696>"], // akademi duyuru reactionu
        "1134479250779553903": ["✔", "❌"],        // film öneri reactionu
        "1163823402633666622": ["<a:onay:1108909260240326696>"], //Ate Olymposs duyuru react
        "1163823859015880734": ["<a:onay:1108909260240326696>"], //Ate Darkness duyuru react
        "1163824208015544451": ["<a:onay:1108909260240326696>"], //Ate Challanger duyuru react
        "1164446608268738590": ["<a:onay:1108909260240326696>"], //Ate Gods duyuru react
        "1164572029505241218": ["<a:onay:1108909260240326696>"], //Ate Lords duyuru react
        "1165389579268931655": ["<a:onay:1108909260240326696>"], //Ate Champions duyuru react
        "1165684381411721266": ["<a:onay:1108909260240326696>"], //Ate Titans duyuru react
        "1166102186506338366": ["<a:onay:1108909260240326696>"], //Ate Zada duyuru react
        "1166028271717187584": ["<a:onay:1108909260240326696>"], //Ate Prime duyuru react
        "1166840311050407937": ["<a:onay:1108909260240326696>"], //Ate Dangerous duyuru react
        "1166839901115912402": ["<a:onay:1108909260240326696>"], //Ate Queens duyuru react
        "1166840144830156880": ["<a:onay:1108909260240326696>"], //Ate Angels duyuru react
    };
    let channelId = msg.channel.id;
    let reactions = reactionChannels[channelId];
    if (reactions) {
        for (const reaction of reactions) {
            await msg.react(reaction);
        }
    };
});


//////////////////////////////jail/////////////////////////////////////////////////////////////7
client.on("guildMemberAdd", async (user) => {
    let jailrol = db.get("jailrol." + user.guild.id)
    let kayıtsızrol = db.get("kayıtsızrolu." + user.guild.id);


    let veri = db.get("jail_" + user.guild.id);
    //console.log(user.id)

    if (veri && veri.includes(user.id)) {
        let jailRolObjesi = user.guild.roles.cache.get(jailrol);
        if (jailRolObjesi) {
            if (!user.user.bot) {
                await user.roles.add(jailRolObjesi);
            }
        }
    } else {
        let kayıtsızRolObjesi = user.guild.roles.cache.get(kayıtsızrol);
        if (kayıtsızRolObjesi) {
            if (!user.user.bot) {
                await user.roles.add(kayıtsızRolObjesi);
            }
        }
    }
});

/////////////////////////////OTOTAG////////////////////////////////////////////////////////////////
client.on("userUpdate", async function (olduser, newuser) {
    const tagRolu = client.guilds.cache.get("1106353008859693166").roles.cache.get("1128236274550067301")

    if (olduser.username !== newuser.username) {
        if (olduser.username.includes("ate") || newuser.username.includes("ate")) {
            if (
                olduser.username.includes("ate") &&
                !newuser.username.includes("ate")
            ) {
                client.guilds.cache
                    .get("1106353008859693166") //sunucu id
                    .members.fetch(newuser)
                    .then(async (user) => {
                        user.roles.remove(tagRolu); //tag rol
                        client.channels.cache.get("1114152867020951623").send(`${newuser} Tagımızı çıkarttı artık ailemizden birisi değilsin.`); //sunucu kanal idsi
                    });
            } else if (
                !olduser.username.includes("ate") &&
                newuser.username.includes("ate")
            ) {
                client.guilds.cache
                    .get("1106353008859693166") //sunucu idsi
                    .members.fetch(newuser)
                    .then(async (user) => {
                        user.roles.add(tagRolu); //tag rol
                        client.channels.cache.get("1114152867020951623").send(`${newuser} Tagımızı aldı ailemize hoşgeldin dostum.`); //sunucu kanal id
                    });
            } else {
                return;
            }
        }
    }
});

/////////////////////////////////////////Özel oda sistemi/////////////////////////////////////////////////////

client.on("voiceStateUpdate", async (oldState, newState) => {
    if (
        newState.channel != null &&
        newState.channel.name.startsWith("➕ 2 Kişilik Oda")
    ) {
        newState.guild.channels
            .create({
                name: `🎧 ${newState.member.displayName} Odası`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            })
            .then(async (cloneChannel) => {
                await newState.setChannel(cloneChannel);
                await cloneChannel.setUserLimit(2);
            });
    }
    if (
        newState.channel != null &&
        newState.channel.name.startsWith("➕ 1 Kişilik Oda")
    ) {
        newState.guild.channels
            .create({
                name: `🎧 ${newState.member.displayName} Odası`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            })
            .then(async (cloneChannel) => {
                await newState.setChannel(cloneChannel);
                await cloneChannel.setUserLimit(1);
            });
    }
    if (
        newState.channel != null &&
        newState.channel.name.startsWith("➕ 3 Kişilik Oda")
    ) {
        newState.guild.channels
            .create({
                name: `🎧 ${newState.member.displayName} Odası`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            })
            .then(async (cloneChannel) => {
                await newState.setChannel(cloneChannel);
                await cloneChannel.setUserLimit(3);
            });
    }
    if (
        newState.channel != null &&
        newState.channel.name.startsWith("➕ 4 Kişilik Oda")
    ) {
        newState.guild.channels
            .create({
                name: `🎧 ${newState.member.displayName} Odası`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            })
            .then(async (cloneChannel) => {
                await newState.setChannel(cloneChannel);
                await cloneChannel.setUserLimit(4);
            });
    }
    if (
        newState.channel != null &&
        newState.channel.name.startsWith("➕ 5 Kişilik Oda")
    ) {
        newState.guild.channels
            .create({
                name: `🎧 ${newState.member.displayName} Odası`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            })
            .then(async (cloneChannel) => {
                await newState.setChannel(cloneChannel);
                await cloneChannel.setUserLimit(5);
            });
    }
    if (
        newState.channel != null &&
        newState.channel.name.startsWith("➕ Kalabalık Oda")
    ) {
        newState.guild.channels
            .create({
                name: `🎧 ${newState.member.displayName} Odası`,
                type: ChannelType.GuildVoice,
                parent: newState.channel.parent,
            })
            .then(async (cloneChannel) => {
                await newState.setChannel(cloneChannel);
                await cloneChannel.setUserLimit(99);
            });
    }
    // Kullanıcı ses kanalından ayrılınca ve kanalda kimse kalmazsa kanalı siler;
    if (oldState.channel != undefined) {
        if (oldState.channel.name.startsWith("🎧")) {
            if (oldState.channel.members.size == 0) {
                oldState.channel.delete();
            } else {
                // İlk kullanıcı ses kanalından ayrılınca kanaldaki başka kullanıcı adını kanal adı yapar.
                let matchMember = oldState.channel.members.find(
                    (x) => `🎧 ${x.displayName} kanalı` == oldState.channel.name
                );
                if (matchMember == null) {
                    oldState.channel.setName(
                        `🎧 ${oldState.channel.members.random().displayName} kanalı`
                    );
                }
            }
        }
    }
});

///////////////////////////////Kayıtsız sunucuya gelinceki mesajı////////////////////////////////////////////////////////////////////////////////////
client.on("guildMemberAdd", async (member) => {

    ////////////////////////////db bilgi çekme/////////////////////////////////////////////////////////////////////
    let kayıtsızrol = db.get("kayıtsızrolu." + member.guild.id);
    let jailrolrol = db.get("jailrol." + member.guild.id);
    let kayıtchat = db.get("kayıtchat." + member.guild.id);
    let kayıtyetkili = db.get("kayıtyetkilirol." + member.guild.id);

    /////////////////////////////////////////////////////davet eden kişi///////////////////////////////////////////////////////////////////////////////
    const invites = await member.guild.invites.fetch();
    const inviteLogChannel = member.guild.channels.cache.get('1153304772972130304'); // Davet bilgilerinin yazılacağı kanalın ID'sini girin.

    const usedInvite = invites.find((invite) => invite.uses > 0);

    if (usedInvite) {
        const inviter = usedInvite.inviter;
        const inviteCount = invites.find((invite) => invite.inviter.id === inviter.id).uses;

        inviteLogChannel.send(`${member.user.tag} sunucuya ${inviter.tag} tarafından davet edildi. Toplam ${inviteCount} daveti var.`);
    } else {
        inviteLogChannel.send(`${member.user.tag} sunucuya davet bilgisi bulunamadı.`);
    }




    /////////////////////////////////////kayıtsız gelinceki mesaj//////////////////////////////////////////////////////////////////////////////////////////////////
    if (member.user.bot) return;
    setTimeout(function () {
        if (member.roles.cache.has(kayıtsızrol)) {
            if (!member.user.bot) {
                let kayitgeridonut = new EmbedBuilder()
                    .setTitle(`Hoş geldin ${member.displayName}`)
                    .setColor("#ff0035")
                    .setDescription(`${member} sunucumuza hoş geldin. \nSeninle beraber **${member.guild.memberCount}** kişiyiz.\n\nLütfen **kayıt odalarına** geçip yetkililerimizi bekleyiniz.\n Sese girmezseniz **kayıt** olamazsınız.`)
                    .setFooter({ text: member.guild.name })
                    .setThumbnail(member.user.avatarURL())
                    .setTimestamp();

                member.guild.channels.cache.get(kayıtchat).send(`<@&${kayıtyetkili}>`);
                member.guild.channels.cache
                    .get(kayıtchat)
                    .send({ embeds: [kayitgeridonut] });
                ////////////////////////////////dm mesaj/////////////////////////////////////////////////////////////////////////////////
                let e = new EmbedBuilder()
                    .setAuthor({ name: 'Ascetion Team', iconURL: member.guild.iconURL() })
                    .setColor(`RANDOM`)
                    .addFields(
                        { name: `Sunucumuza geldiğin için teşekkür ederiz!`, value: `Birşey olur ise Yetkililerimiz ile konuşabilirsiniz.` },
                        { name: `Sunucumuzda belirli kayıt saatleri vardır.`, value: `Bu saatler "08:00 - 01:00" arasındadır.` },
                        { name: `Sunucumuzda belirli kayıt saatleri vardır.`, value: `Bu saatler "08:00 - 01:00" arasındadır.` },
                        { name: `Sunucumuza girdiğinizde kuralları okumuş sayılırsınız.`, value: `Sese girdiğinizde yetkilimiz kayıt edecektir..` },
                        { name: `Kayıt olmak için kayıt sorumlularını etiketleyebilirsiniz.`, value: `Aksi taktirde kaydınız yapılmayacaktır.` }
                    )
                    .setTimestamp()
                    .setFooter({ text: member.guild.name })
                    .setThumbnail(member.guild.iconURL())
                member.send({ embeds: [e] });

            }
            ///////////////////////////////////////////////jail üyesi gelinceki mesaj///////////////////////////////////////////////////////////////////////////7
        } else if (member.roles.cache.has(jailrolrol)) {
            if (!member.user.bot) {
                let jailmesaji = new EmbedBuilder()
                    .setTitle("Sunucuya Jail Üyesi Geldi")
                    .setColor("#ff0035")
                    .setDescription(`**${member} sunucumuzda önceden reklam yaptığı için tekrar Jail Rolü verilmiştir.**`)
                    .setTimestamp()
                    .setFooter({ text: member.guild.name })
                    .setThumbnail(member.guild.iconURL());

                member.guild.channels.cache.get(kayıtchat).send({ embeds: [jailmesaji] });
            }
        }
    }, 2000);
});



//////////////////////////////////////////////////////////////////////kayıt odalarının zamanlayıcıları///////////////////////////////////////////
const channelId = '1194292939694821447'; // 1113259940337950922
function lockChannel() {
    const channel = client.channels.cache.get(channelId);
    try {
        updateOverwrite(channel, channel.guildId, ['SendMessages:false']);
        channel.send("**Bu oda şu anda kilitlenmiştir.**");
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Ascention Team Kayıt Zaman Sistemi' })
            .setColor("#ff0035")
            .setDescription(
                `**<a:onay:1108909260240326696> Arkadaşlar kayıt saatleri "08:00 - 01:00" arasındadır.\n<a:onay:1108909260240326696> Harici olarak gelenlere yetkililer bakmayacaktır, kayıt saatinde lütfen tekrar geliniz.**\n \nOda otomatik olarak kilitlenmiştir.`
            );
        channel.send({ embeds: [embed] });
    } catch (err) {
        console.log('Kanal kilitlenirken bir hata olustu: ', err)
    };
};
function unlockChannel() {
    const channel = client.channels.cache.get(channelId);
    try {
        updateOverwrite(channel, channel.guildId, ['SendMessages:true']);
        channel.send("**Bu oda şu anda açılmıştır**");
        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Ascention Team Kayıt Zaman Sistemi' })
            .setColor("#08ff00")
            .setDescription(
                `**<a:onay:1108909260240326696>  Arkadaşlar kayıt saatleri "08:00 - 01:00" arasındadır.\n<a:onay:1108909260240326696>  Harici olarak gelenlere yetkililer bakmayacaktır bilginiz olsun.**\n \nOda otomatik olarak açılmıştır.`
            );
        channel.send({ embeds: [embed] });
    } catch (err) {
        console.log('Kanal kilidi acilirken bir hata olustu: ', err)
    };
};
client.on('ready', () => {
    cron.schedule('0 1 * * *', lockChannel); // 0 22 * * *
    cron.schedule('0 8 * * *', unlockChannel); // 0 5 * * *
});
////////////////////////////////////////////süreli rol ////////////////////////////////////////////////

//! Süreli rol verme (deprecated)
client.on("ready", async () => {
    const cdb = require("croxydb")
    const csm = require('moment')
    require('moment-duration-format')
    setInterval(async () => {
        client.guilds.cache.forEach(async guild => {
            guild.members.cache.forEach(async member => {
                let m = await cdb.get(`kullanıcı${guild.id}_${member.id}`)
                if (m) {
                    let time = await cdb.get(`rolint${guild.id}_${member.id}`)
                    if (!time) return;
                    let sures = await cdb.get(`rolsure${guild.id}_${member.id}`)
                    let timing = Date.now() - time
                    let rl = await cdb.get(`roliste_${guild.id}_${member.id}`)

                    if (timing >= sures) {
                        guild.members.cache.find(x => x.id === member.id).roles.remove(rl)
                        let logdb = await cdb.fetch(`rollog${guild.id}`)
                        let log = guild.channels.cache.get(logdb)
                        if (log) {
                            log.send(new EmbedBuilder()
                                .setDescription(`${member} kullanıcısının \`${csm.duration(sures).format(`DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`)}\` Süre Boyunca <@&${cdb.get(`roliste_${guild.id}_${member.id}`)}> Sahip Olduğu Rol Süresi Bittiği İçin Alındı!`))
                        }
                        cdb.delete(`kullanıcı${guild.id}_${member.id}`)
                        cdb.delete(`rolsure${guild.id}_${member.id}`)
                        cdb.delete(`rolint${guild.id}_${member.id}`)
                        cdb.delete(`roliste_${guild.id}_${member.id}`)
                    }
                }
            })
        })
    }, 5000)

})

// Yıl sonu oto. notları silme
cron.schedule('59 23 31 12 *', () => {
    db.delete('notes');
});

// Üye sunucudan çıkınca verilerini silme
client.on('guildMemberRemove', member => {
    db.delete(member.id);
    db.delete(`notes.${member.id}`);
});