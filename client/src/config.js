import pjson from './../package.json';

const prod = process.env.NODE_ENV === 'production';  // <1>

export const SERVER_URL = prod ? '/gp4' : 'http://localhost:8080';

export const CLIENT_URL = prod ? '/gp4' : '';

export const CLIENT_VERSION = pjson.version;

export const REACT_VERSION = pjson.dependencies.react;
