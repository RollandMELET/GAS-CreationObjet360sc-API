// FILENAME: tests.gs
// Version: 1.3.0
// Date: 2025-06-07 15:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout du test pour le nouveau wrapper d'activation par profil.
/**
 * @fileoverview Contient toutes les fonctions de test pour valider les fonctionnalités
 * du projet, séparées du code de production pour une meilleure organisation.
 */

function maFonctionDeTestPourAuth() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var resultatString = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerObjet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomObjetBase = "TestUniqueObj";
  var testAlphaId = "v0:OF_PRINCIPAL";
  var config = getConfiguration_(testSystemType);
  var testMetadataTypeId = config.METADATA_AVATAR_TYPES.OF;
  var resultatString = testCreateSingleObject(testSystemType, testNomObjetBase, testAlphaId, testMetadataTypeId);
  Logger.log("Résultat de testCreateSingleObject (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_SUCCES() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetMultiSucces";
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, "OF");
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
}

function maFonctionDeTestPourCreerObjetUnique() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV";
  var testTypeMoule = "MouleEnveloppe"; 
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, "MOULE", testTypeMoule);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMoulePourAppSheet";
  var testSystemType = "DEV"; 
  var testTypeMoule = "MouleEnveloppe"; 
  var resultat = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMoule);
  Logger.log(`Résultat test AppSheet: ${resultat}`);
}

function maFonctionDeTestPourCreerUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUser" + timestamp;
  var testEmail = "testuser" + timestamp + "@example.com";
  var resultatString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, "Test", "Utilisateur" + timestamp, ["testTag1"]);
  Logger.log("Résultat creerUtilisateur360sc (JSON): " + resultatString);
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

function maFonctionDeTestPourActiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestToActivate" + timestamp;
  var testEmail = "testtoactivate" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToActivate", "User" + timestamp, []));
  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé.`);
    return;
  }
  var userObjectToActivate = creationResultObject.user; 
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST", "ROLE_DUHALDE-TEST"];
  var activationResultString = activerUtilisateur360sc(testSystemType, userObjectToActivate, rolesToAssign);
  Logger.log("Résultat activation (JSON): " + activationResultString);
}

function maFonctionDeTestPourDesactiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestToDeactivate" + timestamp;
  var testEmail = "testtodeactivate" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToDeactivate", "User", []));
  if (!creationResultObject.success) { return; }
  var userObjectToTest = creationResultObject.user;
  var activationResultObject = JSON.parse(activerUtilisateur360sc(testSystemType, userObjectToTest, ["ROLE_USER"]));
  if (!activationResultObject.success) { return; }
  var activatedUserObject = activationResultObject.user;
  var deactivationResultString = desactiverUtilisateur360sc(testSystemType, activatedUserObject);
  var deactivationResultObject = JSON.parse(deactivationResultString);
  if (deactivationResultObject.success) {
    Logger.log("Vérification: 'enabled' est bien 'false' ? -> " + deactivationResultObject.user.enabled);
  }
}

function maFonctionDeTestPourActiverUtilisateurForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestAppSheet" + timestamp;
  var testEmail = "testappsheet" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "AppSheet", "User" + timestamp, []));
  if (!creationResultObject.success) { return; }
  var createdUser = creationResultObject.user;
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST"];
  var resultatWrapper = activerUtilisateur360scForAppSheet(testSystemType, createdUser.id, createdUser.username, createdUser.email, createdUser.firstName, createdUser.lastName, rolesToAssign);
  Logger.log(`Résultat du wrapper AppSheet: ${resultatWrapper}`);
}

function maFonctionDeTestPourDesactiverUtilisateurForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestDeactAppS" + timestamp;
  var testEmail = "testdeactapps" + timestamp + "@example.com";
  var creationResultObject = JSON.parse(creerUtilisateur360sc(testSystemType, testUsername, testEmail, "DeactAppSheet", "User", []));
  if (!creationResultObject.success) { return; }
  var createdUser = creationResultObject.user;
  var activationResultObject = JSON.parse(activerUtilisateur360sc(testSystemType, createdUser, ["ROLE_USER"]));
  if (!activationResultObject.success) { return; }
  var activatedUser = activationResultObject.user;
  var resultatWrapper = desactiverUtilisateur360scForAppSheet(testSystemType, activatedUser.id, activatedUser.username, activatedUser.email, activatedUser.firstName, activatedUser.lastName);
  Logger.log(`Résultat du wrapper de désactivation AppSheet: ${resultatWrapper}`);
}

function maFonctionDeTestPourActiverUtilisateurParProfil() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp1 = new Date().getTime();
  var user1 = { username: "TestProfilOp" + timestamp1, email: "testprofilop" + timestamp1 + "@example.com", firstName: "Profil", lastName: "Opérateur" };
  Logger.log("\n--- SCÉNARIO 1: Test avec un profil valide ('Operateur') ---");
  var creationResult1 = JSON.parse(creerUtilisateur360sc(testSystemType, user1.username, user1.email, user1.firstName, user1.lastName, []));
  if (!creationResult1.success) { Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé.`); return; }
  var createdUser1 = creationResult1.user;
  var resultatWrapper1 = activerUtilisateurParProfil360sc(testSystemType, createdUser1.id, createdUser1.username, createdUser1.email, createdUser1.firstName, createdUser1.lastName, "Operateur");
  Logger.log(`Résultat du wrapper pour 'Operateur': ${resultatWrapper1}`);
  Logger.log("\n--- SCÉNARIO 2: Test avec un profil non activable ('Client') ---");
  var resultatWrapper2 = activerUtilisateurParProfil360sc(testSystemType, "12345", "dummy", "dummy@d.com", "dummy", "dummy", "Client");
  Logger.log(`Résultat du wrapper pour 'Client' (devrait être une erreur): ${resultatWrapper2}`);
  Logger.log("\n--- SCÉNARIO 3: Test avec un profil inexistant ---");
  var resultatWrapper3 = activerUtilisateurParProfil360sc(testSystemType, "12345", "dummy", "dummy@d.com", "dummy", "dummy", "ProfilQuiNexistePas");
  Logger.log(`Résultat du wrapper pour profil inexistant (devrait être une erreur): ${resultatWrapper3}`);
}

function testAllEnvironments() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("====== DÉBUT DE LA SUITE DE TESTS COMPLÈTE ======");
  try { testEndToEnd_DEV(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST DEV: " + e.toString()); }
  try { testEndToEnd_TEST(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST TEST: " + e.toString()); }
  try { testEndToEnd_PROD(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST PROD: " + e.toString()); }
  Logger.log("====== FIN DE LA SUITE DE TESTS COMPLÈTE ======");
}

function testEndToEnd_DEV() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const nomObjet = "TestE2EDevOF-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "DEV", "OF");
  Logger.log("Résultat DEV: " + resultat);
}

function testEndToEnd_TEST() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const nomObjet = "TestE2ETestOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "TEST", "OF");
  Logger.log("Résultat TEST: " + resultat);
}

function testEndToEnd_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const canRunProdTest = false; 
  if (!canRunProdTest) {
    Logger.log("AVERTISSEMENT: Le test PROD est désactivé par sécurité.");
    return;
  }
  const nomObjet = "TestE2EProdOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "PROD", "OF");
  Logger.log("Résultat PROD: " + resultat);
}

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
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApiTest, alphaIdTest, metadataAvatarTypeIdTest);
    const mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
    finalOutput.success = true;
    finalOutput.message = `Objet unique (${systemTypeUpper}) créé.`;
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.mcUrl = mcUrl;
  } catch (e) {
    finalOutput.error = e.message;
  }
  return JSON.stringify(finalOutput);
}

function testSuiteComplete() {
    Logger.log("======================================================");
    Logger.log("Lancement de la SUITE DE TESTS COMPLÈTE");
    Logger.log("======================================================");
    const testsToRun = [
      { name: "Scénario 1: Création d'une structure OF complète (sur DEV)", func: maFonctionDeTestPourCreerMultiples_SUCCES },
      { name: "Scénario 2: Création d'un Avatar unique (Moule) (sur DEV)", func: maFonctionDeTestPourCreerObjetUnique },
      { name: "Scénario 3: Cycle de vie complet d'un utilisateur (Créer -> Activer -> Désactiver) (sur TEST)", func: maFonctionDeTestPourDesactiverUtilisateur },
      { name: "Scénario 4: Activation d'un utilisateur par profil (sur TEST)", func: maFonctionDeTestPourActiverUtilisateurParProfil }
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