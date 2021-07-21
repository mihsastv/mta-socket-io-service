export default () => ({
  production: (process.env.PRODUCTION = 'true'),
  debug: process.env.DEBUG === 'true',
  port: process.env.PORT || 3232,
  countSaveRow: process.env.SAVE_COUNT || 1,
  intervalSave: process.env.INTERVAL_SAVE || 3000,
  postgresCfg:
    process.env.DATABASE_URL ||
    'postgresql://mta_add_log:qazwsxedcrfv@localhost:5432/socket-io',
});
