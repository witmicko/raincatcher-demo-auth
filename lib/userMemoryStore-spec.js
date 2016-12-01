const assert = require('assert');
const store = require('./userMemoryStore');

const fixtures = require('./data.json');
const daisyId = 'rJeXyfdrH';
const userToCreate = {
  "username" : "jdoe",
  "name" : "John Doe",
  "position" : "Truck Inspector",
  "phone" : "(265) 754 8176",
  "email" : "jdoe@wfm.com",
  "avatar" : "https://s3.amazonaws.com/uifaces/faces/twitter/madysondesigns/128.jpg",
  "password" : "Password1"
};


describe('userMemoryStore', function() {
  beforeEach(function() {
    store.setAll(fixtures);
  });
  describe('#all', function() {
    it('should return all users', function(done) {
      store.all(function(err, res) {
        assert(!err);
        assert.equal(res.length, fixtures.length);
        done();
      });
    });
  });
  describe('#read', function() {
    it('should find an user by id', function(done) {
      store.read(daisyId, function(err, daisy) {
        assert(!err);
        assert(daisy.username === 'daisy');
        done();
      });
    });
    it('should not allow edits', function(done) {
      store.read(daisyId, function(err, daisy) {
        assert(!err);
        daisy.username = 'donald duck';
        store.read(daisyId, function(err, daisy2) {
          assert(!err);
          assert.equal(daisy2.username, 'daisy',
            'username should not have been edited');
          done();
        });
      });
    });
    it('should error when not found', function(done) {
      store.read('invalid_id', function(err, user) {
        assert(err);
        assert(!user);
        done();
      });
    });
  });
  describe('#byUsername', function() {
    it('should find an user by username', function(done) {
      store.byUsername('daisy', function(err, daisy) {
        assert(!err);
        assert(daisy.username === 'daisy');
        done();
      });
    });
    it('should not allow edits', function(done) {
      store.byUsername('daisy', function(err, daisy) {
        assert(!err);
        daisy.username = 'donald duck';
        store.byUsername('daisy', function(err, daisy2) {
          assert(!err);
          assert(daisy2);
          done();
        });
      });
    });
    it('should error when not found', function(done) {
      store.byUsername('invalid_username', function(err, user) {
        assert(err);
        assert(!user);
        done();
      });
    });
  });
  describe('#create', function() {
    it('should add a new user [slow]', function(done) {
      var oldCount;
      store.all(function(err, orig) {
        assert(!err);
        oldCount = orig.length;
        store.create(userToCreate, function(err) {
          assert(!err),
          store.all(function(err, newUsers) {
            assert(!err);
            assert.equal(newUsers.length, oldCount + 1,
              'total users should have increased by 1');
            done();
          });
        });
      });
    });
    it('should generate an id [slow]', function(done) {
      store.create(userToCreate, function(err, user) {
        assert(!err);
        assert(user.id);
        done();
      });
    });
  });
  describe('#update', function() {
    it('should update fields', function() {
      store.update(daisyId, {position: 'test'}, function(err, newDaisy) {
        assert(!err);
        assert.equal(newDaisy.username, 'daisy');
        assert.equal(newDaisy.position, 'test');
      });
    });
    it('should error when not found', function(done) {
      store.update('invalid_id', {position:'test'}, function(err, user) {
        assert(err);
        assert(!user);
        done();
      });
    });
  });
  describe('#verifyPassword', function() {
    beforeEach(function(done) {
      var self = this;
      store.create(userToCreate, function(err, user) {
        self.user = user;
        done();
      });
    });
    it('should validate against provided password [slow]', function(done) {
      store.verifyPassword(userToCreate.username, userToCreate.password, function(err, match) {
        assert(!err);
        assert(match);
        done();
      });
    });
  });
  describe('#updatePassword', function() {
    it('should error when user not found', function(done) {
      store.updatePassword('invalid_username', 'old', 'new', function(err, user) {
        assert(err);
        assert(!user);
        done();
      });
    });
    it('should error when old password is not correct [slow]', function(done) {
      store.updatePassword(userToCreate.username, 'old', 'new', function(err) {
        assert(err);
        done();
      });
    });
    it('should update the password when the old one is provided [slow]', function(done) {
      store.updatePassword(userToCreate.username, userToCreate.password, 'new', function(err) {
        assert(!err);
        store.verifyPassword(userToCreate.username, 'new', function(err, match) {
          assert(!err);
          assert(match);
          done();
        });
      });
    });
  });
  describe('#delete', function() {
  });
});
