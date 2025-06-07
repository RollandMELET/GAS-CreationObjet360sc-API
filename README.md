# FILENAME: README.md
# Version: 1.8.0
# Date: 2025-06-08 16:30
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Mise à jour majeure pour refléter le refactoring de la gestion utilisateur dans users.gs et clarifier la structure du projet.

# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect. Il fournit des fonctions pour le cycle de vie complet des objets "Avatar" (OF, Moules) et des Utilisateurs.

## Fonctionnalités

*   Authentification sécurisée auprès de l'API 360SmartConnect.
*   **Gestion des Avatars :**
    *   Création **spécialisée** de structures d'objets complexes (ex: OF).
    *   Création **générique** d'objets uniques (ex: Moule).
*   **Gestion des Utilisateurs :**
    *   Cycle de vie complet : Créer, Activer (avec attribution de rôles via un mapping de profils), et Désactiver.
*   **Intégration et Environnement :**
    *   Gestion des environnements DEV, TEST et PROD.
    *   Wrappers de fonctions simplifiés pour une intégration facile avec AppSheet.
    *   Suite de tests complète pour valider chaque fonctionnalité.

## Installation et Déploiement

### Prérequis
1.  Avoir [Node.js](https://nodejs.org/) installé.
2.  Avoir installé et configuré `clasp`, l'outil en ligne de commande de Google Apps Script :
    ```sh
    npm install -g @google/clasp
    ```
3.  S'être authentifié avec `clasp`:
    ```sh
    clasp login
    ```

### Déploiement des Modifications
1.  Après avoir modifié des fichiers localement dans VSCode, poussez les changements vers votre projet Google Apps Script :
    ```sh
    clasp push
    ```

## Structure des Fichiers et Rôles

*   `appsscript.json`: **Manifest du projet.** Définit les paramètres essentiels comme la timezone et la version du runtime.
*   `config.gs`: **Configuration centrale.** Contient les URLs, les IDs spécifiques à chaque environnement, et les mappings de rôles.
*   `utils.gs`: **Fonctions utilitaires.** Gère le cache et l'accès sécurisé aux identifiants via `PropertiesService`.
*   `apiHandler.gs`: **Couche de communication API.** Gère l'authentification et l'envoi des requêtes (`UrlFetchApp`).
*   `users.gs`: **Module de gestion des utilisateurs.** Contient toute la logique métier et les wrappers pour le cycle de vie des utilisateurs.
*   `Code.gs`: **Module de gestion des Avatars.** Contient les fonctions principales pour la création d'objets (OF, Moules) et leurs wrappers.
*   `tests.gs`: **Suite de tests.** Contient toutes les fonctions de test et la fonction maîtresse `testSuiteComplete()` pour la validation post-déploiement.
*   `rex.md`: **Retour d'Expérience.** Documente les problèmes, solutions et leçons apprises.

## Workflow de Développement et Test

1.  Modifiez le code localement dans VSCode.
2.  Poussez les changements sur Google Apps Script : `clasp push`.
3.  Ouvrez le projet dans l'éditeur en ligne : `clasp open`.
4.  Dans l'éditeur, sélectionnez la fonction `testSuiteComplete` et cliquez sur **Exécuter**.
5.  Consultez les journaux (`Afficher > Journaux`) pour valider que tous les tests passent.
6.  Une fois satisfait, commitez et poussez sur GitHub avec un message descriptif :
    ```bash
    git add .
    git commit -m "Refactor: Extract user management logic into users.gs" -m "Moved all user-related functions from Code.gs to a new dedicated users.gs module to improve separation of concerns. Updated appsscript.json to the modern V8 format."
    git push origin main
    ```