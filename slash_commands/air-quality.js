const Discord = require('discord.js');
const fetch = require('node-fetch');
const getData = require('../utils/getEnvVars');

module.exports = {
    name: 'quality',
    description: 'Check quality of air for any location.',
    usage: 'quality <city>',
    type: 'weather',
    note: 'Do not use special characters in name of city.',
    async execute(interaction, client) {
        let response, args = [];
    
        interaction.data.options.forEach(option => {
            args.push(option.value);
        });

        const key = getData(false, 'api_key');
        const query = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${args[0]}&days=${args[1]}&aqi=yes&alerts=no`;

        const res = await fetch(query);
        const data = await res.json();

        if(!data.error) {
            response = new Discord.MessageEmbed()
                                .setTitle(`${data.location.name}, ${data.location.country}`)
                                .setDescription(`${data.current.air_quality.us-epa-index} US - EPA Standard.`)
                                .addFields(
                                    { name: 'Carbon monoxide ( CO )', value: `${data.current.air_quality.co} μg/m3`, inline: true },
                                    { name: 'Nitrogen dioxide ( NO2 )', value: `${data.current.air_quality.no2} μg/m3`, inline: true },
                                    { name: 'Ozone ( O3 )', value: `${data.current.air_quality.o3} μg/m3`, inline: true },
                                    { name: 'Sulphur dioxide ( SO2 )', value: `${data.current.air_quality.so2} μg/m3`, inline: true },
                                    { name: 'PM 2,5', value: `${data.current.air_quality.pm2_5} μg/m3`, inline: true },
                                    { name: 'PM 10', value: `${data.current.air_quality.pm10} μg/m3`, inline: true }
                                )
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