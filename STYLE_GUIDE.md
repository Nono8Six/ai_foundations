# Guide de Style

Ce document résume les conventions appliquées dans le dépôt **AI Foundations**.

## TypeScript

- Mode `strict` activé
- Évitez `any`, `unknown` et `@ts-ignore`
- Composants React écrits sous forme de fonctions avec hooks

## Lint et formatage

- ESLint et Prettier font partie du Quality Gate
- Lancez `pnpm lint` avant de proposer une modification

## Messages de commit

- Utilisez la spécification [Conventional Commits](https://www.conventionalcommits.org/)
- Le type est optionnel mais le message doit contenir au moins trois caractères
