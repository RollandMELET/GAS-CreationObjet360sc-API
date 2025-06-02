// Version: 1.1.3
// Last Modified: 2025-06-02 (Simplification des appels Browser.msgBox, retrait de ButtonSet)
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
    const apiUsername = "360sc_Duhalde"; // REMPLACE CECI LORS DE L'EXECUTION INITIALE
    const apiPassword = "360sc_Duhalde"; // REMPLACE CECI LORS DE L'EXECUTION INITIALE

    if (apiUsername === "PLACEHOLDER_USERNAME_APRES_STOCKAGE" || apiPassword === "PLACEHOLDER_PASSWORD_APRES_STOCKAGE" || apiUsername.trim() === "" || apiPassword.trim() === "") {
      Logger.log("ERREUR: Veuillez remplacer les placeholders par vos identifiants API réels et valides dans la fonction storeApiCredentials avant de l'exécuter.");
      if (typeof Browser !== 'undefined' && Browser.msgBox) {
        Browser.msgBox("Erreur de configuration", "Veuillez éditer la fonction storeApiCredentials et remplacer les placeholders par vos identifiants API réels et valides avant de l'exécuter."); // SIMPLIFIÉ
      }
      return;
    }

    scriptProperties.setProperties({
      'API_USERNAME': apiUsername,
      'API_PASSWORD': apiPassword
    });

    Logger.log('Identifiants API (API_USERNAME, API_PASSWORD) stockés avec succès dans ScriptProperties.');
    if (typeof Browser !== 'undefined' && Browser.msgBox) {
      Browser.msgBox('Succès', 'Les identifiants API ont été stockés dans ScriptProperties.'); // SIMPLIFIÉ
    }

  } catch (e) {
    Logger.log(`Erreur lors du stockage des identifiants API : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    if (typeof Browser !== 'undefined' && Browser.msgBox) {
      Browser.msgBox('Erreur', `Une erreur est survenue lors du stockage des identifiants : ${e.message}`); // SIMPLIFIÉ
    }
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
    const passwordIsSet = !!scriptProperties.getProperty('API_PASSWORD');

    Logger.log('Vérification des identifiants stockés :');
    Logger.log('API_USERNAME: ' + (username || 'NON DÉFINI'));
    Logger.log('API_PASSWORD est défini: ' + passwordIsSet);

    if (typeof Browser !== 'undefined' && Browser.msgBox) {
      Browser.msgBox('Identifiants Stockés',
                     'API_USERNAME: ' + (username || 'NON DÉFINI') +
                     '\nAPI_PASSWORD est défini: ' + passwordIsSet); // SIMPLIFIÉ
    }
  } catch (e) {
    Logger.log(`Erreur lors de la vérification des identifiants : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    if (typeof Browser !== 'undefined' && Browser.msgBox) {
      Browser.msgBox('Erreur', `Une erreur est survenue lors de la vérification des identifiants : ${e.message}`); // SIMPLIFIÉ
    }
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
    if (typeof Browser !== 'undefined' && Browser.msgBox) {
      Browser.msgBox('Succès', 'Les identifiants API ont été supprimés de ScriptProperties.'); // SIMPLIFIÉ
    }
  } catch (e) {
    Logger.log(`Erreur lors de la suppression des identifiants : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    if (typeof Browser !== 'undefined' && Browser.msgBox) {
      Browser.msgBox('Erreur', `Une erreur est survenue lors de la suppression des identifiants : ${e.message}`); // SIMPLIFIÉ
    }
  }
}