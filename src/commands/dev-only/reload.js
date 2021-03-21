const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'reload',
    args: true,
    devOnly: true,
    execute(msg, args) {
        const commandName = args[0].toLowerCase();
        const command = msg.client.commands.get(commandName);

        if(!command) return msg.reply(`You didn't specify proper command to reload.`);

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

        delete require.cache[require.resolve(`../${folderName}/${commandName}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            msg.client.commands.set(newCommand.name, newCommand);

            return msg.reply(`Successfully reloaded ${command.name}!`);
        }catch(error) {
            msg.reply(`An internal error occurred while reloading \`${command.name}\``);

            const errorEmbed = new Discord.MessageEmbed()
                                        .setAuthor(msg.client.user.tag, msg.client.user.displayAvatarURL())
                                        .setDescription(`\`\`\`error\`\`\``)
                                        .setTimestamp();

            msg.channel.send(errorEmbed);

            console.error(error);
        }
    }
}