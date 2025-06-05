<!-- FILENAME: README.md -->
# Version: 1.3.0
# Date: 2025-06-01 17:00
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Ajout de l'environnement TEST, paramètre typeObjet (OF/Moule), mise à jour URL PROD, et section Infos Script.
<!-- Dernière mise à jour du README : 2025-06-01 (Aligné avec la version 1.3.0 du code) -->
# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect pour créer une série de 5 objets "Avatar" liés, à partir d'un nom d'objet de base et d'un type d'objet spécifié (ex: OF, Moule). Il retourne les URLs `mcUrl` uniques associées à chacun des objets créés. Les identifiants API sont gérés de manière sécurisée via `PropertiesService` par environnement (DEV, TEST, PROD).

## Fonctionnalités

*   Authentification sécurisée auprès de l'API 360SmartConnect (identifiants stockés dans `PropertiesService` par environnement).
*   Création séquentielle de 5 types d'objets "Avatar" avec des `alphaId` et des noms spécifiques dérivés d'un nom de base.
*   Prise en charge de différents types d'objets (ex: "OF", "MOULE") via un paramètre.
*   Récupération de l'`mcUrl` pour chaque avatar créé.
*   Gestion des environnements DEV, TEST et PROD via un fichier de configuration.
*   Structure de retour JSON plate et standardisée pour faciliter l'intégration avec AppSheet.
*   Fonctions de test pour valider les étapes individuelles et les scénarios de succès/erreur.
*   Conçu pour être appelé depuis une application Google AppSheet via `google.script.run`.

## Technologies Utilisées

*   Google Apps Script
*   API 360SmartConnect (REST)
*   `clasp` (pour le développement local et le déploiement)
*   Git (pour le versioning)
*   Visual Studio Code (comme IDE recommandé)

## Prérequis

1.  **Compte Google**.
2.  **Accès et identifiants pour l'API 360SmartConnect** (username, password) pour chaque environnement (DEV, TEST, PROD).
3.  **Informations de configuration API :** URL de base et ID de compagnie pour DEV, TEST, PROD (à configurer dans `config.gs`).
4.  **Node.js et npm** installés localement (pour installer et utiliser `clasp`).
5.  **`clasp`** installé globalement : `sudo npm install -g @google/clasp`.
6.  **Git** installé localement.

## Informations du Script Google Apps Script

*   **Nom du Script Google Apps Script :** `GAS-CreationObjet360sc-API`
*   **URL du Script dans l'éditeur Google Apps Script :** [https://script.google.com/home/projects/142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn/edit?pli=1](https://script.google.com/home/projects/142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn/edit?pli=1)
*   **Script ID (depuis `.clasp.json`) :** `142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn`

## Installation et Configuration Initiale

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/RollandMELET/GAS-CreationObjet360sc-API.git
    cd GAS-CreationObjet360sc-API
    ```

2.  **Authentification `clasp` :**
    ```bash
    clasp login
    ```
    Suivez les instructions pour vous connecter à votre compte Google.

3.  **Lier au projet Google Apps Script :**
    Le fichier `.clasp.json` contient le `scriptId` du projet Apps Script. Si vous souhaitez utiliser un autre projet, mettez à jour ce `scriptId`.

4.  **Configuration des Environnements (`config.gs`) :**
    Ouvrez le fichier `config.gs` et mettez à jour les placeholders pour les URLs de base de l'API et les IDs de compagnie, **notamment pour les environnements PROD et TEST** :
    ```javascript
    // FILENAME: config.gs
    // Version: 1.1.1
    // ...
    const ENV_CONFIG = {
      DEV: {
        API_BASE_URL: "https://apiv2preprod.360sc.yt",
        COMPANY_ID: "/api/companies/683097e698355"
      },
      TEST: { // Environnement TEST mis à jour avec COMPANY_ID spécifique
        API_BASE_URL: "https://apiv2.360sc.yt",
        COMPANY_ID: "/api/companies/683fff330baf4" 
      },
      PROD: {
        API_BASE_URL: "https://apiv2.360sc.yt", 
        COMPANY_ID: "/api/companies/VOTRE_ID_COMPANIE_PROD_REEL" // À REMPLACER
      }
    };
    ```

5.  **Pousser les fichiers initiaux vers Google Apps Script :**
    ```bash
    clasp push -f
    ```

6.  **Stocker les Identifiants API (Action Manuelle Cruciale UNE FOIS PAR ENVIRONNEMENT) :**
    *   Ouvrez le projet dans l'éditeur Google Apps Script (ex: via `clasp open`).
    *   Dans le fichier `utils.gs`, localisez les fonctions `storeDevApiCredentials()`, `storeTestApiCredentials()`, et `storeProdApiCredentials()`.
    *   **Pour DEV et PROD :** Modifiez les placeholders `VOTRE_USERNAME_ respectif` et `VOTRE_MOT_DE_PASSE_respectif` par vos identifiants 360sc réels pour ces environnements.
    *   La fonction `storeTestApiCredentials()` est déjà pré-remplie avec les identifiants TEST que vous avez fournis (`360sc_DuhaldeTest` / `360sc_DuhaldeTest@360sc_DuhaldeTest`). Vérifiez-les.
    *   Sauvegardez `utils.gs`.
    *   Exécutez **chacune** des fonctions de stockage (`storeDevApiCredentials`, `storeTestApiCredentials`, `storeProdApiCredentials`) une fois depuis l'éditeur Apps Script. Un message de succès devrait apparaître dans les logs.
    *   **Optionnel mais recommandé :** Exécutez `checkStoredApiCredentials` pour vérifier que les identifiants pour chaque environnement sont bien lus.
    *   **Sécurité :** Après le stockage réussi, vous pouvez modifier à nouveau les fonctions `store...ApiCredentials` dans `utils.gs` pour retirer les identifiants en clair du code (remettez des placeholders ou des chaînes vides), sauvegardez, et faites un `clasp push`. Les identifiants sont maintenant stockés de manière sécurisée dans `PropertiesService`.

## Structure des Fichiers

*   `appsscript.json`: Manifeste du projet Apps Script.
*   `Code.gs`: Contient la fonction principale `creerMultiplesObjets360sc` exposée à AppSheet, ainsi que les fonctions de test publiques et les wrappers pour l'exécution depuis l'éditeur.
*   `apiHandler.gs`: Contient la logique bas niveau pour les appels à l'API 360sc.
*   `config.gs`: Contient les configurations spécifiques aux environnements et les définitions des objets/types.
*   `utils.gs`: Contient des fonctions utilitaires, notamment pour gérer le stockage des identifiants API.
*   `.clasp.json`: Configuration de `clasp`.
*   `.gitignore`: Spécifie les fichiers à ignorer par Git.
*   `README.md`: Ce fichier.
*   `creer_avatar.sh`, `recup_url.sh`: Scripts shell d'exemple pour des tests API manuels.
*   `main.js`: Fichier JavaScript exemple (peut être utilisé ou supprimé selon les besoins).

## Fonctions Principales

### 1. `creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet)`
   *   **Rôle :** Fonction principale à appeler. Crée 5 objets liés sur la plateforme 360SmartConnect et retourne leurs URLs `mcUrl`.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour les objets (ex: "MonProjetSuper"). Ne peut être vide.
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`. Ne peut être vide.
        *   `typeObjet` (String) : Type d'objet à créer, ex: `"OF"` ou `"MOULE"`. Si non fourni ou invalide, un type par défaut est utilisé (voir `config.gs`).
   *   **Retourne :** Une **chaîne JSON** (structure identique à la version précédente, voir ci-dessous pour rappel).

    *   **En cas de succès complet :**
        ```json
        {
          "success": true,
          "message": "Tous les objets ont été créés avec succès.",
          "PAC_360scID": "https://mc.360sc.xyz/xxxx1",
          "PAC_360scID_ENV": "https://mc.360sc.xyz/xxxx2",
          "PAC_360scID_DALLE": "https://mc.360sc.xyz/xxxx3",
          "PAC_360scID_TOIT": "https://mc.360sc.xyz/xxxx4",
          "PAC_360scID_ELEC": "https://mc.360sc.xyz/xxxx5"
        }
        ```
    *   **En cas d'erreur :** (Structure JSON identique à la v1.2.1, incluant `success: false`, `message`, `error`, `details_originalError`, `details_stack`, `details_step`).

### 2. Fonctions de Test Publiques (dans `Code.gs`)
   Mêmes fonctions que v1.2.1 (`testAuthentication`, `testCreateSingleObject`, `testGetMcUrlForAvatar`), adaptées pour accepter "TEST" comme `typeSysteme`. `testCreateSingleObject` prendra désormais aussi un `metadataAvatarTypeId` en paramètre pour plus de flexibilité de test.

### 3. Fonctions Wrapper de Test (dans `Code.gs`)
   Ces fonctions sont préconfigurées pour être exécutées facilement depuis l'éditeur Apps Script :
   *   `maFonctionDeTestPourAuth()` (teste l'authentification pour un `typeSysteme` donné).
   *   `maFonctionDeTestPourCreerObjet()` (teste la création d'un objet unique avec `typeObjet` spécifié).
   *   `maFonctionDeTestPourCreerMultiples_SUCCES()` : Simule un succès complet (peut être adapté pour `typeObjet`).
   *   `maFonctionDeTestPourCreerMultiples_ERREUR()` : Simule des scénarios d'erreur.
   *   **Nouvelles fonctions de test par environnement et type d'objet :**
        *   `maFonctionDeTestPourCreerMultiples_DEV_OF()`
        *   `maFonctionDeTestPourCreerMultiples_DEV_MOULE()`
        *   `maFonctionDeTestPourCreerMultiples_TEST_OF()`
        *   `maFonctionDeTestPourCreerMultiples_TEST_MOULE()`

## Utilisation

### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet.
2.  **Stockez les identifiants API** (voir étape 6 de l'Installation).
3.  Sélectionnez une des fonctions wrapper de test (ex: `maFonctionDeTestPourCreerMultiples_TEST_OF`).
4.  Cliquez sur "Exécuter".
5.  Consultez les `Logger.log`.

### Depuis AppSheet
1.  Configurez une action ou un automatisme.
2.  Utilisez `google.script.run` avec `creerMultiplesObjets360sc` et les trois paramètres : `nomDeObjetBase`, `typeSysteme` ("DEV", "TEST", ou "PROD"), et `typeObjet` ("OF" ou "MOULE").
    ```javascript
    // Exemple conceptuel
    google.script.run
      .withSuccessHandler(function(resultString) {
        var resultatDuScript = JSON.parse(resultString);
        if (resultatDuScript.success) {
          // Traiter succès
          // [Url_Principal] = resultatDuScript.PAC_360scID;
        } else {
          // Traiter erreur
          // [Log_Erreur] = "Erreur Script: " + resultatDuScript.error;
        }
      })
      .withFailureHandler(function(error) {
        // Gérer erreur de l'appel google.script.run lui-même
        // [Log_Erreur_Systeme] = "Erreur appel GAS: " + error.message;
      })
      .creerMultiplesObjets360sc(votreNomBase, votreTypeSysteme, votreTypeObjet);
    ```

## Workflow de Développement

1.  Modifiez localement.
2.  `clasp push`.
3.  Testez depuis l'éditeur.
4.  Git (add, commit, push) avec des messages descriptifs.
    ```bash
    git add .
    git commit -m "Refactor: Ajout commentaire nom de fichier en début de scripts (v1.3.1)"
    git push origin main # ou votre branche de développement
    ```

## Informations Importantes

*   **Sécurité des Identifiants :** Stockés par environnement dans `PropertiesService`.
*   **Environnement TEST/PROD :** **Vérifiez attentivement la configuration `COMPANY_ID` dans `config.gs` avant utilisation intensive.**

## Référence API 360SmartConnect

Documentation officielle : [https://apiv2preprod.360sc.yt/api/docs#](https://apiv2preprod.360sc.yt/api/docs#) (adaptez pour PROD/TEST si l'URL de documentation change). L'URL de l'API pour TEST et PROD est maintenant `https://apiv2.360sc.yt`.

## Versioning des Fichiers Source

Les fichiers source incluent un commentaire de version et le nom du fichier. L'historique complet est géré par Git.