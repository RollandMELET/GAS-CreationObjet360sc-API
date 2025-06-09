// FILENAME: apiHandler.gs
// Version: 1.9.0
// Date: 2025-06-09 18:30
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Version finale stable. Ajout de l'en-tête 'x-deduplication-id' à toutes les opérations de modification. Adaptation à la nouvelle réponse de création d'avatar et au changement de méthode de getMcUrlForAvatar (POST -> GET).
/**
 * @fileoverview Fonctions de bas niveau pour les appels à l'API 360sc.
 */

function getAuthToken_(typeSysteme) {
  const config = getConfiguration_(typeSysteme);
  const credentials = getApiCredentials_(typeSysteme);
  const cache = CacheService.getScriptCache();
  const cacheKey = `API_TOKEN_${typeSysteme}`;
  
  let token = cache.get(cacheKey);
  if (token) { return token; }

  Logger.log(`Authentification en cours pour ${typeSysteme} sur : ${config.API_BASE_URL}${config.AUTH_ENDPOINT}`);
  const response = UrlFetchApp.fetch(config.API_BASE_URL + config.AUTH_ENDPOINT, {
    method: "post", contentType: "application/json",
    payload: JSON.stringify({ username: credentials.username, password: credentials.password }),
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    token = jsonResponse.token;
    cache.put(cacheKey, token, 1800);
    Logger.log(`Authentification ${typeSysteme} réussie.`);
    return token;
  } else {
    throw new Error(`Échec de l'authentification pour ${typeSysteme}. Code: ${responseCode}. Message: ${responseBody}`);
  }
}

function createAvatar_(token, typeSysteme, name, alphaId, metadataAvatarTypeId) {
  const config = getConfiguration_(typeSysteme);
  Logger.log(`Création avatar (${typeSysteme}): ${name} sur ${config.API_BASE_URL}${config.AVATARS_ENDPOINT}`);
  
  const payload = {
    name: name, alphaId: alphaId, enabled: true,
    company: config.COMPANY_ID, metadataAvatarType: metadataAvatarTypeId,
    generateMCFinger: config.GENERATE_MC_FINGER, generateMCQuantity: config.GENERATE_MC_QUANTITY
  };

  const deduplicationId = Utilities.getUuid();
  const response = UrlFetchApp.fetch(config.API_BASE_URL + config.AVATARS_ENDPOINT, {
    method: 'post', contentType: 'application/ld+json',
    headers: { 'Authorization': `Bearer ${token}`, 'x-deduplication-id': deduplicationId },
    payload: JSON.stringify(payload), muteHttpExceptions: true
  });
  
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 201) {
    const jsonResponse = JSON.parse(responseBody);
    Logger.log(`Avatar ${name} créé avec l'ID: ${jsonResponse['@id']}`);
    
    // CORRECTION: Tentative de récupération directe de l'URL du MC
    if (jsonResponse.MCs && jsonResponse.MCs.length > 0 && jsonResponse.MCs[0].url) {
      Logger.log("URL du MC trouvée directement dans la réponse de création.");
      jsonResponse.mcUrl = jsonResponse.MCs[0].url;
    }
    return jsonResponse; // Retourne l'objet complet
  } else {
    throw new Error(`Échec de la création de l'avatar ${name}. Code: ${responseCode}. Body: ${responseBody}`);
  }
}

function getMcUrlForAvatar_(token, typeSysteme, avatarIdPath) {
  const config = getConfiguration_(typeSysteme);
  const url = `${config.API_BASE_URL}${avatarIdPath}${config.MCS_SUFFIX_PATH}`;
  Logger.log(`Récupération mcUrl (fallback) pour ${avatarIdPath} (${typeSysteme}) sur ${url}`);

  const response = UrlFetchApp.fetch(url, {
    method: 'get', // CORRECTION: Passage en GET
    contentType: 'application/ld+json',
    headers: { 'Authorization': `Bearer ${token}` },
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['hydra:member'] && jsonResponse['hydra:member'].length > 0 && jsonResponse['hydra:member'][0].url) {
      return jsonResponse['hydra:member'][0].url;
    } else {
      throw new Error(`La réponse pour getMcUrl était valide (200) mais ne contenait pas d'URL de MC. Body: ${responseBody}`);
    }
  } else {
    throw new Error(`Échec de la récupération (fallback) de mcUrl pour ${avatarIdPath}. Code: ${responseCode}. Body: ${responseBody}`);
  }
}

function addPropertiesToAvatar_(token, typeSysteme, avatarId, propertiesPayload) {
  const config = getConfiguration_(typeSysteme);
  const endpointUrl = `${config.API_BASE_URL}/api/avatars/${avatarId}/add_avatar_properties/batch`;
  Logger.log(`Ajout de propriétés à l'avatar ID ${avatarId} (${typeSysteme}) sur ${endpointUrl}`);

  const payload = { "properties": propertiesPayload };
  const deduplicationId = Utilities.getUuid(); // CORRECTION: Ajout de l'ID de déduplication

  const response = UrlFetchApp.fetch(endpointUrl, {
    method: 'put', contentType: 'application/ld+json',
    headers: { 'Authorization': `Bearer ${token}`, 'x-deduplication-id': deduplicationId },
    payload: JSON.stringify(payload), muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode === 200) {
    Logger.log(`Propriétés ajoutées avec succès à l'avatar ID ${avatarId}.`);
    return JSON.parse(responseBody);
  } else {
    throw new Error(`Échec de l'ajout de propriétés à l'avatar ID ${avatarId}. Code: ${responseCode}. Body: ${responseBody}`);
  }
}

// --- Fonctions de gestion des utilisateurs (inchangées) ---
function createUser_(token, typeSysteme, userData) {
  const config = getConfiguration_(typeSysteme);
  let usersApiUrl = config.API_BASE_URL + config.USERS_ENDPOINT;
  if (typeSysteme === "TEST") { usersApiUrl = "https://api.360sc.yt" + config.USERS_ENDPOINT; }
  let payload = { ...userData, enabled: false, company: config.COMPANY_ID };
  const response = UrlFetchApp.fetch(usersApiUrl, {
    method: 'post', contentType: 'application/ld+json',
    headers: { 'Authorization': `Bearer ${token}` }, payload: JSON.stringify(payload), muteHttpExceptions: true
  });
  if (response.getResponseCode() === 201) { return JSON.parse(response.getContentText()); }
  else { throw new Error(`Échec de la création de l'utilisateur. Code: ${response.getResponseCode()}. Body: ${response.getContentText()}`); }
}

function updateUser_(token, typeSysteme, userId, payload) {
  const config = getConfiguration_(typeSysteme);
  let usersApiUrl = `${config.API_BASE_URL}${config.USERS_ENDPOINT}/${userId}`;
  if (typeSysteme === "TEST") { usersApiUrl = `https://api.360sc.yt${config.USERS_ENDPOINT}/${userId}`; }
  const response = UrlFetchApp.fetch(usersApiUrl, {
    method: 'put', contentType: 'application/ld+json',
    headers: { 'Authorization': `Bearer ${token}` }, payload: JSON.stringify(payload), muteHttpExceptions: true
  });
  if (response.getResponseCode() === 200) { return JSON.parse(response.getContentText()); }
  else { throw new Error(`Échec de la mise à jour de l'utilisateur ID ${userId}. Code: ${response.getResponseCode()}. Body: ${response.getContentText()}`); }
}