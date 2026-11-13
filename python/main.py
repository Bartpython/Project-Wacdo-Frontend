from fastapi import FastAPI # dans la bibliothèque FastAPI, importe l'outil FastAPI

app = FastAPI() #FastAPI() crée une nouvelle application web. Les parenthèses veulent dire « fabrique-moi une application web »
# app = ... range cette application dans une variable nommée app
# C’est ce nom app que tu donnes dans la commande de lancement :
#python -m uvicorn main:app --reload
#                   ↑    ↑
#     fichier main.py   variable app

#---------------

#@app.get("/") : le décorateur
#La ligne qui commence par @ s’appelle un décorateur. Elle s’accroche à la fonction juste en dessous et dit à l’API :

@app.get("/") # get("/") veut dire : lire à la racine de l'url , ("/")=(racine) c'est http://127.0.0.1:8000/
# le couple get(type de demande) et "/" (adresse) s'appelle une route

#---------------

# la fonction (def)
# read_root est le nom de la fonction ( comme une variable )
# () signifie paramètres de la fonction (vide ici)
# : est le décalage (l’indentation), pour que la suite soit dans la fonction
def read_root():
    # return renvoie une réponse au client (navigateur ou autre)
    # {"Hello": "World"} est un dictionnaire Python : des paires clé : "valeur". C’est l’équivalent d’un objet JavaScript.
    return {"Hello": "World"}
# FastAPI transforme automatiquement ce dictionnaire en JSON, qu'on peut le voir en texte dans le navigateur.

#---------------

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}