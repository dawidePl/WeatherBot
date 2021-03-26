const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows all available commands.',
    usage: 'help [command]',
    cooldown: 5,
    type: 'general',
    args: false,
    execute(msg, args) {
        const commands = msg.client.commands;

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
                                .setAuthor(`Available commands`, msg.client.user.displayAvatarURL())
                                .setDescription(content)
                                .setTimestamp()
                                .setColor('2F3136');
    
            msg.channel.send(embed);
        }else {
            const command = commands.find(c => c.name == args[0]);

            if(!command) return msg.reply('Please specify proper command.');

            const embed = new Discord.MessageEmbed()
                                .setAuthor(`Available commands`, msg.client.user.displayAvatarURL())
                                .setDescription(`**Note about command usage:** ${command.note || 'None'}\n\n**Name:** ${command.name}\n**Description:** ${command.description || 'No description provided'}\n**Usage:** ${command.usage || 'No usage specified'}`)
                                .setTimestamp()
                                .setColor('2F3136');

            return msg.channel.send(embed);
        }
    }
}