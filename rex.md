# FILENAME: rex.md
# Version: 1.0.0
# Date: 2025-06-01
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Compilation des Retours d'Expérience (REX) pour le projet GAS-CreationObjet360sc-API.

# Rapport de Retour d'Expérience (REX) - Phase Initiale de Configuration et Tests

## REX Item 1: Erreur API 400 - "Item not found" pour `generateMCFinger` lors des premiers tests sur l'environnement TEST

*   **Problème:**
    Erreur API 400 - `Item not found` pour `generateMCFinger`.

*   **Description:**
    Lors de l'exécution initiale de la fonction de test `maFonctionDeTestPourCreerMultiples_TEST_OF` (ou équivalent avant sa création spécifique), l'API de l'environnement TEST (`https://apiv2.360sc.yt`) retournait une erreur 400. Le détail de l'erreur indiquait que l'ID de Finger `/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487` (qui était configuré pour DEV et initialement utilisé par défaut pour TEST dans `config.gs`) n'était pas trouvé sur l'environnement TEST.

*   **Impact:**
    Échec de la création de tous les avatars pour l'environnement TEST. Le script ne pouvait pas procéder au-delà de la première tentative de création d'avatar.

*   **Investigation et Solutions Intermédiaires Tentées:**
    1.  Vérification de la documentation API : L'outil de navigation de l'IA n'a pas pu accéder directement à l'URL fournie (`https://apiv2.360sc.yt/api/docs#`), et un fichier texte fourni initialement comme documentation s'est avéré être une page d'erreur 404 pour une URL de spec OpenAPI (`/v3/api-docs`).
    2.  Fourniture d'une spec OpenAPI (JSON) par Rolland : Cela a permis d'identifier l'endpoint `/api/fingers` pour lister les Fingers.
    3.  Appel à `/api/fingers` sur l'environnement TEST : Cet appel a retourné une liste vide (`[]`), suggérant quaucun Finger n'était directement listable ou configuré pour l'utilisateur `360sc_DuhaldeTest` sur cet environnement.
    4.  Rolland a fourni un nouvel ID Finger potentiel pour TEST : `6364149b51f85`.
    5.  Test avec ID simple : L'utilisation de `6364149b51f85` directement comme valeur pour `GENERATE_MC_FINGER` a résulté en une erreur API 400 "Invalid IRI".

*   **Solution Appliquée (pour ce REX Item) :**
    L'ID Finger `6364149b51f85` a été formaté en tant qu'IRI complet en le préfixant par `/api/fingers/`, donnant `/api/fingers/6364149b51f85`. Cette valeur a été configurée dans `config.gs` pour `ENV_CONFIG.TEST.GENERATE_MC_FINGER`.
    Les tests subséquents avec cette configuration complète ont réussi, permettant la création des avatars sur l'environnement TEST.

*   **Leçons Apprises:**
    1.  **Spécificité des IDs par Environnement :** Les identifiants de ressources (comme les `COMPANY_ID` et `GENERATE_MC_FINGER`) sont très souvent spécifiques à chaque environnement d'API (DEV, TEST, PROD). Il ne faut pas présumer qu'un ID d'un environnement sera valide sur un autre.
    2.  **Format des Références :** Les API RESTful, en particulier celles utilisant API Platform (comme suggéré par les réponses d'erreur `hydra:`), attendent généralement des IRI (Internationalized Resource Identifiers, ex: `/api/resource/id`) pour référencer des entités liées, et non des ID bruts.
    3.  **Importance de la Documentation API Spécifique à l'Environnement :** Si la documentation n'est pas claire ou si les endpoints de listing ne fournissent pas les informations attendues (comme `/api/fingers` retournant une liste vide), il devient crucial de consulter directement les administrateurs de la plateforme ou le support technique pour obtenir les valeurs de configuration exactes pour chaque environnement.
    4.  **Démarche Itérative de Débogage :** Face à une erreur, il est utile de :
        *   Analyser précisément le message d'erreur de l'API.
        *   Émettre des hypothèses basées sur le message et la documentation disponible.
        *   Tester ces hypothèses de manière isolée et progressive.
        *   Utiliser des outils comme `curl` ou des fonctions de test temporaires pour interroger l'API et comprendre son comportement.
    5.  **Configuration Centralisée :** Maintenir une configuration claire et adaptable par environnement (comme dans `config.gs`) est essentiel pour gérer ces différences. La modification pour rendre `GENERATE_MC_FINGER` spécifique à chaque environnement dans `ENV_CONFIG` a été une étape clé.

## REX Item 2: Gestion Initiale des Identifiants API et Adaptation pour Multi-Environnement

*   **Problème:**
    La structure initiale du script ne gérait pas explicitement les identifiants API (username/password) de manière distincte pour les environnements DEV, TEST, et PROD dans `PropertiesService`.

*   **Description:**
    Le `README.md` et `utils.gs` initiaux se concentraient sur le stockage d'un seul jeu d'identifiants. Avec l'introduction de l'environnement TEST et la perspective de l'environnement PROD, il était nécessaire d'adapter le mécanisme de stockage et de récupération des identifiants.

*   **Impact Potentiel (si non traité) :**
    Risque d'utiliser les mauvais identifiants pour un environnement donné, conduisant à des échecs d'authentification ou à des opérations sur le mauvais système. Confusion lors de la configuration.

*   **Solution Appliquée:**
    1.  Modification de `utils.gs` :
        *   La fonction interne `_storeApiCredentials` a été modifiée pour accepter `typeSysteme`, `username`, et `password` et stocker les identifiants avec des clés préfixées par l'environnement (ex: `API_USERNAME_TEST`, `API_PASSWORD_TEST`).
        *   Des fonctions wrapper `storeDevApiCredentials`, `storeTestApiCredentials`, et `storeProdApiCredentials` ont été créées pour faciliter le stockage pour chaque environnement spécifique.
    2.  Modification de `apiHandler.gs` :
        *   La fonction `getAuthToken_` a été mise à jour pour récupérer les identifiants depuis `PropertiesService` en utilisant la clé spécifique à l'environnement (ex: `scriptProperties.getProperty(API_USERNAME_${systemTypeUpper})`).
    3.  Mise à jour du `README.md` pour refléter la nouvelle procédure de stockage des identifiants par environnement.

*   **Leçons Apprises:**
    1.  **Séparation Claire des Configurations d'Environnement :** Il est crucial de séparer non seulement les URLs et les ID de ressources, mais aussi les identifiants d'authentification pour chaque environnement.
    2.  **Utilisation de `PropertiesService` avec des Clés Distinctes :** L'utilisation de clés préfixées ou nommées de manière unique par environnement dans `PropertiesService` permet un stockage sécurisé et une récupération fiable des identifiants.
    3.  **Documentation Claire pour l'Utilisateur :** Les instructions pour configurer les identifiants doivent être précises et guider l'utilisateur pour chaque environnement.

---

Ce rapport peut être complété au fur et à mesure que nous avançons dans le projet et que nous rencontrons d'autres points d'apprentissage.