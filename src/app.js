const Discord = require('discord.js');
const fs = require('fs');
const getData = require('./utils/getEnvVars');

const client = new Discord.Client();

client.slashCommands = new Discord.Collection();

const sCommandFiles = fs.readdirSync('./slash_commands').filter(file => file.endsWith('.js'));

for(const file of sCommandFiles) {
    const command = require(`./slash_commands/${file}`);

    client.slashCommands.set(command.name, command);
}

const slashCommandsHandler = require('./utils/slashCommandsHandler');

client.on('ready', async () => {
    console.log(`Logged as ${client.user.tag}`);

    // client.api.applications(client.user.id).commands.post({data: {
    //     name: 'weather',
    //     description: 'Check weather for any location.',
    //     options: [
    //         {
    //             "name": "city",
    //             "description": "Name of city you want to check weather of.",
    //             "required": true,
    //             "type": 3
    //         }
    //     ]
    // }})

    slashCommandsHandler(client);
})

const config = getData(true, '');

client.login(config.token);