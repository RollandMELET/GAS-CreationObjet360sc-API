// Version: 1.0.2
// Last Modified: 2025-06-02 10:11 par Rolland  (modification maFonctionDeTestPourCreerObjet() )
/**
 * @fileoverview Main script functions callable from AppSheet.
 */

// --- Fonctions de test spécifiques pour l'éditeur Apps Script ---
/**
 * Fonction wrapper pour tester testAuthentication depuis l'éditeur Apps Script.
 * REMPLACEZ les valeurs de testUsername, testPassword par vos identifiants réels.
 */
function maFonctionDeTestPourCreerObjet() {
  // REMPLACE CECI PAR TES VRAIS IDENTIFIANTS ET PARAMÈTRES DE TEST
  var testUsername = "360sc_Duhalde";      // METS TON VRAI USERNAME API ICI
  var testPassword = "360sc_Duhalde";      // METS TON VRAI MOT DE PASSE API ICI
  var testSystemType = "DEV";               // "DEV" ou "PROD"
  var testNomObjetBase = "TestObjetEditeur"; // Nom de base pour l'objet de test
  var testAlphaId = "v0:OF_PRINCIPAL";      // AlphaId pour le test

  Logger.log(`Appel de testCreateSingleObject avec: user=${testUsername}, type=${testSystemType}, nomBase=${testNomObjetBase}, alphaId=${testAlphaId}`);
  var resultat = testCreateSingleObject(testUsername, testPassword, testSystemType, testNomObjetBase, testAlphaId);
  Logger.log("Résultat de testCreateSingleObject: " + JSON.stringify(resultat));
}

/**
 * Fonction wrapper pour tester testCreateSingleObject depuis l'éditeur Apps Script.
 * REMPLACEZ les valeurs de testUsername, testPassword par vos identifiants réels.
 */
function maFonctionDeTestPourCreerObjet() {
  // REMPLACE CECI PAR TES VRAIS IDENTIFIANTS ET PARAMÈTRES DE TEST
  var testUsername = "360sc_Duhalde";      // METS TON VRAI USERNAME API ICI
  var testPassword = "360sc_Duhalde";      // METS TON VRAI MOT DE PASSE API ICI
  var testSystemType = "DEV";               // "DEV" ou "PROD"
  var testNomObjetBase = "TestObjetEditeur"; // Nom de base pour l'objet de test
  var testAlphaId = "v0:OF_PRINCIPAL";      // AlphaId pour le test

  Logger.log(`Appel de testCreateSingleObject avec: user=${testUsername}, type=${testSystemType}, nomBase=${testNomObjetBase}, alphaId=${testAlphaId}`);
  var resultat = testCreateSingleObject(testUsername, testPassword, testSystemType, testNomObjetBase, testAlphaId);
  Logger.log("Résultat de testCreateSingleObject: " + JSON.stringify(resultat));
}

/**
 * Fonction wrapper pour tester la fonction principale creerMultiplesObjets360sc depuis l'éditeur.
 * REMPLACEZ les valeurs de testUsername, testPassword par vos identifiants réels.
 */
function maFonctionDeTestPourCreerMultiples() {
  // REMPLACE CECI PAR TES VRAIS IDENTIFIANTS ET PARAMÈTRES DE TEST
  var testUsername = "360sc_Duhalde";         // METS TON VRAI USERNAME API ICI
  var testPassword = "360sc_Duhalde";         // METS TON VRAI MOT DE PASSE API ICI
  var testSystemType = "DEV";                  // "DEV" ou "PROD"
  var testNomDeObjetBase = "MonProjetTestEditeur"; // Nom de base pour le lot d'objets

  Logger.log(`Appel de creerMultiplesObjets360sc avec: user=${testUsername}, type=${testSystemType}, nomBase=${testNomDeObjetBase}`);
  var resultat = creerMultiplesObjets360sc(testNomDeObjetBase, testUsername, testPassword, testSystemType);
  Logger.log("Résultat de creerMultiplesObjets360sc: " + JSON.stringify(resultat));
}


/**
 * Crée les 5 objets 360sc et retourne leurs URLs.
 * Appelable depuis AppSheet.
 *
 * @param {string} nomDeObjetBase Le nom de base pour les objets (ex: "MonProjetSuper").
 * @param {string} username Le nom d'utilisateur pour l'API 360sc.
 * @param {string} password Le mot de passe pour l'API 360sc.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @return {object} Un objet contenant les clés des objets et leurs mcUrls, ou un objet {error: "message"}.
 *                  Ex: { "PAC_360scID": "url1", "PAC_360scID_ENV": "url2", ... }
 * @customfunction
 */
function creerMultiplesObjets360sc(nomDeObjetBase, username, password, typeSysteme) {
  try {
    if (!typeSysteme) {
      throw new Error("Le paramètre 'typeSysteme' est requis et ne peut pas être vide/undefined.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase(); // Ensure uppercase for consistency
    Logger.log(`Début création multiple pour ${nomDeObjetBase}, système: ${systemTypeUpper}`);

    const token = getAuthToken_(username, password, systemTypeUpper);
    const results = {};

    for (const objDef of OBJECT_DEFINITIONS) {
      // Le nom de l'objet pour l'API est alphaId:NomDeBaseSuffixe
      // Ex: "v0:OF_PRINCIPAL:MonProjetSuper" ou "v0:OF_ENVELOPPE:MonProjetSuper-ENV"
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      // Le nom "logique" ou "d'affichage"
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
        // Arrêter le processus et retourner une erreur claire
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

// --- Fonctions de Test (appelables directement par les wrappers ci-dessus ou par AppSheet) ---

/**
 * Teste l'authentification à l'API 360sc.
 * @param {string} username Le nom d'utilisateur.
 * @param {string} password Le mot de passe.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @return {object} { success: true, token: "le_token" } ou { success: false, error: "Message" }.
 * @customfunction
 */
function testAuthentication(username, password, typeSysteme) {
  try {
    if (!typeSysteme) {
      throw new Error("Le paramètre 'typeSysteme' est requis pour testAuthentication et ne peut pas être vide/undefined.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(username, password, systemTypeUpper);
    return { success: true, token: token };
  } catch (e) {
    Logger.log(`Erreur testAuthentication: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Teste la création d'un seul objet et la récupération de son mcUrl.
 * @param {string} username Le nom d'utilisateur.
 * @param {string} password Le mot de passe.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @param {string} nomObjetTestBase Le nom de base de l'objet à créer pour le test (ex: "TestObjetAPI").
 * @param {string} alphaIdTest L'alphaId à utiliser (ex: "v0:OF_PRINCIPAL").
 * @return {object} { success: true, avatarApiIdPath: "...", mcUrl: "..." } ou { success: false, error: "Message" }.
 * @customfunction
 */
function testCreateSingleObject(username, password, typeSysteme, nomObjetTestBase, alphaIdTest) {
  try {
    if (!typeSysteme) {
      throw new Error("Le paramètre 'typeSysteme' est requis pour testCreateSingleObject et ne peut pas être vide/undefined.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(username, password, systemTypeUpper);
    
    // Nom de l'objet pour l'API, ex: "v0:OF_PRINCIPAL:TestObjetAPI"
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
 * Teste la récupération de l'URL mc pour un avatar existant.
 * (Note: testGetMcUrlForAvatar nécessite un avatarApiIdPath valide qui doit être obtenu au préalable)
 * @param {string} username Le nom d'utilisateur.
 * @param {string} password Le mot de passe.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @param {string} avatarApiIdPath L'@id de l'avatar (ex: "/api/avatars/xxxxx").
 * @return {object} { success: true, mcUrl: "..." } ou { success: false, error: "Message" }.
 * @customfunction
 */
function testGetMcUrlForAvatar(username, password, typeSysteme, avatarApiIdPath) {
  try {
    if (!typeSysteme) {
      throw new Error("Le paramètre 'typeSysteme' est requis pour testGetMcUrlForAvatar et ne peut pas être vide/undefined.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(username, password, systemTypeUpper);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarApiIdPath);
    return { success: true, mcUrl: mcUrl };
  } catch (e) {
    Logger.log(`Erreur testGetMcUrlForAvatar: ${e.message}`);
    return { success: false, error: e.message };
  }
}