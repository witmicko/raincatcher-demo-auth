const crypto = require('crypto');

const SALT_LENGTH = 64;
const HASH_ITERATIONS = 10000;
const HASH_LENGTH = 256;
const CIPHER = 'sha512';
const SEPARATOR = ':';

function genSalt() {
  return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

/**
 * @callback saltAndHashCallback
 * @param {Error}
 * @param {String} responseMessage
 */

/**
 * Generates a random salt and encrypts the given password
 * @param  {String}   pwd Password to be encrypted
 * @param  {saltAndHashCallback} cb Node-style callback
 */
exports.saltAndHash = function(pwd, cb) {
  const salt = genSalt();
  crypto.pbkdf2(pwd, salt, HASH_ITERATIONS, HASH_LENGTH, CIPHER, function(err, hashed) {
    if (err) {
      return cb(err);
    }

    var finalHash = [CIPHER, HASH_ITERATIONS, hashed.toString('hex'), salt].join(SEPARATOR);
    cb(null, finalHash);
  });
};

/**
 * @callback verifyCallback
 * @param {Error}
 * @param {Boolean} Whether the password corresponds to the supplied hashed string
 */

/**
 * Generates a random salt and encrypts the given password
 * @param  {String}   pwd Password to be verified
 * @param  {String}   hashed Hash generated by {@link exports.saltAndHash}
 * @param  {verifyCallback} cb Node-style callback
 */
exports.verify = function(pwd, hashed, cb) {
  const split = hashed.split(SEPARATOR);
  if (!split || split.length !== 4) {
    return cb(new Error('Hash string should be in {cipher}:{iterations}:{hash}:{salt} format'));
  }
  const cipher = split[0];
  const iterations = Number(split[1]);
  const hash = split[2];
  const salt = split[3];

  crypto.pbkdf2(pwd, salt, iterations, HASH_LENGTH, cipher, function(err, verify) {
    // available on node 6.0+
    if (crypto.timingSafeEqual) {
      var hashBuf;
      try {
        hashBuf = Buffer.from(hash, 'hex');
      } catch (e) {
        // invalid hex string
        return cb(err);
      }
      return cb(err, crypto.timingSafeEqual(hashBuf, verify));
    }
    cb(err, hash === verify.toString('hex'));
  });
};

exports.separator = SEPARATOR;