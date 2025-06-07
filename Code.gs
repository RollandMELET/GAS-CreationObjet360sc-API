// FILENAME: Code.gs
// Version: 1.12.0
// Date: 2025-06-07 13:00 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de la fonction desactiverUtilisateur360sc et de son test.
/**
 * @fileoverview Main script functions callable from AppSheet and test wrappers.
 */

// ... (fonctions existantes inchangées) ...
function maFonctionDeTestPourAuth() {
  var testSystemType = "TEST"; 
  Logger.log("Appel de testAuthentication avec typeSysteme: " + testSystemType);
  var resultatString = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication (chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de testAuthentication (objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour testAuthentication: " + e.message); }
}

function maFonctionDeTestPourCreerObjet() {
  var testSystemType = "DEV";
  var testNomObjetBase = "TestUniqueObj";
  var testAlphaId = "v0:OF_PRINCIPAL";
  var config = getConfiguration_(testSystemType);
  var testMetadataTypeId = config.METADATA_AVATAR_TYPES.OF;

  Logger.log(`Appel de testCreateSingleObject avec: typeSys=${testSystemType}, nomBase=${testNomObjetBase}, alphaId=${testAlphaId}, metaTypeId=${testMetadataTypeId}`);
  var resultatString = testCreateSingleObject(testSystemType, testNomObjetBase, testAlphaId, testMetadataTypeId);
  Logger.log("Résultat de testCreateSingleObject (chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de testCreateSingleObject (objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour testCreateSingleObject: " + e.message); }
}

function maFonctionDeTestPourCreerMultiples_SUCCES() {
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetMultiSucces";
  var testTypeObjet = "OF"; 
  Logger.log(`Appel de creerMultiplesObjets360sc (test SUCCES) avec: typeSys=${testSystemType}, nomBase=${testNomDeObjetBase}, typeObj=${testTypeObjet}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, testTypeObjet);
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  Logger.log("Test d'erreur : Appel de creerMultiplesObjets360sc avec le type invalide 'MOULE'");
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
}

function maFonctionDeTestPourCreerObjetUnique() {
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV";
  var testTypeMoule = "MouleEnveloppe"; 
  
  Logger.log(`Appel de creerObjetUnique360sc (test) avec: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeMoule=${testTypeMoule}`);
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, "MOULE", testTypeMoule);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}

function testAllEnvironments() {
  Logger.log("====== DÉBUT DE LA SUITE DE TESTS COMPLÈTE ======");
  try { testEndToEnd_DEV(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST DEV: " + e.toString() + "\nStack: " + e.stack); }
  try { testEndToEnd_TEST(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST TEST: " + e.toString() + "\nStack: " + e.stack); }
  try { testEndToEnd_PROD(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST PROD: " + e.toString() + "\nStack: " + e.stack); }
  Logger.log("====== FIN DE LA SUITE DE TESTS COMPLÈTE ======");
}

function testEndToEnd_DEV() {
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT DEV ---");
  const nomObjet = "TestE2EDevOF-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "DEV", "OF");
  Logger.log("Résultat DEV: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT DEV ---\n");
}

function testEndToEnd_TEST() {
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT TEST ---");
  const nomObjet = "TestE2ETestOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "TEST", "OF");
  Logger.log("Résultat TEST: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT TEST ---\n");
}

function testEndToEnd_PROD() {
  const canRunProdTest = false; 
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT PROD ---");
  if (!canRunProdTest) {
    Logger.log("AVERTISSEMENT: Le test PROD est désactivé par sécurité.");
    Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT PROD (NON EXÉCUTÉ) ---\n");
    return;
  }
  const nomObjet = "TestE2EProdOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "PROD", "OF");
  Logger.log("Résultat PROD: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT PROD ---\n");
}


// --- Fonctions Principales (Exposées) ---

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

function activerUtilisateur360sc(typeSysteme, userId, roles) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !userId || !Array.isArray(roles) || roles.length === 0) { throw new Error("typeSysteme, userId, et roles (tableau non vide) sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    getConfiguration_(systemTypeUpper);
    Logger.log(`Début activation pour l'utilisateur ID ${userId}, sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    let userObject = getUser_(token, systemTypeUpper, userId);
    userObject.enabled = true;
    userObject.roles = roles;
    delete userObject.createdAt;
    delete userObject.lastLogin;
    delete userObject.passwordRequestedAt;
    if (userObject.id && !String(userObject.id).startsWith('/')) { userObject.id = `/api/users/${userObject.id}`; }
    const updatedUser = updateUser_(token, systemTypeUpper, userId, userObject);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur ID ${userId} activé.`;
    finalOutput.user = updatedUser;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur activation utilisateur ID ${userId}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur activerUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

// --- NOUVELLE FONCTION PRINCIPALE POUR LA DÉSACTIVATION D'UTILISATEUR ---
/**
 * Désactive un utilisateur 360sc en le passant à 'enabled: false'.
 * @customfunction
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {number|string} userId L'ID numérique de l'utilisateur à désactiver (ex: 2209).
 * @return {string} Une chaîne JSON contenant les détails de l'utilisateur mis à jour ou un message d'erreur.
 */
function desactiverUtilisateur360sc(typeSysteme, userId) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("'typeSysteme' est requis."); }
    if (!userId) { throw new Error("'userId' est requis."); }

    const systemTypeUpper = typeSysteme.toUpperCase();
    getConfiguration_(systemTypeUpper); // Valider l'environnement

    Logger.log(`Début de la désactivation pour l'utilisateur ID ${userId}, système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);

    // 1. Récupérer l'état actuel de l'utilisateur
    let userObject = getUser_(token, systemTypeUpper, userId);
    
    // 2. Modifier l'objet en mémoire
    userObject.enabled = false;

    // Nettoyage des champs en lecture seule pour éviter les erreurs lors du PUT
    delete userObject.createdAt;
    delete userObject.lastLogin;
    delete userObject.passwordRequestedAt;
    if (userObject.id && !String(userObject.id).startsWith('/')) {
      userObject.id = `/api/users/${userObject.id}`;
    }

    // 3. Envoyer l'objet modifié avec un PUT
    const updatedUser = updateUser_(token, systemTypeUpper, userId, userObject);

    finalOutput.success = true;
    finalOutput.message = `Utilisateur ID ${userId} désactivé avec succès.`;
    finalOutput.user = updatedUser;
    
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Une erreur est survenue lors de la désactivation de l'utilisateur ID ${userId}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans desactiverUtilisateur360sc: ${finalOutput.error}`);
  }

  return JSON.stringify(finalOutput);
}


// --- Fonctions de Test ---
// ... (fonctions de test existantes)

function maFonctionDeTestPourActiverUtilisateur() {
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestToActivate" + timestamp;
  var testEmail = "testtoactivate" + timestamp + "@example.com";
  var testFirstName = "ToActivate";
  var testLastName = "User" + timestamp;
  
  Logger.log("--- PARTIE 1: Création d'un utilisateur de test ---");
  var creationResultId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, []);
  if (creationResultId.startsWith("ERREUR:")) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultId}`);
    return;
  }
  Logger.log(`Utilisateur créé. ID: ${creationResultId}`);

  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ID ${creationResultId} ---`);
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST", "ROLE_DUHALDE-TEST"];
  var activationResultString = activerUtilisateur360sc(testSystemType, creationResultId, rolesToAssign);
  Logger.log("Résultat activation (JSON): " + activationResultString);
  try {
    var activationResultObject = JSON.parse(activationResultString);
    Logger.log("Résultat activation (objet): " + JSON.stringify(activationResultObject, null, 2));
    if (activationResultObject.success) {
      Logger.log("Vérification: 'enabled' est 'true' ? -> " + activationResultObject.user.enabled);
    }
  } catch (e) { Logger.log("Erreur parsing JSON activation: " + e.message); }
}

// --- NOUVELLE FONCTION DE TEST POUR LA DÉSACTIVATION D'UTILISATEUR ---
function maFonctionDeTestPourDesactiverUtilisateur() {
  var testSystemType = "TEST"; 
  
  // --- ÉTAPE 1: Créer un nouvel utilisateur ---
  var timestamp = new Date().getTime();
  var testUsername = "TestToDeactivate" + timestamp;
  var testEmail = "testtodeactivate" + timestamp + "@example.com";
  var testFirstName = "ToDeactivate";
  var testLastName = "User" + timestamp;
  
  Logger.log("--- PARTIE 1: Création d'un utilisateur de test ---");
  var creationResultId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, []);
  if (creationResultId.startsWith("ERREUR:")) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultId}`);
    return;
  }
  var userIdToTest = creationResultId;
  Logger.log(`Utilisateur de test créé. ID: ${userIdToTest}`);

  // --- ÉTAPE 2: Activer cet utilisateur pour s'assurer qu'il est bien 'enabled: true' ---
  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ID ${userIdToTest} ---`);
  var rolesToAssign = ["ROLE_USER"];
  var activationResultString = activerUtilisateur360sc(testSystemType, userIdToTest, rolesToAssign);
  var activationResultObject = JSON.parse(activationResultString);
  if (!activationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: L'activation a échoué. Test annulé. Erreur: ${activationResultObject.error}`);
    return;
  }
  Logger.log(`Utilisateur activé avec succès. Statut 'enabled': ${activationResultObject.user.enabled}`);

  // --- ÉTAPE 3: Désactiver ce même utilisateur ---
  Logger.log(`\n--- PARTIE 3: Tentative de désactivation de l'utilisateur ID ${userIdToTest} ---`);
  var deactivationResultString = desactiverUtilisateur360sc(testSystemType, userIdToTest);
  Logger.log("Résultat de desactiverUtilisateur360sc (chaîne JSON): " + deactivationResultString);

  try {
    var deactivationResultObject = JSON.parse(deactivationResultString);
    Logger.log("Résultat de desactiverUtilisateur360sc (objet parsé): " + JSON.stringify(deactivationResultObject, null, 2));
    
    if (deactivationResultObject.success) {
      Logger.log("Vérification: 'enabled' est bien 'false' ? -> " + deactivationResultObject.user.enabled);
    }
  } catch (e) {
    Logger.log("Erreur parsing JSON pour le résultat de la désactivation: " + e.message);
  }
}


function testAuthentication(typeSysteme) {
  // ...
}

function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest, metadataAvatarTypeIdTest) {
  // ...
}