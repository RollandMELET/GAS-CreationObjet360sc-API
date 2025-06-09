// FILENAME: users.gs
// Version: 1.1.0
// Date: 2025-06-10 21:30
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Correction d'un bug majeur. La fonction creerUtilisateur360sc valide maintenant la réponse de l'API avant de la retourner comme un succès.
/**
 * @fileoverview This file contains all functions related to user management
 * for the 360sc API, including internal logic and AppSheet wrappers.
 */

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
    
    // CHANGEMENT: Ajout d'une validation critique de la réponse de l'API
    if (!createdUser || typeof createdUser.id === 'undefined') {
      throw new Error("La création de l'utilisateur dans l'API a réussi (code 201) mais n'a pas retourné un objet utilisateur valide.");
    }

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