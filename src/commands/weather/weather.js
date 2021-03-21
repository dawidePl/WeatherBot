const Discord = require('discord.js');
const countryISO = require('iso-3166-country-list');
const fetch = require('node-fetch');
const getTime = require('../../utils/getTime');

module.exports = {
    name: 'weather',
    description: 'Show weather at current location',
    usage: '<city> [country]',
    args: true,
    async execute(msg, args) {
        let q = args[0];
        let isoCountryCode;
        const api_key = 'aa76b4a8bd86eda5b2c96a144201cf69';
        
        if(args[1]) {
            isoCountryCode = countryISO.code(args[1]);

            if(isoCountryCode == undefined) {
                return msg.reply('Wrong country format. Make sure you use full country name, not it\'s shortcut name.');
            }

            q += `,${isoCountryCode}`.toLowerCase();
        }

        const query = `https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams({q, appid: api_key})}`;

        fetch(query).then(response => {
            if(!response.ok) {
                throw new Error('Could not load data. ( weather.js line 27 )');
            }

            return response.json();
        })
        .then(data => {
            const temperature = {
                kelvin: data.main.temp,
                celsius: (data.main.temp - 273.15).toFixed(2),
                fahrenheit: (data.main.temp * (9/5) - 459.67).toFixed(2),
                feelsLike: {
                    kelvin: data.main.feels_like,
                    celsius: (data.main.feels_like - 273.15).toFixed(2),
                    fahrenheit: (data.main.feels_like * (9/5) - 459.67).toFixed(2)
                }
            }

            const embed = new Discord.MessageEmbed()
                                    .setTitle(`${data.name}, ${countryISO.name(data.sys.country)}`)
                                    .addFields(
                                        { name: '🌡️ Temperature data', value: `${temperature.celsius}°C ( Feels like ${temperature.feelsLike.celsius}°C )\n${temperature.fahrenheit}°C ( Feels like ${temperature.feelsLike.fahrenheit}°F )`, inline: true },
                                        { name: '🌥️ Atmospheric data', value: `Humidity: ${data.main.humidity}%\nPressure: ${data.main.pressure}hPa\nVisibility: ${data.visibility} meters`, inline: true },
                                        { name: '🕛 Time data', value: `Sunrise: ${getTime(data.sys.sunrise)}\nSunset: ${getTime(data.sys.sunset)}`, inline: false }
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