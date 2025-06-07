<!-- FILENAME: README.md -->
# Version: 1.6.0
# Date: 2025-06-07 13:30
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Ajout des fonctionnalités d'activation/désactivation des utilisateurs et mise à jour complète de la documentation.

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
    *   Suite de fonctions de test complètes pour valider chaque fonctionnalité.

## Technologies Utilisées

*   Google Apps Script (Runtime V8)
*   API 360SmartConnect (REST)
*   `clasp` (pour le développement local et le déploiement)
*   Git (pour le versioning)

## Prérequis
<!-- Section inchangée -->

## Informations du Script Google Apps Script
<!-- Section inchangée -->

## Installation et Configuration Initiale
<!-- Section inchangée -->

## Structure des Fichiers

*   `appsscript.json`: Manifeste du projet.
*   `Code.gs`: Contient les fonctions principales exposées (`creer...`, `activer...`, `desactiver...`) et les wrappers de test.
*   `apiHandler.gs`: Contient la logique bas niveau pour les appels à l'API 360sc (authentification, `POST` et `PUT`).
*   `config.gs`: Contient les configurations spécifiques aux environnements (URLs, IDs API, mappings).
*   `utils.gs`: Contient des fonctions utilitaires pour la gestion des identifiants API.
*   `rex.md`: Rapport des retours d'expérience du projet.
*   `.clasp.json`, `.gitignore`, `README.md`...

## Fonctions Principales

### Création d'Avatars

1.  **`creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet)`**
    *   **RÔLE : [SPÉCIALISÉE-OF]** Crée la structure complète des **5 objets liés** pour un **Ordre de Fabrication (OF)**.
    *   **Retourne :** Une **chaîne JSON** avec les 5 URLs ou un objet d'erreur.

2.  **`creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule)`**
    *   **RÔLE : [GÉNÉRIQUE-AVATAR]** Crée un **seul objet Avatar** (ex: "MOULE").
    *   **Retourne :** Une **chaîne JSON** avec les détails de l'avatar (`mcUrl`, `@id`, etc.).

3.  **`creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule)`**
    *   **RÔLE : [APPSHEET-HELPER-AVATAR]** Wrapper simplifié pour créer un Avatar depuis AppSheet.
    *   **Retourne :** Une **chaîne de caractères** (l'URL `mcUrl` ou un message d'erreur).

### Gestion des Utilisateurs

4.  **`creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags)`**
    *   **RÔLE : [CRÉATION-UTILISATEUR]** Crée un nouvel utilisateur (par défaut, il est créé avec `enabled: false`).
    *   **Retourne :** Une **chaîne JSON** contenant l'objet utilisateur complet tel que retourné par l'API.

5.  **`creerUtilisateurEtRecupererId360sc(...)`**
    *   **RÔLE : [APPSHEET-HELPER-ID]** Wrapper pour créer un utilisateur et retourner uniquement son ID numérique.
    *   **Retourne :** Une **chaîne de caractères** (l'ID numérique ou un message d'erreur).

6.  **`activerUtilisateur360sc(typeSysteme, userData, roles)`**
    *   **RÔLE : [ACTIVATION-UTILISATEUR]** Met à jour un utilisateur pour le rendre actif (`enabled: true`) et lui assigner des rôles.
    *   **Paramètres :**
        *   `userData` (Object) : L'objet utilisateur complet (idéalement celui retourné par `creerUtilisateur360sc`).
        *   `roles` (Array) : Un tableau de chaînes de caractères pour les rôles (ex: `["ROLE_USER"]`).
    *   **Retourne :** Une **chaîne JSON** avec l'objet utilisateur mis à jour.

7.  **`desactiverUtilisateur360sc(typeSysteme, userData)`**
    *   **RÔLE : [DÉSACTIVATION-UTILISATEUR]** Met à jour un utilisateur pour le rendre inactif (`enabled: false`).
    *   **Paramètres :**
        *   `userData` (Object) : L'objet utilisateur complet.
    *   **Retourne :** Une **chaîne JSON** avec l'objet utilisateur mis à jour.

## Utilisation
<!-- Section mise à jour pour inclure les nouveaux tests -->
### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet.
2.  **Stockez les identifiants API** (voir section "Installation").
3.  Sélectionnez une des fonctions de test dédiées :
    *   `maFonctionDeTestPourCreerMultiples_SUCCES`
    *   `maFonctionDeTestPourCreerObjetUnique`
    *   `maFonctionDeTestPourCreerUtilisateur`
    *   `maFonctionDeTestPourCreerUtilisateurEtRecupererId`
    *   `maFonctionDeTestPourActiverUtilisateur`
    *   `maFonctionDeTestPourDesactiverUtilisateur`
4.  Cliquez sur "Exécuter" et consultez les logs.

## Workflow de Développement
<!-- Section mise à jour avec un nouveau message de commit en exemple -->
1.  Modifiez localement.
2.  `clasp push`.
3.  Testez depuis l'éditeur.
4.  Consultez les logs.
5.  Commitez et pushez sur GitHub avec des messages descriptifs :
    ```bash
    git add .
    git commit -m "Feat: Add user activation and deactivation features" -m "Implemented functions to enable and disable users via API PUT requests. Refactored logic to build payloads directly, bypassing the unsupported GET method. Added comprehensive tests for the full user lifecycle."
    git push origin main
    ```

## Informations Importantes
<!-- Section inchangée -->

## Référence API 360SmartConnect
<!-- Section mise à jour avec les endpoints de mise à jour -->
*   **Documentation générale :** `https://apiv2.360sc.yt/api/docs#` (pour TEST/PROD) ou `https://apiv2preprod.360sc.yt/api/docs#` (pour DEV).
*   **Création utilisateur :** `POST https://api.360sc.yt/api/v2/users`
*   **Mise à jour utilisateur (activation/désactivation) :** `PUT https://api.360sc.yt/api/v2/users/{userId}`
*   Il est crucial de valider les URLs et les méthodes HTTP pour chaque environnement.