const kafka = require('kafka-node');
const pg = require('pg');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const consumer = new kafka.Consumer(client, [{ topic: 'coordinates' }]);

const pgClient = new pg.Client({
    user: 'myuser',
    password: 'mypassword',
    database: 'mydb',
    host: 'postgres',
    port: 5432
});

pgClient.connect();


consumer.on('message', async (message) => {
    console.log('Received message:', message);
    const data = JSON.parse(message.value);

    // Insertion des données dans PostgreSQL
    try {
        await pgClient.query(
        'INSERT INTO coordinates (ip, latitude, longitude) VALUES ($1, $2, $3)',
        [data.ip, data.latitude, data.longitude]
        );
        console.log('Data inserted into PostgreSQL');
    } catch (error) {
        console.error('Error inserting data into PostgreSQL:', error);
    }
});

consumer.on('error', (err) => {
    console.log('Error:', err);
});

consumer.on('offsetOutOfRange', (err) => {
    console.log('offsetOutOfRange:', err);
});



process.on('SIGINT', () => {
    consumer.close(true, () => {
        console.log('Consumer closed');
        pgClient.end();
        process.exit(0);
    });
});