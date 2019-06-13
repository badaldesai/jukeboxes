const request = require('../request');

module.exports = {

    getJukeboxes(jukes, requiredComponents) {
        const result = [];
        jukes.forEach((juke) => {
            const components = juke.components.map(component => component.name);
            if (requiredComponents.every(comp => components.indexOf(comp) >= 0)) {
                result.push(juke);
            }
        });

        return result;
    },

    filterResult(eligibleJukeBoxes, options) {
        let result = eligibleJukeBoxes;
        if (options.model) {
            result = eligibleJukeBoxes.filter(juke => juke.model === options.model);
        }

        let limit = result.length;
        if (options.limit) {
            limit = options.offset + options.limit;
        }

        return result.slice(options.offset, limit);
    },

    jukeboxesList(req, res) {
        const options = Object.assign(req.query, req.body);

        if (!options.settingId) {
            return res.status(400).send({
                error: 'Setting ID is not provided',
            });
        }
        options.offset = Number.isNaN(Number(options.offset)) ? 0 : parseInt(options.offset, 10);
        options.limit = Number.isNaN(Number(options.limit)) ? 0 : parseInt(options.limit, 10);

        return request.getJukes()
            .then(async (jukes) => {
                const { settings } = await request.getSettings();
                const targetSetting = settings.find(setting => setting.id === options.settingId);

                if (!targetSetting) {
                    return res.status(200).send([]);
                }
                const requiredComponents = targetSetting.requires;
                const eligibleJukeBoxes = this.getJukeboxes(jukes, requiredComponents);

                const result = this.filterResult(eligibleJukeBoxes, options);

                return res.status(200).send(
                    result,
                );
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send({
                    error,
                });
            });
    },
};
