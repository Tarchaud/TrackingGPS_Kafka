#!/bin/bash

# Attendre que Kafka soit prêt
while [ $(curl -s -o /dev/null -w %{http_code} http://localhost:9092) -eq 000 ]
do
  echo "Waiting for Kafka to be ready..."
  sleep 1
done

# Créer le topic
kafka-topics.sh --create --topic coordinates --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
