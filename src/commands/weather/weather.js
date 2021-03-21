const Discord = require('discord.js');
const countryISO = require('iso-3166-country-list');
const fetch = require('node-fetch');

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
        let dataJSON;

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
                fahrenheit: (data.main.temp * (9/5) - 459.67).toFixed(2)
            }

            const embed = new Discord.MessageEmbed()
                                    .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
                                    .setTitle(data.name)
                                    .addFields(
                                        { name: 'Temperature', value: `${temperature.celsius}°C, ${temperature.fahrenheit}°F`, inline: true },
                                        { name: 'Pressure', value: `${data.main.pressure}hPa`, inline: true },
                                        { name: 'Humidity', value: `${data.main.humidity}%`, inline: true }
                                    )
                                    .setColor('')
                                    .setTimestamp();
                    
            return msg.channel.send(embed);
        }).catch(error => {
            msg.reply(`An error occured while fetching data.`);

            console.log(error);
        });
    }
}