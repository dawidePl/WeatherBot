const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'weather',
    description: 'Show weather at current location',
    usage: '<city>',
    args: true,
    async execute(msg, args) {
        let q = args.join('%20');

        require('dotenv-flow').config();

        const key = process.env.API_KEY;

        const query = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${q}&aqi=no`;

        fetch(query).then(response => {
            if(!response.ok) {
                throw new Error('Could not load data. ( weather.js line 27 )');
            }

            return response.json();
        })
        .then(data => {
            const embed = new Discord.MessageEmbed()
                                    .setTitle(`${data.location.name}, ${data.location.country}`)
                                    .addFields(
                                        { name: '🌡️ Temperature data     ', value: `${data.current.temp_c}°C\n${data.current.temp_f}°F`, inline: true },
                                        { name: '🌥️ Atmospheric data', value: `Humidity: ${data.current.humidity}%\nPressure: ${data.current.pressure_mb} hPa\nVisibility: ${data.current.vis_km} kilometers ( ${data.current.vis_miles} miles )`, inline: true },
                                        { name: '🕛 Time date', value: `Local date: ${data.location.localtime.split(' ')[0]}\nLocal time: ${data.location.localtime.split(' ')[1]}`, inline: false }
                                    )
                                    .setColor('2F3136')
                                    .setTimestamp();
                    
            return msg.channel.send(embed);
        }).catch(error => {
            msg.reply(`An error occured while fetching data. ( Make sure that you provided valid city name )`);

            console.log(error);
        });
    }
}