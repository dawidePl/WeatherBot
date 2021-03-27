const Discord = require('discord.js');
const fetch = require('node-fetch');
const getData = require('../utils/getEnvVars');

module.exports = {
    name: 'forecast',
    description: 'Forecast for given location at given time.',
    usage: 'forecast <city> <days since now>',
    type: 'weather',
    note: 'Please specify \`days\` field starting from \`2\`. Typing there \`1\` will result in current day forecast.',
    args: false,
    async execute(interaction, client) {
        let response, args = [];

        interaction.data.options.forEach(option => {
            args.push(option.value);
        });

        const key = getData(false, 'api_key');
        const query = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${args[0]}&days=${args[1]}&aqi=no&alerts=no`;

        const res = await fetch(query);
        const data = await res.json();

        const day = parseInt(args[1]);

        if(data && day > 0) {
            try {
                const index = day - 1;

                const dataShort = data.forecast.forecastday[index].day;
    
                response = new Discord.MessageEmbed()
                                .setTitle(`${data.location.name}, ${data.location.country}`)
                                .setDescription(`Forecast for ${data.forecast.forecastday[index].date}`)
                                .addFields(
                                    { name: '🌡️ Temperature data', value: `Average temperature: ${dataShort.avgtemp_c}°C\nAverage temperature: ${dataShort.avgtemp_f}°F`, inline: true },
                                    { name: '🌥️ Atmospheric data', value: `Humidity: ${data.current.humidity}%\nAverage visibility: ${dataShort.avgvis_km} kilometers ( ${dataShort.avgvis_miles} miles )`, inline: true },
                                    { name: '💨 Wind data', value: `Max wind speed: ${dataShort.maxwind_kph} km/h ( ${dataShort.maxwind_mph} mph )`, inline: false }
                                )
                                .setThumbnail(`https:${dataShort.condition.icon}`)
                                .setColor('2F3136')
                                .setTimestamp();
            }catch{error => {
                response = new Discord.MessageEmbed()
                                .setAuthor(client.user.tag, client.user.displayAvatarURL())
                                .setDescription(`Make sure that \`days\` field is between 1 and 12 and that you provided correct city name.`);
            }}
        }else {
            response = new Discord.MessageEmbed()
                                    .setAuthor(client.user.tag, client.user.displayAvatarURL())
                                    .setDescription(`Make sure that \`days\` field is between 1 and 12 and that you provided correct city name.`);
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