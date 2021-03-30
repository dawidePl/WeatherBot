const Discord = require('discord.js');
const fetch = require('node-fetch');
const getData = require('../utils/getEnvVars');

module.exports = {
    name: 'weather',
    description: 'Check weather for any location.',
    usage: 'weather <city>',
    type: 'weather',
    note: 'Do not use special characters in name of city.',
    async execute(interaction, client) {
        let response, args = [];
    
        interaction.data.options.forEach(option => {
            args.push(option.value);
        });

        const key = getData(false, 'api_key');
        const query = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${args[0]}&days=${args[1]}&aqi=no&alerts=no`;

        const res = await fetch(query);
        const data = await res.json();

        if(!data.error) {
            const wind_direction = {
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

            response = new Discord.MessageEmbed()
                                .setTitle(`${data.location.name}, ${data.location.country}`)
                                .addFields(
                                    { name: 'Temperature data 🌡️', value: `Current temperature: ${data.current.temp_c}°C ( ${data.current.temp_f}°F )\nFeels like: ${data.current.feelslike_c}°C ( ${data.current.feelslike_f}°F )`, inline: true },
                                    { name: 'Environmental data 🌥️', value: `Wind speed: ${data.current.wind_kph} kph ( ${data.current.wind_mph} mph )\nWind direction: ${wind_direction[data.current.wind_dir]} ( ${data.current.wind_degree}° )\nPressure: ${data.current.pressure_mb} milibars ( ${data.current.pressure_in} inches )\nPrecipitation: ${data.current.precip_mm} mm ( ${data.current.precip_in} inches )\Humidity: ${data.current.humidity}%\nCloud coverage: ${data.current.cloud}%\nVisibility: ${data.current.vis_km} km ( ${data.current.vis_miles} miles )`, inline: false },
                                    { name: 'Time data 🕙', value: `Local date: ${data.location.localtime.split(' ')[0]}\nLocal time: ${data.location.localtime.split(' ')[1]}` }
                                )
                                .setThumbnail(`https://${data.current.condition.icon}`)
                                .setColor('2F3136')
                                .setTimestamp();
        }else {
            response = new Discord.MessageEmbed()
                                .setDescription(`Please provide correct city name.`)
                                .setColor('2F3136');
        }

        return client.api.interactions[interaction.id][interaction.token].callback.post({data: {
            type: 4,
            data: {
                tts: false,
                embeds: [response]
            }
        }});
    }
}