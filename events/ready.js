module.exports = {
    name: 'ready',
    /**
     * @param {import('discord.js').Client} client 
     */
    execute: function (client) {

        var degisenOynuyor = [
            "Ascention E-Sports",
            "Prefix Değişti : /",
            "/yardım",
            "Ascention Team"
        ]

        setInterval(function () {
            var degisenOynuyor1 = degisenOynuyor[Math.floor(Math.random() * (degisenOynuyor.length))]
            client.user.setActivity(`${degisenOynuyor1}`);

        }, 2 * 30000);

        client.user.setStatus("idle"); //dnd, idle, online, offline

        client.application.commands.set(client.commands.map(a => a.data));

    }
};