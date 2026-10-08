# English Progress

Une application d’apprentissage de l’anglais destinée aux francophones. Le contenu V1 est original, l’interface en français, et la progression est conservée dans le navigateur.

## Installation

Node.js 20+ et npm sont requis.

```bash
npm install
npm run dev
```

Pour compiler et prévisualiser la version de production : `npm run build`, puis `npm run start`.

## L’application

Choisissez un niveau depuis l’accueil ou `/cours`, démarrez une leçon et reprenez votre parcours. Les pages V1 couvrent le vocabulaire, les points de grammaire, des conversations, l’écoute, la prononciation, les quiz, un test de niveau, l’anglais professionnel et la progression. Les filtres, les réponses interactives, les flashcards, le XP et la mémorisation locale sont fonctionnels.

## Contenu et fichiers audio

`data/core.ts` contient les types, les niveaux, 100 mots A1 et les cours. `data/learning.ts` fournit le contenu de grammaire, dialogue, listening, quiz, prononciation et travail. Pour créer une leçon, ajouter un `Lesson` à `ALL_LESSONS` et ses mots aux données vocabulaire. Les audios déposés sous `public/audio/{vocabulary,lessons,conversations,listening,pronunciation,work}` ont une abstraction prête dans `src/services/audioService.ts`. Sans MP3, la Web Speech API anglaise du navigateur lit le texte.

## Organisation

- `src/pages-*.tsx` : vues et interactions.
- `src/layout.tsx`, `src/ui.tsx`, `src/icons/` : navigation, composants partagés et icônes SVG.
- `src/services/progressStore.ts` : stockage local de progression et gamification.
- `src/services/audioService.ts` : interface de lecture audio.
- `data/` : données pédagogiques typées.

## Déploiement

`npm run build` crée `dist/`. Hébergez ce dossier en configurant les routes vers `index.html`.

## Note d’environnement

Le workspace fourni était vide. Les paquets de Next.js et Lucide React ne sont pas disponibles hors ligne sur ce poste. Pour livrer une application qui peut s’exécuter avec l’outillage local disponible, cette V1 utilise React, TypeScript, Vite et un jeu d’icônes SVG interne. Les répertoires audio sont des emplacements de remplacement : aucun fichier audio n’est fourni.
