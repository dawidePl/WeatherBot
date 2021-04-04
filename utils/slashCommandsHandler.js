module.exports = client => {
    client.ws.on('INTERACTION_CREATE', async interaction => {
        const commandName = interaction.data.name;
        const command = client.slashCommands.get(commandName);

        try {
            command.execute(interaction, client);
        }catch(error) {
            console.log(error);
        }
    });
}