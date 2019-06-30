export const environment = {
  auth: {
    google: {
      clientID: '123',
      clientSecret: 'EXAMPLE',
    },
    facebook: {
      clientID: '123',
      clientSecret: 'EXAMPLE',
    },
    passport: {
      sessionSecret: '123',
    },
  },
  db: {
    mongoUri: 'mongodb+srv://REDACTED',
  },
  ssl: {
    key: '',
    cert: '',
  },
  api: {
    mediaDir: 'media',
    publicUrl: 'http://localhost:4200/api',
  },
}
