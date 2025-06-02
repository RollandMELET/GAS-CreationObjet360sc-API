<!-- Dernière mise à jour du README : 2025-06-02 (Aligné avec la version 1.2.1 du code) -->
# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect pour créer une série de 5 objets "Avatar" liés, à partir d'un nom d'objet de base. Il retourne les URLs `mcUrl` uniques associées à chacun des objets créés. Les identifiants API sont gérés de manière sécurisée via `PropertiesService`.

## Fonctionnalités

*   Authentification sécurisée auprès de l'API 360SmartConnect (identifiants stockés dans `PropertiesService`).
*   Création séquentielle de 5 types d'objets "Avatar" avec des `alphaId` et des noms spécifiques dérivés d'un nom de base.
*   Récupération de l'`mcUrl` pour chaque avatar créé.
*   Gestion des environnements DEV et PROD via un fichier de configuration.
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
2.  **Accès et identifiants pour l'API 360SmartConnect** (username, password).
3.  **Informations de configuration API :** URL de base pour DEV/PROD, ID de compagnie pour DEV/PROD (à configurer dans `config.gs`).
4.  **Node.js et npm** installés localement (pour installer et utiliser `clasp`).
5.  **`clasp`** installé globalement : `sudo npm install -g @google/clasp`.
6.  **Git** installé localement.

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
    Ouvrez le fichier `config.gs` et mettez à jour les placeholders pour l'URL de base de l'API et l'ID de compagnie, **surtout pour l'environnement PROD** :
    ```javascript
    const ENV_CONFIG = {
      // ... configuration DEV ...
      PROD: {
        API_BASE_URL: "https://VOTRE_URL_PROD_API_REELLE.360sc.yt", // À REMPLACER
        COMPANY_ID: "/api/companies/VOTRE_ID_COMPANIE_PROD_REEL" // À REMPLACER
      }
    };
    ```

5.  **Pousser les fichiers initiaux vers Google Apps Script :**
    ```bash
    clasp push -f
    ```

6.  **Stocker les Identifiants API (Action Manuelle Cruciale UNE FOIS) :**
    *   Ouvrez le projet dans l'éditeur Google Apps Script (ex: via `clasp open`).
    *   Dans le fichier `utils.gs`, localisez la fonction `storeApiCredentials()`.
    *   **Modifiez les placeholders** `VOTRE_VRAI_USERNAME_360SC_API` et `VOTRE_VRAI_MOT_DE_PASSE_360SC_API` par vos identifiants 360sc réels.
    *   Sauvegardez `utils.gs`.
    *   Sélectionnez `storeApiCredentials` dans l'éditeur et exécutez-la. Un message de succès devrait apparaître (via `Logger.log`, les `Browser.msgBox` ayant été commentés).
    *   **Optionnel mais recommandé :** Exécutez `checkStoredApiCredentials` pour vérifier que les identifiants sont bien lus.
    *   **Sécurité :** Après le stockage réussi, modifiez à nouveau `storeApiCredentials` pour retirer les identifiants en clair du code (remettez des placeholders ou des chaînes vides), sauvegardez, et faites un `clasp push`. Les identifiants sont maintenant stockés de manière sécurisée dans `PropertiesService`.

## Structure des Fichiers

*   `appsscript.json`: Manifeste du projet Apps Script (permissions, etc.).
*   `Code.gs`: Contient la fonction principale `creerMultiplesObjets360sc` exposée à AppSheet, ainsi que les fonctions de test publiques et les wrappers pour l'exécution depuis l'éditeur.
*   `apiHandler.gs`: Contient la logique bas niveau pour les appels à l'API 360sc (authentification, création d'avatar, récupération d'URL). `getAuthToken_` lit désormais les identifiants depuis `PropertiesService`.
*   `config.gs`: Contient les configurations spécifiques aux environnements (URL, IDs constants, définitions des objets à créer).
*   `utils.gs`: Contient des fonctions utilitaires, notamment pour gérer le stockage des identifiants API dans `PropertiesService`.
*   `.clasp.json`: Configuration de `clasp`, notamment le `scriptId`.
*   `.gitignore`: Spécifie les fichiers à ignorer par Git.
*   `README.md`: Ce fichier.

## Fonctions Principales

### 1. `creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme)`
   *   **Rôle :** Fonction principale à appeler (par exemple, depuis AppSheet). Crée 5 objets liés sur la plateforme 360SmartConnect et retourne leurs URLs `mcUrl`. Les identifiants API sont lus de manière sécurisée depuis `ScriptProperties`.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour les objets (ex: "MonProjetSuper"). Ne peut être vide.
        *   `typeSysteme` (String) : `"DEV"` ou `"PROD"`. Ne peut être vide.
   *   **Retourne :** Une **chaîne JSON** qui, une fois parsée, donne un objet avec la structure suivante :

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
        *(Exemple basé sur les tests de `maFonctionDeTestPourCreerMultiples_SUCCES`)*

    *   **En cas d'erreur (erreur de configuration, d'authentification, ou échec de création d'un des objets) :**
        ```json
        {
          "success": false,
          "message": "Message convivial expliquant le contexte de l'échec.",
          "error": "Message technique détaillé de l'erreur.",
          "details_originalError": "Message de l'exception originale capturée.",
          "details_stack": "Trace de la pile (peut être tronquée ou 'N/A').",
          "details_step": "Étape spécifique où l'erreur est survenue (ex: 'creation_PAC_360scID_DALLE')" // Si l'erreur survient pendant la création d'un objet spécifique.
        }
        ```
        **Exemple d'erreur de configuration (`typeSysteme` invalide) :**
        ```json
        {
          "success": false,
          "message": "Une erreur de configuration ou d'authentification est survenue.",
          "error": "Configuration non valide pour le type de système : DEV_INVALIDE. Doit être \"DEV\" ou \"PROD\".",
          "details_originalError": "Configuration non valide pour le type de système : DEV_INVALIDE. Doit être \"DEV\" ou \"PROD\".",
          "details_stack": "Error: Configuration non valide pour le type de système : DEV_INVALIDE. Doit être \"DEV\" ou \"PROD\".\n    at getConfiguration_ (config:XX:XX)\n    ..."
        }
        ```
        **Exemple d'erreur de paramètre manquant (`nomDeObjetBase` non fourni) :**
        ```json
        {
          "success": false,
          "message": "Une erreur de configuration ou d'authentification est survenue.",
          "error": "Le paramètre 'nomDeObjetBase' est requis et ne peut être vide.",
          "details_originalError": "Le paramètre 'nomDeObjetBase' est requis et ne peut être vide.",
          "details_stack": "Error: Le paramètre 'nomDeObjetBase' est requis et ne peut être vide.\n    at creerMultiplesObjets360sc (Code:XX:XX)\n    ..."
        }
        ```

### 2. Fonctions de Test Publiques (dans `Code.gs`)
   Ces fonctions peuvent aussi être appelées depuis AppSheet si besoin, et retournent la même structure JSON que `creerMultiplesObjets360sc`.
   *   `testAuthentication(typeSysteme)`
   *   `testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest)`
   *   `testGetMcUrlForAvatar(typeSysteme, avatarApiIdPath)`

### 3. Fonctions Wrapper de Test (dans `Code.gs`)
   Ces fonctions sont préconfigurées pour être exécutées facilement depuis l'éditeur Apps Script afin de tester différents scénarios.
   *   `maFonctionDeTestPourAuth()`
   *   `maFonctionDeTestPourCreerObjet()`
   *   `maFonctionDeTestPourCreerMultiples_SUCCES()` : Simule un succès complet de la création multiple.
   *   `maFonctionDeTestPourCreerMultiples_ERREUR()` : Simule des scénarios d'erreur pour la création multiple.

## Utilisation

### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet sur [script.google.com](https://script.google.com) ou via `clasp open`.
2.  **Stockez les identifiants API** en exécutant `storeApiCredentials()` depuis `utils.gs` (voir étape 6 de l'Installation).
3.  Sélectionnez une des fonctions wrapper de test (ex: `maFonctionDeTestPourCreerMultiples_SUCCES`).
4.  Cliquez sur "Exécuter".
5.  Consultez les `Logger.log` dans le "Journal d'exécution" pour voir la chaîne JSON retournée et l'objet parsé.
6.  Autorisez les permissions si demandé lors de la première exécution (pour `UrlFetchApp`, `PropertiesService`, etc.).

### Depuis AppSheet
1.  Dans votre application AppSheet, configurez une action ou un automatisme (recommandé pour gérer le retour) pour appeler un script.
2.  Utilisez `google.script.run` avec les gestionnaires de succès et d'échec.
    ```javascript
    // Exemple conceptuel (la syntaxe exacte dépend de votre configuration AppSheet)
    // Supposons que 'resultatDuScript' est l'objet JSON parsé retourné par le script.

    // Dans un Automation, après avoir appelé le script et stocké le résultat dans 'ScriptResult':
    // Condition pour l'étape de succès:
    // [ScriptResult][success] = TRUE
    // Actions de succès:
    //   [Url_Principal] = [ScriptResult][PAC_360scID]
    //   ... (pour les autres URLs)
    //   Notification: [ScriptResult][message]

    // Condition pour l'étape d'erreur:
    // [ScriptResult][success] = FALSE
    // Actions d'erreur:
    //   [Log_Erreur] = CONCATENATE("Erreur Script: ", [ScriptResult][error], " Détails: ", [ScriptResult][details_originalError])
    //   Notification: CONCATENATE("Problème création objets: ", [ScriptResult][message])
    ```
    La fonction à appeler depuis AppSheet est `creerMultiplesObjets360sc` avec les paramètres `nomDeObjetBase` et `typeSysteme`.

## Workflow de Développement

1.  Modifiez les fichiers `.gs` localement dans VS Code.
2.  Utilisez `clasp push` pour synchroniser les modifications avec Google Apps Script.
3.  Testez depuis l'éditeur Apps Script en utilisant les fonctions wrapper.
4.  Utilisez Git pour le versioning :
    ```bash
    git add .
    git commit -m "Description de vos modifications (ex: v1.2.1 - Amélioration X)"
    git push origin main
    ```

## Informations Importantes

*   **Sécurité des Identifiants :** Les identifiants de l'API 360sc sont stockés dans `PropertiesService` au niveau du script et ne sont pas exposés côté client.
*   **`x-deduplication-id` :** Un ID unique est généré automatiquement (`Utilities.getUuid()`) pour chaque requête de création d'avatar.
*   **Gestion des erreurs :** Le script retourne une structure JSON avec `success: false` et des détails en cas d'erreur. Si une étape de la création multiple échoue, le processus s'arrête pour les objets suivants pour cet appel.
*   **Environnement PROD :** Vérifiez la configuration dans `config.gs` avant d'utiliser `typeSysteme="PROD"`.

## Référence API 360SmartConnect

Documentation officielle : [https://apiv2preprod.360sc.yt/api/docs#](https://apiv2preprod.360sc.yt/api/docs#) (adaptez pour PROD si nécessaire).

## Versioning des Fichiers Source

Les fichiers source `.gs` incluent un commentaire de version (ex: `// Version: 1.2.1`). L'historique complet des modifications est géré par Git.