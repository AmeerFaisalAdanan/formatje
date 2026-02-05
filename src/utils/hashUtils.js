import CryptoJS from "crypto-js";

/**
 * Computes the hash of a given input using the specified algorithm.
 *
 * @param {string} input - The input string to hash.
 * @param {string} algorithm - The hashing algorithm to use ('md5', 'sha1', 'sha256', 'sha512').
 * @returns {string} The computed hash as a hexadecimal string, or an empty string if the algorithm is not supported.
 */
export function computeHash(input, algorithm) {
  switch (algorithm) {
    case "md5":
      return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
    case "sha1":
      return CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex);
    case "sha256":
      return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    case "sha512":
      return CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex);
    default:
      return "";
  }
}

/**
 * Computes the HMAC (Hash-based Message Authentication Code) of a given input using a secret and algorithm.
 *
 * @param {string} input - The input string to hash.
 * @param {string} secret - The secret key for the HMAC.
 * @param {string} algorithm - The hashing algorithm to use ('md5', 'sha1', 'sha256', 'sha512').
 * @returns {string} The computed HMAC as a hexadecimal string, or an empty string if the algorithm is not supported.
 */
export function computeHmac(input, secret, algorithm) {
  switch (algorithm) {
    case "md5":
      return CryptoJS.HmacMD5(input, secret).toString(CryptoJS.enc.Hex);
    case "sha1":
      return CryptoJS.HmacSHA1(input, secret).toString(CryptoJS.enc.Hex);
    case "sha256":
      return CryptoJS.HmacSHA256(input, secret).toString(CryptoJS.enc.Hex);
    case "sha512":
      return CryptoJS.HmacSHA512(input, secret).toString(CryptoJS.enc.Hex);
    default:
      return "";
  }
}
