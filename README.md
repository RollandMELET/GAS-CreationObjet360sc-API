<!-- Dernière mise à jour du README : 2025-06-02 à 10:25 par Rolland MELET -->
# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect pour créer une série de 5 objets "Avatar" liés, à partir d'un nom d'objet de base. Il retourne les URLs `mcUrl` uniques associées à chacun des objets créés.

## Fonctionnalités

*   Authentification auprès de l'API 360SmartConnect.
*   Création séquentielle de 5 types d'objets "Avatar" avec des `alphaId` et des noms spécifiques dérivés d'un nom de base.
*   Récupération de l'`mcUrl` pour chaque avatar créé.
*   Gestion des environnements DEV et PROD.
*   Fonctions de test pour valider les étapes individuelles (authentification, création d'un seul objet).
*   Conçu pour être appelé depuis une application Google AppSheet via `google.script.run`.

## Technologies Utilisées

*   Google Apps Script
*   API 360SmartConnect (REST)
*   `clasp` (pour le développement local et le déploiement)
*   Git (pour le versioning)
*   Visual Studio Code (comme IDE recommandé)

## Prérequis

1.  **Compte Google**.
2.  **Accès et identifiants pour l'API 360SmartConnect** (username, password, URL de base pour DEV/PROD, ID de compagnie pour DEV/PROD).
3.  **Node.js et npm** installés localement (pour installer et utiliser `clasp`).
4.  **`clasp`** installé globalement : `sudo npm install -g @google/clasp`.
5.  **Git** installé localement.

## Installation et Configuration

1.  **Cloner le dépôt (si ce n'est pas déjà fait) :**
    ```bash
    git clone https://github.com/RollandMELET/GAS-CreationObjet360sc-API.git
    cd GAS-CreationObjet360sc-API
    ```

2.  **Authentification `clasp` :**
    Si c'est la première fois que vous utilisez `clasp` sur cette machine ou avec ce compte :
    ```bash
    clasp login
    ```
    Suivez les instructions pour vous connecter à votre compte Google.

3.  **Lier au projet Google Apps Script :**
    Le fichier `.clasp.json` inclus dans ce dépôt contient un `scriptId`.
    *   **Pour utiliser le projet Apps Script existant lié à ce `scriptId` :** Assurez-vous d'avoir les permissions sur ce projet.
    *   **Pour lier à un nouveau projet ou un autre projet existant :**
        *   Créez un nouveau projet standalone sur [script.google.com](https://script.google.com).
        *   Notez son `Script ID` (dans Fichier > Paramètres du projet).
        *   Modifiez le `scriptId` dans le fichier `.clasp.json` local avec ce nouvel ID.
        *   Ou utilisez `clasp create --title "Mon Nouveau Projet 360sc" --rootDir ./` pour créer un nouveau projet et lier. (Attention, cela pourrait écraser le `.clasp.json` existant).

4.  **Configuration du Script (`config.gs`) :**
    Ouvrez le fichier `config.gs` et mettez à jour les placeholders suivants, notamment pour l'environnement PROD :
    ```javascript
    const ENV_CONFIG = {
      // ... configuration DEV ...
      PROD: {
        API_BASE_URL: "https://VOTRE_URL_PROD_API.360sc.yt", // À REMPLACER
        COMPANY_ID: "/api/companies/VOTRE_ID_COMPANIE_PROD" // À REMPLACER
      }
    };
    ```
    Les identifiants `username` et `password` pour l'API sont passés en paramètres lors de l'appel des fonctions.

5.  **Pousser les fichiers vers Google Apps Script :**
    ```bash
    clasp push -f
    ```
    L'option `-f` (force) peut être utile pour la première synchronisation ou si des conflits sont détectés.

## Structure des Fichiers

*   `appsscript.json`: Manifeste du projet Apps Script. Contient les permissions nécessaires (comme `script.external_request`).
*   `Code.gs`: Contient la fonction principale `creerMultiplesObjets360sc` exposée à AppSheet, ainsi que les fonctions de test et les wrappers pour l'exécution depuis l'éditeur.
*   `apiHandler.gs`: Contient la logique bas niveau pour les appels à l'API 360sc (authentification, création d'avatar, récupération d'URL).
*   `config.gs`: Contient les configurations spécifiques aux environnements (URL, IDs constants, définitions des objets à créer).
*   `.clasp.json`: Configuration de `clasp`, notamment le `scriptId`.
*   `.gitignore`: Spécifie les fichiers à ignorer par Git.
*   `README.md`: Ce fichier.

## Fonctions Principales

### 1. `creerMultiplesObjets360sc(nomDeObjetBase, username, password, typeSysteme)`
   *   **Rôle :** Fonction principale à appeler (par exemple, depuis AppSheet).
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour les objets (ex: "MonProjetSuper").
        *   `username` (String) : Nom d'utilisateur pour l'API 360sc.
        *   `password` (String) : Mot de passe pour l'API 360sc.
        *   `typeSysteme` (String) : `"DEV"` ou `"PROD"`.
   *   **Retourne :** Un objet JSON.
        *   En cas de succès : `{ "PAC_360scID": "url1", "PAC_360scID_ENV": "url2", ... }`
        *   En cas d'erreur : `{ error: "Message d'erreur détaillé" }`

### 2. Fonctions de Test (dans `Code.gs`)
   Ces fonctions peuvent être appelées depuis AppSheet ou via les wrappers dans l'éditeur.
   *   `testAuthentication(username, password, typeSysteme)`
   *   `testCreateSingleObject(username, password, typeSysteme, nomObjetTestBase, alphaIdTest)`
   *   `testGetMcUrlForAvatar(username, password, typeSysteme, avatarApiIdPath)`

### 3. Fonctions Wrapper de Test (dans `Code.gs`)
   Ces fonctions sont préconfigurées pour être exécutées facilement depuis l'éditeur Apps Script.
   *   `maFonctionDeTestPourAuth()`
   *   `maFonctionDeTestPourCreerObjet()`
   *   `maFonctionDeTestPourCreerMultiples()`
   **Note :** Modifiez les identifiants de test directement dans ces fonctions avant de les exécuter.

## Utilisation

### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet sur [script.google.com](https://script.google.com) ou via `clasp open`.
2.  Sélectionnez une des fonctions wrapper de test (ex: `maFonctionDeTestPourAuth`).
3.  Assurez-vous que les identifiants de test dans la fonction wrapper sont corrects.
4.  Cliquez sur "Exécuter".
5.  Consultez les `Logger.log` dans le "Journal d'exécution".
6.  Autorisez les permissions si demandé lors de la première exécution.

### Depuis AppSheet
1.  Dans votre application AppSheet, configurez une action ou un automatisme pour appeler un script.
2.  Utilisez `google.script.run` avec les gestionnaires de succès et d'échec.
    ```javascript
    // Exemple (côté client AppSheet, syntaxe à adapter)
    google.script.run
      .withSuccessHandler(function(response) {
        if (response.error) {
          console.error("Erreur du script:", response.error);
          // Afficher l'erreur à l'utilisateur
        } else {
          console.log("URLs reçues:", response);
          // Utiliser les URLs: response.PAC_360scID, response.PAC_360scID_ENV, etc.
        }
      })
      .withFailureHandler(function(error) {
        console.error("Erreur d'appel du script:", error.message);
        // Afficher une erreur générique
      })
      .creerMultiplesObjets360sc("NomDeMonObjet", "user_api", "pass_api", "DEV");
    ```

## Workflow de Développement

1.  Modifiez les fichiers `.gs` localement dans VS Code (ou votre IDE préféré).
2.  Utilisez `clasp push` pour synchroniser les modifications avec le projet Google Apps Script en ligne.
3.  Testez depuis l'éditeur Apps Script ou directement via AppSheet.
4.  Utilisez Git pour le versioning :
    ```bash
    git add .
    git commit -m "Description de vos modifications"
    git push origin main
    ```

## Informations Importantes

*   **`x-deduplication-id` :** Un ID unique est généré automatiquement (`Utilities.getUuid()`) pour chaque requête de création d'avatar afin d'assurer l'idempotence.
*   **Gestion des erreurs :** Le script tente de capturer les erreurs API et retourne des messages descriptifs. Si une étape de la création multiple échoue, le processus s'arrête pour les objets suivants.
*   **Environnement PROD :** Assurez-vous que `API_BASE_URL` et `COMPANY_ID` sont correctement configurés dans `config.gs` avant de passer `typeSysteme="PROD"`.

## Référence API 360SmartConnect

La documentation de référence pour l'API 360SmartConnect (utilisée comme base pour ce script) est disponible ici (adaptez le lien pour l'environnement de production si nécessaire) :
[https://apiv2preprod.360sc.yt/api/docs#](https://apiv2preprod.360sc.yt/api/docs#)

## Versioning des Fichiers Source

Les fichiers source `.gs` incluent un commentaire de version en haut du fichier (ex: `// Version: 1.0.2`). Mettez à jour ce numéro lors de modifications significatives du code. L'historique complet des modifications est géré par Git.