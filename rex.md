# FILENAME: rex.md
# Version: 1.2.0
# Date: 2025-06-08 16:30
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Ajout du REX-006 concernant les erreurs de validation du manifest appsscript.json.

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
*   **Problème:**
    Échecs successifs du déploiement via `clasp push` à cause d'un fichier `appsscript.json` invalide.
*   **Description:**
    Après le refactoring pour créer `users.gs`, le déploiement a échoué pour deux raisons :
    1.  **Erreur 1:** `Comments are not allowed in the script manifest file(s)`. L'ajout d'un en-tête de versioning en commentaire (`//`) a invalidé le fichier JSON.
    2.  **Erreur 2:** `Invalid manifest: unknown fields: [fileOrder]`. L'utilisation de la clé `fileOrder` est dépréciée et invalide pour les projets utilisant le runtime V8.
*   **Impact:**
    Bloquage complet du déploiement (`clasp push`), empêchant la validation du refactoring et interrompant le cycle de développement.
*   **Solution Appliquée:**
    La structure du fichier `appsscript.json` a été corrigée pour être conforme au standard JSON et au schéma de manifest moderne de Google Apps Script V8 en supprimant tous les commentaires et la clé `fileOrder` obsolète.
*   **Leçons Apprises:**
    1.  **Stricte conformité JSON :** Les fichiers `.json` ne doivent **jamais** contenir de commentaires.
    2.  **Spécificité du Runtime V8 :** La clé `fileOrder` est obsolète et ne doit plus être utilisée. Le runtime gère les dépendances implicitement. Toujours se référer à la documentation la plus récente.
    3.  **Validation précoce :** Utiliser un linter JSON dans VSCode peut permettre de détecter ces erreurs de syntaxe avant même la tentative de déploiement.

---