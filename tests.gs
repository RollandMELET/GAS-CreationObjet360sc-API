// FILENAME: tests.gs
// Version: 2.5.1
// Date: 2025-06-10 22:30
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Version finale et propre. Test d'historique validé et code expérimental retiré.
/**
 * @fileoverview Contient toutes les fonctions de test pour valider les fonctionnalités
 * du projet, séparées du code de production pour une meilleure organisation.
 */

// =================================================================
// =========== TESTS DÉDIÉS ET SÉCURISÉS POUR LA PRODUCTION =========
// =================================================================

function maFonctionDeTestPourAuth_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "PROD";
  var resultatString = testAuthentication(testSystemType);
  var resultat = JSON.parse(resultatString);
  if (resultat.success) {
    Logger.log("✅ SUCCÈS: L'authentification à l'environnement de Production a réussi.");
  } else {
    Logger.log("❌ ÉCHEC: L'authentification à l'environnement de Production a échoué. Erreur: " + resultat.error);
    throw new Error("Échec du test d'authentification PROD.");
  }
}

function maFonctionDeTestPourCreerObjetUnique_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "PROD";
  var testNomDeObjetBase = "TEST-PROD-VALIDATION-CREATION-01";
  var testTypeMoule = "MouleEnveloppe";
  var testTypeObjet = "MOULE";
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, testTypeObjet, testTypeMoule);
  try {
    var resultat = JSON.parse(resultatString);
    if (resultat.success) {
      Logger.log(`✅ SUCCÈS: La création d'un objet de test en Production a réussi. mcUrl: ${resultat.mcUrl}`);
    } else {
      Logger.log(`❌ ÉCHEC: La création de l'objet de test en Production a échoué. Erreur: ${resultat.error}`);
      throw new Error("Échec de la création d'objet unique en PROD: " + resultat.error);
    }
  } catch(e) {
    Logger.log(`❌ ÉCHEC CRITIQUE: Impossible d'analyser la réponse JSON.`);
    throw e;
  }
}

function testEndToEnd_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("⚠️ ATTENTION : Création de 5 objets de test sur l'environnement de PRODUCTION.");
  const nomObjet = "OF-PROD-TEST-E2E-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "PROD", "OF");
  try {
    var resultatObj = JSON.parse(resultat);
    if (resultatObj.success) {
      Logger.log("✅ SUCCÈS: La création de la structure OF en Production a réussi.");
    } else {
      Logger.log(`❌ ÉCHEC: La création de la structure OF en Production a échoué. Erreur: ${resultatObj.error}`);
       throw new Error("Échec du test de création multiple en PROD: " + resultatObj.error);
    }
  } catch(e) {
    Logger.log(`❌ ÉCHEC CRITIQUE: Impossible d'analyser la réponse JSON.`);
    throw e;
  }
}

// =================================================================
// =============== SUITE DE TESTS POUR DEV & TEST ==================
// =================================================================

function testSuiteComplete() {
    Logger.log("======================================================");
    Logger.log("Lancement de la SUITE DE TESTS COMPLÈTE (DEV & TEST)");
    Logger.log("======================================================");
    const testsToRun = [
      { name: "Scénario 1: Création d'une structure OF complète (sur DEV)", func: maFonctionDeTestPourCreerMultiples_SUCCES },
      { name: "Scénario 2: Création d'une structure OF avec propriétés ELEC (sur DEV)", func: maFonctionDeTestPourCreerMultiplesAvecProprietes },
      { name: "Scénario 3: Création d'un Avatar unique (Moule) (sur DEV)", func: maFonctionDeTestPourCreerObjetUnique },
      { name: "Scénario 4: Récupération de l'historique d'un objet (sur TEST)", func: maFonctionDeTestPourRecupererHistorique },
      { name: "Scénario 5: Cycle de vie complet d'un utilisateur (Créer -> Activer -> Désactiver) (sur TEST)", func: maFonctionDeTestPourDesactiverUtilisateur },
      { name: "Scénario 6: Activation d'un utilisateur par profil (sur TEST)", func: maFonctionDeTestPourActiverUtilisateurParProfil }
    ];
    testsToRun.forEach((test, index) => {
        Logger.log(`\n--- DÉBUT TEST ${index + 1}/${testsToRun.length}: ${test.name} ---\n`);
        try { 
          test.func(); 
          Logger.log(`\n--- SUCCÈS TEST ${index + 1}: ${test.name} ---\n`);
        } catch (e) { 
          Logger.log(`\n--- ERREUR CRITIQUE TEST ${index + 1}: ${test.name} ---`);
          Logger.log("ERREUR: " + e.toString());
          Logger.log("STACK: " + (e.stack || 'N/A'));
        }
    });
    Logger.log("======================================================");
    Logger.log("SUITE DE TESTS COMPLÈTE TERMINÉE");
    Logger.log("======================================================");
}


/**
 * Teste la récupération de l'historique d'un objet sur le serveur V1.
 * Crée un objet, récupère son ID, puis appelle la fonction d'historique.
 */
function maFonctionDeTestPourRecupererHistorique() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const testSystemType = "TEST"; 

  const nomObjetTest = "TestHistoV1-" + new Date().getTime();
  const creationResultString = creerObjetUnique360sc(nomObjetTest, testSystemType, "MOULE", "Autre");
  const creationResult = JSON.parse(creationResultString);

  if (!creationResult.success || !creationResult.avatarApiIdPath) {
    throw new Error("Étape 1 (Création objet) a échoué. Erreur: " + creationResult.error);
  }

  const avatarId = creationResult.avatarApiIdPath.split('/').pop();
  Logger.log(`Objet de test créé avec l'ID: ${avatarId}.`);

  // On appelle la fonction de haut niveau pour un test d'intégration complet
  const historiqueResultString = getHistoriqueObjet360sc(testSystemType, avatarId);
  const historiqueResult = JSON.parse(historiqueResultString);

  if (!historiqueResult.success) {
    throw new Error("Étape 2 (Récupération historique) a échoué. Erreur: " + historiqueResult.error);
  }
  
  if (!Array.isArray(historiqueResult.data) || historiqueResult.data.length === 0) {
    throw new Error("Étape 2 (Validation) a échoué: L'historique retourné n'est pas un tableau ou est vide.");
  }

  Logger.log("✅ SUCCÈS: La fonction getHistoriqueObjet360sc a retourné un résultat valide.");
  Logger.log(`Nombre d'entrées trouvées: ${historiqueResult.data.length}.`);
}

function maFonctionDeTestPourCreerMultiples_SUCCES() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetMultiSucces";
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, "OF");
  const resultat = JSON.parse(resultatString);
  if (!resultat.success) {
      throw new Error("Le test maFonctionDeTestPourCreerMultiples_SUCCES a échoué: " + resultat.error);
  }
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiplesAvecProprietes() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const testSystemType = "DEV";
  const testNomDeObjetBase = "MonOF-AvecPropsElec-" + new Date().getTime();
  const proprietesPourElec = { "tipi": "VALEUR_TIPI_TEST_ELEC", "tfo": "VALEUR_TFO_TEST_ELEC", "ladac": "VALEUR_LADAC_TEST_ELEC", "tab": "VALEUR_TAB_TEST_ELEC_67890" };
  
  Logger.log(`Test de création multiple pour '${testNomDeObjetBase}' avec les propriétés ELEC : ${JSON.stringify(proprietesPourElec)}`);
  
  const resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, "OF", JSON.stringify(proprietesPourElec));
  const resultat = JSON.parse(resultatString);
  
  if (resultat.success) {
    Logger.log("✅ SUCCÈS: La création multiple avec propriétés a réussi.");
    Logger.log("Résultat complet: " + resultatString);
  } else {
    Logger.log(`❌ ÉCHEC: La création multiple avec propriétés a échoué. Erreur: ${resultat.error}`);
    throw new Error("Le test de création multiple avec propriétés a échoué: " + resultat.error);
  }
}

function maFonctionDeTestPourCreerObjetUnique() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV";
  var testTypeMoule = "MouleEnveloppe"; 
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, "MOULE", testTypeMoule);
  const resultat = JSON.parse(resultatString);
  if (!resultat.success) {
      throw new Error("Le test maFonctionDeTestPourCreerObjetUnique a échoué: " + resultat.error);
  }
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourDesactiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestToDeactivate" + timestamp;
  var testEmail = "testtodeactivate" + timestamp + "@example.com";
  
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToDeactivate", "User", []));
  if (!creationResultObject.success) {
    throw new Error("Étape 1 (Création) échouée: " + creationResultObject.error);
  }
  
  var userObjectToTest = creationResultObject.user;
  var activationResultObject = JSON.parse(activerUtilisateur360sc(testSystemType, userObjectToTest, ["ROLE_USER"]));
  if (!activationResultObject.success) {
    throw new Error("Étape 2 (Activation) échouée: " + activationResultObject.error);
  }
  
  var activatedUserObject = activationResultObject.user;
  var deactivationResultString = desactiverUtilisateur360sc(testSystemType, activatedUserObject);
  var deactivationResultObject = JSON.parse(deactivationResultString);
  if (!deactivationResultObject.success) {
    throw new Error("Étape 3 (Désactivation) échouée: " + deactivationResultObject.error);
  }

  Logger.log("✅ SUCCÈS: Cycle de vie complet de l'utilisateur réussi.");
  Logger.log("Vérification: 'enabled' est bien 'false' ? -> " + deactivationResultObject.user.enabled);
}

function maFonctionDeTestPourActiverUtilisateurParProfil() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  
  Logger.log("\n--- SCÉNARIO 1: Test avec un profil valide ('Operateur') ---");
  var timestamp1 = new Date().getTime();
  var user1 = { username: "TestProfilOp" + timestamp1, email: "testprofilop" + timestamp1 + "@example.com", firstName: "Profil", lastName: "Opérateur" };
  
  var creationResult1 = JSON.parse(creerUtilisateur360sc(testSystemType, user1.username, user1.email, user1.firstName, user1.lastName, []));
  if (!creationResult1.success) { 
      Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé.`); 
      throw new Error("Création utilisateur pour test de profil a échoué: " + creationResult1.error); 
  }

  var createdUser1 = creationResult1.user;
  var resultatWrapper1 = activerUtilisateurParProfil360sc(testSystemType, createdUser1.id, createdUser1.username, createdUser1.email, createdUser1.firstName, createdUser1.lastName, "Operateur");
  if (resultatWrapper1 !== "SUCCES") {
    throw new Error("Activation par profil 'Operateur' a échoué: " + resultatWrapper1);
  }
  Logger.log(`Résultat du wrapper pour 'Operateur': ${resultatWrapper1}`);
  
  Logger.log("\n--- SCÉNARIO 2: Test avec un profil non activable ('Client') ---");
  var resultatWrapper2 = activerUtilisateurParProfil360sc(testSystemType, "12345", "dummy", "dummy@d.com", "dummy", "dummy", "Client");
  if (!resultatWrapper2.startsWith("ERREUR")) {
    throw new Error("Le test pour profil non activable aurait dû échouer, mais a retourné : " + resultatWrapper2);
  }
  Logger.log(`Résultat du wrapper pour 'Client' (devrait être une erreur): ${resultatWrapper2}`);

  Logger.log("\n--- SCÉNARIO 3: Test avec un profil inexistant ---");
  var resultatWrapper3 = activerUtilisateurParProfil360sc(testSystemType, "12345", "dummy", "dummy@d.com", "dummy", "dummy", "ProfilQuiNexistePas");
  if (!resultatWrapper3.startsWith("ERREUR")) {
    throw new Error("Le test pour profil inexistant aurait dû échouer, mais a retourné : " + resultatWrapper3);
  }
  Logger.log(`Résultat du wrapper pour profil inexistant (devrait être une erreur): ${resultatWrapper3}`);
}


// =================================================================
// ===== FONCTIONS DE TEST INDIVIDUELLES (non incluses dans la suite) ======
// =================================================================

function maFonctionDeTestPourAuth() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var resultatString = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
}

function maFonctionDeTestPourCreerUtilisateurEtRecupererId() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUserIdNum" + timestamp; 
  var testEmail = "testuseridnum" + timestamp + "@example.com";
  var resultatId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, "TestIdNum", "UtilisateurIdNum" + timestamp, []);
  Logger.log(`Résultat du test (devrait être un ID numérique ou ERREUR): ${resultatId}`);
}


// =================================================================
// ===== FONCTIONS DE TEST BAS NIVEAU (appelées par d'autres tests) ======
// =================================================================

function testAuthentication(typeSysteme) {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme) throw new Error("'typeSysteme' est requis.");
    const token = getAuthToken_(typeSysteme.toUpperCase());
    finalOutput.success = true;
    finalOutput.message = `Authentification réussie pour ${typeSysteme.toUpperCase()}.`;
  } catch (e) {
    finalOutput.error = e.message;
  }
  return JSON.stringify(finalOutput);
}

function testCreateSingleObject(typeSysteme, nomObjetTestBase, alphaIdTest, metadataAvatarTypeIdTest) {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  let finalOutput = { success: false, message: "" };
  try {
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    const objectNameForApiTest = `${alphaIdTest}:${nomObjetTestBase}`;
    const avatarObject = createAvatar_(token, systemTypeUpper, objectNameForApiTest, alphaIdTest, metadataAvatarTypeIdTest);
    const mcUrl = avatarObject.mcUrl || getMcUrlForAvatar_(token, systemTypeUpper, avatarObject['@id']);
    finalOutput.success = true;
    finalOutput.message = `Objet unique (${systemTypeUpper}) créé.`;
    finalOutput.avatarApiIdPath = avatarObject['@id'];
    finalOutput.mcUrl = mcUrl;
  } catch (e) {
    finalOutput.error = e.message;
  }
  return JSON.stringify(finalOutput);
}