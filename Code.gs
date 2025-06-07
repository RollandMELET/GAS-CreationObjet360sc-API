// FILENAME: Code.gs
// Version: 1.10.0
// Date: 2025-06-07 12:00 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout du wrapper creerUtilisateurEtRecupererId360sc pour retourner uniquement l'ID de l'utilisateur créé.
/**
 * @fileoverview Main script functions callable from AppSheet and test wrappers.
 */

// ... (fonctions de test existantes inchangées jusqu'à maFonctionDeTestPourCreerUtilisateur) ...
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
    Logger.log("AVERTISSEMENT: Le test PROD est désactivé par sécurité. Pour l'exécuter, modifiez la variable 'canRunProdTest' à 'true' dans le code de cette fonction.");
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
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") { throw new Error("Le paramètre 'nomDeObjetBase' est requis."); }
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("Le paramètre 'typeSysteme' est requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "OF";
    if (typeObjetUpper !== 'OF') { throw new Error("Usage incorrect: 'creerMultiplesObjets360sc' est réservé au type 'OF'."); }
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES.OF;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) { throw new Error(`Le 'METADATA_AVATAR_TYPES.OF' n'est pas configuré pour ${systemTypeUpper}.`); }
    Logger.log(`Début création multiple pour OF '${nomDeObjetBase}', système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        finalOutput[objDef.key] = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
      } catch (e) { throw new Error(`Échec à l'étape '${objDef.key}': ${e.message}`); }
    }
    finalOutput.success = true;
    finalOutput.message = "Tous les objets OF ont été créés avec succès.";
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Une erreur est survenue.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans creerMultiplesObjets360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") { throw new Error("'nomDeObjetBase' requis."); }
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("'typeSysteme' requis."); }
    if (!typeMoule || String(typeMoule).trim() === "") { throw new Error("'typeMoule' requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const alphaIdSpecifique = ALPHA_ID_MAPPING[typeMoule];
    if (!alphaIdSpecifique) { throw new Error(`Type de moule inconnu : '${typeMoule}'.`); }
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES[typeObjetUpper] || config.METADATA_AVATAR_TYPES.DEFAULT;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) { throw new Error(`Type d'objet '${typeObjetUpper}' non supporté/configuré pour ${systemTypeUpper}.`);}
    const objectNameForApi = `${alphaIdSpecifique}:${nomDeObjetBase}`;
    Logger.log(`Début création objet unique: ${objectNameForApi} (typeMoule: ${typeMoule}) pour ${systemTypeUpper}`);
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
    if (result.success && result.mcUrl) {
      Logger.log(`Succès AppSheet. mcUrl: ${result.mcUrl}`);
      return result.mcUrl;
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE PARSING: ${e.message}. Réponse: ${resultString}`;
    Logger.log(criticalError);
    return criticalError;
  }
}

function creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("'typeSysteme' requis."); }
    if (!username || String(username).trim() === "") { throw new Error("'username' requis."); }
    if (!email || String(email).trim() === "") { throw new Error("'email' requis."); }
    if (!firstName || String(firstName).trim() === "") { throw new Error("'firstName' requis."); }
    if (!lastName || String(lastName).trim() === "") { throw new Error("'lastName' requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    getConfiguration_(systemTypeUpper); 
    Logger.log(`Début création utilisateur '${username}', email '${email}', sys: ${systemTypeUpper}`);
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

// --- NOUVEAU WRAPPER POUR CRÉATION UTILISATEUR RETOURNANT L'ID ---
/**
 * [APPSHEET-HELPER] Crée un utilisateur 360sc et retourne directement son @id ou un message d'erreur.
 * Conçue pour une intégration simplifiée, notamment avec AppSheet.
 * @customfunction
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} username Le nom d'utilisateur.
 * @param {string} email L'adresse e-mail de l'utilisateur.
 * @param {string} firstName Le prénom de l'utilisateur.
 * @param {string} lastName Le nom de famille de l'utilisateur.
 * @param {string[]} [tags] Un tableau optionnel de tags.
 * @return {string} L'@id de l'utilisateur créé (ex: "/api/users/1234") en cas de succès, 
 *                  ou un message préfixé par "ERREUR: " en cas d'échec.
 */
function creerUtilisateurEtRecupererId360sc(typeSysteme, username, email, firstName, lastName, tags) {
  Logger.log(`Appel de creerUtilisateurEtRecupererId360sc avec username: ${username}, email: ${email}, typeSysteme: ${typeSysteme}`);
  
  const resultString = creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags);
  
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.user && result.user['@id']) {
      Logger.log(`Succès pour creerUtilisateurEtRecupererId360sc. Utilisateur @id: ${result.user['@id']}`);
      return result.user['@id'];
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue lors de la création utilisateur ou @id manquant.'}`;
      Logger.log(errorMessage + ` Réponse brute: ${resultString}`);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE PARSING (creerUtilisateurEtRecupererId360sc): ${e.message}. Réponse brute: ${resultString}`;
    Logger.log(criticalError);
    return criticalError;
  }
}


// --- Fonctions de Test ---
function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
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
    if (resultatObjet.success) { Logger.log("ID utilisateur créé: " + (resultatObjet.user ? resultatObjet.user['@id'] : "Non trouvé")); }
  } catch (e) { Logger.log("Erreur parsing JSON creerUtilisateur360sc: " + e.message); }

  Logger.log(`Appel creerUtilisateur360sc (test erreur - email manquant) avec: sys=${testSystemType}, user=${testUsername}_err`);
  var resultatErreurString = creerUtilisateur360sc(testSystemType, testUsername + "_err", null, testFirstName, testLastName, testTags);
  Logger.log("Résultat creerUtilisateur360sc (erreur JSON): " + resultatErreurString);
  try {
    var resultatErreurObjet = JSON.parse(resultatErreurString);
    Logger.log("Résultat creerUtilisateur360sc (erreur objet): " + JSON.stringify(resultatErreurObjet, null, 2));
  } catch (e) { Logger.log("Erreur parsing JSON creerUtilisateur360sc (erreur): " + e.message); }
}

// --- NOUVELLE FONCTION DE TEST POUR LE WRAPPER UTILISATEUR ID ---
function maFonctionDeTestPourCreerUtilisateurEtRecupererId() {
  var testSystemType = "TEST"; // Assurez-vous que TEST est configuré et les identifiants stockés
  var timestamp = new Date().getTime();
  var testUsername = "TestUserIdWrap" + timestamp;
  var testEmail = "testuseridwrap" + timestamp + "@example.com";
  var testFirstName = "TestWrap";
  var testLastName = "UtilisateurId" + timestamp;
  var testTags = ["wrapperTest"];

  Logger.log(`Test de creerUtilisateurEtRecupererId360sc: sys=${testSystemType}, user=${testUsername}, email=${testEmail}`);
  var resultatId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, testTags);
  Logger.log(`Résultat du test pour creerUtilisateurEtRecupererId360sc (devrait être un @id ou ERREUR): ${resultatId}`);

  // Test d'un cas d'erreur (ex: username déjà existant - difficile à simuler sans créer puis recréer immédiatement,
  // ou email invalide, ou paramètre manquant géré par la fonction principale)
  // Testons un email manquant, qui sera intercepté par creerUtilisateur360sc
  Logger.log(`Test d'erreur pour creerUtilisateurEtRecupererId360sc (email manquant): user=${testUsername}_errId`);
  var resultatErreurId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername + "_errId", null, testFirstName, testLastName, testTags);
  Logger.log(`Résultat du test d'erreur pour creerUtilisateurEtRecupererId360sc (devrait être ERREUR): ${resultatErreurId}`);
}


function testAuthentication(typeSysteme) {
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