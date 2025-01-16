# Chatbot Client

Une application de chat interactive construite avec React et TypeScript, utilisant React Router pour la gestion des routes et la gestion de l'état, ainsi que TailwindCSS pour le style. Mistral AI fournit les réponses du chatbot.

## Description

Cette application présente une interface minimaliste standard . Elle offre les fonctionnalités suivantes :

- 💾 Persistance locale de la conversation
- 👀 Scroll automatique vers le bas de la conversation
- 🔄 Réinitialisation de la conversation

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/coldPen/chatbot-client.git
cd chatbot-client
```

2. Installez les dépendances :

```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet et ajoutez-y la clé d'API fournie par Mistral AI :

```bash
MISTRAL_API_KEY=YOUR_API_KEY
```

## Développement

Pour lancer le serveur de développement avec Hot Module Replacement (HMR) :

```bash
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:5173`.

## Production

Pour créer une version de production :

```bash
npm run build
```

## Technologies utilisées

- React
- TypeScript
- Zod
- React Router
- Vite
- TailwindCSS
- shadcn/ui & shadcn-chat
- Lucide Icons
- Client TypeScript Mistral AI

## Notes de développement

- Je fais en sorte d'organiser le projet selon les principes de l'architecture hexagonale.
- L'application utilise le framework React-Router de façon [maximale](https://reactrouter.com/home#react-router-as-a-framework).
- L'application utilise la très simple librairie `node-persist` pour persister les conversations.
- Le choix du SSR a pour bénéfice de réduire le besoin en gestion d'état dans les composants React.
- L'application est plus globalement modulaire, permettant par exemple d'envisager de remplacer Mistral AI avec une API concurrente.
- Les composants UI, issus de `shadcn/ui` et `shadcn-chat` choisis pour leur design, leur fonctionnalité et leur compatibilité avec TailwindCSS, sont construits de manière modulaire pour faciliter la réutilisation et l'extensibilité.

## Idées d'améliorations

- Ajouter des tests unitaires et d'intégration
- Ajouter un historique des conversations
- Remplacer `node-persist` par une solution plus robuste
- Ajouter l'authentification

## Idées d'expérimentations

- Ajouter des adaptateurs alternatifs pour le stockage, la complétion des conversations...
- ...voire la présentation (Next.js en plus de React-Router, ou même SvelteKit ou Analog.js), je me demande comment réorganiser le dépôt pour rendre cela possible.
