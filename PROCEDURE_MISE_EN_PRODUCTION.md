# FILENAME: PROCEDURE_MISE_EN_PRODUCTION.md
# Version: 1.0.0
# Date: 2025-06-08 17:00
# Author: AI Senior Coder (pour Rolland MELET)
# Description: Guide technique détaillé pour l'activation de l'environnement de Production dans le projet GAS-CreationObjet360sc-API.

# Procédure Technique : Activation de l'Environnement de Production

## 1. Objectif

Ce document décrit la procédure complète pour configurer, activer et valider l'environnement de Production (PROD) pour le projet Google Apps Script `GAS-CreationObjet360sc-API`. Le respect scrupuleux de ces étapes est crucial pour garantir la sécurité des identifiants et le bon fonctionnement du script.

## 2. Prérequis : Informations à Collecter

Avant de commencer, vous devez avoir obtenu les informations suivantes spécifiques à l'environnement de **Production** :

**A. Configurations Publiques :**
- [ ] URL de base de l'API de Production (`API_BASE_URL`).
- [ ] URL de base pour le service Utilisateurs, si elle est différente (`USERS_API_BASE_URL`).
- [ ] ID de l'entreprise (`COMPANY_ID`).
- [ ] ID du "finger" pour la génération des `mcUrl` (`GENERATE_MC_FINGER`).
- [ ] ID du type de métadonnée pour les OF (`METADATA_AVATAR_TYPES.OF`).
- [ ] ID du type de métadonnée pour les MOULES (`METADATA_AVATAR_TYPES.MOULE`).
- [ ] ID du type de métadonnée par défaut (`METADATA_AVATAR_TYPES.DEFAULT`).

**B. Identifiants Secrets :**
- [ ] Nom d'utilisateur du compte de service de Production (`API_USERNAME_PROD`).
- [ ] Mot de passe du compte de service de Production (`API_PASSWORD_PROD`).

**IMPORTANT :** Les identifiants secrets ne devront **JAMAIS** être écrits dans le code ou commit sur Git.

---

## 3. Procédure Étape par Étape

### Étape 3.1 : Mettre à jour le Fichier de Configuration (`config.gs`)

1.  Ouvrez le fichier `config.gs` dans VSCode.
2.  Localisez l'objet `ENV_CONFIG.PROD`.
3.  Remplacez les valeurs `"VOTRE_..._PROD"` par les **configurations publiques** que vous avez collectées.
4.  Remplacez l'intégralité du contenu du fichier par le code ci-dessous, après y avoir inséré vos valeurs.

```javascript
// FILENAME: config.gs
// Version: 1.7.0
// Date: 2025-06-08 17:00
// Author: Rolland MELET
// Description: Ajout des configurations pour l'environnement de Production.

/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// --- MAPPING DES PROFILS UTILISATEUR ---
const ROLE_MAPPING = {
  "Admin":             ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"], 
  "BOSS":              ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"],
  "Duhalde":           ["ROLE_USER", "ROLE_DUHALDETEST"], 
  "Operateur":         ["ROLE_USER", "ROLE_OPERATEUR"],
  "ControleurQualite": ["ROLE_USER", "ROLE_CONTROLEUR_QUALITE"],
  "Levageur":          null,
  "Transporteur":      null,
  "Client":            null
};

// Common settings for the API
const COMMON_API_SETTINGS = {
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  USERS_ENDPOINT: "/api/v2/users", 
  MCS_SUFFIX_PATH: "/m_cs"
};

// --- MAPPING SPÉCIFIQUE POUR LES TYPES DE MOULES ---
const ALPHA_ID_MAPPING = {
  MouleEnveloppe: "v0:MOULE_ENVELOPPE",
  MouleToit: "v0:MOULE_TOIT",
  MouleDalle: "v0:MOULE_DALLE",
  Autre: "v0:MOULE_AUTRE"
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: { /* ... configuration DEV inchangée ... */ },
  TEST: { /* ... configuration TEST inchangée ... */ },
  PROD: {
    API_BASE_URL: "METTEZ_VOTRE_URL_DE_BASE_PROD_ICI", // ex: "https://apiv2.360sc.yt"
    COMPANY_ID: "METTEZ_VOTRE_ID_COMPANIE_PROD_ICI", // ex: "/api/companies/..."
    GENERATE_MC_FINGER: "METTEZ_VOTRE_MC_FINGER_ID_PROD_ICI", // ex: "/api/fingers/..."
    METADATA_AVATAR_TYPES: {
      OF: "METTEZ_VOTRE_METADATA_ID_OF_PROD_ICI",
      MOULE: "METTEZ_VOTRE_METADATA_ID_MOULE_PROD_ICI",
      DEFAULT: "METTEZ_VOTRE_METADATA_ID_DEFAULT_PROD_ICI"
    }
    // Si l'URL des utilisateurs est différente en PROD, ajoutez la ligne suivante :
    // USERS_API_BASE_URL: "METTEZ_URL_UTILISATEURS_PROD_ICI"
  }
};

/**
 * Retrieves the configuration for the specified system type.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @return {object} The configuration object for the system type.
 * @throws {Error} If the system type is invalid.
 */
function getConfiguration_(typeSysteme) { /* ... fonction inchangée ... */ }

// Définition des types d'objets à créer (structure de base pour OF)
const OBJECT_DEFINITIONS = [ /* ... définition inchangée ... */ ];
Use code with caution.
Markdown
Étape 3.2 : Ajouter les Identifiants Secrets de Production
Ouvrez votre projet dans l'éditeur Google Apps Script (clasp open).
Naviguez vers : Paramètres du projet (l'icône engrenage ⚙️ sur la gauche).
Descendez jusqu'à la section Propriétés du script.
Cliquez sur Ajouter une propriété de script.
Ajoutez les deux propriétés suivantes, en utilisant exactement ces noms de clé :
Propriété (Clé)	Valeur
API_USERNAME_PROD	Le nom d'utilisateur du compte de service de production.
API_PASSWORD_PROD	Le mot de passe du compte de service de production.
Cliquez sur Enregistrer les propriétés du script.
![alt text](https://img.shields.io/badge/SÉCURITÉ-CRITIQUE-red)
Ne stockez JAMAIS ces valeurs ailleurs que dans les Propriétés du Script.
Étape 3.3 : Créer un Test de Validation Non-Destructif
Pour valider la configuration de production sans créer de données inutiles, nous allons ajouter un test qui ne fait qu'une seule chose : s'authentifier.
Ouvrez le fichier tests.gs dans VSCode.
Ajoutez la nouvelle fonction de test suivante à la fin du fichier :
/**
 * @brief Test de validation non-destructif pour l'environnement de Production.
 * @description Cette fonction tente uniquement de s'authentifier auprès de l'API de PROD.
 * Elle ne crée, ne modifie ni ne supprime aucune donnée.
 */
function testAuthentication_PROD() {
  Logger.log("Lancement du test de validation pour l'environnement PROD.");
  Logger.log("ATTENTION : Ce test ne doit interagir qu'avec le service d'authentification.");
  const testSystemType = "PROD";
  try {
    const token = getAuthToken_(testSystemType);
    if (token) {
      Logger.log("✅ SUCCÈS : L'authentification à l'environnement de Production a réussi.");
    } else {
      throw new Error("Le token retourné est vide ou nul.");
    }
  } catch (e) {
    Logger.log(`❌ ERREUR : Échec de l'authentification à l'environnement de Production. Message : ${e.message}`);
    Logger.log(`Stack Trace: ${e.stack}`);
  }
}
Use code with caution.
JavaScript
Étape 3.4 : Déployer et Exécuter le Test de Validation
Depuis votre terminal dans VSCode, poussez toutes les modifications :
clasp push
Use code with caution.
Sh
Ouvrez le projet dans l'éditeur en ligne :
clasp open
Use code with caution.
Sh
Dans l'éditeur, sélectionnez la nouvelle fonction testAuthentication_PROD dans le menu déroulant.
Cliquez sur Exécuter.
Ouvrez les journaux (Afficher > Journaux).
Étape 3.5 : Valider le Résultat
Si le test réussit, vous devriez voir le message : ✅ SUCCÈS : L'authentification à l'environnement de Production a réussi. dans les logs.
Si le test échoue, le message d'erreur vous donnera une piste. Les causes communes sont :
Une erreur de frappe dans les identifiants ou le nom des propriétés.
Une URL de base incorrecte dans config.gs.
Un problème de pare-feu ou de réseau.
4. Post-Activation
Une fois le test d'authentification réussi, votre script est techniquement prêt à être utilisé en production. Toutes les fonctions (creer..., activer...) peuvent maintenant être appelées avec typeSysteme = "PROD".