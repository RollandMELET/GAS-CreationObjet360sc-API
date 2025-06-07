// FILENAME: Code.gs
// Version: 1.13.0
// Date: 2025-06-07 13:15 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Corrigé activer/desactiverUtilisateur pour ne plus utiliser GET (erreur 405). Ajout de logs de lancement aux tests.
/**
 * @fileoverview Main script functions callable from AppSheet and test wrappers.
 */

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

function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet) { /* ... contenu inchangé ... */ }
function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule) { /* ... contenu inchangé ... */ }
function creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule) { /* ... contenu inchangé ... */ }
function creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags) { /* ... contenu inchangé ... */ }
function creerUtilisateurEtRecupererId360sc(typeSysteme, username, email, firstName, lastName, tags) { /* ... contenu inchangé ... */ }

// --- FONCTION D'ACTIVATION CORRIGÉE ---
/**
 * Active un utilisateur 360sc en construisant le payload pour un PUT.
 * @customfunction
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {object} userData Un objet contenant les données de l'utilisateur ({id, username, email, firstName, lastName, etc.}).
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
    if (payload['@id'] && !String(payload['@id']).startsWith('/')) {
      payload['@id'] = `/api/users/${payload['@id']}`;
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
    if (payload['@id'] && !String(payload['@id']).startsWith('/')) { payload['@id'] = `/api/users/${payload['@id']}`; }

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


// --- Fonctions de Test (mises à jour) ---

function maFonctionDeTestPourCreerUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  /* ... contenu inchangé ... */
}
function maFonctionDeTestPourCreerUtilisateurEtRecupererId() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  /* ... contenu inchangé ... */
}
function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  /* ... contenu inchangé ... */
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
  
  var userObjectToActivate = creationResultObject.user; // On récupère l'objet utilisateur complet
  Logger.log(`Utilisateur créé. ID: ${userObjectToActivate.id}`);

  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ID ${userObjectToActivate.id} ---`);
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST", "ROLE_DUHALDE-TEST"];
  
  // On passe l'objet utilisateur complet à la fonction d'activation
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


function testAuthentication(typeSysteme) { /* ... contenu inchangé ... */ }
function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest, metadataAvatarTypeIdTest) { /* ... contenu inchangé ... */ }