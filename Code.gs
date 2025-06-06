// FILENAME: Code.gs
// Version: 1.6.1
// Date: 2025-06-06 12:35
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Correction d'une régression où `config.typeSysteme` (undefined) était utilisé au lieu de la variable `typeSysteme`.
/**
 * @fileoverview Main script functions callable from AppSheet and test wrappers.
 */

// --- Fonctions de test spécifiques pour l'éditeur Apps Script ---

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
  var testTypeObjet = "MOULE";
  var testAlphaId = "v0:MOULE_CORPS";
  
  Logger.log(`Appel de creerObjetUnique360sc (test) avec: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeObj=${testTypeObjet}, alphaId=${testAlphaId}`);
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, testTypeObjet, testAlphaId);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}


// --- NOUVELLES FONCTIONS DE TEST END-TO-END PAR ENVIRONNEMENT ---

/**
 * Exécute une suite de tests complète, un environnement à la fois.
 * ATTENTION : Le test pour l'environnement PROD est désactivé par défaut pour des raisons de sécurité.
 */
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

/**
 * [TEST E2E] Teste la création multiple d'OF sur l'environnement DEV.
 */
function testEndToEnd_DEV() {
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT DEV ---");
  const nomObjet = "TestE2EDevOF-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "DEV", "OF");
  Logger.log("Résultat DEV: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT DEV ---\n");
}

/**
 * [TEST E2E] Teste la création multiple d'OF sur l'environnement TEST.
 */
function testEndToEnd_TEST() {
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT TEST ---");
  const nomObjet = "TestE2ETestOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "TEST", "OF");
  Logger.log("Résultat TEST: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT TEST ---\n");
}

/**
 * [TEST E2E] Teste la création multiple d'OF sur l'environnement PROD.
 * ATTENTION: Ce test crée des données réelles sur votre environnement de production.
 * Il est DÉSACTIVÉ par défaut.
 */
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


// --- Fonctions Principales (Exposées à AppSheet) ---

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
function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, alphaIdSpecifique) {
  let finalOutput = { success: false, message: "" };

  try {
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") { throw new Error("Le paramètre 'nomDeObjetBase' est requis."); }
    if (!typeSysteme || String(typeSysteme).trim() === "") { throw new Error("Le paramètre 'typeSysteme' est requis."); }
    if (!alphaIdSpecifique || String(alphaIdSpecifique).trim() === "") { throw new Error("Le paramètre 'alphaIdSpecifique' est requis."); }

    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES[typeObjetUpper] || config.METADATA_AVATAR_TYPES.DEFAULT;
    
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) {
      throw new Error(`Type d'objet '${typeObjet}' non supporté ou non configuré pour l'environnement ${systemTypeUpper}.`);
    }
    
    const objectNameForApi = `${alphaIdSpecifique}:${nomDeObjetBase}`;
    Logger.log(`Début création objet unique: ${objectNameForApi}`);
    
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
  }

  return JSON.stringify(finalOutput);
}

/**
 * Teste l'authentification.
 * @customfunction
 */
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

/**
 * Teste la création d'un seul objet.
 * @customfunction
 */
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