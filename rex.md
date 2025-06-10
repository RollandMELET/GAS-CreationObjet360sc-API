# FILENAME: rex.md
# Version: 1.4.0
# Date: 2025-06-10 12:05
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Ajout du REX-008 sur l'architecture API multi-serveurs et le token universel.

# Rapport de Retour d'Expérience (REX) - Projet GAS-CreationObjet360sc-API

## REX Item 1: Spécificité des configurations par environnement
*   **Problème:** Échecs de requêtes API (erreurs 400/404) lors du passage entre environnements.
*   **Description:** Les IDs de ressources et certaines URLs de base de l'API sont uniques à chaque environnement (DEV, TEST, PROD) et n'étaient pas correctement ségrégués.
*   **Solution Appliquée:** Refactoring de `config.gs` pour isoler toutes les configurations par environnement.
*   **Leçons Apprises:** Toujours présumer que toutes les configurations sont uniques à un environnement. Valider systématiquement les hypothèses sur chaque environnement.

---

## REX Item 2: Gestion des identifiants et simplification pour AppSheet
*   **Problème:** Stockage non sécurisé des identifiants et retours de fonctions trop complexes pour AppSheet.
*   **Description:** Les identifiants n'étaient pas gérés par environnement et les fonctions retournaient des objets JSON complets.
*   **Solution Appliquée:** Utilisation de `PropertiesService` avec des clés préfixées par environnement et création de fonctions "wrapper" retournant des valeurs simples (ID, URL, "SUCCES").
*   **Leçons Apprises:** Adapter les interfaces aux consommateurs (simplicité pour AppSheet). Utiliser des clés distinctes par environnement pour les secrets.

---

## REX Item 3: Contraintes de l'API et agilité de conception
*   **Problème:** Une méthode HTTP attendue (`GET` sur un utilisateur) n'était pas autorisée par l'API (erreur 405).
*   **Description:** La stratégie de mise à jour "GET -> Modify -> PUT" était invalide.
*   **Solution Appliquée:** Modification de la logique pour que les fonctions d'activation/désactivation reçoivent l'objet utilisateur complet (obtenu à la création) et le modifient en mémoire avant le `PUT`.
*   **Leçons Apprises:** Toujours se fier au contrat réel de l'API, pas aux conventions. Lire attentivement les messages d'erreur.

---

## REX Item 4: Amélioration de la structure du projet et de la testabilité
*   **Problème:** Fichier `Code.gs` monolithique, mélangeant production et test, rendant la maintenance difficile.
*   **Description:** Le fichier principal dépassait 500 lignes et les logs de test manquaient de clarté.
*   **Solution Appliquée:** Scission du code en `Code.gs` (production) et `tests.gs` (tests). Création d'une suite de tests maîtresse `testSuiteComplete()`.
*   **Leçons Apprises:** La séparation des préoccupations (SoC) est fondamentale. L'observabilité des tests est une fonctionnalité. L'automatisation des tests est un gain de temps.

---

## REX Item 5: Simplification de la logique métier via le "Mapping"
*   **Problème:** AppSheet ne pouvait pas facilement fournir la liste de rôles techniques requise pour activer un utilisateur.
*   **Description:** L'intégration était fragile et exposait une logique complexe à l'application cliente.
*   **Solution Appliquée:** Création d'un `ROLE_MAPPING` dans `config.gs` et d'un wrapper `activerUtilisateurParProfil360sc` qui prend un simple nom de profil.
*   **Leçons Apprises:** Déplacer la logique métier dans la configuration la rend plus maintenable. Concevoir l'API pour simplifier la vie de son consommateur.

---

## REX Item 6: Erreurs de Validation du Manifest `appsscript.json`
*   **Problème:** Échecs successifs du déploiement via `clasp push` à cause d'un fichier `appsscript.json` invalide.
*   **Description:** L'ajout d'un en-tête de versioning en commentaire (`//`) ou l'utilisation de la clé dépréciée `fileOrder` a invalidé le fichier JSON pour le runtime V8.
*   **Solution Appliquée:** Correction du fichier `appsscript.json` pour être conforme au standard JSON strict (pas de commentaires) et au schéma V8 (pas de `fileOrder`).
*   **Leçons Apprises:** 1. Les fichiers `.json` doivent être stricts (pas de commentaires). 2. Toujours se référer à la documentation la plus récente du runtime (V8).

---

## REX Item 7: Validation des Réponses API et Robustesse des Tests
*   **Problème:** L'API de création d'utilisateurs sur l'environnement de TEST retournait un statut de succès (HTTP 201) mais avec un corps de réponse vide, causant des erreurs `TypeError` imprévues plus loin dans le code. De plus, la suite de tests ne rapportait pas ces erreurs correctement.
*   **Description:** 1. La fonction `creerUtilisateur360sc` faisait confiance au code de statut HTTP 201. 2. Les fonctions de test interceptaient les erreurs sans les propager, masquant les échecs.
*   **Impact:** Un bug latent dans le code de production et une suite de tests non fiable.
*   **Solution Appliquée:** 1. Modification du code pour ne plus se fier au corps de la réponse `POST`, et mise en place d'un contournement (`GET` par email) pour récupérer l'objet créé. 2. Modification des tests pour qu'ils lèvent (`throw`) une `Error` en cas d'échec, afin d'être correctement rapportés par la suite de tests.
*   **Leçons Apprises:** 1. Ne jamais faire confiance à un code de statut seul. 2. Les tests doivent être stricts et échouer bruyamment.

---

## REX Item 8: Découverte d'une Architecture API Éclatée (V1/V2)
*   **Problème:** Échecs persistants (404 Not Found, 400 Bad Request) sur les opérations utilisateurs, même en utilisant les bons chemins d'endpoints.
*   **Description:** Après une série de tests et d'erreurs, il a été découvert que l'API 360sc utilise une architecture multi-serveurs :
    1.  L'authentification et les opérations "Avatar" se font sur un serveur V2 (ex: `apiv2.360sc.yt`).
    2.  Les opérations "Utilisateur" se font sur un serveur V1 distinct (ex: `api.360sc.yt`).
    3.  Le token généré par le serveur V2 est universel et fonctionne sur le serveur V1.
*   **Impact:** Toutes les tentatives d'appel sur un seul serveur étaient vouées à l'échec. La compréhension de cette architecture était la clé du déblocage.
*   **Solution Appliquée:** 1. Le fichier `config.gs` a été enrichi pour contenir `API_BASE_URL` (V2) et `USERS_API_BASE_URL` (V1). 2. Les fonctions dans `apiHandler.gs` ont été mises à jour pour utiliser la bonne URL de base en fonction de l'opération. 3. La fonction d'authentification `getAuthToken_` a été fixée pour toujours s'exécuter sur le serveur V2 afin de générer le token universel.
*   **Leçons Apprises:** 1. Face à des erreurs persistantes et illogiques, envisager des hypothèses "hors du cadre", comme une architecture multi-domaines. 2. Une configuration centralisée et explicite (`config.gs`) est vitale pour gérer ce genre de complexité.