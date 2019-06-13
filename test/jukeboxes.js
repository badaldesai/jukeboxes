const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

const jukeboxes = require('../local_modules/jukeboxes');
const request = require('../local_modules/request');

describe('Jukeboxes', function () {
    describe('getJukeboxes', function () {
        it('if empty array is passed it should return empty array', function () {
            const result = jukeboxes.getJukeboxes([], []);
            result.should.be.deep.equal([]);
        });

        it('should return jukeboxes which has all required components', function () {
            const jukes = [
                {
                    id: '123',
                    components: [
                        { name: 'abcd' },
                        { name: 'efgh' },
                    ],
                },
                {
                    id: '567',
                    components: [
                        { name: 'abcd' },
                    ],
                },
                {
                    id: '890',
                    components: [
                        { name: 'efgh' },
                    ],
                },
            ];
            const requiredComponents = ['abcd', 'efgh'];
            const result = jukeboxes.getJukeboxes(jukes, requiredComponents);
            result.should.be.deep.equal(jukes.slice(0, 1));
        });

        it('should return all jukeboxes which has all required components', function () {
            const jukes = [
                {
                    id: '123',
                    components: [
                        { name: 'abcd' },
                        { name: 'efgh' },
                    ],
                },
                {
                    id: '567',
                    components: [
                        { name: 'abcd' },
                    ],
                },
                {
                    id: '890',
                    components: [
                        { name: 'efgh' },
                    ],
                },
            ];
            const requiredComponents = ['abcd'];
            const result = jukeboxes.getJukeboxes(jukes, requiredComponents);
            result.should.be.deep.equal(jukes.slice(0, 2));
        });

        it('should return all jukeboxes if required components is empty', function () {
            const jukes = [
                {
                    id: '123',
                    components: [
                        { name: 'abcd' },
                        { name: 'efgh' },
                    ],
                },
                {
                    id: '567',
                    components: [
                        { name: 'abcd' },
                    ],
                },
                {
                    id: '890',
                    components: [
                        { name: 'efgh' },
                    ],
                },
            ];
            const requiredComponents = [];
            const result = jukeboxes.getJukeboxes(jukes, requiredComponents);
            result.should.be.deep.equal(jukes);
        });
    });

    describe('filterResult', function () {
        it('return full array if no filter is passed', function () {
            const array = ['some', 'array'];
            const options = {
                offset: 0,
            };
            const result = jukeboxes.filterResult(array, options);
            result.should.be.deep.equal(array);
        });

        it('return array with required model', function () {
            const array = [
                { id: '123', model: 'audi' },
                { id: '456', model: 'audi' },
                { id: '789', model: 'mercedes' },
            ];
            const options = {
                offset: 0,
                model: 'audi',
            };
            const result = jukeboxes.filterResult(array, options);
            result.should.be.deep.equal(array.slice(0, 2));
        });

        it('return required model with passed offset', function () {
            const array = [
                { id: '123', model: 'audi' },
                { id: '456', model: 'audi' },
                { id: '789', model: 'mercedes' },
            ];
            const options = {
                offset: 1,
                model: 'audi',
            };
            const result = jukeboxes.filterResult(array, options);
            result.should.be.deep.equal(array.slice(1, 2));
        });

        it('return only limit number of array', function () {
            const array = [
                { id: '123', model: 'audi' },
                { id: '456', model: 'audi' },
                { id: '789', model: 'mercedes' },
                { id: '345', model: 'mercedes' },
            ];
            const options = {
                offset: 0,
                limit: 2,
            };
            const result = jukeboxes.filterResult(array, options);
            result.should.be.deep.equal(array.slice(0, 2));
        });

        it('return only limit number of array from the offset passed', function () {
            const array = [
                { id: '123', model: 'audi' },
                { id: '456', model: 'audi' },
                { id: '789', model: 'mercedes' },
                { id: '345', model: 'mercedes' },
            ];
            const options = {
                offset: 2,
                limit: 2,
            };
            const result = jukeboxes.filterResult(array, options);
            result.should.be.deep.equal(array.slice(2, 4));
        });
    });

    describe('jukeboxesList', function () {
        let res;
        let req;
        const settings = {
            settings: [
                {
                    id: '123',
                    requires: ['abcd', 'xyz'],
                },
                {
                    id: '456',
                    requires: ['qwe'],
                },
            ],
        };

        beforeEach(function () {
            res = { status: sinon.stub().returns({ send: sinon.stub() }) };
            req = {
                query: {},
                body: {},
            };
            sinon.stub(request, 'getJukes').resolves({});
            sinon.stub(request, 'getSettings').resolves(settings);
        });

        afterEach(function () {
            sinon.restore();
        });

        it('should return 400 if there are no settingID is passed', function () {
            jukeboxes.jukeboxesList(req, res);
            res.status.should.have.been.calledWith(400);
            res.status().send.should.have.been.calledWith({ error: 'Setting ID is not provided' });
        });

        it('should return 200 if there are no settingId is found', async function () {
            req.query.settingId = '789';
            await jukeboxes.jukeboxesList(req, res);
            res.status.should.have.been.calledWith(200);
            res.status().send.should.have.been.calledWith([]);
        });

        it('should return 200 if there is proper settingid is passed', async function () {
            req.query.settingId = '123';
            sinon.stub(jukeboxes, 'getJukeboxes').returns([{ id: 'abcde' }]);
            sinon.stub(jukeboxes, 'filterResult').returns([{ id: 'abcde' }]);
            await jukeboxes.jukeboxesList(req, res);
            res.status.should.have.been.calledWith(200);
            res.status().send.should.have.been.calledWith([{ id: 'abcde' }]);
        });

        it('should return 500 if there is error thrown by request', async function () {
            req.query.settingId = '123';
            request.getJukes.rejects('some error');
            await jukeboxes.jukeboxesList(req, res);
            res.status.should.have.been.calledWith(500);
        });
    });
});
