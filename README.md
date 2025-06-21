# FILENAME: README.md
# Version: 1.9.1
# Date: 2025-06-21 7:48
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Documentation majeure des nouvelles fonctionnalités, de la configuration avancée et de l'intégration avec AppSheet.

# GAS-CreationObjet360sc-API

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect. Il fournit des fonctions pour le cycle de vie complet des objets "Avatar" (OF, Moules) et des Utilisateurs, avec une gestion avancée des environnements et une intégration poussée avec AppSheet.

## Fonctionnalités Clés

*   **Authentification Sécurisée :** Gère les tokens d'API et leur mise en cache pour plusieurs environnements (DEV, TEST, PROD).
*   **Architecture API Complexe :** Le script est conçu pour gérer une architecture API multi-serveurs (V1 pour les Utilisateurs, V2 pour les Avatars) avec un token d'authentification universel.
*   **Gestion Avancée des Avatars :**
    *   Création **spécialisée** de structures d'objets OF complexes, avec assignation d'un type de métadonnée (`metadataAvatarType`) **spécifique à chaque sous-objet** (Principal, Elec, Composants).
    *   Création **générique** d'objets uniques (ex: Moule).
    *   **Ajout de propriétés dynamiques** à la création, notamment pour l'objet OF-ELEC.
*   **Gestion Complète des Utilisateurs :**
    *   Cycle de vie complet : Créer, Activer (avec attribution de rôles via un mapping de profils), et Désactiver.
*   **Intégration et Environnement :**
    *   Configuration centralisée et claire pour les environnements DEV, TEST et PROD.
    *   **Wrappers de fonctions optimisés pour AppSheet**, y compris la gestion de paramètres complexes via des chaînes JSON.
    *   Suite de tests complète et robuste pour valider chaque fonctionnalité.

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

## Intégration avec AppSheet

Pour appeler les fonctions de ce script depuis AppSheet, assurez-vous de configurer correctement l'appel dans vos Actions ou Bots.

### Passer des Paramètres Complexes (Ex: Propriétés pour OF-ELEC)

AppSheet ne peut passer que du texte. Pour envoyer des données structurées (comme un objet JSON), vous devez construire la chaîne de caractères JSON dans une formule AppSheet.

**Exemple :** Pour passer les propriétés `tipi`, `tfo`, `ladac`, et `tab` à la fonction `creerMultiplesObjets360sc`, utilisez la formule suivante dans AppSheet pour le 4ème paramètre (`proprietesElec`) :
Use code with caution.
Markdown
CONCATENATE(
"{",
LEFT(
(
IF(ISNOTBLANK([VotreColonneTipi]), CONCATENATE("""tipi"":""", SUBSTITUTE([VotreColonneTipi], """", """"), ""","), "") &
IF(ISNOTBLANK([VotreColonneTfo]), CONCATENATE("""tfo"":""", SUBSTITUTE([VotreColonneTfo], """", """"), ""","), "") &
IF(ISNOTBLANK([VotreColonneLadac]), CONCATENATE("""ladac"":""", SUBSTITUTE([VotreColonneLadac], """", """"), ""","), "") &
IF(ISNOTBLANK([VotreColonneTab]), CONCATENATE("""tab"":""", SUBSTITUTE([VotreColonneTab], """", """"), ""","), "")
),
MAX(LIST(0, LEN(
IF(ISNOTBLANK([VotreColonneTipi]), CONCATENATE("""tipi"":""", SUBSTITUTE([VotreColonneTipi], """", """"), ""","), "") &
IF(ISNOTBLANK([VotreColonneTfo]), CONCATENATE("""tfo"":""", SUBSTITUTE([VotreColonneTfo], """", """"), ""","), "") &
IF(ISNOTBLANK([VotreColonneLadac]), CONCATENATE("""ladac"":""", SUBSTITUTE([VotreColonneLadac], """", """"), ""","), "") &
IF(ISNOTBLANK([VotreColonneTab]), CONCATENATE("""tab"":""", SUBSTITUTE([VotreColonneTab], """", """"), ""","), "")
) - 1))
),
"}"
)
*Cette formule robuste gère les champs vides et "échappe" les guillemets pour éviter les erreurs.*

## Structure des Fichiers et Rôles

*   `appsscript.json`: **Manifest du projet.**
*   `config.gs`: **Configuration centrale.** Contient les URLs (V1 et V2), les IDs spécifiques à chaque environnement, et les mappings de rôles. C'est le premier fichier à modifier pour configurer un nouvel environnement.
*   `utils.gs`: **Fonctions utilitaires.** Gère l'accès sécurisé aux identifiants via `PropertiesService`.
*   `apiHandler.gs`: **Couche de communication API.** Gère l'authentification et l'envoi des requêtes (`UrlFetchApp`) aux bons serveurs.
*   `users.gs`: **Module de gestion des utilisateurs.** Contient toute la logique métier et les wrappers pour le cycle de vie des utilisateurs (API V1).
*   `Code.gs`: **Module de gestion des Avatars.** Contient les fonctions principales pour la création d'objets (OF, Moules) et leurs wrappers (API V2).
*   `tests.gs`: **Suite de tests.** Contient toutes les fonctions de test et la fonction maîtresse `testSuiteComplete()` pour la validation post-déploiement.
*   `rex.md`: **Retour d'Expérience.** Documente les problèmes, solutions et leçons apprises.

## Workflow de Développement et Test

1.  Modifiez le code localement dans VSCode.
2.  Poussez les changements sur Google Apps Script : `clasp push`.
3.  Ouvrez le projet dans l'éditeur en ligne : `clasp open`.
4.  Dans l'éditeur, sélectionnez la fonction `testSuiteComplete` et cliquez sur **Exécuter**.
5.  Consultez les journaux (`Afficher > Journaux`) pour valider que tous les tests passent.
6.  Une fois satisfait, commitez et poussez sur GitHub avec un message descriptif.

## Ressources
le script se trouve à l'URL suivante : 
https://script.google.com/home/projects/142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn/edit
