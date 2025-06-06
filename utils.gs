// FILENAME: utils.gs
// Version: 1.4.0
// Date: 2025-06-06 12:40
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Suppression des fonctions de diagnostic temporaires (`temp_...`) maintenant que les configurations sont validées.
/**
 * @fileoverview Utility functions for the script, including credential management.
 */

// testSimpleBrowserMsgBox reste commenté comme dans la version originale.
function testSimpleBrowserMsgBox() {
  // ... (contenu original commenté)
  Logger.log("testSimpleBrowserMsgBox a été appelé (contenu original commenté).");
}

/**
 * Stores API credentials for a specific environment in ScriptProperties.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 * @param {string} username The API username.
 * @param {string} password The API password.
 * @private
 */
function _storeApiCredentials(typeSysteme, username, password) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  if (!["DEV", "TEST", "PROD"].includes(systemTypeUpper)) {
    Logger.log(`ERREUR: Type de système '${typeSysteme}' invalide pour le stockage des identifiants.`);
    return;
  }

  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    if (!username || !password || username.trim() === "" || password.trim() === "" || username.startsWith("VOTRE_") || password.startsWith("VOTRE_")) {
      var errorPrompt = `Veuillez fournir un username et password valides pour l'environnement ${systemTypeUpper}. Les valeurs actuelles sont : User='${username}', Pass fourni='${password ? 'Oui' : 'Non'}'.`;
      Logger.log("ERREUR stockage: " + errorPrompt);
      return;
    }

    scriptProperties.setProperties({
      [`API_USERNAME_${systemTypeUpper}`]: username,
      [`API_PASSWORD_${systemTypeUpper}`]: password
    });

    var successPrompt = `Les identifiants API pour ${systemTypeUpper} ont été stockés dans ScriptProperties.`;
    Logger.log(successPrompt);
  } catch (e) {
    var catchPrompt = `Une erreur est survenue lors du stockage des identifiants pour ${systemTypeUpper}: ${e.message}`;
    Logger.log(catchPrompt + ` (Stack: ${e.stack || 'N/A'})`);
  }
}

/**
 * Stores DEV API credentials. User must edit placeholders.
 */
function storeDevApiCredentials() {
  var username_dev = "IDENTIFIANT_STOCKE"; // REMPLACEZ CECI
  var password_dev = ""; // REMPLACEZ CECI
  Logger.log("Tentative de stockage des identifiants DEV. VEUILLEZ MODIFIER LES PLACEHOLDERS DANS LE CODE AVANT D'EXECUTER SI CE N'EST PAS FAIT.");
  _storeApiCredentials("DEV", username_dev, password_dev);
}

/**
 * Stores TEST API credentials. (Pré-rempli avec les infos fournies)
 */
function storeTestApiCredentials() {
  var username_test = "IDENTIFIANT_TEST_STOCKE"; // Pré-rempli
  var password_test = "MOTDEPASSE_TEST_STOCKEldeTest"; // Pré-rempli
  Logger.log("Tentative de stockage des identifiants TEST.");
  _storeApiCredentials("TEST", username_test, password_test);
}

/**
 * Stores PROD API credentials. User must edit placeholders.
 */
function storeProdApiCredentials() {
  var username_prod = "VOTRE_USERNAME_PROD"; // REMPLACEZ CECI
  var password_prod = "VOTRE_PASSWORD_PROD"; // REMPLACEZ CECI
  Logger.log("Tentative de stockage des identifiants PROD. VEUILLEZ MODIFIER LES PLACEHOLDERS DANS LE CODE AVANT D'EXECUTER SI CE N'EST PAS FAIT.");
  _storeApiCredentials("PROD", username_prod, password_prod);
}


/**
 * Retrieves and logs stored API credentials for all configured environments.
 */
function checkStoredApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const environments = ["DEV", "TEST", "PROD"];
    Logger.log('Vérification des identifiants stockés :');

    environments.forEach(env => {
      const username = scriptProperties.getProperty(`API_USERNAME_${env}`);
      const passwordIsSet = !!scriptProperties.getProperty(`API_PASSWORD_${env}`);
      Logger.log(`--- ${env} ---`);
      Logger.log(`API_USERNAME_${env}: ` + (username || 'NON DÉFINI'));
      Logger.log(`API_PASSWORD_${env} est défini: ` + passwordIsSet);
    });

  } catch (e) {
    var catchPrompt = `Une erreur est survenue lors de la vérification des identifiants : ${e.message}`;
    Logger.log(catchPrompt + ` (Stack: ${e.stack || 'N/A'})`);
  }
}

/**
 * Deletes stored API credentials for a specific environment from ScriptProperties.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 */
function deleteStoredApiCredentialsForEnv(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  if (!["DEV", "TEST", "PROD"].includes(systemTypeUpper)) {
    Logger.log(`ERREUR: Type de système '${typeSysteme}' invalide pour la suppression des identifiants.`);
    return;
  }
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.deleteProperty(`API_USERNAME_${systemTypeUpper}`);
    scriptProperties.deleteProperty(`API_PASSWORD_${systemTypeUpper}`);

    var successPrompt = `Les identifiants API pour ${systemTypeUpper} ont été supprimés de ScriptProperties.`;
    Logger.log(successPrompt);
  } catch (e) {
    var catchPrompt = `Une erreur est survenue lors de la suppression des identifiants pour ${systemTypeUpper}: ${e.message}`;
    Logger.log(catchPrompt + ` (Stack: ${e.stack || 'N/A'})`);
  }
}

/**
 * Deletes all known API credentials from ScriptProperties.
 */
function deleteAllStoredApiCredentials() {
  Logger.log("Tentative de suppression de TOUS les identifiants API stockés (DEV, TEST, PROD).");
  deleteStoredApiCredentialsForEnv("DEV");
  deleteStoredApiCredentialsForEnv("TEST");
  deleteStoredApiCredentialsForEnv("PROD");
  Logger.log("Suppression de tous les identifiants API terminée.");
}