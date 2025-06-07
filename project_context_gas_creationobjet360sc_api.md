**FILENAME:** `project_context_gas_creationobjet360sc_api.md`
**Version:** 1.0.0
**Date:** 2025-06-07 15:30
**Auteur:** Rolland MELET (Généré par AI Senior Coder)
**Description:** Snapshot complet de l'état du projet "GAS-CreationObjet360sc-API" à la fin de l'implémentation de la gestion des utilisateurs. À utiliser pour initialiser un nouvel échange.

## Résumé du Projet

Ce projet Google Apps Script a pour objectif d'interagir avec l'API de la plateforme 360SmartConnect. Il fournit des fonctions pour le cycle de vie complet des objets "Avatar" (OF, Moules) et des Utilisateurs, avec des wrappers dédiés pour une intégration simplifiée avec AppSheet.

## Informations Clés

*   **PROJECT_NAME:** `GAS-CreationObjet360sc-API`
*   **SCRIPT_ID:** `142FpeFN1CGptXBMCIeRUSYLiDXAr_xrOch8E7sMmxqyAe3E6hiCHfcxn`
*   **GITHUB_REPO (supposé):** `https://github.com/RollandMELET/GAS-CreationObjet360sc-API`

## État Actuel du Projet

*   **CURRENT_PROJECT_PHASE:** Phase 2 : Implémentation de la gestion des utilisateurs (Stable et Testée).
*   **LAST_ACTION_COMPLETED:** Finalisation et test du cycle de vie complet des utilisateurs (Créer, Activer, Désactiver) et refactoring du projet pour séparer le code de production (`Code.gs`) du code de test (`tests.gs`). Une suite de tests complète (`testSuiteComplete`) a été créée et exécutée avec succès.

## Structure du Répertoire

```
└── rollandmelet-gas-creationobjet360sc-api/
    ├── README.md
    ├── apiHandler.gs
    ├── appsscript.json
    ├── Code.gs
    ├── config.gs
    ├── tests.gs
    ├── utils.gs
    ├── rex.md
    └── .clasp.json
```

## Contenu des Fichiers

--- START OF FILE: `config.gs` ---
```javascript
// FILENAME: config.gs
// Version: 1.6.0
// Date: 2025-06-07 15:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de ROLE_MAPPING pour la gestion des profils utilisateur.
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// --- MAPPING DES PROFILS UTILISATEUR ---
// Fait le lien entre le profil choisi dans AppSheet et les rôles techniques de l'API.
// IMPORTANT : Les listes de rôles techniques ci-dessous sont des hypothèses et DOIVENT être confirmées.
const ROLE_MAPPING = {
  // Profils à activer
  "Admin":             ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"], 
  "BOSS":              ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"], // Supposé identique à Admin
  "Duhalde":           ["ROLE_USER", "ROLE_DUHALDETEST"], 
  "Operateur":         ["ROLE_USER", "ROLE_OPERATEUR"],
  "ControleurQualite": ["ROLE_USER", "ROLE_CONTROLEUR_QUALITE"], // Clé sans accent pour la sécurité

  // Profils configurés comme non activables pour le moment
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
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    COMPANY_ID: "/api/companies/683097e698355",
    GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/68309961b20ee",
      MOULE: "/api/metadata_avatar_types/68309a60e3f94",
      DEFAULT: "/api/metadata_avatar_types/683097e6c75c7"
    }
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt", 
    COMPANY_ID: "/api/companies/683fff330baf4",
    GENERATE_MC_FINGER: "/api/fingers/6364149b51f85",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/6840002e05ac2",
      MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
      DEFAULT: "/api/metadata_avatar_types/68309961b20ee"
    }
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    COMPANY_ID: "VOTRE_ID_COMPANIE_PROD",
    GENERATE_MC_FINGER: "VOTRE_MC_FINGER_ID_POUR_PROD",
    METADATA_AVATAR_TYPES: {
      OF: "VOTRE_METADATA_ID_OF_POUR_PROD",
      MOULE: "VOTRE_METADATA_ID_MOULE_POUR_PROD",
      DEFAULT: "VOTRE_METADATA_ID_DEFAULT_POUR_PROD"
    }
  }
};

/**
 * Retrieves the configuration for the specified system type.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @return {object} The configuration object for the system type.
 * @throws {Error} If the system type is invalid.
 */
function getConfiguration_(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  const envSpecificConfig = ENV_CONFIG[systemTypeUpper];
  if (!envSpecificConfig) {
    throw new Error(`Configuration non valide pour le type de système : ${typeSysteme}. Doit être "DEV", "TEST", ou "PROD".`);
  }
  return { ...COMMON_API_SETTINGS, ...envSpecificConfig };
}

// Définition des types d'objets à créer (structure de base pour OF)
const OBJECT_DEFINITIONS = [
  { key: "PAC_360scID", alphaId: "v0:OF_PRINCIPAL", nameSuffix: "" },
  { key: "PAC_360scID_ENV", alphaId: "v0:OF_ENVELOPPE", nameSuffix: "-ENV" },
  { key: "PAC_360scID_DALLE", alphaId: "v0:OF_DALLE", nameSuffix: "-DALLE" },
  { key: "PAC_360scID_TOIT", alphaId: "v0:OF_TOIT", nameSuffix: "-TOIT" },
  { key: "PAC_360scID_ELEC", alphaId: "v0:OF_ELEC", nameSuffix: "-ELEC" }
];
```
--- END OF FILE: `config.gs` ---

--- START OF FILE: `Code.gs` ---
```javascript
// FILENAME: Code.gs
// Version: 1.16.0
// Date: 2025-06-07 15:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout du wrapper activerUtilisateurParProfil360sc utilisant un mapping de rôles.
/**
 * @fileoverview Fichier principal contenant les fonctions exposées et appelables par des services externes comme AppSheet.
 */

function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || !typeSysteme) { throw new Error("'nomDeObjetBase' et 'typeSysteme' requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "OF";
    if (typeObjetUpper !== 'OF') { throw new Error("Usage incorrect: 'creerMultiplesObjets360sc' est réservé à 'OF'."); }
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES.OF;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) { throw new Error(`'METADATA_AVATAR_TYPES.OF' non configuré pour ${systemTypeUpper}.`); }
    Logger.log(`Début création multiple pour OF '${nomDeObjetBase}', sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        finalOutput[objDef.key] = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
      } catch (e) { throw new Error(`Échec étape '${objDef.key}': ${e.message}`); }
    }
    finalOutput.success = true;
    finalOutput.message = "Tous les objets OF ont été créés avec succès.";
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerMultiplesObjets360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || !typeSysteme || !typeMoule) { throw new Error("nomDeObjetBase, typeSysteme, typeMoule sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const alphaIdSpecifique = ALPHA_ID_MAPPING[typeMoule];
    if (!alphaIdSpecifique) { throw new Error(`Type de moule inconnu : '${typeMoule}'.`); }
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES[typeObjetUpper] || config.METADATA_AVATAR_TYPES.DEFAULT;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) { throw new Error(`Type d'objet '${typeObjetUpper}' non supporté pour ${systemTypeUpper}.`);}
    const objectNameForApi = `${alphaIdSpecifique}:${nomDeObjetBase}`;
    Logger.log(`Début création objet unique: ${objectNameForApi} pour ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, alphaIdSpecifique, metadataAvatarTypeId);
    finalOutput.success = true;
    finalOutput.message = `Objet unique '${objectNameForApi}' créé.`;
    finalOutput.mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.objectNameCreated = objectNameForApi;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur création objet unique.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerObjetUnique360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule) {
  Logger.log(`Appel creerObjetUnique360scForAppSheet: nom=${nomDeObjetBase}, sys=${typeSysteme}, typeMoule=${typeMoule}`);
  const resultString = creerObjetUnique360sc(nomDeObjetBase, typeSysteme, "MOULE", typeMoule);
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.mcUrl) { return result.mcUrl; } 
    else { return `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`; }
  } catch (e) { return `ERREUR CRITIQUE PARSING: ${e.message}.`; }
}

function creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !username || !email || !firstName || !lastName) { throw new Error("typeSysteme, username, email, firstName, lastName sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    getConfiguration_(systemTypeUpper); 
    Logger.log(`Début création utilisateur '${username}', sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    const userData = { username: username, email: email, firstName: firstName, lastName: lastName, tags: Array.isArray(tags) ? tags : [] };
    const createdUser = createUser_(token, systemTypeUpper, userData);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur '${username}' créé.`;
    finalOutput.user = createdUser; 
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur création utilisateur.";
    finalOutput.error = error.message; 
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerUtilisateurEtRecupererId360sc(typeSysteme, username, email, firstName, lastName, tags) {
  Logger.log(`Appel creerUtilisateurEtRecupererId360sc: user=${username}, sys=${typeSysteme}`);
  const resultString = creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags);
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.user && typeof result.user.id !== 'undefined' && result.user.id !== null) {
      Logger.log(`Succès. ID numérique: ${result.user.id}`);
      return String(result.user.id);
    } else {
      return `ERREUR: ${result.error || result.message || 'ID numérique manquant.'}`;
    }
  } catch (e) { return `ERREUR CRITIQUE PARSING: ${e.message}.`; }
}

function activerUtilisateur360sc(typeSysteme, userData, roles) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !userData || !userData.id || !Array.isArray(roles) || roles.length === 0) {
      throw new Error("typeSysteme, userData (avec id) et roles (tableau non vide) sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début de l'activation pour l'utilisateur ID ${userData.id}, système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    let payload = { ...userData };
    payload.enabled = true;
    payload.roles = roles;
    delete payload.createdAt;
    delete payload.lastLogin;
    delete payload.passwordRequestedAt;
    if (payload.id && !String(payload.id).startsWith('/')) { payload.id = `/api/users/${payload.id}`; }
    if (!payload['@id']) { payload['@id'] = `/api/users/${userData.id}`; }
    const updatedUser = updateUser_(token, systemTypeUpper, userData.id, payload);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur ID ${userData.id} activé.`;
    finalOutput.user = updatedUser;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur activation utilisateur ID ${userData ? userData.id : 'inconnu'}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans activerUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function desactiverUtilisateur360sc(typeSysteme, userData) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !userData || !userData.id) { throw new Error("typeSysteme et userData (avec id) sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début de la désactivation pour l'utilisateur ID ${userData.id}, système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    let payload = { ...userData };
    payload.enabled = false;
    delete payload.createdAt;
    delete payload.lastLogin;
    delete payload.passwordRequestedAt;
    if (payload.id && !String(payload.id).startsWith('/')) { payload.id = `/api/users/${payload.id}`; }
    if (!payload['@id']) { payload['@id'] = `/api/users/${userData.id}`; }
    const updatedUser = updateUser_(token, systemTypeUpper, userData.id, payload);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur ID ${userData.id} désactivé.`;
    finalOutput.user = updatedUser;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur désactivation utilisateur ID ${userData ? userData.id : 'inconnu'}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans desactiverUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function activerUtilisateur360scForAppSheet(typeSysteme, userId, username, email, firstName, lastName, roles) {
  Logger.log(`Lancement de activerUtilisateur360scForAppSheet pour l'utilisateur ID ${userId}`);
  try {
    const config = getConfiguration_(typeSysteme);
    let userData = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      company: config.COMPANY_ID,
      tags: [],
      groups: [],
      profiles: [],
      rolesv2: [],
      customFields: { ticketing: [], projectIds: [], buildingLogbook: [], redirection_after_login: null }
    };
    const resultString = activerUtilisateur360sc(typeSysteme, userData, roles);
    const result = JSON.parse(resultString);
    if (result.success) {
      Logger.log(`Activation réussie pour l'ID ${userId} via le wrapper AppSheet.`);
      return "SUCCES";
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue depuis activerUtilisateur360sc.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE dans le wrapper AppSheet: ${e.message}`;
    Logger.log(criticalError);
    return criticalError;
  }
}

function desactiverUtilisateur360scForAppSheet(typeSysteme, userId, username, email, firstName, lastName) {
  Logger.log(`Lancement de desactiverUtilisateur360scForAppSheet pour l'utilisateur ID ${userId}`);
  try {
    const config = getConfiguration_(typeSysteme);
    let userData = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      company: config.COMPANY_ID,
      tags: [],
      groups: [],
      profiles: [],
      rolesv2: [],
      customFields: { ticketing: [], projectIds: [], buildingLogbook: [], redirection_after_login: null }
    };
    const resultString = desactiverUtilisateur360sc(typeSysteme, userData);
    const result = JSON.parse(resultString);
    if (result.success) {
      Logger.log(`Désactivation réussie pour l'ID ${userId} via le wrapper AppSheet.`);
      return "SUCCES";
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue depuis desactiverUtilisateur360sc.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE dans le wrapper AppSheet: ${e.message}`;
    Logger.log(criticalError);
    return criticalError;
  }
}

function activerUtilisateurParProfil360sc(typeSysteme, userId, username, email, firstName, lastName, profil) {
  Logger.log(`Lancement de activerUtilisateurParProfil360sc pour l'ID ${userId} avec le profil '${profil}'`);
  try {
    const roles = ROLE_MAPPING[profil];
    if (!roles) {
      if (ROLE_MAPPING.hasOwnProperty(profil)) {
        throw new Error(`Le profil '${profil}' est configuré comme non activable.`);
      } else {
        throw new Error(`Profil inconnu : '${profil}'. Vérifiez la configuration ROLE_MAPPING.`);
      }
    }
    const config = getConfiguration_(typeSysteme);
    let userData = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      company: config.COMPANY_ID,
      tags: [],
      groups: [],
      profiles: [],
      rolesv2: [],
      customFields: { ticketing: [], projectIds: [], buildingLogbook: [], redirection_after_login: null }
    };
    const resultString = activerUtilisateur360sc(typeSysteme, userData, roles);
    const result = JSON.parse(resultString);
    if (result.success) {
      Logger.log(`Activation réussie pour l'ID ${userId} avec le profil '${profil}'.`);
      return "SUCCES";
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE dans le wrapper par profil: ${e.message}`;
    Logger.log(criticalError);
    return criticalError;
  }
}
```
--- END OF FILE: `Code.gs` ---

--- START OF FILE: `tests.gs` ---
```javascript
// FILENAME: tests.gs
// Version: 1.3.0
// Date: 2025-06-07 15:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout du test pour le nouveau wrapper d'activation par profil.
/**
 * @fileoverview Contient toutes les fonctions de test pour valider les fonctionnalités
 * du projet, séparées du code de production pour une meilleure organisation.
 */

function maFonctionDeTestPourAuth() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var resultatString = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerObjet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomObjetBase = "TestUniqueObj";
  var testAlphaId = "v0:OF_PRINCIPAL";
  var config = getConfiguration_(testSystemType);
  var testMetadataTypeId = config.METADATA_AVATAR_TYPES.OF;
  var resultatString = testCreateSingleObject(testSystemType, testNomObjetBase, testAlphaId, testMetadataTypeId);
  Logger.log("Résultat de testCreateSingleObject (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_SUCCES() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetMultiSucces";
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, "OF");
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
}

function maFonctionDeTestPourCreerObjetUnique() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV";
  var testTypeMoule = "MouleEnveloppe"; 
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, "MOULE", testTypeMoule);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMoulePourAppSheet";
  var testSystemType = "DEV"; 
  var testTypeMoule = "MouleEnveloppe"; 
  var resultat = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMoule);
  Logger.log(`Résultat test AppSheet: ${resultat}`);
}

function maFonctionDeTestPourCreerUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUser" + timestamp;
  var testEmail = "testuser" + timestamp + "@example.com";
  var resultatString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, "Test", "Utilisateur" + timestamp, ["testTag1"]);
  Logger.log("Résultat creerUtilisateur360sc (JSON): " + resultatString);
}

function maFonctionDeTestPourCreerUtilisateurEtRecupererId() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUserIdNum" + timestamp; 
  var testEmail = "testuseridnum" + timestamp + "@example.com";
  var resultatId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, "TestIdNum", "UtilisateurIdNum" + timestamp, []);
  Logger.log(`Résultat du test (devrait être un ID numérique ou ERREUR): ${resultatId}`);
}

function maFonctionDeTestPourActiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestToActivate" + timestamp;
  var testEmail = "testtoactivate" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToActivate", "User" + timestamp, []));
  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé.`);
    return;
  }
  var userObjectToActivate = creationResultObject.user; 
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST", "ROLE_DUHALDE-TEST"];
  var activationResultString = activerUtilisateur360sc(testSystemType, userObjectToActivate, rolesToAssign);
  Logger.log("Résultat activation (JSON): " + activationResultString);
}

function maFonctionDeTestPourDesactiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestToDeactivate" + timestamp;
  var testEmail = "testtodeactivate" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToDeactivate", "User", []));
  if (!creationResultObject.success) { return; }
  var userObjectToTest = creationResultObject.user;
  var activationResultObject = JSON.parse(activerUtilisateur360sc(testSystemType, userObjectToTest, ["ROLE_USER"]));
  if (!activationResultObject.success) { return; }
  var activatedUserObject = activationResultObject.user;
  var deactivationResultString = desactiverUtilisateur360sc(testSystemType, activatedUserObject);
  var deactivationResultObject = JSON.parse(deactivationResultString);
  if (deactivationResultObject.success) {
    Logger.log("Vérification: 'enabled' est bien 'false' ? -> " + deactivationResultObject.user.enabled);
  }
}

function maFonctionDeTestPourActiverUtilisateurForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestAppSheet" + timestamp;
  var testEmail = "testappsheet" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "AppSheet", "User" + timestamp, []));
  if (!creationResultObject.success) { return; }
  var createdUser = creationResultObject.user;
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST"];
  var resultatWrapper = activerUtilisateur360scForAppSheet(testSystemType, createdUser.id, createdUser.username, createdUser.email, createdUser.firstName, createdUser.lastName, rolesToAssign);
  Logger.log(`Résultat du wrapper AppSheet: ${resultatWrapper}`);
}

function maFonctionDeTestPourDesactiverUtilisateurForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestDeactAppS" + timestamp;
  var testEmail = "testdeactapps" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "DeactAppSheet", "User", []));
  if (!creationResultObject.success) { return; }
  var createdUser = creationResultObject.user;
  var activationResultObject = JSON.parse(activerUtilisateur360sc(testSystemType, createdUser, ["ROLE_USER"]));
  if (!activationResultObject.success) { return; }
  var activatedUser = activationResultObject.user;
  var resultatWrapper = desactiverUtilisateur360scForAppSheet(testSystemType, activatedUser.id, activatedUser.username, activatedUser.email, activatedUser.firstName, activatedUser.lastName);
  Logger.log(`Résultat du wrapper de désactivation AppSheet: ${resultatWrapper}`);
}

function maFonctionDeTestPourActiverUtilisateurParProfil() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp1 = new Date().getTime();
  var user1 = { username: "TestProfilOp" + timestamp1, email: "testprofilop" + timestamp1 + "@example.com", firstName: "Profil", lastName: "Opérateur" };
  Logger.log("\n--- SCÉNARIO 1: Test avec un profil valide ('Operateur') ---");
  var creationResult1 = JSON.parse(creerUtilisateur360sc(testSystemType, user1.username, user1.email, user1.firstName, user1.lastName, []));
  if (!creationResult1.success) { Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé.`); return; }
  var createdUser1 = creationResult1.user;
  var resultatWrapper1 = activerUtilisateurParProfil360sc(testSystemType, createdUser1.id, createdUser1.username, createdUser1.email, createdUser1.firstName, createdUser1.lastName, "Operateur");
  Logger.log(`Résultat du wrapper pour 'Operateur': ${resultatWrapper1}`);
  Logger.log("\n--- SCÉNARIO 2: Test avec un profil non activable ('Client') ---");
  var resultatWrapper2 = activerUtilisateurParProfil360sc(testSystemType, "12345", "dummy", "dummy@d.com", "dummy", "dummy", "Client");
  Logger.log(`Résultat du wrapper pour 'Client' (devrait être une erreur): ${resultatWrapper2}`);
  Logger.log("\n--- SCÉNARIO 3: Test avec un profil inexistant ---");
  var resultatWrapper3 = activerUtilisateurParProfil360sc(testSystemType, "12345", "dummy", "dummy@d.com", "dummy", "dummy", "ProfilQuiNexistePas");
  Logger.log(`Résultat du wrapper pour profil inexistant (devrait être une erreur): ${resultatWrapper3}`);
}

function testAllEnvironments() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("====== DÉBUT DE LA SUITE DE TESTS COMPLÈTE ======");
  try { testEndToEnd_DEV(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST DEV: " + e.toString()); }
  try { testEndToEnd_TEST(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST TEST: " + e.toString()); }
  try { testEndToEnd_PROD(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST PROD: " + e.toString()); }
  Logger.log("====== FIN DE LA SUITE DE TESTS COMPLÈTE ======");
}

function testEndToEnd_DEV() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const nomObjet = "TestE2EDevOF-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "DEV", "OF");
  Logger.log("Résultat DEV: " + resultat);
}

function testEndToEnd_TEST() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const nomObjet = "TestE2ETestOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "TEST", "OF");
  Logger.log("Résultat TEST: " + resultat);
}

function testEndToEnd_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const canRunProdTest = false; 
  if (!canRunProdTest) {
    Logger.log("AVERTISSEMENT: Le test PROD est désactivé par sécurité.");
    return;
  }
  const nomObjet = "TestE2EProdOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "PROD", "OF");
  Logger.log("Résultat PROD: " + resultat);
}

function testAuthentication(typeSysteme) {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme) throw new Error("'typeSysteme' est requis.");
    const token = getAuthToken_(typeSysteme.toUpperCase());
    finalOutput.success = true;
    finalOutput.message = `Authentification réussie pour ${typeSysteme.toUpperCase()}.`;
  } catch (e) {
    finalOutput.error = e.message;
  }
  return JSON.stringify(finalOutput);
}

function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest, metadataAvatarTypeIdTest) {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  let finalOutput = { success: false, message: "" };
  try {
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    const objectNameForApiTest = `${alphaIdTest}:${nomObjetTestBase}`;
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApiTest, alphaIdTest, metadataAvatarTypeIdTest);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
    finalOutput.success = true;
    finalOutput.message = `Objet unique (${systemTypeUpper}) créé.`;
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.mcUrl = mcUrl;
  } catch (e) {
    finalOutput.error = e.message;
  }
  return JSON.stringify(finalOutput);
}

function testSuiteComplete() {
    Logger.log("======================================================");
    Logger.log("Lancement de la SUITE DE TESTS COMPLÈTE");
    Logger.log("======================================================");
    const testsToRun = [
      { name: "Scénario 1: Création d'une structure OF complète (sur DEV)", func: maFonctionDeTestPourCreerMultiples_SUCCES },
      { name: "Scénario 2: Création d'un Avatar unique (Moule) (sur DEV)", func: maFonctionDeTestPourCreerObjetUnique },
      { name: "Scénario 3: Cycle de vie complet d'un utilisateur (Créer -> Activer -> Désactiver) (sur TEST)", func: maFonctionDeTestPourDesactiverUtilisateur },
      { name: "Scénario 4: Activation d'un utilisateur par profil (sur TEST)", func: maFonctionDeTestPourActiverUtilisateurParProfil }
    ];
    testsToRun.forEach((test, index) => {
        Logger.log(`\n--- DÉBUT TEST ${index + 1}/${testsToRun.length}: ${test.name} ---\n`);
        try {
            test.func();
            Logger.log(`\n--- SUCCÈS TEST ${index + 1}: ${test.name} ---\n`);
        } catch (e) {
            Logger.log(`\n--- ERREUR CRITIQUE TEST ${index + 1}: ${test.name} ---`);
            Logger.log("ERREUR: " + e.toString());
            Logger.log("STACK: " + (e.stack || 'N/A'));
        }
    });
    Logger.log("======================================================");
    Logger.log("SUITE DE TESTS COMPLÈTE TERMINÉE");
    Logger.log("======================================================");
}
```