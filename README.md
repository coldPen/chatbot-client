# Fake Chatbot

Une application de chat interactive construite avec React et TypeScript, utilisant React Router pour la gestion des routes et la gestion de l'état, ainsi que TailwindCSS pour le style.

## Description

Cette application est un chatbot qui simule une conversation avec des mocks simples, à travers une interface standard. Elle offre les fonctionnalités suivantes :

- 🤖 Simulateur de conversation basée sur des déclencheurs de mots-clés dans le message de l’utilisateur
- 💾 Persistance locale de la conversation
- 👀 Scroll automatique vers le bas de la conversation
- 🔄 Réinitialisation de la conversation

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/coldPen/digitalkin-frontend-test.git
cd digitalkin-frontend-test
```

2. Installez les dépendances :

```bash
npm install
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

## Structure du projet

```
├── app/
│   ├── routes/          # Routes de l'application
│   ├── components/      # Composants réutilisables
│   ├── lib/             # Utilitaires et fonctions helpers
│   ├── domain/          # Modèles et types métier
│   └── services/        # Services (stockage, chat)
└── public/             # Assets statiques
```

## Notes de développement

- L'application utilise le stockage local via `clientLoader` et `clientAction` pour persister les conversations. Elle simule ainsi l'interaction avec un backend alors qu'il s'agit d'une SPA.
- Cette décision a pour bénéfice de réduire le besoin en gestion d'état dans les composants React.
- Si le choix d'utilisation d'un backend est envisagé ultérieurement, il serait possible de le faire en réactivant le SSR et modifiant la couche de persistence en utilisant `loader`et `action`.
- L'application est plus globalement modulaire, permettant par exemple d'envisager de remplacer le mock de chat par une communication avec un vraie API de chat IA. (`generateBotResponse` ne prend que le dernier message de l'utilisateur en compte cependant, alors qu'une API a besoin du contexte complet de la conversation.)
- Les composants UI, issus de shadcn/ui et shadcn-chat choisis pour leur design, leur fonctionnalité et leur compatibilité avec TailwindCSS, sont construits de manière modulaire pour faciliter la réutilisation et l'extensibilité.
