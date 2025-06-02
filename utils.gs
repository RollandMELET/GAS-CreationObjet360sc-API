// Version: 1.1.0
// Last Modified: 2025-06-02
/**
 * @fileoverview Utility functions for the script, including credential management.
 */

/**
 * Stores API credentials in ScriptProperties.
 * TO BE EXECUTED MANUALLY ONCE by an administrator from the Apps Script editor.
 * Replace placeholders with actual credentials before running.
 */
function storeApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();

    // IMPORTANT: Replace with your actual 360sc API credentials
    const apiUsername = "VOTRE_VRAI_USERNAME_360SC_API";
    const apiPassword = "VOTRE_VRAI_MOT_DE_PASSE_360SC_API";

    if (apiUsername === "VOTRE_VRAI_USERNAME_360SC_API" || apiPassword === "VOTRE_VRAI_MOT_DE_PASSE_360SC_API") {
      Logger.log("ERREUR: Veuillez remplacer les placeholders par vos identifiants réels dans la fonction storeApiCredentials avant de l'exécuter.");
      Browser.msgBox("Erreur de configuration", "Veuillez éditer la fonction storeApiCredentials et remplacer les placeholders par vos identifiants API réels avant de l'exécuter.", Browser. europäischen ButtonSet.OK);
      return;
    }

    scriptProperties.setProperties({
      'API_USERNAME': apiUsername,
      'API_PASSWORD': apiPassword
    });

    Logger.log('Identifiants API (API_USERNAME, API_PASSWORD) stockés avec succès dans ScriptProperties.');
    Browser.msgBox('Succès', 'Les identifiants API ont été stockés dans ScriptProperties.', Browser. europäischen ButtonSet.OK);

  } catch (e) {
    Logger.log(`Erreur lors du stockage des identifiants API : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    Browser.msgBox('Erreur', `Une erreur est survenue lors du stockage des identifiants : ${e.message}`, Browser. europäischen ButtonSet.OK);
  }
}

/**
 * Retrieves and logs stored API credentials (username only, password presence).
 * Useful for verification.
 * TO BE EXECUTED MANUALLY from the Apps Script editor.
 */
function checkStoredApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const username = scriptProperties.getProperty('API_USERNAME');
    const passwordIsSet = !!scriptProperties.getProperty('API_PASSWORD'); // Check presence, not value

    Logger.log('Vérification des identifiants stockés :');
    Logger.log('API_USERNAME: ' + (username || 'NON DÉFINI'));
    Logger.log('API_PASSWORD est défini: ' + passwordIsSet);

    Browser.msgBox('Identifiants Stockés',
                   'API_USERNAME: ' + (username || 'NON DÉFINI') +
                   '\nAPI_PASSWORD est défini: ' + passwordIsSet,
                   Browser. europäischen ButtonSet.OK);
  } catch (e) {
    Logger.log(`Erreur lors de la vérification des identifiants : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    Browser.msgBox('Erreur', `Une erreur est survenue lors de la vérification des identifiants : ${e.message}`, Browser. europäischen ButtonSet.OK);
  }
}

/**
 * Deletes stored API credentials from ScriptProperties.
 * Use with caution.
 * TO BE EXECUTED MANUALLY from the Apps Script editor if credentials need to be cleared.
 */
function deleteStoredApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.deleteProperty('API_USERNAME');
    scriptProperties.deleteProperty('API_PASSWORD');
    Logger.log('Identifiants API (API_USERNAME, API_PASSWORD) supprimés de ScriptProperties.');
    Browser.msgBox('Succès', 'Les identifiants API ont été supprimés de ScriptProperties.', Browser. europäischen ButtonSet.OK);
  } catch (e) {
    Logger.log(`Erreur lors de la suppression des identifiants : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    Browser.msgBox('Erreur', `Une erreur est survenue lors de la suppression des identifiants : ${e.message}`, Browser. europäischen ButtonSet.OK);
  }
}