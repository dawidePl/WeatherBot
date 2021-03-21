const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
require('dotenv-flow').config();

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);

        client.commands.set(command.name, command);
    }
}

const config = {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    developersID: process.env.developersID.split(' '),
    api_key: process.env.API_KEY
}

client.on('ready', () => {
    console.log(`Logged as ${client.user.tag}`);
})

client.on('message', msg => {
    if(msg.content === /<@!$822848534658547713>/) return msg.channel.send(`Hi! My prefix is \`${config.prefix}\``);
    if(!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    const args = msg.content.slice(config.prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if(!command) return;

    if(command.args && !args.length) {
        let reply = `\`${command.name}\` requries arguments!`;

        if(command.usage) reply += `\nProper usage of this command is \`${config.prefix}${command.name} ${command.usage}\``;

        return msg.channel.send(reply);
    }

    if(command.devOnly && !config.developersID.includes(msg.author.id)) msg.reply(`This command is reserved for developers only.`);

    const cooldowns = client.cooldowns;

    if(!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmmount = (command.cooldown || 0) * 1000;

    if(timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;

            return msg.reply(`You need to wait \`${timeLeft.toFixed(1)}\` more second(s) before using \`${command.name}\` again.`);
        }
    }

    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmmount);

    try {
        command.execute(msg, args);
    }catch(error) {
        msg.reply(`An internal error occurred while executing \`${commandName}\`.`);

        console.log(error);
    }
})

client.login(config.token);