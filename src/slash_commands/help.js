const Discord = require('discord.js');
const getData = require('../utils/getEnvVars');

module.exports = {
    name: 'help',
    description: 'Shows all available commands.',
    usage: 'help [command]',
    type: 'general',
    execute(interaction, client) {        
        let response, args = [];

        if(interaction.data.options) {
            interaction.data.options.forEach(option => {
                args.push(option.value);
            });
        }

        const prefix = getData(false, 'prefix');

        if(args.length) {
            const command = client.slashCommands.get(args[0]);

            if(!command) response = new Discord.MessageEmbed().setDescription('Provided command is invalid.').setColor('2F3136');
            else {
                response = new Discord.MessageEmbed()
                                    .setAuthor(client.user.tag, client.user.displayAvatarURL())
                                    .setDescription(`Note about command usage: ${command.note || 'none'}`)
                                    .addFields(
                                        { name: 'Name', value: command.name, inline: false },
                                        { name: 'Description', value: command.description, inline: false },
                                        { name: 'Usage', value: command.usage, inline: false },
                                        { name: 'Type', value: command.type, inline: false }
                                    )
                                    .setColor('2F3136')
                                    .setTimestamp()
            }
        }else {
            let answer = '';

            client.slashCommands.forEach(command => {
                answer += `\n${command.name} • ${command.description}`;
            });

            response = new Discord.MessageEmbed()
                                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                                .setDescription(answer)
                                .setColor('2F3136')
                                .setTimestamp();
        }

        return client.api.interactions[interaction.id][interaction.token].callback.post({data: {
            type: 4,
            data: {
                embeds: [response]
            }
        }});
    }
}