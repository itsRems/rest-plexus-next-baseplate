import { extractEnv } from '@rocketplay/extractenv';
import admin from 'firebase-admin';
import exitHook from 'async-exit-hook';
import { rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const serviceFile = join(`${__dirname}/../firebase.json`);

export function init () {
  const data = extractEnv('FIREBASE_SERVICE_ACCOUNT');
  if (!data) return console.warn(`Firebase admin account not found in your environment, init skipped.`);
  writeFileSync(serviceFile, Buffer.from(data, 'base64').toString());
  const credentials = require(serviceFile);
  admin.initializeApp({
    credential: admin.credential.cert(credentials)
  });
  exitHook(() => {
    rmSync(serviceFile);
  });
}