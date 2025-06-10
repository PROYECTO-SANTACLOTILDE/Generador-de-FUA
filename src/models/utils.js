const crypto = require('crypto');

/**
 * Sort objects keys recursevely.
 * 
 *
 */
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortObjectKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}


/**
 * Hashes the content of a row using th createdAt or updateAt value.
 * 
 *
 */
function generateHMAC(obj) {
  const secret = process.env.HMAC_SECRET;
  if (!secret) throw new Error('HMAC_SECRET not defined');
  const str = JSON.stringify(sortObjectKeys(obj));
  return crypto.createHmac('sha256', secret).update(str).digest('hex');
}


module.exports = { generateHMAC };