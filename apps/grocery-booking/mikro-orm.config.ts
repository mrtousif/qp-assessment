import { defineConfig } from '@mikro-orm/postgresql';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { SeedManager } from '@mikro-orm/seeder';
import { env } from './src/app/config/index';

export default defineConfig({
  dbName: env.POSTGRES_DB,
  host: 'localhost',
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  debug: true,
  entities: ['../../dist/apps/**/*.entity.js'], // path to our JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/app/**/*.entity.ts'], // path to our TS entities (src), relative to `baseDir`
  seeder: {
    path: './src/seeders', // path to the folder with seeders
    pathTs: undefined, // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
  extensions: [EntityGenerator, SeedManager],
});
