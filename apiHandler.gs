// FILENAME: apiHandler.gs
// Version: 2.3.0
// Date: 2025-06-10 23:15
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Correction de deux régressions : 1) Rétablissement du 'x-deduplication-id' manquant. 2) Utilisation de USERS_API_BASE_URL pour TOUTES les opérations sur les utilisateurs.
/**
 * @fileoverview Fonctions de bas niveau pour les appels à l'API 360sc.
 */

function getAuthToken_(typeSysteme) {
  const config = getConfiguration_(typeSysteme);
  // L'authentification se fait sur le serveur principal de la V2
  const baseUrl = config.API_BASE_URL; 
  const credentials = getApiCredentials_(typeSysteme);
  const cache = CacheService.getScriptCache();
  const cacheKey = `API_TOKEN_${typeSysteme}`;
  
  let token = cache.get(cacheKey);
  if (token) { return token; }

  Logger.log(`Authentification en cours pour ${typeSysteme} sur : ${baseUrl}${config.AUTH_ENDPOINT}`);
  const response = UrlFetchApp.fetch(baseUrl + config.AUTH_ENDPOINT, {
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
    if (jsonResponse.MCs && jsonResponse.MCs.length > 0 && jsonResponse.MCs[0].yourls && jsonResponse.MCs[0].yourls.mcUrl) {
      jsonResponse.mcUrl = jsonResponse.MCs[0].yourls.mcUrl;
    }
    return jsonResponse;
  } else {
    throw new Error(`Échec de la création de l'avatar ${name}. Code: ${responseCode}. Body: ${responseBody}`);
  }
}

function getMcUrlForAvatar_(token, typeSysteme, avatarIdPath) {
  const config = getConfiguration_(typeSysteme);
  const url = `${config.API_BASE_URL}${avatarIdPath}${config.MCS_SUFFIX_PATH}`;
  const response = UrlFetchApp.fetch(url, { method: 'get', headers: { 'Authorization': `Bearer ${token}` }, muteHttpExceptions: true });
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['hydra:member'] && jsonResponse['hydra:member'].length > 0 && jsonResponse['hydra:member'][0].yourls && jsonResponse['hydra:member'][0].yourls.mcUrl) {
      return jsonResponse['hydra:member'][0].yourls.mcUrl;
    }
  }
  throw new Error(`Échec de la récupération (fallback) de mcUrl pour ${avatarIdPath}. Code: ${responseCode}. Body: ${responseBody}`);
}

function addPropertiesToAvatar_(token, typeSysteme, avatarId, propertiesPayload) {
  const config = getConfiguration_(typeSysteme);
  const endpointUrl = `${config.API_BASE_URL}/api/avatars/${avatarId}/add_avatar_properties/batch`;
  Logger.log(`Ajout de propriétés à l'avatar ID ${avatarId} (${typeSysteme}) sur ${endpointUrl}`);
  
  const payload = { "properties": propertiesPayload };
  // CORRECTION: Rétablissement du deduplicationId
  const deduplicationId = Utilities.getUuid();
  const response = UrlFetchApp.fetch(endpointUrl, {
    method: 'put', contentType: 'application/ld+json',
    headers: { 'Authorization': `Bearer ${token}`, 'x-deduplication-id': deduplicationId },
    payload: JSON.stringify(payload), muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  if (responseCode === 200) {
    return JSON.parse(responseBody);
  } else {
    throw new Error(`Échec de l'ajout de propriétés. Code: ${responseCode}. Body: ${responseBody}`);
  }
}

function findUserByEmail_(token, typeSysteme, email) {
  const config = getConfiguration_(typeSysteme);
  const encodedEmail = encodeURIComponent(email);
  // Utilisation de la bonne URL de base pour les utilisateurs (V1)
  const searchUrl = `${config.USERS_API_BASE_URL}${config.USERS_ENDPOINT_V1}?email=${encodedEmail}`;
  Logger.log(`Recherche de l'utilisateur par email (${typeSysteme}) sur: ${searchUrl}`);

  const response = UrlFetchApp.fetch(searchUrl, {
    method: 'get', headers: { 'Authorization': `Bearer ${token}` }, muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  if (responseCode === 200) {
    const jsonResponse = JSON.parse(responseBody);
    if (jsonResponse['hydra:member'] && jsonResponse['hydra:member'].length > 0) {
      Logger.log(`Utilisateur avec l'email '${email}' trouvé.`);
      return jsonResponse['hydra:member'][0];
    }
    return null;
  }
  throw new Error(`Échec de la recherche d'utilisateur par email. Code: ${responseCode}. Body: ${responseBody}`);
}

function createUser_(token, typeSysteme, userData) {
  const config = getConfiguration_(typeSysteme);
  // CORRECTION: La création utilise l'endpoint V2 mais sur la base URL de la V1
  const endpointUrl = `${config.USERS_API_BASE_URL}${config.USERS_ENDPOINT_V2}`;
  Logger.log(`Appel API pour création user sur: ${endpointUrl}`);
  
  const response = UrlFetchApp.fetch(endpointUrl, {
    method: 'post', contentType: 'application/json', headers: { 'Authorization': `Bearer ${token}` },
    payload: JSON.stringify(userData), muteHttpExceptions: true
  });
  
  const responseCode = response.getResponseCode();
  if (responseCode !== 201) {
    throw new Error(`Erreur lors de l'appel POST de création. Code: ${responseCode}. Body: ${response.getContentText()}`);
  }
}

function updateUser_(token, typeSysteme, userId, payload) {
  const config = getConfiguration_(typeSysteme);
  // CORRECTION: La mise à jour utilise l'endpoint V2 mais sur la base URL de la V1
  const endpointUrl = `${config.USERS_API_BASE_URL}${config.USERS_ENDPOINT_V2}/${userId}`;
  Logger.log(`Appel API pour mise à jour user sur: ${endpointUrl}`);
  delete payload.id; 
  
  const response = UrlFetchApp.fetch(endpointUrl, {
    method: 'put', contentType: 'application/json', headers: { 'Authorization': `Bearer ${token}` },
    payload: JSON.stringify(payload), muteHttpExceptions: true
  });
  
  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();
  if (responseCode === 200) {
    return JSON.parse(responseBody);
  } else {
    throw new Error(`Erreur lors de la mise à jour de l'utilisateur. Code: ${responseCode}. Body: ${responseBody}`);
  }
}