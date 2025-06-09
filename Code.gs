// FILENAME: Code.gs
// Version: 1.22.0
// Date: 2025-06-10 10:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de la capacité à passer des propriétés à l'objet OF-ELEC lors de la création multiple.
/**
 * @fileoverview Fichier principal contenant les fonctions exposées et appelables par des services externes comme AppSheet.
 * Ce fichier se concentre sur la création d'objets (Avatars). La logique de gestion des utilisateurs est dans `users.gs`.
 */

// CHANGEMENT: Ajout du paramètre optionnel 'proprietesElec'
function creerMultiplesObjets360sc(nomDeObjetBase, typeSysteme, typeObjet, proprietesElec) {
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
        const createdAvatarObject = createAvatar_(token, systemTypeUpper, objectNameForApi, objDef.alphaId, metadataAvatarTypeId);
        
        // Gère la nouvelle réponse de l'API
        if (createdAvatarObject && createdAvatarObject.mcUrl) {
          finalOutput[objDef.key] = createdAvatarObject.mcUrl;
        } else if (createdAvatarObject && createdAvatarObject['@id']) {
          finalOutput[objDef.key] = getMcUrlForAvatar_(token, systemTypeUpper, createdAvatarObject['@id']);
        } else {
           throw new Error("La réponse de création d'avatar était invalide.");
        }

        // CHANGEMENT: Logique pour ajouter des propriétés à l'objet OF-ELEC
        if (objDef.alphaId === "v0:OF_ELEC" && proprietesElec && typeof proprietesElec === 'object' && Object.keys(proprietesElec).length > 0) {
          Logger.log(`Détection de l'objet OF_ELEC. Tentative d'ajout des propriétés.`);
          
          const avatarId = createdAvatarObject['@id'].split('/').pop(); // Extrait l'ID de l'IRI
          const propertiesPayload = Object.keys(proprietesElec).map(key => ({
            name: key,
            value: String(proprietesElec[key]),
            private: false
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