import 'dotenv/config'

if (!process.env.MONGO_URI)
  throw new Error('MONGO_URI is undefined!')

export const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  },
  mongoose: {
    uri: process.env.MONGO_URI as string,
  },
  session: {
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET ?? 'secret',
    cookie: {
      path: '/',
      httpOnly: true,
      secure: process.env.HTTPS
        ? process.env.HTTPS == 'true'
        : false,
      maxAge: process.env.MAX_AGE
        ? parseInt(process.env.MAX_AGE)
        : 24 * 60 * 60 * 1000,
    },
  },
}
