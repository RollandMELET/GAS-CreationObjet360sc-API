// <!-- START OF FILE: Code.gs -->
// FILENAME: Code.gs
// Version: 1.28.0
// Date: 2024-06-22 20:41
// Author: Rolland MELET & AI Senior Coder
// Description: Alignement de creerMultiplesObjets360sc pour retourner aussi les AvatarID, comme creerOFPrincipalEtElec360sc. Standardisation de l'usage de .id.

/**
 * @fileoverview Fichier principal contenant les fonctions exposées et appelables par des services externes comme AppSheet.
 * Ce fichier se concentre sur la gestion des objets (Avatars). La logique des utilisateurs est dans `users.gs`.
 */

function creerOFPrincipalEtElec360sc(nomDeObjetBase, typeSysteme, proprietesElec) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || !typeSysteme) { throw new Error("'nomDeObjetBase' et 'typeSysteme' sont requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();

    const objectDefinitions = getObjectDefinitionsForPrincipalAndElec_(systemTypeUpper);
    
    let parsedProperties = null;
    if (proprietesElec && typeof proprietesElec === 'string' && proprietesElec.trim().startsWith('{')) {
      try {
        parsedProperties = JSON.parse(proprietesElec);
        Logger.log("Les propriétés ELEC fournies en JSON ont été parsées avec succès.");
      } catch (jsonError) {
        throw new Error(`Le paramètre 'proprietesElec' n'est pas un JSON valide. Erreur: ${jsonError.message}`);
      }
    } else if (proprietesElec && typeof proprietesElec === 'object') {
      parsedProperties = proprietesElec;
      Logger.log("Les propriétés ELEC ont été fournies directement comme un objet.");
    }

    Logger.log(`Début création Principal & Elec pour OF '${nomDeObjetBase}', sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    
    for (const objDef of objectDefinitions) {
      const metadataAvatarTypeId = objDef.metadataId;
      if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) {
        throw new Error(`Metadata ID non configuré pour '${objDef.key}' dans l'environnement ${systemTypeUpper}.`);
      }

      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      try {
        const createdAvatarObject = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        
        const mcUrlKey = `${objDef.key}_mcUrl`;
        const avatarIdKey = `${objDef.key}_AvatarID`;

        if (createdAvatarObject && createdAvatarObject.mcUrl) {
          finalOutput[mcUrlKey] = createdAvatarObject.mcUrl;
        } else if (createdAvatarObject && createdAvatarObject['@id']) {
          finalOutput[mcUrlKey] = getMcUrlForAvatar_(token, systemTypeUpper, createdAvatarObject['@id']);
        } else {
           throw new Error("La réponse de création d'avatar était invalide pour récupérer l'URL.");
        }

        if (createdAvatarObject && createdAvatarObject.id) {
          finalOutput[avatarIdKey] = createdAvatarObject.id;
        } else {
          throw new Error("La réponse de création d'avatar était invalide pour récupérer l'AvatarID.");
        }

        if (objDef.alphaId === "v0:OF_ELEC" && parsedProperties && Object.keys(parsedProperties).length > 0) {
          Logger.log(`Détection de l'objet OF_ELEC. Tentative d'ajout des propriétés.`);
          const avatarId = createdAvatarObject.id;
          const propertiesPayload = Object.keys(parsedProperties).map(key => ({
            name: key, value: String(parsedProperties[key]), private: false
          }));
          addPropertiesToAvatar_(token, systemTypeUpper, avatarId, propertiesPayload);
          Logger.log(`Propriétés ajoutées avec succès à l'objet ${objectNameForApi}.`);
        }

      } catch (e) { 
        throw new Error(`Échec étape '${objDef.key}': ${e.message}`); 
      }
    }
    finalOutput.success = true;
    finalOutput.message = "Objets OF Principal et Elec créés avec succès.";
  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = "Erreur.";
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur creerOFPrincipalEtElec360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet, proprietesElec) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!nomDeObjetBase || !typeSysteme) { throw new Error("'nomDeObjetBase' et 'typeSysteme' requis."); }
    const systemTypeUpper = typeSysteme.toUpperCase();
    const typeObjetUpper = typeObjet ? String(typeObjet).toUpperCase() : "OF";
    if (typeObjetUpper !== 'OF') { throw new Error("Usage incorrect: 'creerMultiplesObjets360sc' est réservé à 'OF'."); }

    const objectDefinitions = getObjectDefinitions_(systemTypeUpper);
    
    let parsedProperties = null;
    if (proprietesElec && typeof proprietesElec === 'string' && proprietesElec.trim().startsWith('{')) {
      try {
        parsedProperties = JSON.parse(proprietesElec);
        Logger.log("Les propriétés ELEC fournies en JSON ont été parsées avec succès.");
      } catch (jsonError) {
        throw new Error(`Le paramètre 'proprietesElec' n'est pas un JSON valide. Erreur: ${jsonError.message}`);
      }
    } else if (proprietesElec && typeof proprietesElec === 'object') {
      parsedProperties = proprietesElec;
      Logger.log("Les propriétés ELEC ont été fournies directement comme un objet.");
    }

    Logger.log(`Début création multiple pour OF '${nomDeObjetBase}', sys: ${systemTypeUpper}`);
    const token = getAuthToken_(systemTypeUpper);
    
    for (const objDef of objectDefinitions) {
      const metadataAvatarTypeId = objDef.metadataId;
      if (!metadataAvatarTypeId || metadataAvatarTypeId.startsWith("VOTRE_")) {
        throw new Error(`Metadata ID non configuré pour '${objDef.key}' dans l'environnement ${systemTypeUpper}.`);
      }

      const objectNameForApi = `${objDef.alphaId}:${nomDeObjetBase}${objDef.nameSuffix}`;
      try {
        const createdAvatarObject = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        
        // --- [MODIFIÉ] Logique pour extraire et stocker URL et ID ---
        const mcUrlKey = `${objDef.key}_mcUrl`;
        const avatarIdKey = `${objDef.key}_AvatarID`;

        if (createdAvatarObject && createdAvatarObject.mcUrl) {
          finalOutput[mcUrlKey] = createdAvatarObject.mcUrl;
        } else if (createdAvatarObject && createdAvatarObject['@id']) {
          finalOutput[mcUrlKey] = getMcUrlForAvatar_(token, systemTypeUpper, createdAvatarObject['@id']);
        } else {
           throw new Error("La réponse de création d'avatar était invalide pour récupérer l'URL.");
        }

        if (createdAvatarObject && createdAvatarObject.id) {
          finalOutput[avatarIdKey] = createdAvatarObject.id;
        } else {
          throw new Error("La réponse de création d'avatar était invalide pour récupérer l'AvatarID.");
        }
        // --- Fin de la modification ---

        if (objDef.alphaId === "v0:OF_ELEC" && parsedProperties && Object.keys(parsedProperties).length > 0) {
          Logger.log(`Détection de l'objet OF_ELEC. Tentative d'ajout des propriétés.`);
          // --- [STANDARDISÉ] Utilisation de .id au lieu de .split().pop() ---
          const avatarId = createdAvatarObject.id;
          const propertiesPayload = Object.keys(parsedProperties).map(key => ({
            name: key, value: String(parsedProperties[key]), private: false
          }));
          addPropertiesToAvatar_(token, systemTypeUpper, avatarId, propertiesPayload);
          Logger.log(`Propriétés ajoutées avec succès à l'objet ${objectNameForApi}.`);
        }

      } catch (e) { 
        throw new Error(`Échec étape '${objDef.key}': ${e.message}`); 
      }
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
    const createdAvatarObject = createAvatar_(token, systemTypeUpper, objectNameForApi, alphaIdSpecifique, metadataAvatarTypeId);
    
    finalOutput.success = true;
    finalOutput.message = `Objet unique '${objectNameForApi}' créé.`;
    
    if (createdAvatarObject.mcUrl) {
      finalOutput.mcUrl = createdAvatarObject.mcUrl;
    } else {
      finalOutput.mcUrl = getMcUrlForAvatar_(token, systemTypeUpper, createdAvatarObject['@id']);
    }

    finalOutput.avatarApiIdPath = createdAvatarObject['@id'];
    finalOutput.avatarId = createdAvatarObject.id; // Ajout de l'ID simple pour plus de flexibilité
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

function getHistoriqueObjet360sc(typeSysteme, avatarId) {
  let finalOutput = { success: false, message: "", data: null };
  try {
    if (!typeSysteme || !avatarId) {
      throw new Error("Les paramètres 'typeSysteme' et 'avatarId' sont requis.");
    }
    
    const itemId = avatarId.includes('/') ? avatarId.split('/').pop() : avatarId;
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Demande d'historique pour l'avatar ID ${itemId}, système: ${systemTypeUpper}`);
    
    const token = getAuthToken_(systemTypeUpper);
    const historyData = getHistoryForItem_(token, systemTypeUpper, itemId);
    
    finalOutput.success = true;
    finalOutput.message = `Historique récupéré avec succès pour l'avatar ID ${itemId}.`;
    finalOutput.data = historyData;

  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur lors de la récupération de l'historique pour l'avatar ID ${avatarId}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur getHistoriqueObjet360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}

function creerObjetUnique360scForAppSheet(nomDeObjetBase, typeSysteme, typeMoule) {
  Logger.log(`Appel creerObjetUnique360scForAppSheet: nom=${nomDeObjetBase}, sys=${typeSysteme}, typeMoule=${typeMoule}`);
  const resultString = creerObjetUnique360sc(nomDeObjetBase, typeSysteme, "MOULE", typeMoule);
  try {
    const result = JSON.parse(resultString);
    if (result.success && result.mcUrl) { 
      return result.mcUrl; 
    } else { 
      return `ERREUR: ${result.error || result.message || 'Erreur inconnue.'}`; 
    }
  } catch (e) { 
    return `ERREUR CRITIQUE PARSING: ${e.message}.`; 
  }
}

function ajouterProprietesAvatar360sc(typeSysteme, avatarId, proprietes) {
  let finalOutput = { success: false, message: "" };
  try {
    if (!typeSysteme || !avatarId || typeof proprietes !== 'object' || Object.keys(proprietes).length === 0) {
      throw new Error("Les paramètres 'typeSysteme', 'avatarId', et 'proprietes' (objet non vide) sont requis.");
    }
    const systemTypeUpper = typeSysteme.toUpperCase();
    Logger.log(`Début de l'ajout de propriétés pour l'avatar ID ${avatarId}, sys: ${systemTypeUpper}`);
    
    const propertiesPayload = Object.keys(proprietes).map(key => ({
      name: key,
      value: String(proprietes[key]),
      private: false
    }));
    
    const token = getAuthToken_(systemTypeUpper);
    const updatedAvatar = addPropertiesToAvatar_(token, systemTypeUpper, avatarId, propertiesPayload);
    
    finalOutput.success = true;
    finalOutput.message = `Les propriétés ont été ajoutées avec succès à l'avatar ID ${avatarId}.`;
    finalOutput.avatar = updatedAvatar;

  } catch (error) {
    finalOutput.success = false;
    finalOutput.message = `Erreur lors de l'ajout de propriétés à l'avatar ID ${avatarId}.`;
    finalOutput.error = error.message;
    finalOutput.details_stack = error.stack ? error.stack.substring(0, 500) : 'N/A';
    Logger.log(`Erreur ajouterProprietesAvatar360sc: ${finalOutput.error}`);
  }
  return JSON.stringify(finalOutput);
}
// <!-- END OF FILE: Code.gs -->