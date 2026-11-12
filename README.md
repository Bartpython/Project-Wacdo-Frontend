# Wacdo – Borne de commande

Borne de commande en ligne pour le restaurant **Wacdo** : le client choisit s'il mange sur place ou à emporter, compose sa commande (menus, burgers, boissons, desserts…), vérifie son panier puis valide sa commande.

Version en ligne : [https://bartpc.alwaysdata.net]
fichier JSON accessible en ligne :
[https://bartpc.alwaysdata.net/data/produits.json]
[https://bartpc.alwaysdata.net/data/categories.json]

Mise en ligne via SSH (à la place du FTP), avec la commande scp dans PowerShell.

## Objectif du projet

Réaliser l'interface d'une borne de commande à partir d'une maquette Figma, en :

- affichant les produits et catégories à partir de fichiers JSON;
- gérant un panier en JavaScript;
- envoyant la commande à une API (fictive) avec une requête AJAX (fetch);
- rendant le site responsive (du téléphone aux écrans 2K / 4K) et accessible.

## Fonctionnement

### 1. Page d'accueil (`index.html`)

- Le client choisit **« Sur place »** ou **« À emporter »**.
- « Sur place », il doit saisir le numéro de son chevalet.
- Le choix est enregistré dans le `sessionStorage`, puis le client est redirigé vers la page de choix des menus et produits.

### 2. Page de choix des menus et produits (`choix-menu.html`)

- **Liste des catégories** (Menus, Sandwichs, Wraps, Frites, Boissons, Encas, Desserts…) avec flèches gauche, droite et slider
- Un clic sur une catégorie affiche ses produits (chargés depuis les fichiers JSON).
- **Menus** : le client est guidé par des fenêtres (overlays) en 3 étapes :
  1. la taille du menu ;
  2. l'accompagnement ;
  3. la boisson (liste de boissons avec flèches et slider)
- **Boissons seules** : choix de la taille (30 cl ou 50 cl) et de la quantité.
- **Les autres produits** (burgers, frites, encas, desserts…) : un seul clic les ajoutes au panier.

### 3. Le panier

- Affiche le numéro de commande (généré automatiquement et remis à zéro à minuit) et le mode « Sur place ou À emporter ».
- Affiche le numéro de son chevalet saisie.
- Liste tous les articles avec leurs quantités, leurs prix
- Chaque article peut être supprimé (icône poubelle).
- Additionne tous les articles et affiche le `Total (ttc)`
- Bouton **Abandon** : vide la commande (après pop-up de confirmation).
- Bouton **Payer** : crée un objet commande (numéro, date, mode, chevalet, produits, total) et l'envoie avec `fetch` (méthode `POST`) à une API fictive(https://jsonplaceholder.typicode.com). Un message de succès ou d'erreur s'affiche, puis un récapitulatif de la commande est généré.

## Technologies utilisées

**HTML5** structure des pages, balises sémantiques, formulaires de saisies
**CSS3** mise en page (Flexbox), variables CSS, @media (responsive), clamp()
**JavaScript (ES6)** manipulation du DOM, overlays, gestion du panier, sessionStorage
**JSON** données des produits et catégories (dossier `data/)
**AJAX (fetch)** chargement des fichiers JSON (GET) et envoi de la commande (POST)
**WebP** images optimisées, plus légères que le PNG

**Outils :** Figma (maquette), Visual Studio Code, Copilot, Live Server, GitHub Desktop, Claude, Validateur HTML et CSS, WAVE, Inspecteur web (Elements, Network, Application Lighthouse), MinifyAll, Alwaysdata (hébergement).

## Structure du projet

─ index.html page d'accueil (sur place / à emporter, chevalet)
─ choix-menu.html page des catégories, des produits et du panier
─ css/ feuilles de style
─ js/ scripts JavaScript
─ asset/ images
─ data/ fichiers JSON
─ dist/ version minifiée et mise en ligne
─ README.md

## Accessibilité et responsive

- Textes alternatifs (`alt`) adaptés sur les images.
- Étiquettes (`aria-label`) sur les champs du numéro de chevalet.
- Titres (`h1`, `h2`) pour structurer les pages.
- Vérifications avec **WAVE** et **Lighthouse**.
- Mise en page adaptée aux écrans de moins de 1440 px (portable, tablette, téléphone) et de plus de 1440 px (Full HD, 2K, 4K).
