<!-- FILENAME: README.md -->
# Version: 1.4.0 
# Date: 2025-06-07 11:45 <!-- MODIFIÉ -->
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Ajout de la fonctionnalité de création d'utilisateurs et mise à jour de la documentation. <!-- MODIFIÉ -->

# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect. Il fournit des fonctions pour :
*   La création spécialisée et en masse d'une structure d'Ordre de Fabrication (OF).
*   La création générique d'objets uniques "Avatar" (ex: Moule).
*   La création d'utilisateurs sur la plateforme. <!-- NOUVEAU -->

## Fonctionnalités

*   Authentification sécurisée auprès de l'API 360SmartConnect (identifiants stockés dans `PropertiesService` par environnement).
*   Création **spécialisée** de 5 objets "Avatar" liés pour un OF.
*   Création **générique** d'un objet "Avatar" unique pour tout autre cas (ex: "MOULE").
*   Création d'**utilisateurs** sur la plateforme 360SmartConnect. <!-- NOUVEAU -->
*   Récupération de l'`mcUrl` pour chaque avatar créé.
*   Gestion des environnements DEV, TEST et PROD via un fichier de configuration.
*   Structure de retour JSON plate et standardisée pour faciliter l'intégration avec AppSheet (et des wrappers spécifiques pour AppSheet).
*   Fonctions de test pour valider les étapes individuelles et les scénarios de succès/erreur.
*   Conçu pour être appelé depuis une application Google AppSheet via `google.script.run` ou d'autres services.

## Technologies Utilisées

*   Google Apps Script (Runtime V8)
*   API 360SmartConnect (REST)
*   `clasp` (pour le développement local et le déploiement)
*   Git (pour le versioning)
*   Visual Studio Code (comme IDE recommandé)

## Prérequis

1.  **Compte Google**.
2.  **Accès et identifiants pour l'API 360SmartConnect** (username, password) pour chaque environnement (DEV, TEST, PROD).
3.  **Informations de configuration API :** URL de base, ID de compagnie, etc., pour DEV, TEST, PROD (à configurer dans `config.gs`).
4.  **Node.js et npm** installés localement (pour installer et utiliser `clasp`).
5.  **`clasp`** installé globalement : `sudo npm install -g @google/clasp`.
6.  **Git** installé localement.

## Informations du Script Google Apps Script

*   **Nom du Script Google Apps Script :** `GAS-CreationObjet360sc-API`
*   **URL du Script dans l'éditeur Google Apps Script :** `https://script.google.com/home/projects/142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn/edit`
*   **Script ID (depuis `.clasp.json`) :** `142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn`

## Installation et Configuration Initiale
<!-- Cette section reste généralement la même, l'étape 6 concernant les identifiants est toujours cruciale. -->
1.  **Clonez le dépôt GitHub** (si vous travaillez en local avec `clasp`) ou **copiez le projet Apps Script** depuis l'URL fournie.
2.  **Si vous utilisez `clasp` :**
    *   Naviguez dans le répertoire du projet.
    *   Connectez-vous à votre compte Google : `clasp login`.
    *   Si c'est un nouveau clone, liez `clasp` au projet Apps Script existant en utilisant le Script ID : `clasp clone <Script_ID_Existant>`. Ou si vous avez copié les fichiers localement et que le `.clasp.json` est correct, vous pouvez juste `clasp push`.
3.  **Ouvrez le projet** dans l'éditeur Google Apps Script.
4.  **Configurez les identifiants API (Très Important) :**
    *   Ouvrez le fichier `utils.gs`.
    *   Modifiez les fonctions `storeDevApiCredentials()`, `storeTestApiCredentials()`, et `storeProdApiCredentials()` en y insérant VOS PROPRES identifiants (nom d'utilisateur et mot de passe) pour chaque environnement respectif.
    *   **Exécutez chacune de ces fonctions une fois** (ex: `storeDevApiCredentials`, puis `storeTestApiCredentials`, etc.) depuis l'éditeur Apps Script pour stocker les identifiants de manière sécurisée dans `PropertiesService`. Sélectionnez la fonction à exécuter dans la barre d'outils et cliquez sur "Exécuter".
5.  **Configurez les IDs spécifiques à l'environnement dans `config.gs` :**
    *   Ouvrez le fichier `config.gs`.
    *   Vérifiez et mettez à jour les valeurs pour `COMPANY_ID`, `GENERATE_MC_FINGER`, et les `METADATA_AVATAR_TYPES` pour chaque environnement (`DEV`, `TEST`, `PROD`), en particulier pour `PROD` avant toute utilisation en production. Les valeurs pour `PROD` sont des placeholders et DOIVENT être remplacées.
6.  **Déployez/Sauvegardez les modifications.**

## Structure des Fichiers

*   `appsscript.json`: Manifeste du projet Apps Script.
*   `Code.gs`: Contient les fonctions principales (`creerMultiplesObjets360sc`, `creerObjetUnique360sc`, `creerObjetUnique360scForAppSheet`, `creerUtilisateur360sc`) exposées et les wrappers de test. <!-- MODIFIÉ -->
*   `apiHandler.gs`: Contient la logique bas niveau pour les appels à l'API 360sc (authentification, création d'avatar, création d'utilisateur). <!-- MODIFIÉ -->
*   `config.gs`: Contient les configurations spécifiques aux environnements (URLs, IDs API, mappings). <!-- MODIFIÉ (implicitement par ajout de USERS_ENDPOINT) -->
*   `utils.gs`: Contient des fonctions utilitaires, notamment pour gérer le stockage des identifiants API.
*   `.clasp.json`: Configuration de `clasp`.
*   `.gitignore`: Spécifie les fichiers à ignorer par Git.
*   `README.md`: Ce fichier.
*   `rex.md`: Rapport des retours d'expérience.

## Fonctions Principales

<!-- MODIFIÉ : Ajout de creerUtilisateur360sc -->
Il y a plusieurs fonctions principales exposées, chacune avec un rôle bien défini :

### 1. `creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet)`
   *   **RÔLE : [SPÉCIALISÉE]** Crée la structure complète des **5 objets liés** pour un **Ordre de Fabrication (OF)**.
   *   **USAGE EXCLUSIF :** Cette fonction ne doit **JAMAIS** être utilisée pour un type autre que "OF". Le script retournera une erreur si un autre type est fourni.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour les objets OF (ex: "MonOF123"). Requis.
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`. Requis.
        *   `typeObjet` (String) : **Doit être `"OF"`** ou laissé vide/null.
   *   **Retourne :** Une **chaîne JSON** avec les 5 URLs (`PAC_360scID`, `PAC_360scID_ENV`, etc.) en cas de succès, ou un objet d'erreur.

### 2. `creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule)`
   *   **RÔLE : [GÉNÉRIQUE-AVATAR]** Crée un **seul objet Avatar** de n'importe quel type (ex: "MOULE", ou même un composant "OF" individuel).
   *   **USAGE :** C'est la fonction à utiliser pour tous les cas qui ne sont pas la création complète d'un OF. Par exemple, pour créer un objet `MOULE_CORPS`. Utilise `ALPHA_ID_MAPPING` dans `config.gs` pour déterminer l'`alphaId` à partir de `typeMoule`.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour l'objet (ex: "MonMouleXYZ"). Requis.
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`. Requis.
        *   `typeObjet` (String) : Type d'objet général à créer, ex: `"MOULE"`. Utilisé pour déterminer les métadonnées de l'objet.
        *   `typeMoule` (String) : La clé du type spécifique (ex: `"MouleEnveloppe"`) définie dans `ALPHA_ID_MAPPING`. Requis.
   *   **Retourne :** Une **chaîne JSON** avec l'URL unique (`mcUrl`) de l'objet créé, son `@id`, etc., ou un objet d'erreur.

### 3. `creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule)`
   *   **RÔLE : [APPSHEET-HELPER-AVATAR]** Wrapper simplifié pour `creerObjetUnique360sc`, spécifiquement pour être appelé depuis AppSheet pour créer des Avatars (typiquement des Moules).
   *   **USAGE :** Recommandé pour AppSheet pour obtenir directement l'URL mc ou un message d'erreur.
   *   **Paramètres :**
        *   `nomDeObjetBase` (String) : Le nom de base pour l'objet (ex: "MonMouleXYZ").
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`.
        *   `typeMoule` (String) : La clé du type spécifique (ex: `"MouleEnveloppe"`) définie dans `ALPHA_ID_MAPPING`.
   *   **Retourne :** Une **chaîne de caractères** : soit l'URL `mcUrl` en cas de succès, soit un message préfixé par "ERREUR: " en cas d'échec.

### 4. `creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags)` <!-- NOUVEAU -->
   *   **RÔLE : [GÉNÉRIQUE-UTILISATEUR]** Crée un **nouvel utilisateur** sur la plateforme 360SmartConnect.
   *   **USAGE :** Pour provisionner de nouveaux comptes utilisateurs.
   *   **Paramètres :**
        *   `typeSysteme` (String) : `"DEV"`, `"TEST"`, ou `"PROD"`. Requis.
        *   `username` (String) : Nom d'utilisateur unique pour la connexion. Requis.
        *   `email` (String) : Adresse e-mail unique de l'utilisateur. Requis.
        *   `firstName` (String) : Prénom de l'utilisateur. Requis.
        *   `lastName` (String) : Nom de famille de l'utilisateur. Requis.
        *   `tags` (Array de Strings, optionnel) : Tableau de tags à associer à l'utilisateur (ex: `["technicien", "siteA"]`). Peut être un tableau vide `[]` ou omis.
   *   **Retourne :** Une **chaîne JSON** contenant les détails de l'utilisateur créé (y compris son `@id` système) en cas de succès, ou un objet d'erreur.

## Utilisation

### Depuis l'Éditeur Google Apps Script
1.  Ouvrez le projet.
2.  **Stockez les identifiants API** pour chaque environnement (voir section "Installation").
3.  Sélectionnez une des fonctions wrapper de test (ex: `maFonctionDeTestPourCreerMultiples_SUCCES`, `maFonctionDeTestPourCreerObjetUnique`, `maFonctionDeTestPourCreerObjetUniqueForAppSheet`, ou `maFonctionDeTestPourCreerUtilisateur`). <!-- MODIFIÉ -->
4.  Modifiez les paramètres de test dans la fonction de test si nécessaire.
5.  Cliquez sur "Exécuter" et consultez les logs (Affichage > Journaux).

### Depuis AppSheet (Exemples Conceptuels)

<!-- MODIFIÉ : Ajout d'un exemple pour la création d'utilisateur -->
1.  Configurez une action ou un automatisme (Bot) dans AppSheet.
2.  Utilisez `google.script.run` en appelant la fonction appropriée à votre besoin :

    *   **Pour créer un OF complet :** `creerMultiplesObjets360sc(...)`
        ```javascript
        // google.script.run.withSuccessHandler(...).creerMultiplesObjets360sc(votreNomOF, votreEnv, "OF");
        ```

    *   **Pour créer un objet AVATAR unique (Moule, etc.) et obtenir directement l'URL mc :** `creerObjetUnique360scForAppSheet(...)`
        ```javascript
        // Exemple pour un Moule
        google.script.run
          .withSuccessHandler(function(mcUrlOuErreur) {
            if (mcUrlOuErreur && !mcUrlOuErreur.startsWith("ERREUR:")) {
              // Stocker mcUrlOuErreur dans votre colonne [URL_Moule_360sc]
              // Exemple: SET([URL_Moule_360sc], mcUrlOuErreur)
            } else {
              // Stocker mcUrlOuErreur (qui est le message d'erreur) dans une colonne [Log_Erreur_Script]
            }
          })
          .withFailureHandler(function(erreurSysteme) {
            // Gérer les erreurs système de l'appel Apps Script
            // Stocker erreurSysteme.message dans [Log_Erreur_Script]
          })
          .creerObjetUnique360scForAppSheet(
            [NomDuMoule],    // Colonne AppSheet
            "TEST",          // ou "DEV", "PROD"
            [TypeDeMoule]    // Colonne AppSheet correspondant aux clés de ALPHA_ID_MAPPING
          );
        ```

    *   **Pour créer un UTILISATEUR :** `creerUtilisateur360sc(...)`
        ```javascript
        // Exemple pour créer un utilisateur
        // Supposons que vous avez des colonnes [Username], [Email], [FirstName], [LastName]
        google.script.run
          .withSuccessHandler(function(resultatJsonString) {
            var resultat = JSON.parse(resultatJsonString);
            if (resultat.success && resultat.user) {
              // Utilisateur créé avec succès. L'ID est resultat.user['@id']
              // Vous pouvez stocker resultat.user['@id'] ou un message de succès.
              // Exemple: SET([ID_Utilisateur_360sc], resultat.user['@id'])
            } else {
              // Erreur lors de la création. resultat.error contient le message.
              // Stocker resultat.error dans [Log_Erreur_Script]
            }
          })
          .withFailureHandler(function(erreurSysteme) {
            // Gérer les erreurs système de l'appel Apps Script
          })
          .creerUtilisateur360sc(
            "TEST",        // ou "DEV", "PROD"
            [Username],    // Colonne AppSheet
            [Email],       // Colonne AppSheet
            [FirstName],   // Colonne AppSheet
            [LastName],    // Colonne AppSheet
            // Pour les tags, vous pouvez passer un tableau vide si non utilisé,
            // ou construire un tableau à partir de colonnes AppSheet si nécessaire.
            // Exemple: SPLIT([ListeDeTagsSeparéeParVirgule], ",") ou simplement []
            [] 
          );
        ```

## Workflow de Développement

1.  Modifiez localement les fichiers `.gs` ou `.js`.
2.  Utilisez `clasp push` pour envoyer les modifications au projet Google Apps Script en ligne.
3.  Testez les fonctions depuis l'éditeur Apps Script en utilisant les fonctions de test dédiées (ex: `maFonctionDeTestPour...`).
4.  Consultez les logs pour le débogage.
5.  Une fois satisfait, commitez et pushez vos changements sur GitHub avec des messages descriptifs :
    ```bash
    git add .
    git commit -m "Feat: Add user creation functionality" -m "Implemented creerUtilisateur360sc function, associated API handler, config, and tests. Updated README."
    git push origin main
    ```

## Informations Importantes

*   **Sécurité des Identifiants :** Stockés par environnement dans `PropertiesService` via les fonctions de `utils.gs`. Ne jamais commiter les identifiants réels dans le code.
*   **Environnement PROD :** **Vérifiez attentivement TOUTES les configurations (`COMPANY_ID`, `GENERATE_MC_FINGER`, `METADATA_AVATAR_TYPES`, URLs de base) dans `config.gs` avant toute utilisation en production.** Testez intensivement sur DEV et TEST.
*   **Limites d'Exécution Apps Script :** Soyez conscient des quotas et limitations de Google Apps Script (temps d'exécution, nombre d'appels `UrlFetchApp`, etc.).

## Référence API 360SmartConnect

*   **Documentation générale (si disponible) :** `https://apiv2.360sc.yt/api/docs#` (pour TEST/PROD) ou `https://apiv2preprod.360sc.yt/api/docs#` (pour DEV).
*   **Endpoint création utilisateur (confirmé pour TEST/PROD) :** `POST https://api.360sc.yt/api/v2/users`
*   Consultez les administrateurs de la plateforme pour obtenir les informations les plus à jour et spécifiques à chaque environnement.