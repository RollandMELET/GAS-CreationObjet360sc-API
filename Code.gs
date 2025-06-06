// FILENAME: Code.gs
// Version: 1.5.1
// Date: 2025-06-06 11:20
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout d'une validation pour s'assurer que creerMultiplesObjets360sc est exclusivement utilisé pour le type 'OF'. Mise à jour des commentaires.
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
  var testTypeObjet = "OF"; // Seul type valide
  Logger.log(`Appel de creerMultiplesObjets360sc (test SUCCES) avec: typeSys=${testSystemType}, nomBase=${testNomDeObjetBase}, typeObj=${testTypeObjet}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, testTypeObjet);
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour creerMultiples_SUCCES: " + e.message); }
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  // Test d'un type d'objet invalide (ex: MOULE), devrait retourner une erreur de validation.
  Logger.log("Test d'erreur : Appel de creerMultiplesObjets360sc avec le type invalide 'MOULE'");
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
  
  // Test original pour nom manquant
  Logger.log(`Appel de creerMultiplesObjets360sc (test ERREUR - nomDeObjetBase manquant)`);
  var resultatString = creerMultiplesObjets360sc(null, "DEV", "OF");
  Logger.log("Résultat de creerMultiplesObjets360sc (ERREUR nomBase manquant - chaîne JSON): " + resultatString);
}

// --- Fonctions de test par environnement et type d'objet ---
function maFonctionDeTestPourCreerMultiples_DEV_OF() {
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_DEV_OF");
  var resultat = creerMultiplesObjets360sc("TestDevOF", "DEV", "OF");
  Logger.log("Résultat DEV OF (JSON): " + resultat);
}
function maFonctionDeTestPourCreerMultiples_DEV_MOULE() {
  Logger.log("ERREUR ATTENDUE : Cette fonction de test est obsolète car 'creerMultiples...' est pour les OF seulement.");
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_DEV_MOULE pour vérifier le mécanisme de garde...");
  var resultat = creerMultiplesObjets360sc("TestDevMoule", "DEV", "MOULE");
  Logger.log("Résultat DEV MOULE (JSON - devrait être une erreur): " + resultat);
}
function maFonctionDeTestPourCreerMultiples_TEST_OF() {
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_TEST_OF");
  var resultat = creerMultiplesObjets360sc("TestTestOF", "TEST", "OF");
  Logger.log("Résultat TEST OF (JSON): " + resultat);
}
function maFonctionDeTestPourCreerMultiples_TEST_MOULE() {
  Logger.log("ERREUR ATTENDUE : Cette fonction de test est obsolète car 'creerMultiples...' est pour les OF seulement.");
  Logger.log("Exécution maFonctionDeTestPourCreerMultiples_TEST_MOULE pour vérifier le mécanisme de garde...");
  var resultat = creerMultiplesObjets360sc("TestTestMoule", "TEST", "MOULE");
  Logger.log("Résultat TEST MOULE (JSON - devrait être une erreur): " + resultat);
}

// --- Nouvelle fonction de test wrapper pour creerObjetUnique360sc ---
function maFonctionDeTestPourCreerObjetUnique() {
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV"; // ou "TEST", "PROD"
  var testTypeObjet = "MOULE";   // ou "OF"
  var testAlphaId = "v0:MOULE_CORPS"; // Exemple d'alphaId spécifique pour un moule
  
  Logger.log(`Appel de creerObjetUnique360sc (test) avec: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeObj=${testTypeObjet}, alphaId=${testAlphaId}`);
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, testTypeObjet, testAlphaId);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}


/**
 * [SPECIALISEE-OF] Crée la structure complète des 5 objets 360sc pour un Ordre de Fabrication (OF).
 * Retourne leurs URLs dans une structure JSON plate.
 * CETTE FONCTION EST EXCLUSIVEMENT POUR LES OBJETS DE TYPE 'OF'.
 *
 * @param {string} nomDeObjetBase Le nom de base pour les objets OF.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} typeObjet Doit être "OF". Si non fourni, "OF" est assumé. Toute autre valeur provoquera une erreur.
 * @return {string} Une chaîne JSON: { success: boolean, message: string, PAC_360scID?: string, ..., error?: string, details_...?: string }
 * @customfunction
 */
function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet) {
  let finalOutput = { success: false, message: "" };

  try {
    // ---- VALIDATION ET GARDES ----
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

    // Vérification stricte du type d'objet pour cette fonction spécialisée
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "OF"; // Défaut à OF si non fourni
    if (typeObjetUpper !== 'OF') {
      throw new Error("Usage incorrect: La fonction 'creerMultiplesObjets360sc' est réservée exclusivement à la création d'objets de type 'OF'. Pour un 'MOULE' ou autre, veuillez utiliser la fonction 'creerObjetUnique360sc'.");
    }
    // ---- FIN VALIDATION ----
    
    const metadataAvatarTypeId = METADATA_AVATAR_TYPES.OF; // On utilise directement le type OF
    Logger.log(`Début création multiple pour OF '${nomDeObjetBase}', système: ${systemTypeUpper}`);

    const config = getConfiguration_(systemTypeUpper);
    const token = getAuthToken_(systemTypeUpper);

    // La constante OBJECT_DEFINITIONS est correcte car spécifique aux OF
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
        finalOutput.details_stack = e.stack ? e.stack.substring(0, 500) : 'N/A';
        Logger.log(finalOutput.error + ` (Stack: ${finalOutput.details_stack}...`);
        return JSON.stringify(finalOutput);
      }
    }

    finalOutput.success = true;
    finalOutput.message = "Tous les objets OF ont été créés avec succès.";
    Logger.log(finalOutput.message);

  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Une erreur de configuration, de validation ou d'authentification est survenue.";
    finalOutput.error = error.message;
    finalOutput.details_originalError = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans creerMultiplesObjets360sc: ${finalOutput.error} (Stack: ${finalOutput.details_stack}...`);
  }

  return JSON.stringify(finalOutput);
}


/**
 * [GENERIQUE] Crée un unique objet 360sc et retourne son URL mc.
 * Le nom de l'objet API sera construit comme alphaIdSpecifique:nomDeObjetBase.
 *
 * @param {string} nomDeObjetBase Le nom de base pour l'objet.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} typeObjet "OF", "MOULE", etc. pour déterminer le metadataAvatarTypeId.
 * @param {string} alphaIdSpecifique L'alphaId spécifique à utiliser pour cet objet unique (ex: "v0:MOULE_CORPS").
 * @return {string} Une chaîne JSON: { success: boolean, message: string, mcUrl?: string, avatarApiIdPath?: string, objectNameCreated?: string, error?: string, details_...?: string }
 * @customfunction
 */
function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, alphaIdSpecifique) {
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
    if (!alphaIdSpecifique || String(alphaIdSpecifique).trim() === "") {
      throw new Error("Le paramètre 'alphaIdSpecifique' est requis et ne peut être vide.");
    }

    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = METADATA_AVATAR_TYPES[typeObjetUpper] || METADATA_AVATAR_TYPES.DEFAULT;
    if (!metadataAvatarTypeId) {
        throw new Error(`Type d'objet '${typeObjet}' non supporté ou 'DEFAULT' non configuré pour déterminer metadataAvatarTypeId.`);
    }
    
    const objectNameForApi = `${alphaIdSpecifique}:${nomDeObjetBase}`;

    Logger.log(`Début création objet unique pour ${nomDeObjetBase}, système: ${systemTypeUpper}, type (meta): ${typeObjetUpper}, alphaId: ${alphaIdSpecifique}, nom API: ${objectNameForApi}`);

    const config = getConfiguration_(systemTypeUpper);
    const token = getAuthToken_(systemTypeUpper);

    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, alphaIdSpecifique, metadataAvatarTypeId);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);

    finalOutput.success = true;
    finalOutput.message = `Objet unique '${objectNameForApi}' créé avec succès.`;
    finalOutput.mcUrl = mcUrl;
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.objectNameCreated = objectNameForApi;
    Logger.log(finalOutput.message + ` URL: ${mcUrl}`);

  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Une erreur est survenue lors de la création de l'objet unique.";
    finalOutput.error = error.message;
    finalOutput.details_originalError = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans creerObjetUnique360sc: ${finalOutput.error} (Stack: ${finalOutput.details_stack}...`);
  }

  return JSON.stringify(finalOutput);
}


// --- Fonctions de Test Publiques (appelables par AppSheet si besoin, structure plate) ---

/**
 * Teste l'authentification.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @return {string} Chaîne JSON: { success: boolean, message: string, error?: string }
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
    Logger.log(`Token obtenu pour ${systemTypeUpper} (non inclus dans la réponse par défaut)`);

  } catch (e) {
    finalOutput.success = false;
    finalOutput.message = `Échec de l'authentification pour ${typeSysteme}.`;
    finalOutput.error = e.message;
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
 * @return {string} Chaîne JSON: { success: boolean, message: string, avatarApiIdPath?: string, mcUrl?: string, error?: string }
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
    Logger.log(`Erreur testCreateSingleObject (${typeSysteme}): ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

/**
 * Teste la récupération de l'URL mc pour un avatar.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @param {string} avatarApiIdPath L'@id de l'avatar.
 * @return {string} Chaîne JSON: { success: boolean, message: string, mcUrl?: string, error?: string }
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
    Logger.log(`Erreur testGetMcUrlForAvatar (${typeSysteme}): ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}