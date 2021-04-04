const dotenv = require('dotenv').config();

const config = {
    token: process.env.TOKEN,
    developersID: process.env.developersID.split(' '),
    api_key: process.env.API_KEY
}


function getData(all, data) {
    if(!all) {
        const keys = data.split(' ');
        let returnData = [];

        for(let i = 0; i < keys.length; i++) {
            returnData.push(config[keys[i]]);
        }

        return returnData;
    }else return config;
}

module.exports = getData;