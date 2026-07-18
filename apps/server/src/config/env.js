import 'dotenv/config';

const required = (name, value) => {
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: required('MONGODB_URI', process.env.MONGODB_URI),
  JWT_SECRET: required('JWT_SECRET', process.env.JWT_SECRET),
  CLIENT_ORIGIN: required('CLIENT_ORIGIN', process.env.CLIENT_ORIGIN)

};



