import * as fs from 'fs';
import { parse } from 'dotenv';

export class ConfigService {
  private readonly environmentConfig: { [key: string]: string };

  constructor() {
    const isDevelopment = process.env.NODE_ENV != 'production';
    if (isDevelopment) {
      const envFilePath = __dirname + '/../../.env';
      const existsPath = fs.existsSync(envFilePath);
      if (!existsPath) {
        console.log('.env file does not exist');
        process.exit(0);
      }
      this.environmentConfig = parse(fs.readFileSync(envFilePath));
    } else {
      this.environmentConfig = {
        PORT: process.env.PORT,
        DB_URI: process.env.DB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        TMDB_URI: process.env.TMDB_URI,
        TMDB_API_KEY_V4_AUTH: process.env.TMDB_API_KEY_V4_AUTH,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      };
    }
  }

  get(key: string): string {
    return this.environmentConfig[key];
  }
}
