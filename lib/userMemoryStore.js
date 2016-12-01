const _ = require('lodash');
const users = require('./data.json');
const shortid = require('shortid');

const find = _.find.bind(null, users);
function findById(id) {
  return find(function(u) {
    return u.id === id;
  });
}
function findByUsername(username) {
  return find(function(u) {
    return u.username === username;
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
  users.push(user);
  cb(null, user);
};
exports.update = function(id, user, cb) {
  const originalUser = findById(id);
  if (!originalUser) {
    return cb(new Error('User not found'));
  }
  
};
exports.updatePassword = function(id, password, cb) {
  
};
exports.delete = function(id, cb) {
  
};