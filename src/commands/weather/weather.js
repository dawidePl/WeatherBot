const Discord = require('discord.js');
const fetch = require('node-fetch');
const getData = require('../../utils/getEnvVars');

module.exports = {
    name: 'weather',
    description: 'Show weather at current location',
    usage: '<city> [flag]',
    cooldown: 10,
    note: 'Make sure you don\'t use any special character in name of city.',
    type:'weather',
    args: true,
    async execute(msg, args) {
        const [city, flag] = args.join(' ').split('--');

        let q = city.split(' ').join('%20');
        const key = getData(false, 'api_key');
        const flags = ['temperature', 'environment', 'env'];

        const query = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${q}&aqi=no`;

        fetch(query).then(response => {
            if(!response) throw new Error;

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

            if(!flag) {
                const embed = new Discord.MessageEmbed()
                                .setTitle(`${data.location.name}, ${data.location.country}`)
                                .addFields(
                                    { name: '🌡️ Temperature data', value: `Current temperature: ${data.current.temp_c}°C\nCurrent temperature: ${data.current.temp_f}°F`, inline: true },
                                    { name: '🌥️ Atmospheric data', value: `Humidity: ${data.current.humidity}%\nPressure: ${data.current.pressure_mb} hPa\nVisibility: ${data.current.vis_km} kilometers ( ${data.current.vis_miles} miles )`, inline: true },
                                    { name: '🕛 Time data', value: `Local date: ${data.location.localtime.split(' ')[0].split('-').join('.')}\nLocal time: ${data.location.localtime.split(' ')[1]} ( 24 hour clock )` },
                                    { name: '💨 Wind data', value: `Wind speed: ${data.current.wind_kph} km/h ( ${data.current.wind_mph} mph )\nWind direction: ${wind_direction[data.current.wind_dir] || data.current.wind_dir}`, inline: true }
                                )
                                .setThumbnail(`https:${data.current.condition.icon}`)
                                .setColor('2F3136')
                                .setTimestamp();

                return msg.channel.send(embed);
            }else if(flags.includes(flag)) {
                const embed = new Discord.MessageEmbed()
                                    .setTitle(`${data.location.name}, ${data.location.country}`)
                                    .setThumbnail(`https:${data.current.condition.icon}`)
                                    .setColor('2F3136')
                                    .setTimestamp();
                    
                if(flag == 'temperature') {
                    embed.addFields(
                        { name: '🌡️ Temperature data', value: `\n**Current temperature ( Celsius ):** ${data.current.temp_c}°C\n**Current temperature ( Fahrenheit ):** ${data.current.temp_f}°F\n\n**Feels like ( Celsius ):** ${data.current.feelslike_c}°C\n**Feels like ( Fahrenheit ):** ${data.current.feelslike_f}°F`, inline: true },
                    )
                }else if(flag == 'environment' || flag == 'env') {
                    embed.setDescription('🌥️ Atmospheric data');
                    embed.addFields(
                        { name: 'Humidity', value: `${data.current.humidity}%`, inline: true },
                        { name: 'Pressure', value: `${data.current.pressure_mb} hPa`, inline: true },
                        { name: 'Visibility', value: `${data.current.vis_km} kilometers ( ${data.current.vis_miles} miles )`, inline: true },
                        { name: 'Wind speed', value: `${data.current.wind_kph} km/h ( ${data.current.wind_mph} miles per hour )`, inline: true },
                        { name: 'Wind degree', value: `${data.current.wind_degree}°`, inline: true },
                        { name: 'Wind direction', value: wind_direction[data.current.wind_dir], inline: true },
                        { name: 'Pressure ( milibars )', value: data.current.pressure_mb, inline: true },
                        { name: 'Pressure ( inches )', value: data.current.pressure_in, inline: true },
                        { name: 'Precipitation ( millimeters )', value: data.current.precip_mm, inline: true },
                        { name: 'Precipitation ( inches )', value: data.current.precip_in, inline: true }
                    )
                }

                return msg.channel.send(embed);
            }else {
                let replyMsg = `This flag doesn't exist! Available flags:`;

                flags.map(flag => replyMsg += `\` ${flag}\``);

                return msg.reply(replyMsg);
            }
        }).catch(error => {
            msg.reply(`This city doesn't exist.\n*Note: if such city exists, API could not have it.*`);
        });
    }
}