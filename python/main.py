# Dans la bibliothèque FastAPI, importe l'outil FastAPI
from fastapi import FastAPI

# Dans la bibliothèque Pydantic, importe BaseModel pour définir des modèles de données
from pydantic import BaseModel

# ---------------

app = FastAPI()  # FastAPI() crée une nouvelle application web. Les parenthèses veulent dire « fabrique-moi une application web »
# app = ... range cette application dans une variable nommée app
# C’est ce nom app que tu donnes dans la commande de lancement :
# python -m uvicorn main:app --reload
#                   ↑    ↑
#     fichier main.py   variable app


class Item(
    BaseModel
):  # Modèle de données pour un article de l'API ( item de ce cas d'utilisation)
    name: str
    price: float
    image: str | None = None


# ---------------

# @app.get("/") : le décorateur
# La ligne qui commence par @ s’appelle un décorateur. Elle s’accroche à la fonction juste en dessous et dit à l’API :


@app.get(
    "/"
)  # get("/") veut dire : lire à la racine de l'url , ("/")=(racine) c'est http://127.0.0.1:8000/
# le couple get(type de demande) et "/" (adresse) s'appelle une route

# ---------------

# la fonction (def)
# read_root est le nom de la fonction ( comme une variable )
# () signifie paramètres de la fonction (vide ici)
# : est le décalage (l’indentation), pour que la suite soit dans la fonction
def read_root():
    # return renvoie une réponse au client (navigateur ou autre)
    # {"Hello": "World"} est un dictionnaire Python : des paires clé : "valeur". C’est l’équivalent d’un objet JavaScript.
    return {"Hello": "World"}


# FastAPI transforme automatiquement ce dictionnaire en JSON, qu'on peut le voir en texte dans le navigateur.

# ---------------


@app.get(
    "/items/{item_id}"
)  # "/items/{item_id}" : Les accolades {item_id} indiquent un emplacement variable.
def read_item(
    item_id: int, q: str | None = None
):  # item_id: int : le type / int: nombre entier
    # q: str | None = None : paramètre optionnel / str: chaîne de caractères / None: valeur par défaut si non fourni
    # Celui-ci n’apparaît pas entre accolades dans l’adresse. FastAPI le cherche donc après un point d’interrogation ? dans l’URL.
    # On appelle ça un paramètre de requête (query parameter, d’où le nom q).

    return {"item_id": item_id, "q": q}
    # La fonction renvoie simplement ce qu’elle a reçu. À gauche des deux-points,
    # les clés "item_id" et "q" sont des textes fixes (avec des guillemets).
    # À droite, les variables contiennent les valeurs reçues.


# ---------------
# Ce qui se passe quand tu tapes une adresse dans le navigateur:
#
# Navigateur : GET http://127.0.0.1:8000/items/5?q=test
#      ↓
# FastAPI : « /items/{item_id} correspond, j'appelle read_item »
#      ↓
# read_item(item_id=5, q="test")
#      ↓
# return {"item_id": 5, "q": "test"}
#      ↓
# FastAPI transforme le dictionnaire en JSON et le renvoie
#      ↓
# Navigateur affiche : {"item_id":5,"q":"test"}
# ---------------

# on peut test l'api avec http://127.0.0.1:8000/docs
# Cela ouvre une interface interactive où tu peux essayer les différentes routes de l'API.

#----------------

# Liste qui garde les articles reçus
items = []


# Route POST : ajouter un article à la liste
@app.post("/items/")
def create_item(item: Item) -> Item:
    items.append(item)  # ajoute l'article à la liste
    return item


# Route GET : afficher tous les articles
@app.get("/items/")
def list_items() -> list[Item]:
    return items

# (item: Item) : le paramètre
# item, en minuscule, est le nom de la variable qui va recevoir les données
# Item, avec une majuscule, est le type, c’est-à-dire ton moule Pydantic class Item(BaseModel)
# C’est la même logique que item_id: int, sauf qu’au lieu d’un simple nombre, on attend un objet complet qui a la forme de Item.

# Test Dans http://127.0.0.1:8000/docs#/ ,POST /items/ de l'API, clique sur "Try it out" et remplis les champs.
# ensuite sur http://127.0.0.1:8000/items/ : on voit la liste en JSON.