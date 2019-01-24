const chai = require('chai');
const expect = chai.expect;
const usersModel = require('../src/models/users_model');
const config = require('../knexfile').test;

//testing knex in a test file
describe('test', () => {
  before(() => {
    const tmpConnection = require('knex')({
      client: 'pg',
      connection: config.connection,
    });
    return tmpConnection
      .raw(`CREATE DATABASE ${config.connection.database};`)
      .catch(err => {
        Promise.resolve('Everything is OK');
      })
      .then(() => (global.knex = require('../db/db')))
      .then(() => knex.migrate.rollback())
      .then(() => knex.migrate.latest(config))
      .then(() => knex.seed.run())
      .catch(() => console.log(`Migrations or seeds failed.`));
  });

  describe('#getAllUsers', () => {
    let result;
    let user;

    before(async () => {
      result = await usersModel.getAllUsers();
      user = result[0];
    });

    it('should return an array of users', () => {
      // console.log('>>>>', user);
      expect(result).to.be.an('array');
      expect(user.first_name).to.equal('Carl');
    });

    it('should have all keys', () => {
      expect(user).to.have.all.keys(
        'id',
        'first_name',
        'last_name',
        'username',
        'email',
        'hashedPassword',
        'profile_pic',
        'location',
        'bio',
        'soundcloud_url',
        'is_admin',
        'created_at',
        'updated_at'
      );
    });
  });
});

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const returnOdds = arr => {
  let result = [];
  arr.forEach(num => {
    if (num % 2 != 0) {
      result.push(num);
    }
  });
  return result;
};

describe('returnOdds()', () => {
  it('should return an array of odd numbers', () => {
    let result = returnOdds(testArray);
    expect(result)
      .to.be.an('array')
      .that.does.not.include(2);
    expect(result[0]).to.equal(1);
    expect(result.length).to.equal(5);
  });
});
