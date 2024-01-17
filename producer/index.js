const kafka = require('kafka-node');
const config = require('config');

const client = new kafka.KafkaClient({ kafkaHost: 'kafka:9092' });
const producer = new kafka.Producer(client);
const topic = 'coordinates';


producer.on('ready', () => {
  console.log('Producer is ready');
    // Fonction pour générer des coordonnées GPS aléatoires avec déplacement simulé
  const generateCoordinatesWithMovement = (currentCoordinates) => {
    const newLatitude = currentCoordinates.latitude + (Math.random() - 0.5) * 0.002; // Changement aléatoire dans la latitude
    const newLongitude = currentCoordinates.longitude + (Math.random() - 0.5) * 0.002; // Changement aléatoire dans la longitude
  
    return {
      latitude: parseFloat(newLatitude.toFixed(6)),
      longitude: parseFloat(newLongitude.toFixed(6))
    };
  };
  
  // Coordonnées de départ (par exemple, une localisation initiale)
  let currentLocation = { latitude: config.get("latitude"), longitude: config.get("longitude") };
  
  // Envoi de coordonnées GPS avec déplacement simulé au topic Kafka
  const sendCoordinates = () => {
    const newCoordinates = generateCoordinatesWithMovement(currentLocation);
    const message = { ip : config.get("ip"), ...newCoordinates};
  
    const payloads = [
      {
        topic: topic,
        messages: JSON.stringify(message)
      }
    ];
  
    producer.send(payloads, (error, data) => {
      if (error) {
        console.error('Erreur lors de l\'envoi des coordonnées:', error);
      } else {
        console.log(`Coordonnées envoyées : ${JSON.stringify(newCoordinates)}`);
        currentLocation = newCoordinates; // Mise à jour des coordonnées actuelles
      }
    });
  };
  
  // Envoi de coordonnées GPS à intervalles réguliers
  setInterval(sendCoordinates, 1000); // Envoi toutes les secondes 1000
});


producer.on('error', (err) => {
    console.log('Producer is in error state');
    console.log(err);
});