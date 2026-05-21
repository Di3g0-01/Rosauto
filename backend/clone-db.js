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
    try {
      // Create a new database without spaces
      await client.query('CREATE DATABASE sistema_vehiculos WITH TEMPLATE "Proyecto Diego Ovalle ";');
      console.log('Successfully cloned database to sistema_vehiculos');
    } catch (e) {
      if (e.message.includes('already exists')) {
         console.log('Database sistema_vehiculos already exists');
      } else if (e.message.includes('accessed by other users')) {
         console.log('Cannot clone because DataGrip is connected. Please close DataGrip connections to that DB.');
      } else {
         console.error('Error:', e.message);
      }
    }
    client.end();
  })
  .catch(err => {
    console.error('Connection error', err.stack);
  });
