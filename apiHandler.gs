// Version: 1.0.0
// Last Modified: 2025-06-02
/**
 * @fileoverview Handles interactions with the 360sc API.
 */

/**
 * Authenticates with the 360sc API and returns an access token.
 * @param {string} username The username for authentication.
 * @param {string} password The password for authentication.
 * @param {string} typeSysteme "DEV" or "PROD" to determine API endpoint.
 * @return {string} The access token.
 * @throws {Error} If authentication fails or API returns an error.
 * @private
 */
function getAuthToken_(username, password, typeSysteme) {
  const config = getConfiguration_(typeSysteme);
  const authUrl = config.API_BASE_URL + config.AUTH_ENDPOINT;

  const payload = {
    username: username,
    password: password
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true // Important pour gérer les erreurs HTTP nous-mêmes
  };

  Logger.log(`Authentification en cours sur : ${authUrl}`);
  const response = UrlFetchApp.fetch(authUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse.token) {
      Logger.log("Authentification réussie. Token obtenu.");
      return jsonResponse.token;
    } else {
      Logger.log(`Erreur d'authentification : token non trouvé dans la réponse. Réponse: ${responseBody}`);
      throw new Error("Erreur d'authentification : token non trouvé dans la réponse.");
    }
  } else {
    Logger.log(`Erreur d'authentification. Code: ${responseCode}. Réponse: ${responseBody}`);
    throw new Error(`Échec de l'authentification. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

/**
 * Creates an "Avatar" object in the 360sc platform.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV" or "PROD".
 * @param {string} objectNameForApi The name for the new avatar as expected by API (e.g., "v0:OF_PRINCIPAL:MonObjet").
 * @param {string} alphaId The alphaId for the avatar (e.g., "v0:OF_PRINCIPAL").
 * @return {string} The "@id" of the created avatar (e.g., "/api/avatars/xxxxxxxx").
 * @throws {Error} If avatar creation fails or API returns an error.
 * @private
 */
function createAvatar_(accessToken, typeSysteme, objectNameForApi, alphaId) {
  const config = getConfiguration_(typeSysteme);
  const avatarsUrl = config.API_BASE_URL + config.AVATARS_ENDPOINT;

  const payload = {
    name: objectNameForApi, 
    alphaId: alphaId,
    generateMCFinger: config.GENERATE_MC_FINGER,
    generateMCQuantity: config.GENERATE_MC_QUANTITY,
    company: config.COMPANY_ID,
    metadataAvatarType: config.METADATA_AVATAR_TYPE
  };

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

  Logger.log(`Création de l'avatar : ${objectNameForApi} (alphaId: ${alphaId}) sur ${avatarsUrl}`);
  Logger.log(`Payload création avatar: ${JSON.stringify(payload)}`);
  const response = UrlFetchApp.fetch(avatarsUrl, options);
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) { // 201 Created
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['@id']) {
      Logger.log(`Avatar créé avec succès : ${jsonResponse['@id']}`);
      return jsonResponse['@id'];
    } else {
      Logger.log(`Erreur création avatar : @id non trouvé. Réponse: ${responseBody}`);
      throw new Error(`Erreur création avatar : @id non trouvé dans la réponse JSON. Réponse: ${responseBody}`);
    }
  } else {
    Logger.log(`Erreur création avatar. Code: ${responseCode}. Réponse: ${responseBody}`);
    throw new Error(`Échec de création avatar pour ${objectNameForApi}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

/**
 * Retrieves the mcUrl for a given avatar.
 * @param {string} accessToken The API access token.
 * @param {string} typeSysteme "DEV" or "PROD".
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

  Logger.log(`Récupération mcUrl pour ${avatarApiIdPath} sur ${mcUrlFetchFullUrl}`);
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
      Logger.log(`mcUrl récupérée avec succès : ${mcUrl}`);
      return mcUrl;
    } else {
      Logger.log(`Erreur récupération mcUrl : structure de réponse inattendue. Réponse: ${responseBody}`);
      throw new Error(`Erreur récupération mcUrl : structure de réponse JSON inattendue. Réponse: ${responseBody}`);
    }
  } else {
    Logger.log(`Erreur récupération mcUrl. Code: ${responseCode}. Réponse: ${responseBody}`);
    throw new Error(`Échec de récupération mcUrl pour ${avatarApiIdPath}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}