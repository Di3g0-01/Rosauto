const { Client } = require('pg');

const client = new Client({
  user: 'diego',
  password: 'diego1',
  host: 'localhost',
  port: 54933,
  database: 'postgres',
});

client.connect()
  .then(async () => {
    const res = await client.query('SELECT datname FROM pg_database;');
    console.log('Databases:', res.rows.map(r => r.datname).join(', '));
    client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });
