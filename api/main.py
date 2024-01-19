
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import asyncpg
import asyncio
from fastapi.websockets import WebSocketDisconnect
import json

app = FastAPI()

# Variables de configuration de la base de données
DATABASE_USER = 'myuser'
DATABASE_PASSWORD = 'mypassword'
DATABASE_NAME = 'mydb'
DATABASE_HOST = 'postgres'

# Connexion à la base de données
async def connect_to_db():
    return await asyncpg.connect(
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        database=DATABASE_NAME,
        host=DATABASE_HOST
    )

# Stocke les connexions WebSocket actives
websocket_connections = []

# Envoie des mises à jour aux clients WebSocket
async def send_updates():
    try:
        while True:
            conn = await connect_to_db()
            records = await conn.fetch('SELECT DISTINCT ON (ip) id, ip, latitude, longitude FROM coordinates ORDER BY ip, id DESC')
            await conn.close()
            
            coordinates = [dict(record) for record in records]
            
            for websocket in websocket_connections:
                try:
                    await websocket.send_text(json.dumps(coordinates))
                    print("Sent update to client")
                except WebSocketDisconnect:
                    websocket_connections.remove(websocket)
                    break  # Sortir de la boucle pour éviter les problèmes après la déconnexion
            
            await asyncio.sleep(1)
    except Exception as e:
        print("Error sending updates:", e)


# Route pour la page WebSocket
@app.websocket("/ws_coordinates")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.append(websocket)
    try:
        while True:
            await asyncio.sleep(1)  # Garder la connexion WebSocket active
    except WebSocketDisconnect:
        websocket_connections.remove(websocket)

# Lancer la tâche pour envoyer des mises à jour aux clients WebSocket
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(send_updates())
