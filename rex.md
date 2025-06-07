# FILENAME: rex.md
# Version: 1.1.0
# Date: 2025-06-07 15:15
# Author: Rolland MELET (Collaboratively with AI Senior Coder)
# Description: Consolidation et mise à jour du rapport de retours d'expérience.

# Rapport de Retour d'Expérience (REX) - Projet GAS-CreationObjet360sc-API

## REX Item 1: Spécificité des configurations par environnement

*   **Problème:**
    Échecs de requêtes API (erreurs 400 "Item not found" et 404 "Not Found") lors du passage d'un environnement (DEV) à un autre (TEST).

*   **Description:**
    Initialement, le script supposait que de nombreuses valeurs de configuration (IDs pour `generateMCFinger`, `metadata_avatar_types`, et même les URLs de base de l'API) étaient identiques entre les environnements. Les tests ont révélé que :
    1.  Les identifiants de ressources (`/api/fingers/...`, `/api/metadata_avatar_types/...`) sont uniques à chaque environnement.
    2.  Les URLs de base de l'API peuvent différer pour certains services (ex: `/auth` sur `apiv2.360sc.yt` vs `/users` sur `api.360sc.yt`).

*   **Impact:**
    Échecs systématiques des tests sur les nouveaux environnements, bloquant la validation et le déploiement.

*   **Solution Appliquée:**
    1.  **Refactoring de `config.gs` :** Toutes les configurations spécifiques à un environnement (IDs, URLs) ont été déplacées à l'intérieur de l'objet de cet environnement (`ENV_CONFIG.DEV`, `ENV_CONFIG.TEST`).
    2.  **Refactoring de `apiHandler.gs` :** La logique de construction des URLs a été adaptée pour gérer les cas où des services ont des URLs de base différentes au sein du même environnement.

*   **Leçons Apprises:**
    1.  **Principe de Ségrégation Totale des Configurations :** Toujours présumer que **toutes** les configurations (identifiants, URLs) sont uniques à chaque environnement. Centraliser ces valeurs par environnement dans `config.gs` est la meilleure pratique.
    2.  **Valider Systématiquement les Hypothèses :** Ne jamais supposer qu'une configuration d'un environnement fonctionnera sur un autre. Il faut valider chaque endpoint sur chaque environnement.
    3.  **Format des Références API (IRI) :** Les API RESTful attendent souvent des identifiants de ressource complets (IRI, ex: `/api/resource/id`) et non des ID bruts.

---

## REX Item 2: Gestion des identifiants et simplification pour AppSheet

*   **Problème:**
    1. La gestion initiale des identifiants ne supportait pas plusieurs environnements. 2. Les fonctions de script retournaient des objets JSON complexes, difficiles à utiliser directement dans AppSheet.

*   **Description:**
    Le script devait stocker des paires username/password distinctes pour DEV, TEST et PROD. De plus, les fonctions comme `creerObjetUnique360sc` retournaient un objet JSON complet, ce qui obligeait à faire du traitement de données côté AppSheet.

*   **Impact:**
    Risque d'utiliser les mauvais identifiants et complexification de la logique dans les bots AppSheet.

*   **Solution Appliquée:**
    1.  **Identifiants :** `utils.gs` a été modifié pour stocker les identifiants avec des clés uniques par environnement dans `PropertiesService` (ex: `API_USERNAME_TEST`).
    2.  **Simplification pour AppSheet :** Des fonctions "wrapper" dédiées ont été créées (ex: `creerObjetUnique360scForAppSheet`, `creerUtilisateurEtRecupererId360sc`). Ces wrappers appellent les fonctions principales mais retournent une valeur simple et directement utilisable (une URL, un ID, ou un message d'erreur).

*   **Leçons Apprises:**
    1.  **Adapter les interfaces pour les consommateurs :** Il est crucial de concevoir des fonctions dont le retour est aussi simple que possible pour le système qui les appelle (ici, AppSheet).
    2.  **Utiliser des clés distinctes pour les secrets :** Préfixer les clés dans `PropertiesService` par environnement est une pratique de sécurité et de robustesse essentielle.

---

## REX Item 3: Contraintes de l'API et agilité de conception

*   **Problème:**
    L'API 360sc ne se comporte pas toujours selon les conventions REST les plus courantes, menant à des erreurs inattendues.

*   **Description:**
    Lors de la mise à jour d'un utilisateur, la stratégie "GET -> Modify -> PUT" a été tentée. Cependant, l'API a retourné une erreur `HTTP 405 Method Not Allowed`, indiquant que la méthode `GET` sur l'endpoint `/api/v2/users/{id}` n'est pas autorisée.

*   **Impact:**
    La stratégie de conception initiale était invalide, nécessitant une réécriture complète de la logique d'activation/désactivation.

*   **Solution Appliquée:**
    1.  Abandon de la stratégie "GET -> PUT".
    2.  La nouvelle approche consiste à ce que les fonctions d'activation/désactivation reçoivent en paramètre l'objet utilisateur complet (obtenu lors de sa création).
    3.  La fonction modifie cet objet en mémoire (`enabled: true/false`) et l'envoie directement via un `PUT`.

*   **Leçons Apprises:**
    1.  **Toujours se fier au contrat réel de l'API :** Il est impératif de valider les méthodes HTTP autorisées pour chaque endpoint et de ne pas se baser uniquement sur les conventions.
    2.  **Lire attentivement les messages d'erreur de l'API :** L'erreur 405 contenait toutes les informations nécessaires pour résoudre le problème (`Allow: PUT`).
    3.  **L'agilité dans le développement est clé :** Il faut être prêt à pivoter rapidement quand une approche de conception se révèle incorrecte.

---

## REX Item 4: Amélioration de la structure du projet et de la testabilité

*   **Problème:**
    Le projet devenait difficile à maintenir : le fichier `Code.gs` dépassait les 500 lignes, mélangeait code de production et de test, et les logs de test manquaient de clarté.

*   **Description:**
    Au fur et à mesure que des fonctionnalités étaient ajoutées, `Code.gs` est devenu un "fourre-tout". Identifier quel test produisait quel log était devenu fastidieux.

*   **Impact:**
    Maintenabilité réduite, non-respect des contraintes du projet, perte de temps en débogage.

*   **Solution Appliquée:**
    1.  **Refactoring :** Scission du code en deux fichiers logiques : `Code.gs` (production) et `tests.gs` (tests).
    2.  **Observabilité :** Ajout d'un log de lancement standardisé (`Logger.log("Lancement de la fonction de test : " + arguments.callee.name);`) au début de chaque fonction de test.
    3.  **Automatisation :** Création d'une suite de tests maîtresse `testSuiteComplete()` dans `tests.gs` pour exécuter tous les scénarios clés en une seule fois.

*   **Leçons Apprises:**
    1.  **Séparation des préoccupations (SoC) :** Séparer le code de production du code de test est une pratique fondamentale qui améliore la clarté, la sécurité et la maintenabilité.
    2.  **L'Observabilité des Tests est une fonctionnalité :** Des logs clairs et structurés ne sont pas un luxe, mais une nécessité.
    3.  **L'automatisation des tests est un gain de temps :** Une suite de tests complète permet une validation rapide et fiable du projet après chaque modification (tests de régression).

---

## REX Item 5: Simplification de la logique métier via le "Mapping"

*   **Problème:**
    L'intégration avec AppSheet pour l'activation d'utilisateurs était encore trop complexe, car AppSheet devait fournir un tableau de rôles techniques, ce qu'il ne peut pas faire facilement.

*   **Description:**
    La fonction `activerUtilisateur360scForAppSheet` nécessitait de passer un tableau de rôles. La seule façon de le faire depuis AppSheet aurait été une formule `SPLIT()` complexe et peu intuitive pour l'utilisateur final.

*   **Impact:**
    Configuration fragile et complexe dans AppSheet, exposant la logique des rôles techniques à l'application cliente.

*   **Solution Appliquée:**
    1.  Création d'une constante `ROLE_MAPPING` dans `config.gs`. Cet objet sert de "table de correspondance" entre un nom de profil simple (ex: "Operateur") et la liste des rôles techniques correspondants.
    2.  Création d'un nouveau wrapper `activerUtilisateurParProfil360sc` qui prend un simple `profil` en chaîne de caractères.
    3.  Cette fonction utilise le mapping pour trouver les bons rôles, ce qui masque toute la complexité à AppSheet.

*   **Leçons Apprises:**
    1.  **Configuration plutôt que code :** Déplacer la logique métier (quel profil a quels rôles) dans un fichier de configuration la rend beaucoup plus facile à maintenir et à faire évoluer sans toucher au code de la fonction.
    2.  **Concevoir pour l'utilisateur final (de l'API) :** La meilleure abstraction est celle qui rend l'utilisation de la fonction la plus simple et la plus intuitive possible pour le système qui l'appelle (ici, AppSheet).