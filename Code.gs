// Version: 1.2.1
// Last Modified: 2025-06-02 (Ajout tests spécifiques succès/erreur pour creerMultiplesObjets360sc)
/**
 * @fileoverview Main script functions callable from AppSheet.
 */

// --- Fonctions de test spécifiques pour l'éditeur Apps Script ---

function maFonctionDeTestPourAuth() {
  var testSystemType = "DEV"; // Modifier en "PROD" pour tester la config PROD (si configurée)
  Logger.log("Appel de testAuthentication avec typeSysteme: " + testSystemType);
  var resultatString = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication (chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de testAuthentication (objet parsé): " + JSON.stringify(resultatObjet));
  } catch(e) { Logger.log("Erreur parsing JSON pour testAuthentication: " + e.message); }
}

function maFonctionDeTestPourCreerObjet() {
  var testSystemType = "DEV";
  var testNomObjetBase = "TestObjetPlateUnique"; // Nouveau nom pour éviter doublons de tests précédents
  var testAlphaId = "v0:OF_PRINCIPAL";
  Logger.log(`Appel de testCreateSingleObject avec: type=${testSystemType}, nomBase=${testNomObjetBase}, alphaId=${testAlphaId}`);
  var resultatString = testCreateSingleObject(testSystemType, testNomObjetBase, testAlphaId);
  Logger.log("Résultat de testCreateSingleObject (chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de testCreateSingleObject (objet parsé): " + JSON.stringify(resultatObjet));
  } catch(e) { Logger.log("Erreur parsing JSON pour testCreateSingleObject: " + e.message); }
}

// Test spécifique pour un succès de creerMultiplesObjets360sc
function maFonctionDeTestPourCreerMultiples_SUCCES() {
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetPlateSucces"; // Nouveau nom pour un test de succès clair
  Logger.log(`Appel de creerMultiplesObjets360sc (test SUCCES) avec: type=${testSystemType}, nomBase=${testNomDeObjetBase}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType);
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString.substring(0,1000));
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - objet parsé): " + JSON.stringify(resultatObjet));
  } catch(e) { Logger.log("Erreur parsing JSON pour creerMultiples_SUCCES: " + e.message); }
}

// Test spécifique pour une ERREUR gérée par creerMultiplesObjets360sc
function maFonctionDeTestPourCreerMultiples_ERREUR() {
  var testSystemType = "DEV_INVALIDE"; // typeSysteme qui va causer une erreur dans getConfiguration_
  var testNomDeObjetBase = "MonProjetPlateErreur";
  Logger.log(`Appel de creerMultiplesObjets360sc (test ERREUR) avec: type=${testSystemType}, nomBase=${testNomDeObjetBase}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType);
  Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR - chaîne JSON): " + resultatString.substring(0,1000));
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR - objet parsé): " + JSON.stringify(resultatObjet));
  } catch(e) { Logger.log("Erreur parsing JSON pour creerMultiples_ERREUR: " + e.message); }

  // Autre test d'erreur: paramètre manquant
  Logger.log(`Appel de creerMultiplesObjets360sc (test ERREUR - nomDeObjetBase manquant)`);
  resultatString = creerMultiplesObjets360sc(null, "DEV");
  Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR nomDeObjetBase manquant - chaîne JSON): " + resultatString.substring(0,1000));
  try {
    var resultatObjetManquant = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR nomDeObjetBase manquant - objet parsé): " + JSON.stringify(resultatObjetManquant));
  } catch(e) { Logger.log("Erreur parsing JSON pour creerMultiples_ERREUR_MANQUANT: " + e.message); }
}


/**
 * Crée les 5 objets 360sc et retourne leurs URLs dans une structure JSON plate.
 *
 * @param {string} nomDeObjetBase Le nom de base pour les objets.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @return {string} Une chaîne JSON: { success: boolean, message: string, PAC_360scID?: string, ..., error?: string, details_...?: string }
 * @customfunction
 */
function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme) {
  let finalOutput = {
    success: false,
    message: "",
    // La clé 'error' sera ajoutée seulement en cas d'erreur
  };

  try {
    // Validation des paramètres d'entrée
    if (!nomDeObjetBase || String(nomDeObjetBase).trim() === "") { // Vérifie aussi chaîne vide ou espaces
      throw new Error("Le paramètre 'nomDeObjetBase' est requis et ne peut être vide.");
    }
    if (!typeSysteme || String(typeSysteme).trim() === "") { // Vérifie aussi chaîne vide ou espaces
      throw new Error("Le paramètre 'typeSysteme' est requis et ne peut être vide.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début création multiple pour ${nomDeObjetBase}, système: ${systemTypeUpper}`);

    // Tente d'obtenir la configuration AVANT getAuthToken pour valider typeSysteme tôt
    const config = getConfiguration_(systemTypeUpper); // Peut lever une erreur si typeSysteme invalide
    const token = getAuthToken_(systemTypeUpper); // Peut lever une erreur si identifiants non configurés

    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      const objectDisplayName = `${nomDeObjetBase}${objDef.nameSuffix}`;
      Logger.log(`Traitement de l'objet : ${objDef.key}, nom API: ${objectNameForApi}`);

      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId);
        const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
        finalOutput[objDef.key] = mcUrl;
        Logger.log(`Objet ${objDef.key} (${objectDisplayName}) créé avec succès. URL: ${mcUrl}`);
      } catch (e) {
        finalOutput.success = false;
        finalOutput.message = "Échec partiel ou total de la création des objets.";
        finalOutput.error = `Erreur pour ${objectDisplayName} (${objDef.key}): ${e.message}`;
        finalOutput.details_step = `creation_${objDef.key}`;
        finalOutput.details_originalError = e.message; // e.message est souvent suffisant ici
        finalOutput.details_stack = e.stack || 'N/A'; // Stack peut être verbeux
        Logger.log(finalOutput.error + ` (Stack: ${finalOutput.details_stack.substring(0, 200)}...)`); // Limite le log du stack
        return JSON.stringify(finalOutput);
      }
    }

    finalOutput.success = true;
    finalOutput.message = "Tous les objets ont été créés avec succès.";
    Logger.log(finalOutput.message);

  } catch (error) { // Attrape les erreurs de validation des paramètres, getConfiguration_, getAuthToken_
    finalOutput.success = false;
    finalOutput.message = "Une erreur de configuration ou d'authentification est survenue.";
    finalOutput.error = error.message; // Message de l'erreur attrapée
    finalOutput.details_originalError = error.message;
    finalOutput.details_stack = error.stack || 'N/A';
    Logger.log(`Erreur globale dans creerMultiplesObjets360sc: ${finalOutput.error} (Stack: ${finalOutput.details_stack.substring(0, 200)}...)`);
  }

  Logger.log("Retour final (string): " + JSON.stringify(finalOutput).substring(0, 500));
  return JSON.stringify(finalOutput);
}

// --- Fonctions de Test (structure plate) ---
// (Les fonctions testAuthentication, testCreateSingleObject, testGetMcUrlForAvatar restent les mêmes que la v1.2.1)
// Elles retournent déjà une structure plate.

/**
 * Teste l'authentification.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @return {string} Chaîne JSON: { success: boolean, message: string, token?: string, error?: string, details_...?: string }
 * @customfunction
 */
function testAuthentication(typeSysteme) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme) throw new Error("Le paramètre 'typeSysteme' est requis.");
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);

    finalOutput.success = true;
    finalOutput.message = "Authentification réussie.";
    finalOutput.token = token;
  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = "Échec de l'authentification.";
    finalOutput.error = e.message;
    finalOutput.details_originalError = e.message;
    Logger.log(`Erreur testAuthentication: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

/**
 * Teste la création d'un seul objet.
 * @param {string} typeSysteme "DEV" ou "PROD".
 * @param {string} nomObjetTestBase Le nom de base de l'objet.
 * @param {string} alphaIdTest L'alphaId à utiliser.
 * @return {string} Chaîne JSON: { success: boolean, message: string, avatarApiIdPath?: string, mcUrl?: string, error?: string, details_...?: string }
 * @customfunction
 */
function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !nomObjetTestBase || !alphaIdTest) {
      throw new Error("Les paramètres 'typeSysteme', 'nomObjetTestBase', et 'alphaIdTest' sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    const objectNameForApiTest = `${alphaIdTest}:${nomObjetTestBase}`;
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApiTest, alphaIdTest);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);

    finalOutput.success = true;
    finalOutput.message = "Objet unique créé et URL récupérée avec succès.";
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.mcUrl = mcUrl;
  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = "Échec de la création de l'objet unique.";
    finalOutput.error = e.message;
    finalOutput.details_originalError = e.message;
    Logger.log(`Erreur testCreateSingleObject: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

/**
 * Teste la récupération de l'URL mc pour un avatar.
 * @param {string} typeSysteme "DEV" ou "PROD".
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
    const token = getAuthToken_(systemTypeUpper);
    const mcUrlResult = getMcUrlForAvatar_(token, systemTypeUpper, avatarApiIdPath);

    finalOutput.success = true;
    finalOutput.message = "URL mc récupérée avec succès.";
    finalOutput.mcUrl = mcUrlResult;
  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = "Échec de la récupération de l'URL mc.";
    finalOutput.error = e.message;
    finalOutput.details_originalError = e.message;
    Logger.log(`Erreur testGetMcUrlForAvatar: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}