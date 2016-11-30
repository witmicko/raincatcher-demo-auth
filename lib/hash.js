const crypto = require('crypto');
const assert = require('assert');

const SALT_LENGTH = 256;
const HASH_ITERATIONS = 10000;
const HASH_LENGTH = 512;
const CIPHER = 'sha512';
const SEPARATOR = ':';

function genSalt() {
  return crypto.randomBytes(SALT_LENGTH).toString('base64');
}

/**
 * @callback saltAndHashCallback
 * @param {Error}
 * @param {String} responseMessage
 */

/**
 * Generates a random salt and encrypts the given password
 * @param  {String}   pw Password to be encrypted
 * @param  {saltAndHashCallback} cb Node-style callback
 */
exports.saltAndHash = function(pw, cb) {
  const salt = genSalt();
  crypto.pbkdf2(pw, salt, HASH_ITERATIONS, HASH_LENGTH, CIPHER, function(err, hashed) {
    if (err) {
      return cb(err);
    }

    var finalHash = [CIPHER, HASH_ITERATIONS, hashed, salt].join(SEPARATOR);
    cb(null, finalHash);
  });
};

exports.verify = function(pw, hashed, cb) {
  const split = hashed.split(SEPARATOR);
  assert.equal(split.length, 4, 'Hash string should be in {cipher}:{iterations}:{hash}:{salt} format');
  const cipher = split[0];
  const iterations = Number(split[1]);
  const hash = split[2];
  const salt = split[3];

  crypto.pbkdf2(pw, salt, iterations, hash.length, cipher, function(err, verify) {
    cb(err, hash === verify);
  });
};