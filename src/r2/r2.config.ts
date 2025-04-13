import { registerAs } from '@nestjs/config';

export default registerAs('r2', () => ({
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  endpoint: process.env.R2_ENDPOINT,
  bucket: process.env.R2_BUCKET,
  url: process.env.R2_MEDIA_URL,
}));
