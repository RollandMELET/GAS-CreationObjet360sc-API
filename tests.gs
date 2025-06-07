// FILENAME: tests.gs
// Version: 1.1.0
// Date: 2025-06-07 14:15
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de la fonction testSuiteComplete pour exécuter les scénarios de test clés.
/**
 * @fileoverview Contient toutes les fonctions de test pour valider les fonctionnalités
 * du projet, séparées du code de production pour une meilleure organisation.
 */

function maFonctionDeTestPourAuth() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  Logger.log("Appel de testAuthentication avec typeSysteme: " + testSystemType);
  var resultatString = testAuthentication(testSystemType);
  Logger.log("Résultat de testAuthentication (chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de testAuthentication (objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour testAuthentication: " + e.message); }
}

function maFonctionDeTestPourCreerObjet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomObjetBase = "TestUniqueObj";
  var testAlphaId = "v0:OF_PRINCIPAL";
  var config = getConfiguration_(testSystemType);
  var testMetadataTypeId = config.METADATA_AVATAR_TYPES.OF;

  Logger.log(`Appel de testCreateSingleObject avec: typeSys=${testSystemType}, nomBase=${testNomObjetBase}, alphaId=${testAlphaId}, metaTypeId=${testMetadataTypeId}`);
  var resultatString = testCreateSingleObject(testSystemType, testNomObjetBase, testAlphaId, testMetadataTypeId);
  Logger.log("Résultat de testCreateSingleObject (chaîne JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat de testCreateSingleObject (objet parsé): " + JSON.stringify(resultatObjet));
  } catch (e) { Logger.log("Erreur parsing JSON pour testCreateSingleObject: " + e.message); }
}

function maFonctionDeTestPourCreerMultiples_SUCCES() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "DEV";
  var testNomDeObjetBase = "MonProjetMultiSucces";
  var testTypeObjet = "OF"; 
  Logger.log(`Appel de creerMultiplesObjets360sc (test SUCCES) avec: typeSys=${testSystemType}, nomBase=${testNomDeObjetBase}, typeObj=${testTypeObjet}`);
  var resultatString = creerMultiplesObjets360sc(testNomDeObjetBase, testSystemType, testTypeObjet);
  Logger.log("Résultat de creerMultiplesObjets360sc (SUCCES - chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerMultiples_ERREUR() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("Test d'erreur : Appel de creerMultiplesObjets360sc avec le type invalide 'MOULE'");
  var resultatErr = creerMultiplesObjets360sc("TestMultiErreurType", "DEV", "MOULE");
  Logger.log("Résultat attendu (erreur de type) : " + resultatErr);
}

function maFonctionDeTestPourCreerObjetUnique() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMouleFlexible";
  var testSystemType = "DEV";
  var testTypeMoule = "MouleEnveloppe"; 
  
  Logger.log(`Appel de creerObjetUnique360sc (test) avec: nomBase=${testNomDeObjetBase}, typeSys=${testSystemType}, typeMoule=${testTypeMoule}`);
  var resultatString = creerObjetUnique360sc(testNomDeObjetBase, testSystemType, "MOULE", testTypeMoule);
  Logger.log("Résultat de creerObjetUnique360sc (chaîne JSON): " + resultatString);
}

function maFonctionDeTestPourCreerObjetUniqueForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testNomDeObjetBase = "MonMoulePourAppSheet";
  var testSystemType = "DEV"; 
  var testTypeMoule = "MouleEnveloppe"; 
  Logger.log(`Test creerObjetUnique360scForAppSheet: nom=${testNomDeObjetBase}, sys=${testSystemType}, typeMoule=${testTypeMoule}`);
  var resultat = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMoule);
  Logger.log(`Résultat test AppSheet: ${resultat}`);

  var testTypeMouleInexistant = "TypeMouleQuiNexistePas";
  Logger.log(`Test erreur creerObjetUnique360scForAppSheet: nom=${testNomDeObjetBase}, sys=${testSystemType}, typeMoule=${testTypeMouleInexistant}`);
  var resultatErreur = creerObjetUnique360scForAppSheet(testNomDeObjetBase, testSystemType, testTypeMouleInexistant);
  Logger.log(`Résultat test erreur AppSheet: ${resultatErreur}`);
}

function maFonctionDeTestPourCreerUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUser" + timestamp;
  var testEmail = "testuser" + timestamp + "@example.com";
  var testFirstName = "Test";
  var testLastName = "Utilisateur" + timestamp;
  var testTags = ["testTag1", "apiCreated"];

  Logger.log(`Appel creerUtilisateur360sc (test) avec: sys=${testSystemType}, user=${testUsername}, email=${testEmail}`);
  var resultatString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, testTags);
  Logger.log("Résultat creerUtilisateur360sc (JSON): " + resultatString);
  try {
    var resultatObjet = JSON.parse(resultatString);
    Logger.log("Résultat creerUtilisateur360sc (objet): " + JSON.stringify(resultatObjet, null, 2));
    if (resultatObjet.success) { Logger.log("ID utilisateur créé (@id): " + (resultatObjet.user ? resultatObjet.user['@id'] : "Non trouvé") + ", ID numérique: " + (resultatObjet.user ? resultatObjet.user.id : "Non trouvé")); }
  } catch (e) { Logger.log("Erreur parsing JSON creerUtilisateur360sc: " + e.message); }

  Logger.log(`Appel creerUtilisateur360sc (test erreur - email manquant) avec: sys=${testSystemType}, user=${testUsername}_err`);
  var resultatErreurString = creerUtilisateur360sc(testSystemType, testUsername + "_err", null, testFirstName, testLastName, testTags);
  Logger.log("Résultat creerUtilisateur360sc (erreur JSON): " + resultatErreurString);
  try {
    var resultatErreurObjet = JSON.parse(resultatErreurString);
    Logger.log("Résultat creerUtilisateur360sc (erreur objet): " + JSON.stringify(resultatErreurObjet, null, 2));
  } catch (e) { Logger.log("Erreur parsing JSON creerUtilisateur360sc (erreur): " + e.message); }
}

function maFonctionDeTestPourCreerUtilisateurEtRecupererId() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  var timestamp = new Date().getTime();
  var testUsername = "TestUserIdNum" + timestamp; 
  var testEmail = "testuseridnum" + timestamp + "@example.com";
  var testFirstName = "TestIdNum";
  var testLastName = "UtilisateurIdNum" + timestamp;
  var testTags = ["wrapperTestIdNum"];

  Logger.log(`Test de creerUtilisateurEtRecupererId360sc (pour ID numérique): sys=${testSystemType}, user=${testUsername}, email=${testEmail}`);
  var resultatId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, testTags);
  Logger.log(`Résultat du test pour creerUtilisateurEtRecupererId360sc (devrait être un ID numérique ou ERREUR): ${resultatId}`);

  Logger.log(`Test d'erreur pour creerUtilisateurEtRecupererId360sc (email manquant): user=${testUsername}_errIdNum`);
  var resultatErreurId = creerUtilisateurEtRecupererId360sc(testSystemType, testUsername + "_errIdNum", null, testFirstName, testLastName, testTags);
  Logger.log(`Résultat du test d'erreur pour creerUtilisateurEtRecupererId360sc (devrait être ERREUR): ${resultatErreurId}`);
}

function maFonctionDeTestPourActiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  
  var timestamp = new Date().getTime();
  var testUsername = "TestToActivate" + timestamp;
  var testEmail = "testtoactivate" + timestamp + "@example.com";
  var testFirstName = "ToActivate";
  var testLastName = "User" + timestamp;
  
  Logger.log("--- PARTIE 1: Création d'un utilisateur de test ---");
  var creationResultString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, []);
  var creationResultObject = JSON.parse(creationResultString);

  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultObject.error}`);
    return;
  }
  
  var userObjectToActivate = creationResultObject.user; 
  Logger.log(`Utilisateur créé. ID: ${userObjectToActivate.id}`);

  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ID ${userObjectToActivate.id} ---`);
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST", "ROLE_DUHALDE-TEST"];
  
  var activationResultString = activerUtilisateur360sc(testSystemType, userObjectToActivate, rolesToAssign);
  Logger.log("Résultat activation (JSON): " + activationResultString);
  var activationResultObject = JSON.parse(activationResultString);

  if (activationResultObject.success) {
    Logger.log("Vérification: 'enabled' est 'true' ? -> " + activationResultObject.user.enabled);
  }
}

function maFonctionDeTestPourDesactiverUtilisateur() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  
  var timestamp = new Date().getTime();
  var testUsername = "TestToDeactivate" + timestamp;
  var testEmail = "testtodeactivate" + timestamp + "@example.com";
  
  Logger.log("--- PARTIE 1: Création d'un utilisateur ---");
  var creationResultString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, "ToDeactivate", "User", []);
  var creationResultObject = JSON.parse(creationResultString);
  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultObject.error}`);
    return;
  }
  var userObjectToTest = creationResultObject.user;
  Logger.log(`Utilisateur créé. ID: ${userObjectToTest.id}`);

  Logger.log(`\n--- PARTIE 2: Activation de l'utilisateur ---`);
  var rolesToAssign = ["ROLE_USER"];
  var activationResultString = activerUtilisateur360sc(testSystemType, userObjectToTest, rolesToAssign);
  var activationResultObject = JSON.parse(activationResultString);
  if (!activationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: L'activation a échoué. Test annulé. Erreur: ${activationResultObject.error}`);
    return;
  }
  var activatedUserObject = activationResultObject.user;
  Logger.log(`Utilisateur activé. Statut 'enabled': ${activatedUserObject.enabled}`);

  Logger.log(`\n--- PARTIE 3: Désactivation de l'utilisateur ---`);
  var deactivationResultString = desactiverUtilisateur360sc(testSystemType, activatedUserObject);
  Logger.log("Résultat désactivation (JSON): " + deactivationResultString);
  var deactivationResultObject = JSON.parse(deactivationResultString);

  if (deactivationResultObject.success) {
    Logger.log("Vérification: 'enabled' est 'false' ? -> " + deactivationResultObject.user.enabled);
  }
}

function maFonctionDeTestPourActiverUtilisateurForAppSheet() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  var testSystemType = "TEST"; 
  
  var timestamp = new Date().getTime();
  var testUsername = "TestAppSheet" + timestamp;
  var testEmail = "testappsheet" + timestamp + "@example.com";
  var testFirstName = "AppSheet";
  var testLastName = "User" + timestamp;

  Logger.log("--- PARTIE 1: Création d'un utilisateur de test ---");
  var creationResultString = creerUtilisateur360sc(testSystemType, testUsername, testEmail, testFirstName, testLastName, []);
  var creationResultObject = JSON.parse(creationResultString);

  if (!creationResultObject.success) {
    Logger.log(`ERREUR CRITIQUE: Création échouée. Test annulé. Erreur: ${creationResultObject.error}`);
    return;
  }
  var createdUser = creationResultObject.user;
  Logger.log(`Utilisateur créé. ID: ${createdUser.id}`);

  Logger.log(`\n--- PARTIE 2: Appel du wrapper AppSheet pour activer l'utilisateur ID ${createdUser.id} ---`);
  var rolesToAssign = ["ROLE_USER", "ROLE_DUHALDETEST"];
  
  var resultatWrapper = activerUtilisateur360scForAppSheet(
    testSystemType,
    createdUser.id,
    createdUser.username,
    createdUser.email,
    createdUser.firstName,
    createdUser.lastName,
    rolesToAssign
  );
  
  Logger.log(`Résultat du wrapper AppSheet: ${resultatWrapper}`);
}

function testAllEnvironments() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("====== DÉBUT DE LA SUITE DE TESTS COMPLÈTE ======");
  try { testEndToEnd_DEV(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST DEV: " + e.toString() + "\nStack: " + e.stack); }
  try { testEndToEnd_TEST(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST TEST: " + e.toString() + "\nStack: " + e.stack); }
  try { testEndToEnd_PROD(); } catch (e) { Logger.log("ERREUR CRITIQUE PENDANT LE TEST PROD: " + e.toString() + "\nStack: " + e.stack); }
  Logger.log("====== FIN DE LA SUITE DE TESTS COMPLÈTE ======");
}

function testEndToEnd_DEV() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT DEV ---");
  const nomObjet = "TestE2EDevOF-" + new Date().getTime(); 
  const resultat = creerMultiplesObjets360sc(nomObjet, "DEV", "OF");
  Logger.log("Résultat DEV: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT DEV ---\n");
}

function testEndToEnd_TEST() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT TEST ---");
  const nomObjet = "TestE2ETestOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "TEST", "OF");
  Logger.log("Résultat TEST: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT TEST ---\n");
}

function testEndToEnd_PROD() {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  const canRunProdTest = false; 
  Logger.log("--- DÉBUT TEST END-TO-END: ENVIRONNEMENT PROD ---");
  if (!canRunProdTest) {
    Logger.log("AVERTISSEMENT: Le test PROD est désactivé par sécurité.");
    Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT PROD (NON EXÉCUTÉ) ---\n");
    return;
  }
  const nomObjet = "TestE2EProdOF-" + new Date().getTime();
  const resultat = creerMultiplesObjets360sc(nomObjet, "PROD", "OF");
  Logger.log("Résultat PROD: " + resultat);
  Logger.log("--- FIN TEST END-TO-END: ENVIRONNEMENT PROD ---\n");
}

// Fonctions de test de bas niveau (legacy ou pour diagnostic spécifique)
function testAuthentication(typeSysteme) {
  Logger.log("Lancement de la fonction de test : " + arguments.callee.name);
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme) throw new Error("'typeSysteme' est requis.");
    const systemTypeUpper = typeSysteme.toUpperCase();
    const token = getAuthToken_(systemTypeUpper);
    finalOutput.success = true;
    finalOutput.message = `Authentification réussie pour ${systemTypeUpper}.`;
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


// --- NOUVELLE FONCTION DE SUITE DE TESTS ---
/**
 * [SUITE DE TESTS] Exécute une série de tests clés pour valider l'ensemble des fonctionnalités du projet.
 * Cette fonction sert de point d'entrée unique pour une validation complète.
 * Note : les tests sont exécutés sur les environnements DEV ou TEST comme spécifié dans chaque fonction de test.
 */
function testSuiteComplete() {
    Logger.log("======================================================");
    Logger.log("Lancement de la SUITE DE TESTS COMPLÈTE");
    Logger.log("======================================================");

    const testsToRun = [
      { name: "Scénario 1: Création d'une structure OF complète (sur DEV)", func: maFonctionDeTestPourCreerMultiples_SUCCES },
      { name: "Scénario 2: Création d'un Avatar unique (Moule) (sur DEV)", func: maFonctionDeTestPourCreerObjetUnique },
      { name: "Scénario 3: Cycle de vie complet d'un utilisateur (Créer -> Activer -> Désactiver) (sur TEST)", func: maFonctionDeTestPourDesactiverUtilisateur }
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
            Logger.log(`--------------------------------------------------\n`);
        }
    });

    Logger.log("======================================================");
    Logger.log("SUITE DE TESTS COMPLÈTE TERMINÉE");
    Logger.log("======================================================");
}