// FILENAME: Code.gs
// Version: 1.17.0
// Date: 2025-06-08 10:00
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Refactor: Moved all user-related functions to the new `users.gs` module for better separation of concerns.

/**
 * @fileoverview Fichier principal contenant les fonctions exposées et appelables par des services externes comme AppSheet.
 * Ce fichier se concentre sur la création d'objets (Avatars). La logique de gestion des utilisateurs est dans `users.gs`.
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