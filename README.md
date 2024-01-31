# Tracking GPS - Kafka

Le projet est un système de tracking GPS de plusieurs positions en utilisant Kafka.

L'application est faite en Angular pour le front-end, NodeJs pour le consumer/producer Kafka, Python pour l'api et utilise Postgres pour la base de donnée.
Le serveur est en nginx.


## Lancer le project 
```bash
# Pour lancer le projet en mode détaché
sudo docker-compose up -d
```
```bash
# Pour lancer le projet en mode attaché
sudo docker-compose up
```

Une fois le projet lancée, direction http://localhost:4200/ pour accéder au projet.

## Arreter le projet
```bash
# Pour arreter et supprimer les dockers
sudo docker-compose down
```
```bash
# Pour supprimer les images en même temps que les containers
sudo docker-compose down --rmi all
```
```bash
# Pour supprimer les volumes en même temps que les containers
sudo docker-compose down -v
```

## Structure Docker-compose

La stack est composée de 6 services :

## Partie Front

### Front-End :

Ce conteneur assure le fonctionnement du site web pour afficher les différentes positions des marqueurs sur la carte.
- **Build:** Le service est construit à partir du `Dockerfile` situés dans le répertoire `front/`.
- **Redémarrage:** Le service est configuré pour redémarrer toujours (`restart: always`).
- **Ports:** Le service expose le port 4200 sur l'hôte, qui est mappé sur le port 4200 du conteneur.

## Partie Back

### Kafka :

- **Build:** Le service est construit à partir de l'image Kafka disponible publiquement sur Docker Hub.
- **Ports:** Le service expose le port 9092 sur l'hôte, qui est mappé sur le port 9092 du conteneur.

### Database :

Gestion et stockage des données (Bdd Sql).
- **Image:** Le service utilise l'image Postgres disponible publiquement sur Docker Hub.
- **Ports:** Le service expose le port 5432 sur l'hôte, qui est mappé sur le port 5432 du conteneur.

### Api :

Utilise la bibliothèque fast-api pour créer nos endpoints de collecte de données.
- **Build:** Le service est construit à partir du `Dockerfile` situés dans le répertoire `./api`.
- **Ports:** Le service expose le port 8000 sur l'hôte, qui est mappé sur le port 8000 du conteneur.
  
### Producer :

Publie des messages contenant les données des marqueurs à destination des consumers.
- **Build:** Le service est construit à partir du `Dockerfile` situés dans le répertoire `./producer`.

### Consumer 1 & 2 :

Reçoit et traite les messages envoyés par le producer. Un consumer par marqueur.
- **Build:** Le service est construit à partir du `Dockerfile` situés dans le répertoire `./consumer`.

## Autre

### Networks :

- Un réseau appelé `TrackingNetwork` est défini pour permettre la communication entre les conteneurs des différents services.

### Volumes :

- Un volume nommé `kafka_data` est utilisé pour assurer la persistance des données du système.
