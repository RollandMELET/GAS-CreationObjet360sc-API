// FILENAME: Code.gs
// Version: 1.16.0
// Date: 2025-06-07 15:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout du wrapper activerUtilisateurParProfil360sc utilisant un mapping de rôles.
/**
 * @fileoverview Fichier principal contenant les fonctions exposées et appelables par des services externes comme AppSheet.
 */

function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || !typeSysteme) { throw new Error("'nomDeObjetBase' et 'typeSysteme' requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "OF";
    if (typeObjetUpper !== 'OF') { throw new Error("Usage incorrect: 'creerMultiplesObjets360sc' est réservé à 'OF'."); }
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES.OF;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) { throw new Error(`'METADATA_AVATAR_TYPES.OF' non configuré pour ${systemTypeUpper}.`); }
    Logger.log(`Début création multiple pour OF '${nomDeObjetBase}', sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    for (const objDef of OBJECT_DEFINITIONS) {
      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      try {
        const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        finalOutput[objDef.key] = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
      } catch (e) { throw new Error(`Échec étape '${objDef.key}': ${e.message}`); }
    }
    finalOutput.success = true;
    finalOutput.message = "Tous les objets OF ont été créés avec succès.";
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerMultiplesObjets360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerObjetUnique360sc(nomDeObjetBase, typeSysteme, typeObjet, typeMoule) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || !typeSysteme || !typeMoule) { throw new Error("nomDeObjetBase, typeSysteme, typeMoule sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const config = getConfiguration_(systemTypeUpper);
    const alphaIdSpecifique = ALPHA_ID_MAPPING[typeMoule];
    if (!alphaIdSpecifique) { throw new Error(`Type de moule inconnu : '${typeMoule}'.`); }
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "DEFAULT";
    const metadataAvatarTypeId = config.METADATA_AVATAR_TYPES[typeObjetUpper] || config.METADATA_AVATAR_TYPES.DEFAULT;
    if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) { throw new Error(`Type d'objet '${typeObjetUpper}' non supporté pour ${systemTypeUpper}.`);}
    const objectNameForApi = `${alphaIdSpecifique}:${nomDeObjetBase}`;
    Logger.log(`Début création objet unique: ${objectNameForApi} pour ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    const avatarIdPath = createAvatar_(token, systemTypeUpper, objectNameForApi, alphaIdSpecifique, metadataAvatarTypeId);
    finalOutput.success = true;
    finalOutput.message = `Objet unique '${objectNameForApi}' créé.`;
    finalOutput.mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, avatarIdPath);
    finalOutput.avatarApiIdPath = avatarIdPath;
    finalOutput.objectNameCreated = objectNameForApi;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur création objet unique.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerObjetUnique360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule) {
  Logger.log(`Appel creerObjetUnique360scForAppSheet: nom=${nomDeObjetBase}, sys=${typeSysteme}, typeMoule=${typeMoule}`);
  const resultString = creerObjetUnique360sc(nomDeObjetBase, typeSysteme, "MOULE", typeMoule);
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.mcUrl) { return result.mcUrl; } 
    else { return `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`; }
  } catch (e) { return `ERREUR CRITIQUE PARSING: ${e.message}.`; }
}

function creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !username || !email || !firstName || !lastName) { throw new Error("typeSysteme, username, email, firstName, lastName sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    getConfiguration_(systemTypeUpper); 
    Logger.log(`Début création utilisateur '${username}', sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    const userData = { username: username, email: email, firstName: firstName, lastName: lastName, tags: Array.isArray(tags) ? tags : [] };
    const createdUser = createUser_(token, systemTypeUpper, userData);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur '${username}' créé.`;
    finalOutput.user = createdUser; 
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur création utilisateur.";
    finalOutput.error = error.message; 
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerUtilisateurEtRecupererId360sc(typeSysteme, username, email, firstName, lastName, tags) {
  Logger.log(`Appel creerUtilisateurEtRecupererId360sc: user=${username}, sys=${typeSysteme}`);
  const resultString = creerUtilisateur360sc(typeSysteme, username, email, firstName, lastName, tags);
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.user && typeof result.user.id !== 'undefined' && result.user.id !== null) {
      Logger.log(`Succès. ID numérique: ${result.user.id}`);
      return String(result.user.id);
    } else {
      return `ERREUR: ${result.error || result.message || 'ID numérique manquant.'}`;
    }
  } catch (e) { return `ERREUR CRITIQUE PARSING: ${e.message}.`; }
}

function activerUtilisateur360sc(typeSysteme, userData, roles) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !userData || !userData.id || !Array.isArray(roles) || roles.length === 0) {
      throw new Error("typeSysteme, userData (avec id) et roles (tableau non vide) sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début de l'activation pour l'utilisateur ID ${userData.id}, système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    let payload = { ...userData };
    payload.enabled = true;
    payload.roles = roles;
    delete payload.createdAt;
    delete payload.lastLogin;
    delete payload.passwordRequestedAt;
    if (payload.id && !String(payload.id).startsWith('/')) { payload.id = `/api/users/${payload.id}`; }
    if (!payload['@id']) { payload['@id'] = `/api/users/${userData.id}`; }
    const updatedUser = updateUser_(token, systemTypeUpper, userData.id, payload);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur ID ${userData.id} activé.`;
    finalOutput.user = updatedUser;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur activation utilisateur ID ${userData ? userData.id : 'inconnu'}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans activerUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function desactiverUtilisateur360sc(typeSysteme, userData) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !userData || !userData.id) { throw new Error("typeSysteme et userData (avec id) sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début de la désactivation pour l'utilisateur ID ${userData.id}, système: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    let payload = { ...userData };
    payload.enabled = false;
    delete payload.createdAt;
    delete payload.lastLogin;
    delete payload.passwordRequestedAt;
    if (payload.id && !String(payload.id).startsWith('/')) { payload.id = `/api/users/${payload.id}`; }
    if (!payload['@id']) { payload['@id'] = `/api/users/${userData.id}`; }
    const updatedUser = updateUser_(token, systemTypeUpper, userData.id, payload);
    finalOutput.success = true;
    finalOutput.message = `Utilisateur ID ${userData.id} désactivé.`;
    finalOutput.user = updatedUser;
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur désactivation utilisateur ID ${userData ? userData.id : 'inconnu'}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur globale dans desactiverUtilisateur360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function activerUtilisateur360scForAppSheet(typeSysteme, userId, username, email, firstName, lastName, roles) {
  Logger.log(`Lancement de activerUtilisateur360scForAppSheet pour l'utilisateur ID ${userId}`);
  try {
    const config = getConfiguration_(typeSysteme);
    let userData = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      company: config.COMPANY_ID,
      tags: [],
      groups: [],
      profiles: [],
      rolesv2: [],
      customFields: { ticketing: [], projectIds: [], buildingLogbook: [], redirection_after_login: null }
    };
    const resultString = activerUtilisateur360sc(typeSysteme, userData, roles);
    const result = JSON.parse(resultString);
    if (result.success) {
      Logger.log(`Activation réussie pour l'ID ${userId} via le wrapper AppSheet.`);
      return "SUCCES";
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue depuis activerUtilisateur360sc.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE dans le wrapper AppSheet: ${e.message}`;
    Logger.log(criticalError);
    return criticalError;
  }
}

function desactiverUtilisateur360scForAppSheet(typeSysteme, userId, username, email, firstName, lastName) {
  Logger.log(`Lancement de desactiverUtilisateur360scForAppSheet pour l'utilisateur ID ${userId}`);
  try {
    const config = getConfiguration_(typeSysteme);
    let userData = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      company: config.COMPANY_ID,
      tags: [],
      groups: [],
      profiles: [],
      rolesv2: [],
      customFields: { ticketing: [], projectIds: [], buildingLogbook: [], redirection_after_login: null }
    };
    const resultString = desactiverUtilisateur360sc(typeSysteme, userData);
    const result = JSON.parse(resultString);
    if (result.success) {
      Logger.log(`Désactivation réussie pour l'ID ${userId} via le wrapper AppSheet.`);
      return "SUCCES";
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue depuis desactiverUtilisateur360sc.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE dans le wrapper AppSheet: ${e.message}`;
    Logger.log(criticalError);
    return criticalError;
  }
}

function activerUtilisateurParProfil360sc(typeSysteme, userId, username, email, firstName, lastName, profil) {
  Logger.log(`Lancement de activerUtilisateurParProfil360sc pour l'ID ${userId} avec le profil '${profil}'`);
  try {
    const roles = ROLE_MAPPING[profil];
    if (!roles) {
      if (ROLE_MAPPING.hasOwnProperty(profil)) {
        throw new Error(`Le profil '${profil}' est configuré comme non activable.`);
      } else {
        throw new Error(`Profil inconnu : '${profil}'. Vérifiez la configuration ROLE_MAPPING.`);
      }
    }
    const config = getConfiguration_(typeSysteme);
    let userData = {
      id: userId,
      username: username,
      email: email,
      firstName: firstName,
      lastName: lastName,
      company: config.COMPANY_ID,
      tags: [],
      groups: [],
      profiles: [],
      rolesv2: [],
      customFields: { ticketing: [], projectIds: [], buildingLogbook: [], redirection_after_login: null }
    };
    const resultString = activerUtilisateur360sc(typeSysteme, userData, roles);
    const result = JSON.parse(resultString);
    if (result.success) {
      Logger.log(`Activation réussie pour l'ID ${userId} avec le profil '${profil}'.`);
      return "SUCCES";
    } else {
      const errorMessage = `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`;
      Logger.log(errorMessage);
      return errorMessage;
    }
  } catch (e) {
    const criticalError = `ERREUR CRITIQUE dans le wrapper par profil: ${e.message}`;
    Logger.log(criticalError);
    return criticalError;
  }
}