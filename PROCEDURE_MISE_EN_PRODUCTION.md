# FILENAME: PROCEDURE_MISE_EN_PRODUCTION.md
# Version: 1.1.0
# Date: 2025-06-10 12:15
# Author: AI Senior Coder (pour Rolland MELET)
# Description: Mise à jour majeure pour refléter l'architecture API V1/V2 et la nouvelle configuration granulaire des métadonnées d'OF.

# Procédure Technique : Activation de l'Environnement de Production

## 1. Objectif

Ce document décrit la procédure complète pour configurer, activer et valider l'environnement de Production (PROD) pour le projet Google Apps Script `GAS-CreationObjet360sc-API`. Le respect scrupuleux de ces étapes est crucial pour garantir la sécurité des identifiants et le bon fonctionnement du script.

## 2. Prérequis : Informations à Collecter

Avant de commencer, vous devez avoir obtenu les informations suivantes spécifiques à l'environnement de **Production** de 360SmartConnect :

**A. Configurations Publiques :**
- [ ] **URL de base de l'API V2** (`API_BASE_URL`) : Utilisée pour les Avatars et l'authentification.
- [ ] **URL de base de l'API V1** (`USERS_API_BASE_URL`) : Utilisée pour les Utilisateurs.
- [ ] **ID de l'entreprise** (`COMPANY_ID`).
- [ ] **ID du "finger"** pour la génération des `mcUrl` (`GENERATE_MC_FINGER`).
- [ ] **IDs des types de métadonnées pour les OF :**
    - [ ] ID pour `OF_PRINCIPAL`.
    - [ ] ID pour `OF_ELEC`.
    - [ ] ID pour `OF_COMPOSANT` (utilisé pour DALLE, TOIT, ENVELOPPE).
- [ ] **IDs des types de métadonnées génériques :**
    - [ ] ID pour `MOULE`.
    - [ ] ID `DEFAULT` (par défaut).

**B. Identifiants Secrets :**
- [ ] Nom d'utilisateur du compte de service de Production (`API_USERNAME_PROD`).
- [ ] Mot de passe du compte de service de Production (`API_PASSWORD_PROD`).

**IMPORTANT :** Les identifiants secrets ne devront **JAMAIS** être écrits dans le code ou commit sur Git.

---

## 3. Procédure Étape par Étape

### Étape 3.1 : Mettre à jour le Fichier de Configuration (`config.gs`)

1.  Ouvrez le fichier `config.gs` dans VSCode.
2.  Localisez l'objet `ENV_CONFIG.PROD`.
3.  Remplacez **toutes les valeurs placeholder** par les **configurations publiques** que vous avez collectées pour la production. Soyez particulièrement attentif à la section `METADATA_AVATAR_TYPES`.

### Étape 3.2 : Ajouter les Identifiants Secrets de Production

1.  Ouvrez votre projet dans l'éditeur Google Apps Script en ligne (`clasp open`).
2.  Naviguez vers : **Paramètres du projet** (l'icône engrenage ⚙️ sur la gauche).
3.  Descendez jusqu'à la section **Propriétés du script** et cliquez sur **Modifier les propriétés du script**.
4.  Cliquez sur **Ajouter une propriété de script**.
5.  Ajoutez les deux propriétés suivantes, en utilisant **exactement ces noms de clé** :

| Propriété (Clé) | Valeur |
| :--- | :--- |
| `API_USERNAME_PROD` | Le nom d'utilisateur du compte de service de production. |
| `API_PASSWORD_PROD` | Le mot de passe du compte de service de production. |

6.  Cliquez sur **Enregistrer les propriétés du script**.

> **SÉCURITÉ CRITIQUE :** Ne stockez JAMAIS ces valeurs ailleurs que dans les Propriétés du Script.

### Étape 3.3 : Déployer et Valider la Configuration

Pour valider que la configuration est correcte, nous allons utiliser les fonctions de test dédiées à la production qui sont déjà dans `tests.gs`.

1.  **Poussez les modifications de la configuration :**
    ```sh
    clasp push
    ```

2.  **Ouvrez le projet dans l'éditeur en ligne :**
    ```sh
    clasp open
    ```

3.  **Exécutez les tests de validation non-destructifs un par un :**

    *   **Test 1 : Authentification**
        *   Sélectionnez la fonction `maFonctionDeTestPourAuth_PROD`.
        *   Cliquez sur **Exécuter**.
        *   Vérifiez les journaux (`Afficher > Journaux`). Vous devez voir le message : `✅ SUCCÈS : L'authentification à l'environnement de Production a réussi.`
        *   Si cela échoue, vérifiez les identifiants, les noms des propriétés et l'URL `API_BASE_URL`.

    *   **Test 2 : Création d'un objet de test**
        *   Sélectionnez la fonction `maFonctionDeTestPourCreerObjetUnique_PROD`.
        *   Cliquez sur **Exécuter**.
        *   Vérifiez les journaux. Vous devez voir un message de succès indiquant la création d'un objet de test en Production.
        *   Si cela échoue, vérifiez les IDs (`COMPANY_ID`, `GENERATE_MC_FINGER`, IDs `METADATA_AVATAR_TYPES`).

### Étape 3.4 : Test End-to-End (Optionnel mais Recommandé)

Si les tests non-destructifs ont réussi, vous pouvez effectuer un test de création complet pour valider l'ensemble du processus.

1.  Dans l'éditeur, sélectionnez la fonction `testEndToEnd_PROD`.
2.  Lisez l'avertissement dans les logs, puis cliquez sur **Exécuter**.
3.  Cette fonction créera une structure OF complète sur l'environnement de Production.
4.  Vérifiez que le test se termine avec succès et, si possible, validez la présence des objets dans l'interface de 360SmartConnect.

## 4. Post-Activation

Une fois tous les tests de validation réussis, votre script est techniquement prêt à être utilisé en production. Toutes les fonctions (`creerMultiplesObjets360sc`, `creerUtilisateur360sc`, etc.) peuvent maintenant être appelées depuis vos applications (ex: AppSheet) en passant `"PROD"` comme paramètre `typeSysteme`.