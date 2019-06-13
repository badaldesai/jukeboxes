const request = require('../request');

module.exports = {

    /**
     * Returns array of jukes which contains required components.
     * @param {Array<object>} jukes - Array of jukes objects
     * @param {Array<string>} requiredComponents - Array of components
     *
     * @returns {Array<object>} returns array of jukes objects
     */
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

    /**
     * Filter the result based on passed options
     * @param {Array<object>} eligibleJukeBoxes - Array of jukes objects
     * @param {Object} options - filters need to be applied
     *
     * @returns {Array<object>} filtered result of the object.
     */
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

    /**
     * Function to retrieve result for the specified settings.
     * @param {Express<Request>} req - Express request object
     * @param {Express<Response>} res - Express response object
     */
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
