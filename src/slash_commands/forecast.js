const Discord = require('discord.js');
const fetch = require('node-fetch');
const getData = require('../utils/getEnvVars');

module.exports = {
    name: 'forecast',
    description: 'Forecast for given location at given time.',
    usage: 'forecast <city> <days since now>',
    type: 'weather',
    note: 'Please specify \`days\` field starting from \`2\`. Typing there \`1\` will result in current day forecast.',
    async execute(interaction, client) {
        let response, args = [];

        interaction.data.options.forEach(option => {
            args.push(option.value);
        });

        const key = getData(false, 'api_key');
        const query = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${args[0]}&days=${args[1]}&aqi=no&alerts=no`;

        const res = await fetch(query);
        const data = await res.json();

        const index = parseInt(args[1]) - 1;

        if(!data.error) {
            if(index > 1 && index < 5) {
                const dataShort = data.forecast.forecastday[index].day;

                response = new Discord.MessageEmbed()
                                    .setTitle(`${data.location.name}, ${data.location.country}`)
                                    .setDescription(`Forecast for ${data.forecast.forecastday[index].date}`)
                                    .addFields(
                                        { name: '🌡️ Temperature data', value: `Average temperature: ${dataShort.avgtemp_c}°C (  ${dataShort.avgtemp_f}°F )\nMinimal temperature: ${dataShort.mintemp_c}°C ( ${dataShort.mintemp_f}°F )\nMaximal temperature: ${dataShort.maxtemp_c}°C ( ${dataShort.maxtemp_f}°F )`, inline: false },
                                        { name: '🌥️ Atmospheric data', value: `Average humidity: ${dataShort.avghumidity}%\nAverage visibility: ${dataShort.avgvis_km} kilometers ( ${dataShort.avgvis_miles} miles )`, inline: false },
                                        { name: '💨 Wind data', value: `Max wind speed: ${dataShort.maxwind_kph} km/h ( ${dataShort.maxwind_mph} mph )`, inline: false }
                                    )
                                    .setThumbnail(`https:${dataShort.condition.icon}`)
                                    .setColor('2F3136');

            }else {
                response = new Discord.MessageEmbed()
                                    .setDescription(`Please select time from 2 to 4 days. Keep in mind that \`1\` will show forecast for current day.`)
                                    .setColor('2F3136');
            }
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