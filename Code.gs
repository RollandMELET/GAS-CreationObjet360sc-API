// FILENAME: Code.gs
// Version: 1.3.0
// Date: 2025-06-01 17:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout paramètre typeObjet, gestion env TEST, et nouvelles fonctions de test pour DEV/TEST avec OF/MOULE.
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
  // Utilisation d'un type d'objet spécifique (ex: OF)
  var testMetadataTypeId = METADATA_AVATAR_TYPES.OF; // Ou METADATA_AVATAR_TYPES.MOULE

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
  var testTypeObjet = "OF"; // "OF" ou "MOULE"
  Logger.log(`Appel de creerMultiplesObjets360sc (test SUCCES) avec: typeSys=${testSystemType}, nomBase=${testNomDeObjetBase}, typeObj=${testTypeObjet}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, testTypeObjet);
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString.substring(0, 1000));
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour creerMultiples_SUCCES: " + e.message); }
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  var testSystemTypeInvalide = "DEV_INVALIDE";
  var testNomDeObjetBaseErreur = "MonProjetMultiErreur";
  var testTypeObjetErreur = "OF";
  Logger.log(`Appel de creerMultiplesObjets360sc (test ERREUR config) avec: typeSys=${testSystemTypeInvalide}, nomBase=${testNomDeObjetBaseErreur}, typeObj=${testTypeObjetErreur}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBaseErreur, testSystemTypeInvalide, testTypeObjetErreur);
  Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR config - chaîne JSON): " + resultatString.substring(0, 1000));
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR config - objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour creerMultiples_ERREUR_config: " + e.message); }

  Logger.log(`Appel de creerMultiplesObjets360sc (test ERREUR - nomDeObjetBase manquant)`);
  resultatString = creerMultiplesObjets360sc(null, "DEV", "OF");
  Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR nomBase manquant - chaîne JSON): " + resultatString.substring(0, 1000));
  try {
    var resultatObjetManquant = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR nomBase manquant - objet parsé): " + JSON.stringify(resultatObjetManquant));
  } catch (e) { Logger.log("Erreur parsing JSON pour creerMultiples_ERREUR_MANQUANT: " + e.message); }
}

// --- Nouvelles fonctions de test par environnement et type d'objet ---
function maFonctionDeTestPourCreerMultiples_DEV_OF() {
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_DEV_OF");
  var resultat = creerMultiplesObjets360sc("TestDevOF", "DEV", "OF");
  Logger.log("Résultat DEV OF (JSON): " + resultat);
  Logger.log("Résultat DEV OF (Parsed): " + JSON.stringify(JSON.parse(resultat)));
}
function maFonctionDeTestPourCreerMultiples_DEV_MOULE() {
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_DEV_MOULE");
  var resultat = creerMultiplesObjets360sc("TestDevMoule", "DEV", "MOULE");
  Logger.log("Résultat DEV MOULE (JSON): " + resultat);
  Logger.log("Résultat DEV MOULE (Parsed): " + JSON.stringify(JSON.parse(resultat)));
}
function maFonctionDeTestPourCreerMultiples_TEST_OF() {
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_TEST_OF");
  var resultat = creerMultiplesObjets360sc("TestTestOF", "TEST", "OF");
  Logger.log("Résultat TEST OF (JSON): " + resultat);
  Logger.log("Résultat TEST OF (Parsed): " + JSON.stringify(JSON.parse(resultat)));
}
function maFonctionDeTestPourCreerMultiples_TEST_MOULE() {
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_TEST_MOULE");
  var resultat = creerMultiplesObjets360sc("TestTestMoule", "TEST", "MOULE");
  Logger.log("Résultat TEST MOULE (JSON): " + resultat);
  Logger.log("Résultat TEST MOULE (Parsed): " + JSON.stringify(JSON.parse(resultat)));
}

/**
 * Crée les 5 objets 360sc et retourne leurs URLs dans une structure JSON plate.
 *
 * @param {string} nomDeObjetBase Le nom de base pour les objets.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} typeObjet "OF" ou "MOULE" (ou autre clé de METADATA_AVATAR_TYPES).
 * @return {string} Une chaîne JSON: { success: boolean, message: string, PAC_360scID?: string, ..., error?: string, details_...?: string }
 * @customfunction
 */
function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet) {
  let finalOutput = { success: false, message: "" };

  try {
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") {
      throw new Error("Le paramètre 'nomDeObjetBase' est requis et ne peut être vide.");
    }
    if (!typeSysteme || String(typeSysteme).trim() === "") {
      throw new Error("Le paramètre 'typeSysteme' est requis et ne peut être vide.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    if (!["DEV", "TEST", "PROD"].includes(systemTypeUpper)) {
        throw new Error(`Valeur de 'typeSysteme' invalide: ${typeSysteme}. Doit être "DEV", "TEST", ou "PROD".`);
    }

    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = METADATA_AVATAR_TYPES[typeObjetUpper] || METADATA_AVATAR_TYPES.DEFAULT;
    if (!metadataAvatarTypeId) { // Double check si DEFAULT n'existe pas ou si typeObjetUpper est invalide sans fallback
        throw new Error(`Type d'objet '${typeObjet}' non supporté ou 'DEFAULT' non configuré.`);
    }

    Logger.log(`Début création multiple pour ${nomDeObjetBase}, système: ${systemTypeUpper}, type d'objet: ${typeObjetUpper} (ID: ${metadataAvatarTypeId})`);

    const config = getConfiguration_(systemTypeUpper);
    const token = getAuthToken_(systemTypeUpper);

    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      const objectDisplayName = `${nomDeObjetBase}${objDef.nameSuffix}`;
      Logger.log(`Traitement de l'objet : ${objDef.key}, nom API: ${objectNameForApi}`);

      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
        finalOutput[objDef.key] = mcUrl;
        Logger.log(`Objet ${objDef.key} (${objectDisplayName}) créé avec succès. URL: ${mcUrl}`);
      } catch (e) {
        finalOutput.success = false;
        finalOutput.message = "Échec partiel ou total de la création des objets.";
        finalOutput.error = `Erreur pour ${objectDisplayName} (${objDef.key}): ${e.message}`;
        finalOutput.details_step = `creation_${objDef.key}`;
        finalOutput.details_originalError = e.message;
        finalOutput.details_stack = e.stack ? e.stack.substring(0, 500) : 'N/A'; // Limiter taille stack
        Logger.log(finalOutput.error + ` (Stack: ${finalOutput.details_stack}...`);
        return JSON.stringify(finalOutput);
      }
    }

    finalOutput.success = true;
    finalOutput.message = "Tous les objets ont été créés avec succès.";
    Logger.log(finalOutput.message);

  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Une erreur de configuration, d'authentification ou de paramètre est survenue.";
    finalOutput.error = error.message;
    finalOutput.details_originalError = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A'; // Limiter taille stack
    Logger.log(`Erreur globale dans creerMultiplesObjets360sc: ${finalOutput.error} (Stack: ${finalOutput.details_stack}...`);
  }

  Logger.log("Retour final (string): " + JSON.stringify(finalOutput).substring(0, 500));
  return JSON.stringify(finalOutput);
}

// --- Fonctions de Test Publiques (appelables par AppSheet si besoin, structure plate) ---

/**
 * Teste l'authentification.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @return {string} Chaîne JSON: { success: boolean, message: string, token?: string, error?: string, details_...?: string }
 * @customfunction
 */
function testAuthentication(typeSysteme) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme) throw new Error("Le paramètre 'typeSysteme' est requis.");
    const systemTypeUpper = typeSysteme.toUpperCase();
     if (!["DEV", "TEST", "PROD"].includes(systemTypeUpper)) {
        throw new Error(`Valeur de 'typeSysteme' invalide: ${typeSysteme}. Doit être "DEV", "TEST", ou "PROD".`);
    }
    const token = getAuthToken_(systemTypeUpper);

    finalOutput.success = true;
    finalOutput.message = `Authentification réussie pour ${systemTypeUpper}.`;
    // Par sécurité, ne pas retourner le token dans un contexte AppSheet, sauf si explicitement debug.
    // finalOutput.token = token; 
    Logger.log(`Token obtenu pour ${systemTypeUpper} (non inclus dans la réponse par défaut)`);

  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = `Échec de l'authentification pour ${typeSysteme}.`;
    finalOutput.error = e.message;
    finalOutput.details_originalError = e.message;
    Logger.log(`Erreur testAuthentication (${typeSysteme}): ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

/**
 * Teste la création d'un seul objet.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} nomObjetTestBase Le nom de base de l'objet.
 * @param {string} alphaIdTest L'alphaId à utiliser.
 * @param {string} metadataAvatarTypeIdTest L'ID du type de metadata avatar (ex: METADATA_AVATAR_TYPES.OF).
 * @return {string} Chaîne JSON: { success: boolean, message: string, avatarApiIdPath?: string, mcUrl?: string, error?: string, details_...?: string }
 * @customfunction
 */
function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest, metadataAvatarTypeIdTest) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !nomObjetTestBase || !alphaIdTest || !metadataAvatarTypeIdTest) {
      throw new Error("Les paramètres 'typeSysteme', 'nomObjetTestBase', 'alphaIdTest', et 'metadataAvatarTypeIdTest' sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    if (!["DEV", "TEST", "PROD"].includes(systemTypeUpper)) {
        throw new Error(`Valeur de 'typeSysteme' invalide: ${typeSysteme}.`);
    }
    
    const token = getAuthToken_(systemTypeUpper);
    const objectNameForApiTest = `${alphaIdTest}:${nomObjetTestBase}`;
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApiTest, alphaIdTest, metadataAvatarTypeIdTest);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);

    finalOutput.success = true;
    finalOutput.message = `Objet unique (${systemTypeUpper}) créé et URL récupérée avec succès.`;
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.mcUrl = mcUrl;
  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = `Échec de la création de l'objet unique (${typeSysteme}).`;
    finalOutput.error = e.message;
    finalOutput.details_originalError = e.message;
    Logger.log(`Erreur testCreateSingleObject (${typeSysteme}): ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

/**
 * Teste la récupération de l'URL mc pour un avatar.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} avatarApiIdPath L'@id de l'avatar.
 * @return {string} Chaîne JSON: { success: boolean, message: string, mcUrl?: string, error?: string, details_...?: string }
 * @customfunction
 */
function testGetMcUrlForAvatar(typeSysteme, avatarApiIdPath) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !avatarApiIdPath) {
      throw new Error("Les paramètres 'typeSysteme' et 'avatarApiIdPath' sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    if (!["DEV", "TEST", "PROD"].includes(systemTypeUpper)) {
        throw new Error(`Valeur de 'typeSysteme' invalide: ${typeSysteme}.`);
    }

    const token = getAuthToken_(systemTypeUpper);
    const mcUrlResult = getMcUrlForAvatar_(token, systemTypeUpper, avatarApiIdPath);

    finalOutput.success = true;
    finalOutput.message = `URL mc (${systemTypeUpper}) récupérée avec succès.`;
    finalOutput.mcUrl = mcUrlResult;
  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = `Échec de la récupération de l'URL mc (${typeSysteme}).`;
    finalOutput.error = e.message;
    finalOutput.details_originalError = e.message;
    Logger.log(`Erreur testGetMcUrlForAvatar (${typeSysteme}): ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}