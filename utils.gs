// Version: 1.1.5
// Last Modified: 2025-06-02 (Commenté tous les appels Browser.msgBox pour éviter les erreurs)
/**
 * @fileoverview Utility functions for the script, including credential management.
 */

/**
 * Teste les appels les plus simples à Browser.msgBox pour isoler les problèmes.
 * NOTE: CETTE FONCTION EST LAISSÉE POUR INVESTIGATION FUTURE SI BESOIN.
 */
function testSimpleBrowserMsgBox() {
  try {
    Logger.log("Début testSimpleBrowserMsgBox");

    // Test 1: Signature msgBox(prompt)
    var prompt1 = "Ceci est un message de test simple.";
    Logger.log("Appel Browser.msgBox(prompt1)");
    // Browser.msgBox(prompt1); // Commenté
    Logger.log("Browser.msgBox(prompt1) aurait été appelé.");

    // Test 2: Signature msgBox(title, prompt)
    var title2 = "Titre de Test";
    var prompt2 = "Ceci est un message de test avec un titre.";
    Logger.log("Appel Browser.msgBox(title2, prompt2)");
    // Browser.msgBox(title2, prompt2); // Commenté
    Logger.log("Browser.msgBox(title2, prompt2) aurait été appelé.");

    // Test 3: Signature msgBox(title, prompt, buttons)
    var title3 = "Titre de Test 3";
    var prompt3 = "Ceci est un test avec un bouton OK/CANCEL.";
    Logger.log("Appel Browser.msgBox(title3, prompt3, Browser.ButtonSet.OK_CANCEL)");
    // var response3 = Browser.msgBox(title3, prompt3, Browser.ButtonSet.OK_CANCEL); // Commenté
    // Logger.log("Browser.msgBox(title3, prompt3, ...) aurait été appelé. Réponse: " + response3);

    Logger.log("testSimpleBrowserMsgBox terminé (appels msgBox commentés).");
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //     Browser.msgBox("Test msgBox", "Tous les tests Browser.msgBox simples ont été tentés (commentés). Vérifiez les logs.", Browser.ButtonSet.OK);
    // }

  } catch (e) {
    Logger.log(`Erreur dans testSimpleBrowserMsgBox : ${e.message} (Stack: ${e.stack || 'N/A'})`);
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //     Browser.msgBox("Erreur Test msgBox", `Erreur: ${e.message}. Vérifiez les logs.`, Browser.ButtonSet.OK);
    // }
  }
}


/**
 * Stores API credentials in ScriptProperties.
 */
function storeApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const apiUsername = "360sc_Duhalde"; // REMPLACE CECI LORS DE L'EXECUTION INITIALE
    const apiPassword = "360sc_Duhalde"; // REMPLACE CECI LORS DE L'EXECUTION INITIALE

    if (apiUsername === "PLACEHOLDER_USERNAME_APRES_STOCKAGE" || apiPassword === "PLACEHOLDER_PASSWORD_APRES_STOCKAGE" || apiUsername.trim() === "" || apiPassword.trim() === "") {
      var errorPrompt = "Veuillez éditer la fonction storeApiCredentials et remplacer les placeholders par vos identifiants API réels et valides avant de l'exécuter.";
      Logger.log("ERREUR: " + errorPrompt);
      // if (typeof Browser !== 'undefined' && Browser.msgBox) {
      //   Browser.msgBox("Erreur de configuration", errorPrompt, Browser.ButtonSet.OK);
      // }
      return;
    }

    scriptProperties.setProperties({
      'API_USERNAME': apiUsername,
      'API_PASSWORD': apiPassword
    });

    var successPrompt = 'Les identifiants API ont été stockés dans ScriptProperties.';
    Logger.log(successPrompt);
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //   Browser.msgBox('Succès', successPrompt, Browser.ButtonSet.OK);
    // }

  } catch (e) {
    var catchPrompt = `Une erreur est survenue lors du stockage des identifiants : ${e.message}`;
    Logger.log(catchPrompt + ` (Stack: ${e.stack || 'N/A'})`);
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //   Browser.msgBox('Erreur', catchPrompt, Browser.ButtonSet.OK);
    // }
  }
}

/**
 * Retrieves and logs stored API credentials.
 */
function checkStoredApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    const username = scriptProperties.getProperty('API_USERNAME');
    const passwordIsSet = !!scriptProperties.getProperty('API_PASSWORD');

    Logger.log('Vérification des identifiants stockés :');
    Logger.log('API_USERNAME: ' + (username || 'NON DÉFINI'));
    Logger.log('API_PASSWORD est défini: ' + passwordIsSet);

    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //   var msgTitle = 'Identifiants Stockés';
    //   var msgPrompt = 'API_USERNAME: ' + (username || 'NON DÉFINI') + '\n' + 'API_PASSWORD est défini: ' + passwordIsSet.toString();
    //   Browser.msgBox(msgTitle, msgPrompt, Browser.ButtonSet.OK);
    // }
  } catch (e) {
    var catchPrompt = `Une erreur est survenue lors de la vérification des identifiants : ${e.message}`;
    Logger.log(catchPrompt + ` (Stack: ${e.stack || 'N/A'})`);
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //   Browser.msgBox('Erreur', catchPrompt, Browser.ButtonSet.OK);
    // }
  }
}

/**
 * Deletes stored API credentials from ScriptProperties.
 */
function deleteStoredApiCredentials() {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.deleteProperty('API_USERNAME');
    scriptProperties.deleteProperty('API_PASSWORD');

    var successPrompt = 'Les identifiants API ont été supprimés de ScriptProperties.';
    Logger.log(successPrompt);
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //   Browser.msgBox('Succès', successPrompt, Browser.ButtonSet.OK);
    // }
  } catch (e) {
    var catchPrompt = `Une erreur est survenue lors de la suppression des identifiants : ${e.message}`;
    Logger.log(catchPrompt + ` (Stack: ${e.stack || 'N/A'})`);
    // if (typeof Browser !== 'undefined' && Browser.msgBox) {
    //   Browser.msgBox('Erreur', catchPrompt, Browser.ButtonSet.OK);
    // }
  }
}