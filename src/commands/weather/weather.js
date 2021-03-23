const Discord = require('discord.js');
const fetch = require('node-fetch');
const getData = require('../../utils/getEnvVars');

module.exports = {
    name: 'weather',
    description: 'Show weather at current location',
    usage: '<city>',
    args: true,
    async execute(msg, args) {
        let q = args.join('%20');
        const key = getData(false, 'api_key');

        const query = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${q}&aqi=no`;

        fetch(query).then(response => {
            if(!response.ok) {
                throw new Error('Could not load data. ( weather.js line 27 )');
            }

            return response.json();
        })
        .then(data => {
            wind_direction = {
                W: 'West',
                E: 'East',
                N: 'North',
                S: 'South',
                NE: 'Northeast',
                SE: 'Southeast',
                SW: 'Southwest',
                NW: 'NorthWest',
                NNE: 'North-Northeast',
                ENE: 'East-Northease',
                ESE: 'East-Southeast',
                SSE: 'South-Southeast',
                SSW: 'South-Southwest',
                WSW: 'West-Soutwest',
                WNW: 'North-Northwest',
                NNW: 'North-Northwest',
            }

            const embed = new Discord.MessageEmbed()
                                    .setTitle(`${data.location.name}, ${data.location.country}`)
                                    .addFields(
                                        { name: '🌡️ Temperature data     ', value: `${data.current.temp_c}°C\n${data.current.temp_f}°F`, inline: true },
                                        { name: '🌥️ Atmospheric data', value: `Humidity: ${data.current.humidity}%\nPressure: ${data.current.pressure_mb} hPa\nVisibility: ${data.current.vis_km} kilometers ( ${data.current.vis_miles} miles )`, inline: true },
                                        { name: '🕛 Time data', value: `Local date: ${data.location.localtime.split(' ')[0].split('-').join('.')}\nLocal time: ${data.location.localtime.split(' ')[1]} ( 24 hour clock )` },
                                        { name: '💨 Wind data', value: `Wind speed: ${data.current.wind_kph} km/h ( ${data.current.wind_mph} mph )\nWind direction: ${wind_direction[data.current.wind_dir] || data.current.wind_dir}`, inline: true }
                                    )
                                    .setThumbnail(`https:${data.current.condition.icon}`)
                                    .setColor('2F3136')
                                    .setTimestamp();
                    
            return msg.channel.send(embed);
        }).catch(error => {
            msg.reply(`An error occured while fetching data. ( Make sure that you provided valid city name )`);

            console.log(error);
        });
    }
}