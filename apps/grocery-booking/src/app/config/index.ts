import { cleanEnv, port, str, url } from 'envalid';
import { Inject } from '@nestjs/common';
import { makeValidators, Static, ENVALID } from 'nestjs-envalid';

const ENVS = {
  DB_URI: url(),
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging', 'qa'],
    devDefault: 'development',
  }),
  PORT: port({ devDefault: 6000 }),
};

export const env = cleanEnv(process.env, ENVS);

export const validators = makeValidators(ENVS);

export type Config = Static<typeof validators>;

export const InjectEnvalid = () => Inject(ENVALID);
