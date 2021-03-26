const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows all available commands.',
    usage: 'help [command]',
    type: 'general',
    args: false,
    execute(interaction, client) {
        const commands = client.commands;
        let response, args = [];

        if(interaction.data.options) {
            interaction.data.options.forEach(option => {
                args.push(option.value);
            })
        }

        if(!args.length) {
            let content = '**Weather**';
            const weatherCommands = commands.filter(command => command.type.toLowerCase() === 'weather');
            const generalCommands = commands.filter(command => command.type.toLowerCase() === 'general');

            weatherCommands.forEach(command => {
                content += `\n• ${command.name} - ${command.description || 'No description provided'}`;
            })

            content += `\n\n**General**`;

            generalCommands.forEach(command => {
                content += `\n• ${command.name} - ${command.description || 'No description provided'}`;
            })
    
            const embed = new Discord.MessageEmbed()
                                .setAuthor(`Available commands`, client.user.displayAvatarURL())
                                .setDescription(content)
                                .setTimestamp()
                                .setColor('2F3136');
    
            response = embed;
        }else {
            const command = commands.find(c => c.name == args[0]);

            if(!command) {
                response = new Discord.MessageEmbed()
                                            .setAuthor(client.user.tag, client.user.displayAvatarURL())
                                            .setDescription(`Such command, \`${args.join(' ')}\`, does not exist.`);
            }else {
                const embed = new Discord.MessageEmbed()
                                .setAuthor(`${command.name}`, client.user.displayAvatarURL())
                                .setDescription(`**Note about command usage:** ${command.note || 'None'}\n\n**Name:** ${command.name}\n**Description:** ${command.description || 'No description provided'}\n**Usage:** ${command.usage || 'No usage specified'}\n**Cooldown:** ${command.cooldown || 'none'}`)
                                .setTimestamp()
                                .setColor('2F3136');

                response = embed;
            }
        }

        return client.api.interactions[interaction.id][interaction.token].callback.post({data: {
            type: 5,
            data: {
                embeds: [response]
            }
        }})
    }
}