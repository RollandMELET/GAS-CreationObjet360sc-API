<!-- FILENAME: README.md -->
# Version: 1.3.1
# Date: 2025-06-06 11:20
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Clarification du rôle des fonctions. creerMultiplesObjets360sc est exclusivement pour les OF.

# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect pour créer des objets "Avatar". Il fournit deux fonctions principales : une pour la création spécialisée et en masse d'une structure d'Ordre de Fabrication (OF), et une autre pour la création générique d'objets uniques (ex: Moule).

## Fonctionnalités

*   Authentification sécurisée auprès de l'API 360SmartConnect (identifiants stockés dans `PropertiesService` par environnement).
*   Création **spécialisée** de 5 objets "Avatar" liés pour un OF.
*   Création **générique** d'un objet "Avatar" unique pour tout autre cas (ex: "MOULE").
*   Récupération de l'`mcUrl` pour chaque avatar créé.
*   Gestion des environnements DEV, TEST et PROD via un fichier de configuration.
*   Structure de retour JSON plate et standardisée pour faciliter l'intégration avec AppSheet.
*   Fonctions de test pour valider les étapes individuelles et les scénarios de succès/erreur.
*   Conçu pour être appelé depuis une application Google AppSheet via `google.script.run`.

## Technologies Utilisées

*   Google Apps Script (Runtime V8)
*   API 360SmartConnect (REST)
*   `clasp` (pour le développement local et le déploiement)
*   Git (pour le versioning)
*   Visual Studio Code (comme IDE recommandé)

## Prérequis

1.  **Compte Google**.
2.  **Accès et identifiants pour l'API 360SmartConnect** (username, password) pour chaque environnement (DEV, TEST, PROD).
3.  **Informations de configuration API :** URL de base, ID de compagnie, et ID Finger pour DEV, TEST, PROD (à configurer dans `config.gs`).
4.  **Node.js et npm** installés localement (pour installer et utiliser `clasp`).
5.  **`clasp`** installé globalement : `sudo npm install -g @google/clasp`.
6.  **Git** installé localement.

## Informations du Script Google Apps Script

*   **Nom du Script Google Apps Script :** `GAS-CreationObjet360sc-API`
*   **URL du Script dans l'éditeur Google Apps Script :** `https://script.google.com/home/projects/142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn/edit`
*   **Script ID (depuis `.clasp.json`) :** `142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn`

## Installation et Configuration Initiale

(Les étapes restent inchangées, assurez-vous de suivre attentivement l'étape 6 pour les identifiants)
<!-- Le reste de cette section est identique à la version précédente -->

## Structure des Fichiers

*   `appsscript.json`: Manifeste du projet Apps Script.
*   `Code.gs`: Contient les fonctions principales (`creerMultiplesObjets360sc`, `creerObjetUnique360sc`) exposées à AppSheet, ainsi que les wrappers de test.
*   `apiHandler.gs`: Contient la logique bas niveau pour les appels à l'API 360sc.
*   `config.gs`: Contient les configurations spécifiques aux environnements et les définitions des objets/types.
*   `utils.gs`: Contient des fonctions utilitaires, notamment pour gérer le stockage des identifiants API.
*   `.clasp.json`: Configuration de `clasp`.
*   `.gitignore`: Spécifie les fichiers à ignorer par Git.
*   `README.md`: Ce fichier.

## Fonctions Principales

Il y a deux fonctions principales exposées, chacune avec un rôle bien défini :

### 1. `creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet)`
   *   **RÔLE : [SPÉCIALISÉE]** Crée la structure complète des **5 objets liés** pour un **Ordre de Fabrication (OF)**.
   *   **USAGE EXCLUSIF :** Cette fonction ne doit **JAMAIS** être utilisée pour un type autre que "OF". Le script retournera une erreur si un autre type est fourni.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour les objets OF (ex: "MonOF123"). Requis.
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`. Requis.
        *   `typeObjet` (String) : **Doit être `"OF"`** ou laissé vide/null.
   *   **Retourne :** Une **chaîne JSON** avec les 5 URLs (`PAC_360scID`, `PAC_360scID_ENV`, etc.) en cas de succès.

### 2. `creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, alphaIdSpecifique)`
   *   **RÔLE : [GÉNÉRIQUE]** Crée un **seul objet** de n'importe quel type (ex: "MOULE", ou même un composant "OF" individuel).
   *   **USAGE :** C'est la fonction à utiliser pour tous les cas qui ne sont pas la création complète d'un OF. Par exemple, pour créer un objet `MOULE_CORPS`.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour l'objet (ex: "MonMouleXYZ"). Requis.
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`. Requis.
        *   `typeObjet` (String) : Type d'objet à créer, ex: `"MOULE"`. Utilisé pour déterminer les métadonnées de l'objet.
        *   `alphaIdSpecifique` (String) : L'`alphaId` exact à utiliser (ex: `"v0:MOULE_CORPS"`). Requis.
   *   **Retourne :** Une **chaîne JSON** avec l'URL unique (`mcUrl`) de l'objet créé.

## Utilisation

### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet.
2.  **Stockez les identifiants API** pour chaque environnement.
3.  Sélectionnez une des fonctions wrapper de test (ex: `maFonctionDeTestPourCreerMultiples_DEV_OF` ou `maFonctionDeTestPourCreerObjetUnique`).
4.  Cliquez sur "Exécuter" et consultez les logs.

### Depuis AppSheet
1.  Configurez une action ou un automatisme.
2.  Utilisez `google.script.run` en appelant la fonction appropriée à votre besoin :
    *   Pour créer un OF complet : `creerMultiplesObjets360sc(...)`
    *   Pour créer un objet unique (Moule, etc.) : `creerObjetUnique360sc(...)`

    ```javascript
    // Exemple conceptuel pour la création d'un OBJET UNIQUE (Moule)
    google.script.run
      .withSuccessHandler(function(resultString) {
        var resultat = JSON.parse(resultString);
        if (resultat.success) {
          // [Url_Moule] = resultat.mcUrl;
        } else {
          // [Log_Erreur] = "Erreur Script: " + resultat.error;
        }
      })
      .creerObjetUnique360sc(votreNomMoule, votreTypeSysteme, "MOULE", votreAlphaIdMoule);
    ```

## Workflow de Développement

1.  Modifiez localement.
2.  `clasp push`.
3.  Testez depuis l'éditeur.
4.  Git (add, commit, push) avec des messages descriptifs.
    ```bash
    git add Code.gs README.md
    git commit -m "Fix: Restrict creerMultiplesObjets360sc to OF type only" -m "Added a guard clause to the function and updated documentation to clarify the specialized roles of the main functions."
    git push origin main
    ```

## Informations Importantes

*   **Sécurité des Identifiants :** Stockés par environnement dans `PropertiesService`.
*   **Environnement PROD :** **Vérifiez attentivement la configuration `COMPANY_ID` et `GENERATE_MC_FINGER` dans `config.gs` avant utilisation.**

## Référence API 360SmartConnect

Documentation officielle : `https://apiv2.360sc.yt/api/docs#` (pour TEST/PROD) ou `https://apiv2preprod.360sc.yt/api/docs#` (pour DEV).