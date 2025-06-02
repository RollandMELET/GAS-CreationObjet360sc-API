// Version: 1.1.0
// Last Modified: 2025-06-02 (Utilisation de ScriptProperties pour identifiants API, MAJ signatures fonctions publiques)
/**
 * @fileoverview Main script functions callable from AppSheet.
 */

// --- Fonctions de test spécifiques pour l'éditeur Apps Script ---
// Note: Ces fonctions ne prennent plus username/password car getAuthToken_ les récupère de ScriptProperties.

function maFonctionDeTestPourAuth() {
  var testSystemType = "DEV";          // "DEV" ou "PROD"

  Logger.log("Appel de testAuthentication avec typeSysteme: " + testSystemType);
  // Assurez-vous que les identifiants sont DÉJÀ stockés via storeApiCredentials()
  var resultat = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication: " + JSON.stringify(resultat));
}

function maFonctionDeTestPourCreerObjet() {
  var testSystemType = "DEV";               // "DEV" ou "PROD"
  var testNomObjetBase = "TestObjetEditeurProps"; // Nom de base pour l'objet de test
  var testAlphaId = "v0:OF_PRINCIPAL";      // AlphaId pour le test

  Logger.log(`Appel de testCreateSingleObject avec: type=${testSystemType}, nomBase=${testNomObjetBase}, alphaId=${testAlphaId}`);
  // Assurez-vous que les identifiants sont DÉJÀ stockés via storeApiCredentials()
  var resultat = testCreateSingleObject(testSystemType, testNomObjetBase, testAlphaId);
  Logger.log("Résultat de testCreateSingleObject: " + JSON.stringify(resultat));
}

function maFonctionDeTestPourCreerMultiples() {
  var testSystemType = "DEV";                  // "DEV" ou "PROD"
  var testNomDeObjetBase = "MonProjetTestEditeurProps"; // Nom de base pour le lot d'objets

  Logger.log(`Appel de creerMultiplesObjets360sc avec: type=${testSystemType}, nomBase=${testNomDeObjetBase}`);
  // Assurez-vous que les identifiants sont DÉJÀ stockés via storeApiCredentials()
  var resultat = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType);
  Logger.log("Résultat de creerMultiplesObjets360sc: " + JSON.stringify(resultat));
}


/**
 * Crée les 5 objets 360sc et retourne leurs URLs.
 * Appelable depuis AppSheet. Les identifiants API sont lus depuis ScriptProperties.
 *
 * @param {string} nomDeObjetBase Le nom de base pour les objets (ex: "MonProjetSuper").
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @return {object} Un objet contenant les clés des objets et leurs mcUrls, ou un objet {error: "message"}.
 * @customfunction
 */
function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme) {
  try {
    if (!typeSysteme) {
      throw new Error("Le paramètre 'typeSysteme' est requis et ne peut pas être vide/undefined.");
    }
    if (!nomDeObjetBase) {
      throw new Error("Le paramètre 'nomDeObjetBase' est requis et ne peut pas être vide/undefined.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début création multiple pour ${nomDeObjetBase}, système: ${systemTypeUpper}`);

    // Les identifiants username/password sont maintenant récupérés par getAuthToken_
    const token = getAuthToken_(systemTypeUpper);
    const results = {};

    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      const objectDisplayName = `${nomDeObjetBase}${objDef.nameSuffix}`;
      Logger.log(`Traitement de l'objet : ${objDef.key}, nom API: ${objectNameForApi}`);

      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId);
        const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
        results[objDef.key] = mcUrl;
        Logger.log(`Objet ${objDef.key} (${objectDisplayName}) créé avec succès. URL: ${mcUrl}`);
      } catch (e) {
        const errorMessage = `Erreur lors de la création/récupération URL pour l'objet ${objectDisplayName} (${objDef.key}): ${e.message}`;
        Logger.log(errorMessage + ` (Stack: ${e.stack || 'N/A'})`);
        return { error: errorMessage };
      }
    }
    Logger.log("Création de tous les objets terminée avec succès.");
    Logger.log(JSON.stringify(results));
    return results;
  } catch (error) {
    const globalErrorMessage = `Erreur globale dans creerMultiplesObjets360sc: ${error.message}`;
    Logger.log(globalErrorMessage + ` (Stack: ${error.stack || 'N/A'})`);
    return { error: globalErrorMessage };
  }
}

// --- Fonctions de Test (appelables par AppSheet ou les wrappers) ---
// Note: Signatures modifiées, username/password ne sont plus des paramètres.

/**
 * Teste l'authentification à l'API 360sc (identifiants via ScriptProperties).
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @return {object} { success: true, token: "le_token" } ou { success: false, error: "Message" }.
 * @customfunction
 */
function testAuthentication(typeSysteme) {
  try {
    if (!typeSysteme) {
      throw new Error("Le paramètre 'typeSysteme' est requis pour testAuthentication.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    // Les identifiants username/password sont maintenant récupérés par getAuthToken_
    const token = getAuthToken_(systemTypeUpper);
    return { success: true, token: token };
  } catch (e) {
    Logger.log(`Erreur testAuthentication: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Teste la création d'un seul objet (identifiants via ScriptProperties).
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @param {string} nomObjetTestBase Le nom de base de l'objet.
 * @param {string} alphaIdTest L'alphaId à utiliser.
 * @return {object} { success: true, avatarApiIdPath: "...", mcUrl: "..." } ou { success: false, error: "Message" }.
 * @customfunction
 */
function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest) {
  try {
    if (!typeSysteme || !nomObjetTestBase || !alphaIdTest) {
      throw new Error("Les paramètres 'typeSysteme', 'nomObjetTestBase', et 'alphaIdTest' sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    const objectNameForApiTest = `${alphaIdTest}:${nomObjetTestBase}`;
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApiTest, alphaIdTest);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
    return { success: true, avatarApiIdPath: avatarIdPath, mcUrl: mcUrl };
  } catch (e) {
    Logger.log(`Erreur testCreateSingleObject: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Teste la récupération de l'URL mc pour un avatar (identifiants via ScriptProperties).
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @param {string} avatarApiIdPath L'@id de l'avatar.
 * @return {object} { success: true, mcUrl: "..." } ou { success: false, error: "Message" }.
 * @customfunction
 */
function testGetMcUrlForAvatar(typeSysteme, avatarApiIdPath) {
  try {
    if (!typeSysteme || !avatarApiIdPath) {
      throw new Error("Les paramètres 'typeSysteme' et 'avatarApiIdPath' sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarApiIdPath);
    return { success: true, mcUrl: mcUrl };
  } catch (e) {
    Logger.log(`Erreur testGetMcUrlForAvatar: ${e.message}`);
    return { success: false, error: e.message };
  }
}