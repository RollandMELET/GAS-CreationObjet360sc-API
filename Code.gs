// FILENAME: Code.gs
// Version: 1.13.0
// Date: 2025-06-07 13:15 
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Corrigé activer/desactiverUtilisateur pour ne plus utiliser GET (erreur 405). Ajout de logs de lancement aux tests.
/**
 * @fileoverview Main script functions callable from AppSheet and test wrappers.
 */

// --- Fonctions de Test (avec logs de lancement) ---

function maFonctionDeTestPourAuth() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
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
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
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
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetMultiSucces";
  var testTypeObjet = "OF"; 
  Logger.log(`Appel de creerMultiplesObjets360sc (test SUCCES) avec: typeSys=${testSystemType}, nomBase=${testNomDeObjetBase}, typeObj=${testTypeObjet}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, testTypeObjet);
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("Test d'erreur : Appel de creerMultiplesObjets360sc avec le type invalide 'MOULE'");
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
}

function maFonctionDeTestPourCreerObjetUnique() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV";
  var testTypeMoule = "MouleEnveloppe"; 
  
  Logger.log(`Appel de creerObjetUnique360sc (test) avec: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeMoule=${testTypeMoule}`);
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, "MOULE", testTypeMoule);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMoulePourAppSheet";
  var testSystemType = "DEV"; 
  var testTypeMoule = "MouleEnveloppe"; 
  Logger.log(`Test creerObjetUnique360scForAppSheet: nom=${testNomDeObjetBase}, sys=${testSystemType}, typeMoule=${testTypeMoule}`);
  var resultat = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMoule);
  Logger.log(`Résultat test AppSheet: ${resultat}`);

  var testTypeMouleInexistant = "TypeMouleQuiNexistePas";
  Logger.log(`Test erreur creerObjetUnique360scForAppSheet: nom=${testNomDeObjetBase}, sys=${testSystemType}, typeMoule=${testTypeMouleInexistant}`);
  var resultatErreur = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMouleInexistant);
  Logger.log(`Résultat test erreur AppSheet: ${resultatErreur}`);
}

function maFonctionDeTestPourCreerUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUser" + timestamp;
  var testEmail = "testuser" + timestamp + "@example.com";
  var testFirstName = "Test";
  var testLastName = "Utilisateur" + timestamp;
  var testTags = ["testTag1", "apiCreated"];

  Logger.log(`Appel creerUtilisateur360sc (test) avec: sys=${testSystemType}, user=${testUsername}, email=${testEmail}`);
  var resultatString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, testTags);
  Logger.log("Résultat creerUtilisateur360sc (JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat creerUtilisateur360sc (objet): " + JSON.stringify(resultatObjet, null, 2));
    if (resultatObjet.success) { Logger.log("ID utilisateur créé (@id): " + (resultatObjet.user ? resultatObjet.user['@id'] : "Non trouvé") + ", ID numérique: " + (resultatObjet.user ? resultatObjet.user.id : "Non trouvé")); }
  } catch (e) { Logger.log("Erreur parsing JSON creerUtilisateur360sc: " + e.message); }

  Logger.log(`Appel creerUtilisateur360sc (test erreur - email manquant) avec: sys=${testSystemType}, user=${testUsername}_err`);
  var resultatErreurString = creerUtilisateur360sc(testSystemType, testUsername + "_err", null, testFirstName, testLastName, testTags);
  Logger.log("Résultat creerUtilisateur360sc (erreur JSON): " + resultatErreurString);
  try {
    var resultatErreurObjet = JSON.parse(resultatErreurString);
    Logger.log("Résultat creerUtilisateur360sc (erreur objet): " + JSON.stringify(resultatErreurObjet, null, 2));
  } catch (e) { Logger.log("Erreur parsing JSON creerUtilisateur360sc (erreur): " + e.message); }
}

function maFonctionDeTestPourCreerUtilisateurEtRecupererId() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUserIdNum" + timestamp; 
  var testEmail = "testuseridnum" + timestamp + "@example.com";
  var testFirstName = "TestIdNum";
  var testLastName = "UtilisateurIdNum" + timestamp;
  var testTags = ["wrapperTestIdNum"];

  Logger.log(`Test de creerUtilisateurEtRecupererId360sc (pour ID numérique): sys=${testSystemType}, user=${testUsername}, email=${testEmail}`);
  var resultatId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, testTags);
  Logger.log(`Résultat du test pour creerUtilisateurEtRecupererId360sc (devrait être un ID numérique ou ERREUR): ${resultatId}`);

  Logger.log(`Test d'erreur pour creerUtilisateurEtRecupererId360sc (email manquant): user=${testUsername}_errIdNum`);
  var resultatErreurId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername + "_errIdNum", null, testFirstName, testLastName, testTags);
  Logger.log(`Résultat du test d'erreur pour creerUtilisateurEtRecupererId360sc (devrait être ERREUR): ${resultatErreurId}`);
}

function testAllEnvironments() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("====== DÉBUT DE LA SUITE DE TESTS COMPLÈTE ======");
  try { testEndToEnd_DEV(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST DEV: " + e.toString() + "\nStack: " + e.stack); }
  try { testEndToEnd_TEST(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST TEST: " + e.toString() + "\nStack: " + e.stack); }
  try { testEndToEnd_PROD(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST PROD: " + e.toString() + "\nStack: " + e.stack); }
  Logger.log("====== FIN DE LA SUITE DE TESTS COMPLÈTE ======");
}

function testEndToEnd_DEV() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT DEV ---");
  const nomObjet = "TestE2EDevOF-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "DEV", "OF");
  Logger.log("Résultat DEV: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT DEV ---\n");
}

function testEndToEnd_TEST() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT TEST ---");
  const nomObjet = "TestE2ETestOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "TEST", "OF");
  Logger.log("Résultat TEST: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT TEST ---\n");
}

function testEndToEnd_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
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

// --- FONCTION D'ACTIVATION CORRIGÉE ---
/**
 * Active un utilisateur 360sc en construisant le payload pour un PUT.
 * Cette fonction ne fait plus de GET préalable car l'API retourne 405 Method Not Allowed.
 * @customfunction
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {object} userData Un objet contenant les données de base de l'utilisateur ({id, username, email, firstName, lastName, etc.}).
 *                          L'objet retourné par creerUtilisateur360sc est idéal.
 * @param {string[]} roles Un tableau de chaînes de caractères représentant les rôles à assigner.
 * @return {string} Une chaîne JSON contenant les détails de l'utilisateur mis à jour ou un message d'erreur.
 */
function activerUtilisateur360sc(typeSysteme, userData, roles) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !userData || !userData.id || !Array.isArray(roles) || roles.length === 0) {
      throw new Error("typeSysteme, userData (avec id) et roles (tableau non vide) sont requis.");
    }

    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début de l'activation pour l'utilisateur ID ${userData.id}, système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);

    // Construire le payload directement à partir des données fournies
    let payload = { ...userData }; // Copie de l'objet initial
    payload.enabled = true;
    payload.roles = roles;

    // Nettoyage des champs non désirés ou en lecture seule
    delete payload.createdAt;
    delete payload.lastLogin;
    delete payload.passwordRequestedAt;

    // L'API attend l'id sous forme d'IRI dans le payload, assurons-nous-en
    if (payload.id && !String(payload.id).startsWith('/')) {
      payload.id = `/api/users/${payload.id}`;
    }
    // L'API attend aussi @id
    if (!payload['@id']) {
      payload['@id'] = `/api/users/${userData.id}`;
    }

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

// --- FONCTION DE DÉSACTIVATION CORRIGÉE ---
/**
 * Désactive un utilisateur 360sc en construisant le payload pour un PUT.
 * @customfunction
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {object} userData Un objet contenant les données de l'utilisateur.
 * @return {string} Une chaîne JSON contenant les détails de l'utilisateur mis à jour ou un message d'erreur.
 */
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

// --- FONCTION DE TEST D'ACTIVATION CORRIGÉE ---
function maFonctionDeTestPourActiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  
  var timestamp = new Date().getTime();
  var testUsername = "TestToActivate" + timestamp;
  var testEmail = "testtoactivate" + timestamp + "@example.com";
  var testFirstName = "ToActivate";
  var testLastName = "User" + timestamp;
  
  Logger.log("--- PARTIE 1: Création d'un utilisateur de test ---");
  var creationResultString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, []);
  var creationResultObject = JSON.parse(creationResultString);

  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultObject.error}`);
    return;
  }
  
  var userObjectToActivate = creationResultObject.user; 
  Logger.log(`Utilisateur créé. ID: ${userObjectToActivate.id}`);

  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ID ${userObjectToActivate.id} ---`);
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST", "ROLE_DUHALDE-TEST"];
  
  var activationResultString = activerUtilisateur360sc(testSystemType, userObjectToActivate, rolesToAssign);
  Logger.log("Résultat activation (JSON): " + activationResultString);
  var activationResultObject = JSON.parse(activationResultString);

  if (activationResultObject.success) {
    Logger.log("Vérification: 'enabled' est 'true' ? -> " + activationResultObject.user.enabled);
  }
}

// --- FONCTION DE TEST DE DÉSACTIVATION CORRIGÉE ---
function maFonctionDeTestPourDesactiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  
  var timestamp = new Date().getTime();
  var testUsername = "TestToDeactivate" + timestamp;
  var testEmail = "testtodeactivate" + timestamp + "@example.com";
  
  Logger.log("--- PARTIE 1: Création d'un utilisateur ---");
  var creationResultString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToDeactivate", "User", []);
  var creationResultObject = JSON.parse(creationResultString);
  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultObject.error}`);
    return;
  }
  var userObjectToTest = creationResultObject.user;
  Logger.log(`Utilisateur créé. ID: ${userObjectToTest.id}`);

  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ---`);
  var rolesToAssign = ["ROLE_USER"];
  var activationResultString = activerUtilisateur360sc(testSystemType, userObjectToTest, rolesToAssign);
  var activationResultObject = JSON.parse(activationResultString);
  if (!activationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: L'activation a échoué. Test annulé. Erreur: ${activationResultObject.error}`);
    return;
  }
  var activatedUserObject = activationResultObject.user;
  Logger.log(`Utilisateur activé. Statut 'enabled': ${activatedUserObject.enabled}`);

  Logger.log(`\n--- PARTIE 3: Désactivation de l'utilisateur ---`);
  var deactivationResultString = desactiverUtilisateur360sc(testSystemType, activatedUserObject);
  Logger.log("Résultat désactivation (JSON): " + deactivationResultString);
  var deactivationResultObject = JSON.parse(deactivationResultString);

  if (deactivationResultObject.success) {
    Logger.log("Vérification: 'enabled' est 'false' ? -> " + deactivationResultObject.user.enabled);
  }
}

function testAuthentication(typeSysteme) {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme) throw new Error("'typeSysteme' est requis.");
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    finalOutput.success = true;
    finalOutput.message = `Authentification réussie pour ${systemTypeUpper}.`;
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