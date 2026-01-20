import CryptoJS from 'crypto-js';

export function computeHash(input, algorithm) {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.MD5(input).toString(CryptoJS.enc.Hex);
    case 'sha1':
      return CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex);
    case 'sha256':
      return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
    case 'sha512':
      return CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex);
    default:
      return '';
  }
}

export function computeHmac(input, secret, algorithm) {
  switch (algorithm) {
    case 'md5':
      return CryptoJS.HmacMD5(input, secret).toString(CryptoJS.enc.Hex);
    case 'sha1':
      return CryptoJS.HmacSHA1(input, secret).toString(CryptoJS.enc.Hex);
    case 'sha256':
      return CryptoJS.HmacSHA256(input, secret).toString(CryptoJS.enc.Hex);
    case 'sha512':
      return CryptoJS.HmacSHA512(input, secret).toString(CryptoJS.enc.Hex);
    default:
      return '';
  }
}
