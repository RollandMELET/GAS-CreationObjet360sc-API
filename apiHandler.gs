// FILENAME: apiHandler.gs
// Version: 1.3.0 
// Date: 2025-06-07 10:35 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de la fonction createUser_ pour la création d'utilisateurs.
/**
 * @fileoverview Handles interactions with the 360sc API.
 */

/**
 * Authenticates with the 360sc API and returns an access token.
 * Retrieves API credentials from ScriptProperties based on typeSysteme.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD" to determine API endpoint and credentials.
 * @return {string} The access token.
 * @throws {Error} If authentication fails, API returns an error, or credentials are not configured for the given typeSysteme.
 * @private
 */
function getAuthToken_(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiUsername = scriptProperties.getProperty(`API_USERNAME_${systemTypeUpper}`);
  const apiPassword = scriptProperties.getProperty(`API_PASSWORD_${systemTypeUpper}`);

  if (!apiUsername || !apiPassword) {
    const errorMessage = `ERREUR CRITIQUE: Identifiants API_USERNAME_${systemTypeUpper} ou API_PASSWORD_${systemTypeUpper} non trouvés dans ScriptProperties. Veuillez exécuter la fonction 'store${systemTypeUpper.charAt(0) + systemTypeUpper.slice(1).toLowerCase()}ApiCredentials' ou la fonction de stockage générique avec les bons identifiants.`;
    Logger.log(errorMessage);
    throw new Error(errorMessage);
  }

  const config = getConfiguration_(systemTypeUpper); // Valide aussi typeSysteme
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

  Logger.log(`Authentification en cours pour ${systemTypeUpper} sur : ${authUrl} (utilisateur: ${apiUsername})`);
  const response = UrlFetchApp.fetch(authUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.token) {
      Logger.log(`Authentification ${systemTypeUpper} réussie. Token obtenu.`);
      return jsonResponse.token;
    } else {
      Logger.log(`Erreur d'authentification ${systemTypeUpper} : token non trouvé dans la réponse. Réponse: ${responseBody}`);
      throw new Error("Erreur d'authentification : token non trouvé dans la réponse JSON.");
    }
  } else {
    Logger.log(`Erreur d'authentification ${systemTypeUpper}. Code: ${responseCode}. Réponse: ${responseBody}`);
    throw new Error(`Échec de l'authentification pour ${systemTypeUpper}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

/**
 * Creates an "Avatar" object in the 360sc platform.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 * @param {string} objectNameForApi The name for the new avatar as expected by API (e.g., "v0:OF_PRINCIPAL:MonObjet").
 * @param {string} alphaId The alphaId for the avatar (e.g., "v0:OF_PRINCIPAL").
 * @param {string} metadataAvatarTypeId The ID for the metadata avatar type (e.g., "/api/metadata_avatar_types/xxxx").
 * @return {string} The "@id" of the created avatar (e.g., "/api/avatars/xxxxxxxx").
 * @throws {Error} If avatar creation fails or API returns an error.
 * @private
 */
function createAvatar_(accessToken, typeSysteme, objectNameForApi, alphaId, metadataAvatarTypeId) {
  const config = getConfiguration_(typeSysteme); 
  const avatarsUrl = config.API_BASE_URL + config.AVATARS_ENDPOINT;

  if (!metadataAvatarTypeId) {
    Logger.log("ERREUR: metadataAvatarTypeId non fourni à createAvatar_.");
    throw new Error("Le paramètre 'metadataAvatarTypeId' est requis pour createAvatar_.");
  }

  const payload = {
    name: objectNameForApi,
    alphaId: alphaId,
    generateMCQuantity: config.GENERATE_MC_QUANTITY,
    company: config.COMPANY_ID,
    metadataAvatarType: metadataAvatarTypeId
  };

  if (config.GENERATE_MC_FINGER && String(config.GENERATE_MC_FINGER).trim() !== "") {
    payload.generateMCFinger = config.GENERATE_MC_FINGER;
  } else {
    Logger.log(`Information: generateMCFinger n'est pas configuré, est null ou est vide pour l'environnement ${typeSysteme}. Il ne sera pas inclus dans le payload de création d'avatar.`);
  }

  const deduplicationId = Utilities.getUuid();

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'x-deduplication-id': deduplicationId
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  Logger.log(`Création de l'avatar (${typeSysteme}): ${objectNameForApi} (alphaId: ${alphaId}, typeId: ${metadataAvatarTypeId}) sur ${avatarsUrl}`);
  Logger.log(`Payload création avatar: ${JSON.stringify(payload)}`);
  const response = UrlFetchApp.fetch(avatarsUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) { // 201 Created
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['@id']) {
      Logger.log(`Avatar (${typeSysteme}) créé avec succès : ${jsonResponse['@id']}`);
      return jsonResponse['@id'];
    } else {
      Logger.log(`Erreur création avatar (${typeSysteme}) : @id non trouvé. Réponse: ${responseBody}`);
      throw new Error(`Erreur création avatar : @id non trouvé dans la réponse JSON. Réponse: ${responseBody}`);
    }
  } else {
    Logger.log(`Erreur création avatar (${typeSysteme}). Code: ${responseCode}. Réponse: ${responseBody}`);
    throw new Error(`Échec de création avatar pour ${objectNameForApi}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

/**
 * Retrieves the mcUrl for a given avatar.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 * @param {string} avatarApiIdPath The "@id" of the avatar (e.g., "/api/avatars/xxxxxxxx").
 * @return {string} The mcUrl.
 * @throws {Error} If mcUrl retrieval fails or API returns an error.
 * @private
 */
function getMcUrlForAvatar_(accessToken, typeSysteme, avatarApiIdPath) {
  const config = getConfiguration_(typeSysteme);
  const mcUrlFetchFullUrl = config.API_BASE_URL + avatarApiIdPath + config.MCS_SUFFIX_PATH;

  const options = {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    muteHttpExceptions: true
  };

  Logger.log(`Récupération mcUrl pour ${avatarApiIdPath} (${typeSysteme}) sur ${mcUrlFetchFullUrl}`);
  const response = UrlFetchApp.fetch(mcUrlFetchFullUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['hydra:member'] &&
        jsonResponse['hydra:member'][0] &&
        jsonResponse['hydra:member'][0].yourls &&
        jsonResponse['hydra:member'][0].yourls.mcUrl) {
      const mcUrl = jsonResponse['hydra:member'][0].yourls.mcUrl;
      Logger.log(`mcUrl (${typeSysteme}) récupérée avec succès : ${mcUrl}`);
      return mcUrl;
    } else {
      Logger.log(`Erreur récupération mcUrl (${typeSysteme}) : structure de réponse inattendue. Réponse: ${responseBody}`);
      throw new Error(`Erreur récupération mcUrl : structure de réponse JSON inattendue. Réponse: ${responseBody}`);
    }
  } else {
    Logger.log(`Erreur récupération mcUrl (${typeSysteme}). Code: ${responseCode}. Réponse: ${responseBody}`);
    throw new Error(`Échec de récupération mcUrl pour ${avatarApiIdPath}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

/**
 * Creates a "User" object in the 360sc platform.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV", "TEST", or "PROD".
 * @param {object} userData An object containing user details. Expected properties: username, email, firstName, lastName. Optional: tags (array).
 * @return {object} The JSON response from the API, typically the created user object.
 * @throws {Error} If user creation fails or API returns an error.
 * @private
 */
function createUser_(accessToken, typeSysteme, userData) {
  const config = getConfiguration_(typeSysteme);
  const usersUrl = config.API_BASE_URL + config.USERS_ENDPOINT;

  // Validate required userData fields
  if (!userData.username || !userData.email || !userData.firstName || !userData.lastName) {
    const errorMessage = "ERREUR: Les champs userData 'username', 'email', 'firstName', et 'lastName' sont requis pour createUser_.";
    Logger.log(errorMessage + ` Données reçues: ${JSON.stringify(userData)}`);
    throw new Error(errorMessage);
  }

  const payload = {
    company: config.COMPANY_ID, // COMPANY_ID est spécifique à l'environnement via getConfiguration_
    username: userData.username,
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    tags: userData.tags || [] // Default to empty array if tags are not provided
  };

  // Note: La déduplication n'est généralement pas utilisée pour la création d'utilisateur,
  // mais si l'API le supporte et que c'est souhaité, un 'x-deduplication-id' pourrait être ajouté.
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  Logger.log(`Création de l'utilisateur (${typeSysteme}): ${userData.username} sur ${usersUrl}`);
  Logger.log(`Payload création utilisateur: ${JSON.stringify(payload)}`);
  const response = UrlFetchApp.fetch(usersUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) { // 201 Created
    const jsonResponse = JSON.parse(responseBody);
    Logger.log(`Utilisateur (${typeSysteme}) '${userData.username}' créé avec succès. Réponse: ${responseBody}`);
    return jsonResponse; // Retourne l'objet utilisateur créé (qui devrait inclure son @id)
  } else {
    Logger.log(`Erreur création utilisateur (${typeSysteme}) '${userData.username}'. Code: ${responseCode}. Réponse: ${responseBody}`);
    // Tenter de parser le message d'erreur de l'API s'il est en JSON
    let apiErrorMessage = responseBody;
    try {
        const errorResponseJson = JSON.parse(responseBody);
        if (errorResponseJson.detail) {
            apiErrorMessage = errorResponseJson.detail;
        } else if (errorResponseJson.message) {
            apiErrorMessage = errorResponseJson.message;
        } else if (errorResponseJson["hydra:description"]) {
            apiErrorMessage = errorResponseJson["hydra:description"];
        }
    } catch (e) {
        // La réponse n'est pas du JSON ou a une structure inattendue, utiliser le corps brut.
    }
    throw new Error(`Échec de création utilisateur pour ${userData.username}. Code: ${responseCode}. Message: ${apiErrorMessage}`);
  }
}