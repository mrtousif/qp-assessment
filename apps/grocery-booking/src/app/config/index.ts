import { cleanEnv, port, str, url } from 'envalid';
import { Inject } from '@nestjs/common';
import { makeValidators, Static, ENVALID } from 'nestjs-envalid';

const ENVS = {
  POSTGRES_USER: str(),
  POSTGRES_PASSWORD: str(),
  POSTGRES_DB: str(),
  POSTGRES_HOST: str({ devDefault: 'localhost' }),
  POSTGRES_PORT: port({ default: 5432 }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging', 'qa'],
    devDefault: 'development',
  }),
  PORT: port({ default: 6000 }),
};

export const env = cleanEnv(process.env, ENVS);

export const validators = makeValidators(ENVS);

export type Config = Static<typeof validators>;

export const InjectEnvalid = () => Inject(ENVALID);
