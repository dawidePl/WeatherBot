const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows all available commands.',
    usage: 'help [command]',
    type: 'general',
    args: false,
    execute(interaction, client) {
        const response = new Discord.MessageEmbed()
                                .setDescription('In development.')
                                .setColor('2F3136');

        return client.api.interactions[interaction.id][interaction.token].callback.post({data: {
            type: 4,
            data: {
                embeds: [response]
            }
        }});
    }
}