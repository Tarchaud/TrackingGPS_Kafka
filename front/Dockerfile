# Utilisation de l'image Node.js
FROM node:20.9.0-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json
COPY . .

RUN npm install

# Exposez le port de l'application si nécessaire
EXPOSE 4200

# Fournissez npm start comme arguments par défaut à la commande de base
CMD npm start
