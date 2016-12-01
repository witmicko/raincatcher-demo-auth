const _ = require('lodash');
const users = require('./data.json');
const shortid = require('shortid');
const hash = require('./hash');

function findById(id) {
  return _.find(users, {id: id});
}
function findByUsername(username) {
  return _.find(users, {username: username});
}

function setUserPassword(user, pwd, cb) {
  hash.saltAndHash(pwd, function(err, hashed) {
    if (err) {
      return cb(err);
    }
    user.password = hashed;
    cb(null, user);
  });
}

exports.all = function() {
  return _.cloneDeep(users);
};

exports.read = function(id, cb) {
  const user = findById(id);
  if (!user) {
    return cb(new Error('User not found'));
  }
  cb(null, user);
};

exports.byUsername = function(username, cb) {
  const user = findByUsername(username);
  if (!user) {
    return cb(new Error('User not found'));
  }
  cb(null, user);
};

exports.create = function(user, cb) {
  user.id = shortid.generate();
  setUserPassword(user, user.password, function(err, user) {
    if (err) {
      return cb(err);
    }
    users.push(user);
    cb(null, user);
  });
};
exports.update = function(id, user, cb) {
  const originalUser = findById(id);
  // avoid updating the password and id on this method
  delete user.id;
  delete user.password;
  _.assign(originalUser, user);
  if (!originalUser) {
    return cb(new Error('User not found'));
  }
};
exports.updatePassword = function(id, password, cb) {
  const user = findById(id);
  setUserPassword(user, user.password, cb);
};
exports.delete = function(id, cb) {
  const removed = _.remove(users, {id: id});
  if (!removed.length) {
    return cb(new Error('User not found'));
  }
  cb(null, removed[0]);
};