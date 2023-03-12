
// import { CryptoJS } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
import { IPem } from '../api/pem';

export const ENCRYPT_PEM = (plainData: string): string => {
  const key = CryptoJS.enc.Hex.parse('4d4f42494f5365637265744032303231');
  const iv = CryptoJS.enc.Hex.parse('4d4f42494f5365637265744032303231');
  const mode = CryptoJS.mode.CBC;
  const padding = CryptoJS.pad.Pkcs7;
  const options = { iv: iv, mode: mode, padding: padding };
  const encrypted: any = CryptoJS.AES.encrypt(plainData, key, options);
  return encrypted.toString();
};

export const BUILD_PEM = (action: number, pathCheck: string) => {
  return `1:${action}:{{path-api}}:${pathCheck}`;
};

export const BUILD_PEM_OBJECT = (pem: IPem) => {
  return `${pem.isCheck === undefined ? 1 : pem.isCheck}:${pem.action}:{{path-api}}:${pem.pathCheck}`;
};
