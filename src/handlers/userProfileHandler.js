const request = require('request');

require('dotenv').config();

function userProfileHandler(sender_psid) {
    return new Promise((resolve, reject) => {
        const options = {
            uri: `https://graph.facebook.com/${sender_psid}`,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: 'first_name'
            },
            method: 'GET'
        };

        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const userProfile = JSON.parse(body);
                resolve(userProfile);
            } else {
                reject(error);
            }
        });
    });
}

module.exports.userProfileHandler = userProfileHandler;