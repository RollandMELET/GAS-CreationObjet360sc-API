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

## REX Item 3: Incohérence des ID de Ressources entre les Environnements

*   **Problème:**
    Échec des tests sur l'environnement DEV avec une erreur API 400 - `Item not found` pour `metadata_avatar_types`.

*   **Description:**
    Après avoir résolu les problèmes de configuration pour `GENERATE_MC_FINGER` (spécifique à chaque environnement), la suite de tests a révélé que les identifiants pour `METADATA_AVATAR_TYPES` (ex: pour "OF") étaient également différents entre l'environnement DEV (`apiv2preprod.360sc.yt`) et l'environnement TEST (`apiv2.360sc.yt`). La configuration initiale les définissait comme des constantes globales, supposant qu'ils étaient identiques partout.

*   **Impact:**
    Échec systématique de la création d'avatars sur l'environnement DEV, bien que l'environnement TEST fonctionnait parfaitement. Cela a bloqué la validation complète du script.

*   **Solution Appliquée:**
    1.  **Investigation :** Création d'une fonction de listing temporaire (`temp_listDevMetadataAvatarTypes`) dans `utils.gs` pour interroger l'endpoint `/api/metadata_avatar_types` sur l'environnement DEV et récupérer les identifiants corrects.
    2.  **Refactoring de `config.gs` :** La constante globale `METADATA_AVATAR_TYPES` a été supprimée. Elle a été déplacée à l'intérieur de chaque objet d'environnement (`ENV_CONFIG.DEV`, `ENV_CONFIG.TEST`, etc.), rendant ainsi les ID de types d'avatar spécifiques à chaque environnement.
    3.  **Adaptation de `Code.gs` :** Les fonctions principales ont été mises à jour pour récupérer les ID de `metadataAvatarTypeId` depuis l'objet de configuration spécifique à l'environnement (`config.METADATA_AVATAR_TYPES.OF`) au lieu de la constante globale.

*   **Leçons Apprises:**
    1.  **Principe de Ségrégation Totale des Configurations :** Il faut présumer que **toutes** les valeurs de configuration qui sont des identifiants de ressources (ex: `/api/companies/ID`, `/api/fingers/ID`, `/api/metadata_avatar_types/ID`) sont uniques à chaque environnement. La meilleure pratique est de définir toutes ces valeurs au sein d'une structure de configuration par environnement, plutôt que de les partager globalement.
    2.  **Valider Systématiquement les Hypothèses :** Ne jamais supposer qu'une configuration d'un environnement fonctionnera sur un autre. Utiliser des fonctions de test et des outils d'investigation (comme les fonctions de listing temporaires) est une étape de validation cruciale lors de l'ajout d'un nouvel environnement.
    3.  **Robustesse du Code :** La structure finale est plus robuste car elle force le développeur à trouver et à renseigner explicitement les valeurs pour chaque environnement, réduisant ainsi les risques d'erreurs lors du passage en production.

---
## REX Item 4: Simplification de l'intégration AppSheet pour la création d'objets uniques

*   **Problème:**
    Simplification de l'intégration AppSheet pour la création d'objets uniques.

*   **Description:**
    La fonction `creerObjetUnique360sc` retourne une chaîne JSON complexe contenant plusieurs informations (`success`, `message`, `mcUrl`, `avatarApiIdPath`, `objectNameCreated`, `error`, `details_stack`). Bien que complète, cette structure n'est pas directement utilisable par AppSheet qui préfère souvent une valeur simple (comme une URL ou un message d'erreur direct) à stocker dans une colonne. Un traitement supplémentaire côté AppSheet serait nécessaire pour parser le JSON.

*   **Impact:**
    Complexification de la configuration de l'automation AppSheet (nécessité de parser le JSON via des expressions AppSheet ou une fonction script supplémentaire côté AppSheet). Augmentation du risque d'erreurs dans la logique AppSheet. Moins bonne expérience utilisateur pour l'intégrateur AppSheet.

*   **Solution Appliquée:**
    1.  Création d'une nouvelle fonction wrapper `creerObjetUnique360scForAppSheet` dans `Code.gs`.
    2.  Cette fonction prend des arguments simplifiés et adaptés à l'usage depuis AppSheet (par exemple, elle fixe `typeObjet` à "MOULE" en interne).
    3.  Elle appelle la fonction `creerObjetUnique360sc` existante.
    4.  Elle parse la réponse JSON de `creerObjetUnique360sc`.
    5.  En cas de succès, elle retourne *directement* la valeur de `mcUrl`.
    6.  En cas d'échec, elle retourne une *chaîne de caractères unique* préfixée par "ERREUR: " contenant le message d'erreur pertinent.
    7.  Une fonction de test `maFonctionDeTestPourCreerObjetUniqueForAppSheet` a également été ajoutée pour valider ce wrapper.

*   **Leçons Apprises:**
    1.  **Adapter les interfaces pour les consommateurs :** Lors de la création d'API ou de fonctions destinées à être appelées par d'autres systèmes (comme AppSheet), il est crucial de considérer la facilité d'intégration du point de vue du consommateur. Fournir des wrappers ou des endpoints spécifiques qui retournent des données dans le format le plus simple et le plus directement utilisable par le système appelant améliore grandement l'expérience d'intégration et réduit les risques d'erreurs.
    2.  **Principe de responsabilité unique (SRP) pour les fonctions exposées :** Bien que `creerObjetUnique360sc` soit une bonne fonction générique interne, le wrapper `creerObjetUnique360scForAppSheet` a une responsabilité plus ciblée : servir spécifiquement AppSheet pour la création de moules de la manière la plus simple possible pour AppSheet.
    3.  **L'importance des tests unitaires/d'intégration pour les wrappers :** La création d'une fonction de test dédiée (`maFonctionDeTestPourCreerObjetUniqueForAppSheet`) pour le nouveau wrapper assure que cette couche d'abstraction fonctionne comme prévu avant de l'intégrer dans AppSheet.
---
## REX Item 5: Divergence des URLs de base de l'API au sein d'un même environnement pour différents services

*   **Problème:**
    Divergence des URLs de base de l'API au sein d'un même environnement pour différents services.

*   **Description:**
    Lors de l'implémentation de la création d'utilisateurs, il a été découvert que l'URL de base pour l'API des utilisateurs (`https://api.360sc.yt`) différait de l'URL de base utilisée pour d'autres services comme l'authentification et la création d'avatars (`https://apiv2.360sc.yt`) pour les environnements TEST et PROD. L'utilisation de la `API_BASE_URL` standard configurée pour TEST (initialement `https://apiv2.360sc.yt`) pour l'endpoint `/api/v2/users` résultait en une erreur HTTP 404 (Not Found).

*   **Impact:**
    Échec de la fonctionnalité de création d'utilisateurs car l'endpoint correct n'était pas atteint. Nécessité d'adapter la logique de construction des URLs API.

*   **Solution Appliquée:**
    1.  Confirmation par Rolland que l'URL correcte pour la création d'utilisateurs en TEST et PROD est `https://api.360sc.yt/api/v2/users`.
    2.  Modification de la fonction `createUser_` dans `apiHandler.gs` pour introduire une logique conditionnelle :
        *   Si `typeSysteme` est "TEST" ou "PROD" ET que la `config.API_BASE_URL` (utilisée pour `/auth`, `/avatars`) est `https://apiv2.360sc.yt`, alors l'URL pour la création d'utilisateur est forcée à `https://api.360sc.yt` + `config.USERS_ENDPOINT`.
        *   Pour les autres cas (ex: DEV, ou si la `config.API_BASE_URL` était déjà `https://api.360sc.yt`), la construction standard de l'URL est utilisée.
    3.  Cette modification a permis d'atteindre l'endpoint correct et de réussir la création d'utilisateurs.

*   **Leçons Apprises:**
    1.  **Ne pas présumer l'uniformité des URLs de base :** Même au sein d'un "même" environnement (ex: TEST), différents services ou modules d'une API peuvent être hébergés sous des sous-domaines ou des chemins de base légèrement différents. Il est crucial de valider chaque endpoint individuellement.
    2.  **Importance de la documentation API précise :** Une documentation API claire indiquant les URLs de base spécifiques pour chaque groupe de fonctionnalités ou par environnement est essentielle.
    3.  **Flexibilité de la configuration :** Bien qu'une `API_BASE_URL` unique par environnement soit idéale, le code doit être capable de s'adapter à des exceptions. La solution appliquée (logique conditionnelle dans `apiHandler.gs`) est un compromis. Une solution plus structurelle pourrait impliquer des configurations d'URL de base multiples par environnement dans `config.gs` (par exemple, `API_BASE_URL_AUTH_AVATARS` et `API_BASE_URL_USERS`).
    4.  **Débogage itératif :** Le processus d'identification (erreur 401 -> identifiants corrigés -> erreur 404 -> URL corrigée) illustre l'importance de résoudre les problèmes un par un et d'analyser attentivement les messages d'erreur de l'API.

---
## REX Item 6: Erreur API 405 (Method Not Allowed) lors de la récupération d'un utilisateur

*   **Problème:**
    Échec systématique de la récupération des données d'un utilisateur unique via un appel `GET` à l'endpoint `/api/v2/users/{id}`.

*   **Description:**
    La stratégie initiale pour mettre à jour un utilisateur (activation/désactivation) était de suivre un schéma classique "GET -> Modify -> PUT". Cependant, l'appel `GET` à l'API via la fonction `getUser_` échouait avec un code d'erreur `HTTP 405 Method Not Allowed`. Le message d'erreur de l'API indiquait explicitement que seule la méthode `PUT` était autorisée (`Allow: PUT`).

*   **Impact:**
    La stratégie de mise à jour initialement conçue était invalide et bloquait complètement l'implémentation des fonctionnalités d'activation et de désactivation.

*   **Solution Appliquée:**
    1.  Abandon complet de la stratégie "GET -> Modify -> PUT".
    2.  Suppression de la fonction `getUser_` de `apiHandler.gs` car elle est inutilisable.
    3.  Modification des fonctions `activerUtilisateur360sc` et `desactiverUtilisateur360sc` dans `Code.gs` pour qu'elles ne dépendent plus de la récupération préalable des données.
    4.  Les nouvelles signatures de ces fonctions exigent maintenant que l'objet utilisateur complet (tel que retourné par la fonction de création `creerUtilisateur360sc`) soit fourni en paramètre.
    5.  Ces fonctions modifient ensuite cet objet en mémoire avant de l'envoyer directement via un `PUT`.

*   **Leçons Apprises:**
    1.  **Toujours se fier au contrat de l'API, pas aux conventions générales :** Même si "GET -> PUT" est une pratique courante, chaque API est unique. Il est impératif de valider les méthodes HTTP autorisées pour chaque endpoint.
    2.  **Lire attentivement les messages d'erreur de l'API :** L'erreur 405 et son en-tête `Allow: PUT` contenaient toutes les informations nécessaires pour diagnostiquer et résoudre le problème. C'est une source d'information primaire.
    3.  **L'agilité dans le développement est clé :** Il faut être prêt à abandonner rapidement une approche ou une hypothèse de conception lorsque les preuves montrent qu'elle est incorrecte.

---

## REX Item 7: Amélioration de la lisibilité des logs de test

*   **Problème:**
    Manque de clarté dans les journaux d'exécution lors du lancement successif de plusieurs fonctions de test.

*   **Description:**
    Sans un marqueur de début clair, les logs de différentes exécutions de test se mélangent, rendant difficile l'identification de la fonction source d'un log spécifique. Cela ralentit l'analyse et le débogage.

*   **Impact:**
    Perte de temps, risque de mauvaise interprétation des résultats.

*   **Solution Appliquée:**
    1.  Adoption d'une convention de logging pour toutes les fonctions de test.
    2.  Ajout systématique de la ligne `Logger.log("Lancement de la fonction de test : " + arguments.callee.name);` au tout début de chaque fonction de test (`maFonctionDeTestPour...`).
    3.  L'utilisation de `arguments.callee.name` permet de récupérer dynamiquement le nom de la fonction, rendant la solution robuste et facile à maintenir (pas de mise à jour manuelle du nom en cas de copier-coller).

*   **Leçons Apprises:**
    1.  **L'Observabilité des Tests est une fonctionnalité :** Des logs clairs ne sont pas un luxe, mais une nécessité pour un développement efficace.
    2.  **Standardiser les pratiques de logging :** Des conventions simples améliorent considérablement la productivité.
    3.  **Privilégier les solutions dynamiques et non répétitives (DRY) :** `arguments.callee.name` est un exemple parfait de code qui s'auto-documente et prévient les erreurs de maintenance.

---
Ce rapport peut être complété au fur et à mesure que nous avançons dans le projet et que nous rencontrons d'autres points d'apprentissage.

