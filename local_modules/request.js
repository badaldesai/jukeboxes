const request = require('request-promise');

const BASE_URL = 'http://my-json-server.typicode.com/touchtunes/tech-assignment';

module.exports = {

    async getJukes() {
        const jukes = await request.get(`${BASE_URL}/jukes`);
        return JSON.parse(jukes);
    },

    async getSettings() {
        const settings = await request.get(`${BASE_URL}/settings`);
        return JSON.parse(settings);
    },
};
