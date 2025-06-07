// FILENAME: Code.gs
// Version: 1.9.0
// Date: 2025-06-07 10:45 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de la fonctionnalité de création d'utilisateur (creerUtilisateur360sc) et de sa fonction de test.
/**
 * @fileoverview Main script functions callable from AppSheet and test wrappers.
 */

// ... (fonctions de test existantes inchangées) ...
function maFonctionDeTestPourAuth() {
  var testSystemType = "TEST"; // Modifier en "DEV", "TEST", ou "PROD"
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
  var testTypeObjet = "OF"; // Seul type valide
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
  
  try {
    testEndToEnd_DEV();
  } catch (e) {
    Logger.log("ERREUR CRITIQUE PENDANT LE TEST DEV: " + e.toString() + "\nStack: " + e.stack);
  }

  try {
    testEndToEnd_TEST();
  } catch (e) {
    Logger.log("ERREUR CRITIQUE PENDANT LE TEST TEST: " + e.toString() + "\nStack: " + e.stack);
  }

  try {
    testEndToEnd_PROD();
  } catch (e) {
    Logger.log("ERREUR CRITIQUE PENDANT LE TEST PROD: " + e.toString() + "\nStack: " + e.stack);
  }
  
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

/**
 * [SPECIALISEE-OF] Crée la structure complète des 5 objets 360sc pour un Ordre de Fabrication (OF).
 * @customfunction
 */
function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") { throw new Error("Le paramètre 'nomDeObjetBase' est requis."); }
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("Le paramètre 'typeSysteme' est requis."); }
    
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "OF";
    if (typeObjetUpper !== 'OF') {
      throw new Error("Usage incorrect: 'creerMultiplesObjets360sc' est réservé au type 'OF'. Utilisez 'creerObjetUnique360sc' pour les autres types.");
    }
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES.OF;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) {
      throw new Error(`Le 'METADATA_AVATAR_TYPES.OF' n'est pas configuré pour l'environnement ${systemTypeUpper}.`);
    }
    Logger.log(`Début création multiple pour OF '${nomDeObjetBase}', système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        finalOutput[objDef.key] = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
      } catch (e) {
        throw new Error(`Échec à l'étape '${objDef.key}': ${e.message}`);
      }
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

/**
 * [GENERIQUE] Crée un unique objet 360sc et retourne son URL mc.
 * @customfunction
 */
function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") { throw new Error("Le paramètre 'nomDeObjetBase' est requis."); }
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("Le paramètre 'typeSysteme' est requis."); }
    if (!typeMoule || String(typeMoule).trim() === "") { throw new Error("Le paramètre 'typeMoule' est requis."); }

    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const alphaIdSpecifique = ALPHA_ID_MAPPING[typeMoule];
    if (!alphaIdSpecifique) {
      throw new Error(`Type de moule inconnu : '${typeMoule}'. Valeurs possibles : ${Object.keys(ALPHA_ID_MAPPING).join(', ')}.`);
    }
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES[typeObjetUpper] || config.METADATA_AVATAR_TYPES.DEFAULT;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) {
      throw new Error(`Type d'objet général '${typeObjetUpper}' non supporté ou non configuré pour l'environnement ${systemTypeUpper}. Vérifiez METADATA_AVATAR_TYPES dans config.gs.`);
    }
    const objectNameForApi = `${alphaIdSpecifique}:${nomDeObjetBase}`;
    Logger.log(`Début création objet unique: ${objectNameForApi} (typeMoule: ${typeMoule}, alphaId: ${alphaIdSpecifique}) pour l'environnement ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, alphaIdSpecifique, metadataAvatarTypeId);
    finalOutput.success = true;
    finalOutput.message = `Objet unique '${objectNameForApi}' créé avec succès.`;
    finalOutput.mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.objectNameCreated = objectNameForApi;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Une erreur est survenue lors de la création de l'objet unique.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans creerObjetUnique360sc: ${finalOutput.error}. Input: nomDeObjetBase=${nomDeObjetBase}, typeSysteme=${typeSysteme}, typeObjet=${typeObjet}, typeMoule=${typeMoule}`);
  }
  return JSON.stringify(finalOutput);
}

/**
 * [APPSHEET-HELPER] Crée un objet unique 360sc (spécifiquement pour Moule) et retourne directement l'URL mc ou un message d'erreur.
 * @customfunction
 */
function creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule) {
  Logger.log(`Appel de creerObjetUnique360scForAppSheet avec nomDeObjetBase: ${nomDeObjetBase}, typeSysteme: ${typeSysteme}, typeMoule: ${typeMoule}`);
  const resultString = creerObjetUnique360sc(nomDeObjetBase, typeSysteme, "MOULE", typeMoule);
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.mcUrl) {
      Logger.log(`Succès pour AppSheet. mcUrl: ${result.mcUrl}`);
      return result.mcUrl;
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE PARSING: ${e.message}. Réponse brute: ${resultString}`;
    Logger.log(criticalError);
    return criticalError;
  }
}

// --- NOUVELLE FONCTION PRINCIPALE POUR LA CRÉATION D'UTILISATEUR ---
/**
 * Crée un utilisateur dans la plateforme 360sc.
 * @customfunction
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} username Le nom d'utilisateur.
 * @param {string} email L'adresse e-mail de l'utilisateur.
 * @param {string} firstName Le prénom de l'utilisateur.
 * @param {string} lastName Le nom de famille de l'utilisateur.
 * @param {string[]} [tags] Un tableau optionnel de tags (chaînes de caractères).
 * @return {string} Une chaîne JSON contenant les détails de l'utilisateur créé ou un message d'erreur.
 */
function creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("Le paramètre 'typeSysteme' est requis."); }
    if (!username || String(username).trim() === "") { throw new Error("Le paramètre 'username' est requis."); }
    if (!email || String(email).trim() === "") { throw new Error("Le paramètre 'email' est requis."); }
    if (!firstName || String(firstName).trim() === "") { throw new Error("Le paramètre 'firstName' est requis."); }
    if (!lastName || String(lastName).trim() === "") { throw new Error("Le paramètre 'lastName' est requis."); }

    const systemTypeUpper = typeSysteme.toUpperCase();
    // Valide typeSysteme et récupère la config (y compris COMPANY_ID)
    getConfiguration_(systemTypeUpper); 

    Logger.log(`Début création utilisateur '${username}', email '${email}', système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);

    const userData = {
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      tags: Array.isArray(tags) ? tags : [] // S'assurer que tags est un tableau
    };

    const createdUser = createUser_(token, systemTypeUpper, userData);

    finalOutput.success = true;
    finalOutput.message = `Utilisateur '${username}' créé avec succès.`;
    finalOutput.user = createdUser; // L'objet utilisateur retourné par l'API
    
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Une erreur est survenue lors de la création de l'utilisateur.";
    finalOutput.error = error.message; // Message d'erreur de createUser_ ou autre
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans creerUtilisateur360sc: ${finalOutput.error}`);
  }

  return JSON.stringify(finalOutput);
}


// --- Fonctions de Test ---
function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
  var testNomDeObjetBase = "MonMoulePourAppSheet";
  var testSystemType = "DEV"; 
  var testTypeMoule = "MouleEnveloppe"; 
  Logger.log(`Test de creerObjetUnique360scForAppSheet: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeMoule=${testTypeMoule}`);
  var resultat = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMoule);
  Logger.log(`Résultat du test pour AppSheet: ${resultat}`);

  var testTypeMouleInexistant = "TypeMouleQuiNexistePas";
  Logger.log(`Test d'erreur de creerObjetUnique360scForAppSheet: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeMoule=${testTypeMouleInexistant}`);
  var resultatErreur = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMouleInexistant);
  Logger.log(`Résultat du test d'erreur pour AppSheet: ${resultatErreur}`);
}

// --- NOUVELLE FONCTION DE TEST POUR LA CRÉATION D'UTILISATEUR ---
function maFonctionDeTestPourCreerUtilisateur() {
  var testSystemType = "TEST"; // Ou "DEV", "PROD" - Assurez-vous que l'environnement est configuré et que les identifiants sont stockés.
  // Utiliser des valeurs uniques pour username et email à chaque test pour éviter les conflits
  var timestamp = new Date().getTime();
  var testUsername = "TestUser" + timestamp;
  var testEmail = "testuser" + timestamp + "@example.com";
  var testFirstName = "Test";
  var testLastName = "Utilisateur" + timestamp;
  var testTags = ["testTag1", "apiCreated"];

  Logger.log(`Appel de creerUtilisateur360sc (test) avec: typeSys=${testSystemType}, user=${testUsername}, email=${testEmail}`);
  var resultatString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, testTags);
  Logger.log("Résultat de creerUtilisateur360sc (chaîne JSON): " + resultatString);

  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de creerUtilisateur360sc (objet parsé): " + JSON.stringify(resultatObjet, null, 2));
    if (resultatObjet.success) {
      Logger.log("ID de l'utilisateur créé: " + (resultatObjet.user ? resultatObjet.user['@id'] : "Non trouvé"));
    }
  } catch (e) {
    Logger.log("Erreur parsing JSON pour creerUtilisateur360sc: " + e.message);
  }

  // Optionnel : Test d'un cas d'erreur (ex: email manquant)
  Logger.log(`Appel de creerUtilisateur360sc (test d'erreur - email manquant) avec: typeSys=${testSystemType}, user=${testUsername}_err`);
  var resultatErreurString = creerUtilisateur360sc(testSystemType, testUsername + "_err", null, testFirstName, testLastName, testTags);
  Logger.log("Résultat de creerUtilisateur360sc (erreur - chaîne JSON): " + resultatErreurString);
  try {
    var resultatErreurObjet = JSON.parse(resultatErreurString);
    Logger.log("Résultat de creerUtilisateur360sc (erreur - objet parsé): " + JSON.stringify(resultatErreurObjet, null, 2));
  } catch (e) {
    Logger.log("Erreur parsing JSON pour creerUtilisateur360sc (erreur): " + e.message);
  }
}

// ... (fonctions testAuthentication et testCreateSingleObject inchangées) ...
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