# Portfolio Admin Dashboard

Interface d'administration pour gérer le contenu du portfolio de Jean-Baptiste Mensah.

## Stack

- **Vite** + **React 18**
- **Tailwind CSS** (thème violet `#c770f0`)
- **Axios** pour les appels API
- **React Router v6**

## Fonctionnalités

- 🔐 Authentification (email / mot de passe via le backend)
- 📝 Gestion des articles (CRUD + éditeur de blocs : TEXT, CODE, IMAGE, VIDEO, QUOTE, DIVIDER)
- 💼 Gestion des projets (CRUD)
- 📧 Gestion des abonnés newsletter (liste + désabonnement)

## Prérequis

- Node.js 18+
- Le backend `portfolio-backend` doit tourner sur `http://localhost:8080`

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8080
```

## Développement

```bash
npm run dev
# → http://localhost:5173
```

## Build production

```bash
npm run build
```

## Variables d'environnement (production)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL du backend Spring Boot |

## Connexion au backend

Le dashboard s'authentifie via `POST /api/auth/login` et reçoit l'API key en retour.
Toutes les requêtes protégées envoient cette clé dans l'en-tête `X-API-Key`.
