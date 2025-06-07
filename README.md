<!-- FILENAME: README.md -->
# Version: 1.7.0
# Date: 2025-06-07 14:30
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Documentation finale pour le cycle de vie des utilisateurs et la nouvelle structure de test.

# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect. Il fournit des fonctions pour le cycle de vie complet des objets "Avatar" (OF, Moules) et des Utilisateurs.

## Fonctionnalités

*   Authentification sécurisée auprès de l'API 360SmartConnect.
*   **Gestion des Avatars :**
    *   Création **spécialisée** de 5 objets "Avatar" liés pour un Ordre de Fabrication (OF).
    *   Création **générique** d'un objet "Avatar" unique (ex: "MOULE").
    *   Récupération de l'`mcUrl` pour chaque avatar créé.
*   **Gestion des Utilisateurs :**
    *   Création d'**utilisateurs**.
    *   Activation d'utilisateurs avec assignation de rôles.
    *   Désactivation d'utilisateurs.
*   **Intégration et Environnement :**
    *   Gestion des environnements DEV, TEST et PROD via un fichier de configuration centralisé.
    *   Wrappers de fonctions simplifiés pour une intégration facile avec AppSheet.
    *   Suite de tests complète pour valider chaque fonctionnalité en une seule exécution.

## Technologies Utilisées
<!-- Section inchangée -->

## Prérequis
<!-- Section inchangée -->

## Informations du Script Google Apps Script
<!-- Section inchangée -->

## Installation et Configuration Initiale
<!-- Section inchangée -->

## Structure des Fichiers

*   `Code.gs`: **Code de Production.** Contient uniquement les fonctions principales exposées (`creer...`, `activer...`, `desactiver...`) et leurs wrappers.
*   `tests.gs`: **Code de Test.** Contient toutes les fonctions de test (`maFonctionDeTestPour...`) et la suite de tests complète (`testSuiteComplete`).
*   `apiHandler.gs`: Logique bas niveau pour les appels à l'API 360sc (authentification, `POST` et `PUT`).
*   `config.gs`: Configurations spécifiques aux environnements (URLs, IDs API, mappings).
*   `utils.gs`: Fonctions utilitaires pour la gestion des identifiants API.
*   `rex.md`: Rapport des retours d'expérience du projet.
*   `appsscript.json`, `.clasp.json`, `.gitignore`, `README.md`...

## Fonctions Principales

### Création d'Avatars

1.  **`creerMultiplesObjets360sc(...)`**: Crée la structure OF complète.
2.  **`creerObjetUnique360sc(...)`**: Crée un seul objet Avatar (Moule, etc.).
3.  **`creerObjetUnique360scForAppSheet(...)`**: Wrapper pour AppSheet, retourne une URL ou une erreur.

### Gestion des Utilisateurs

4.  **`creerUtilisateur360sc(...)`**: Crée un nouvel utilisateur (par défaut `enabled: false`). Retourne l'objet utilisateur complet en JSON.
5.  **`creerUtilisateurEtRecupererId360sc(...)`**: Wrapper pour créer un utilisateur et retourner uniquement son ID numérique.
6.  **`activerUtilisateur360sc(typeSysteme, userData, roles)`**: Active un utilisateur (`enabled: true`) et lui assigne des rôles. **Requiert l'objet `userData` complet** (celui de `creerUtilisateur360sc`).
7.  **`desactiverUtilisateur360sc(typeSysteme, userData)`**: Désactive un utilisateur (`enabled: false`). **Requiert l'objet `userData` complet**.
8.  **`activerUtilisateur360scForAppSheet(...)`**: Wrapper pour AppSheet qui prend des paramètres simples (id, nom, email...) pour activer un utilisateur.

## Utilisation

### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet.
2.  **Stockez les identifiants API** (voir section "Installation").
3.  Ouvrez le fichier **`tests.gs`**.
4.  Pour une validation complète, sélectionnez et exécutez la fonction **`testSuiteComplete()`**.
5.  Pour un test ciblé, sélectionnez et exécutez une fonction de test individuelle (ex: `maFonctionDeTestPourActiverUtilisateur`).
6.  Consultez les logs (Affichage > Journaux).

## Workflow de Développement
<!-- Section mise à jour avec un nouveau message de commit en exemple -->
1.  Modifiez les fichiers de code (`.gs`).
2.  `clasp push`.
3.  Exécutez `testSuiteComplete()` depuis l'éditeur.
4.  Consultez les logs.
5.  Une fois satisfait, commitez et pushez sur GitHub avec des messages descriptifs :
    ```bash
    git add .
    git commit -m "Feat: Add comprehensive test suite" -m "Implemented a testSuiteComplete function to run all key scenarios. Refactored code by splitting tests into a dedicated tests.gs file."
    git push origin main
    ```

## Informations Importantes
<!-- Section inchangée -->

## Référence API 360SmartConnect
<!-- Section mise à jour avec les endpoints de mise à jour -->
*   **Documentation générale :** `https://apiv2.360sc.yt/api/docs#` (TEST/PROD), `https://apiv2preprod.360sc.yt/api/docs#` (DEV).
*   **Création utilisateur :** `POST https://api.360sc.yt/api/v2/users`
*   **Mise à jour utilisateur :** `PUT https://api.360sc.yt/api/v2/users/{userId}`
*   **Récupération utilisateur unique :** `GET /api/v2/users/{id}` n'est **PAS AUTORISÉ** (erreur 405).