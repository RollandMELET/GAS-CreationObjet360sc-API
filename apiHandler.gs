// FILENAME: apiHandler.gs
// Version: 1.4.0
// Date: 2025-06-07 12:30 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout des fonctions getUser_ (GET) et updateUser_ (PUT) pour la gestion des utilisateurs.
/**
 * @fileoverview Handles interactions with the 360sc API.
 */

// ... (getAuthToken_, createAvatar_, getMcUrlForAvatar_, createUser_ restent inchangés) ...
function getAuthToken_(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiUsername = scriptProperties.getProperty(`API_USERNAME_${systemTypeUpper}`);
  const apiPassword = scriptProperties.getProperty(`API_PASSWORD_${systemTypeUpper}`);

  if (!apiUsername || !apiPassword) {
    const errorMessage = `ERREUR CRITIQUE: Identifiants API_USERNAME_${systemTypeUpper} ou API_PASSWORD_${systemTypeUpper} non trouvés.`;
    Logger.log(errorMessage);
    throw new Error(errorMessage);
  }

  const config = getConfiguration_(systemTypeUpper); 
  const authUrl = config.API_BASE_URL + config.AUTH_ENDPOINT;

  const payload = {
    username: apiUsername,
    password: apiPassword
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  Logger.log(`Authentification en cours pour ${systemTypeUpper} sur : ${authUrl}`);
  const response = UrlFetchApp.fetch(authUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.token) {
      Logger.log(`Authentification ${systemTypeUpper} réussie.`);
      return jsonResponse.token;
    } else {
      throw new Error("Erreur d'authentification : token non trouvé.");
    }
  } else {
    throw new Error(`Échec de l'authentification pour ${systemTypeUpper}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

function createAvatar_(accessToken, typeSysteme, objectNameForApi, alphaId, metadataAvatarTypeId) {
  const config = getConfiguration_(typeSysteme); 
  const avatarsUrl = config.API_BASE_URL + config.AVATARS_ENDPOINT;

  if (!metadataAvatarTypeId) { throw new Error("'metadataAvatarTypeId' requis pour createAvatar_."); }

  const payload = { name: objectNameForApi, alphaId: alphaId, generateMCQuantity: config.GENERATE_MC_QUANTITY, company: config.COMPANY_ID, metadataAvatarType: metadataAvatarTypeId };
  if (config.GENERATE_MC_FINGER && String(config.GENERATE_MC_FINGER).trim() !== "") { payload.generateMCFinger = config.GENERATE_MC_FINGER; }
  const options = { method: 'post', contentType: 'application/json', headers: {'Authorization': 'Bearer ' + accessToken, 'x-deduplication-id': Utilities.getUuid()}, payload: JSON.stringify(payload), muteHttpExceptions: true };

  Logger.log(`Création avatar (${typeSysteme}): ${objectNameForApi} sur ${avatarsUrl}`);
  const response = UrlFetchApp.fetch(avatarsUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['@id']) { return jsonResponse['@id']; } 
    else { throw new Error(`Erreur création avatar : @id non trouvé. Réponse: ${responseBody}`); }
  } else { throw new Error(`Échec création avatar pour ${objectNameForApi}. Code: ${responseCode}. Message: ${responseBody}`); }
}

function getMcUrlForAvatar_(accessToken, typeSysteme, avatarApiIdPath) {
  const config = getConfiguration_(typeSysteme);
  const mcUrlFetchFullUrl = config.API_BASE_URL + avatarApiIdPath + config.MCS_SUFFIX_PATH;
  const options = { method: 'get', headers: {'Authorization': 'Bearer ' + accessToken }, muteHttpExceptions: true };

  Logger.log(`Récupération mcUrl pour ${avatarApiIdPath} (${typeSysteme}) sur ${mcUrlFetchFullUrl}`);
  const response = UrlFetchApp.fetch(mcUrlFetchFullUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['hydra:member'] && jsonResponse['hydra:member'][0] && jsonResponse['hydra:member'][0].yourls.mcUrl) {
      return jsonResponse['hydra:member'][0].yourls.mcUrl;
    } else { throw new Error(`Erreur récupération mcUrl : structure de réponse inattendue. Réponse: ${responseBody}`); }
  } else { throw new Error(`Échec récupération mcUrl pour ${avatarApiIdPath}. Code: ${responseCode}. Message: ${responseBody}`); }
}

function createUser_(accessToken, typeSysteme, userData) {
  const config = getConfiguration_(typeSysteme);
  let usersUrl;
  const systemTypeUpper = typeSysteme.toUpperCase();

  if ((systemTypeUpper === "TEST" || systemTypeUpper === "PROD") && config.API_BASE_URL === "https://apiv2.360sc.yt") {
    usersUrl = "https://api.360sc.yt" + config.USERS_ENDPOINT; 
    Logger.log(`Info: Utilisation URL spécifique ("https://api.360sc.yt") pour users en ${systemTypeUpper}.`);
  } else {
    usersUrl = config.API_BASE_URL + config.USERS_ENDPOINT;
    Logger.log(`Info: Utilisation URL standard ("${config.API_BASE_URL}") pour users en ${systemTypeUpper}.`);
  }

  if (!userData.username || !userData.email || !userData.firstName || !userData.lastName) { throw new Error("username, email, firstName, lastName sont requis pour createUser_."); }

  const payload = { company: config.COMPANY_ID, username: userData.username, email: userData.email, firstName: userData.firstName, lastName: userData.lastName, tags: userData.tags || [] };
  const options = { method: 'post', contentType: 'application/json', headers: { 'Authorization': 'Bearer ' + accessToken }, payload: JSON.stringify(payload), muteHttpExceptions: true };

  Logger.log(`Création utilisateur (${typeSysteme}): ${userData.username} sur ${usersUrl}`);
  const response = UrlFetchApp.fetch(usersUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) { 
    return JSON.parse(responseBody); 
  } else {
    let apiErrorMessage = responseBody;
    try {
        const errorJson = JSON.parse(responseBody);
        apiErrorMessage = errorJson.detail || errorJson.message || errorJson["hydra:description"] || responseBody;
    } catch (e) { /* Pas du JSON */ }
    throw new Error(`Échec création utilisateur ${userData.username}. Code: ${responseCode}. Message: ${apiErrorMessage}`);
  }
}

// --- NOUVELLE FONCTION GET USER ---
/**
 * Retrieves a single user object from the 360sc platform by its ID.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 * @param {number|string} userId The numerical ID of the user to retrieve.
 * @return {object} The user object from the API.
 * @throws {Error} If user retrieval fails.
 * @private
 */
function getUser_(accessToken, typeSysteme, userId) {
  const config = getConfiguration_(typeSysteme);
  let usersApiBaseUrl;
  const systemTypeUpper = typeSysteme.toUpperCase();

  if ((systemTypeUpper === "TEST" || systemTypeUpper === "PROD") && config.API_BASE_URL === "https://apiv2.360sc.yt") {
    usersApiBaseUrl = "https://api.360sc.yt";
  } else {
    usersApiBaseUrl = config.API_BASE_URL;
  }
  const userUrl = usersApiBaseUrl + config.USERS_ENDPOINT + '/' + userId;

  const options = {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + accessToken },
    muteHttpExceptions: true
  };

  Logger.log(`Récupération de l'utilisateur ID ${userId} (${typeSysteme}) sur ${userUrl}`);
  const response = UrlFetchApp.fetch(userUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    Logger.log(`Utilisateur ID ${userId} récupéré avec succès.`);
    return JSON.parse(responseBody);
  } else {
    throw new Error(`Échec de la récupération de l'utilisateur ID ${userId}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

// --- NOUVELLE FONCTION UPDATE USER ---
/**
 * Updates a user object in the 360sc platform using a PUT request.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 * @param {number|string} userId The numerical ID of the user to update.
 * @param {object} userDataPayload The complete user object to send as the payload.
 * @return {object} The updated user object from the API.
 * @throws {Error} If user update fails.
 * @private
 */
function updateUser_(accessToken, typeSysteme, userId, userDataPayload) {
  const config = getConfiguration_(typeSysteme);
  let usersApiBaseUrl;
  const systemTypeUpper = typeSysteme.toUpperCase();

  if ((systemTypeUpper === "TEST" || systemTypeUpper === "PROD") && config.API_BASE_URL === "https://apiv2.360sc.yt") {
    usersApiBaseUrl = "https://api.360sc.yt";
  } else {
    usersApiBaseUrl = config.API_BASE_URL;
  }
  const userUrl = usersApiBaseUrl + config.USERS_ENDPOINT + '/' + userId;

  const options = {
    method: 'put',
    contentType: 'application/ld+json', // Utiliser 'application/ld+json' comme vu dans le vrac
    headers: { 'Authorization': 'Bearer ' + accessToken },
    payload: JSON.stringify(userDataPayload),
    muteHttpExceptions: true
  };

  Logger.log(`Mise à jour de l'utilisateur ID ${userId} (${typeSysteme}) sur ${userUrl}`);
  Logger.log(`Payload de mise à jour: ${JSON.stringify(userDataPayload)}`);
  const response = UrlFetchApp.fetch(userUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    Logger.log(`Utilisateur ID ${userId} mis à jour avec succès.`);
    return JSON.parse(responseBody);
  } else {
    let apiErrorMessage = responseBody;
    try {
        const errorJson = JSON.parse(responseBody);
        apiErrorMessage = errorJson.detail || errorJson.message || errorJson["hydra:description"] || responseBody;
    } catch (e) { /* Pas du JSON */ }
    throw new Error(`Échec de la mise à jour de l'utilisateur ID ${userId}. Code: ${responseCode}. Message: ${apiErrorMessage}`);
  }
}