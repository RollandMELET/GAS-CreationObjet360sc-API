// FILENAME: config.gs
// Version: 1.3.0
// Date: 2025-06-06 12:25
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Mise à jour avec les METADATA_AVATAR_TYPES spécifiques à l'environnement DEV.
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// Common settings for the API
const COMMON_API_SETTINGS = {
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  MCS_SUFFIX_PATH: "/m_cs"
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    COMPANY_ID: "/api/companies/683097e698355",
    GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/68309961b20ee",
      MOULE: "/api/metadata_avatar_types/68309a60e3f94",
      DEFAULT: "/api/metadata_avatar_types/683097e6c75c7"
    }
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    COMPANY_ID: "/api/companies/683fff330baf4",
    GENERATE_MC_FINGER: "/api/fingers/6364149b51f85",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/6840002e05ac2",      // ID confirmé valide pour TEST
      MOULE: "/api/metadata_avatar_types/6840003b7c7b6",   // ID confirmé valide pour TEST
      DEFAULT: "/api/metadata_avatar_types/68309961b20ee" // ID confirmé valide pour TEST
    }
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    COMPANY_ID: "VOTRE_ID_COMPANIE_PROD",
    GENERATE_MC_FINGER: "VOTRE_MC_FINGER_ID_POUR_PROD",
    METADATA_AVATAR_TYPES: {
      // NOTE: Ces valeurs pour PROD devront être vérifiées de la même manière.
      OF: "VOTRE_METADATA_ID_OF_POUR_PROD",       // À REMPLACER
      MOULE: "VOTRE_METADATA_ID_MOULE_POUR_PROD", // À REMPLACER
      DEFAULT: "VOTRE_METADATA_ID_DEFAULT_POUR_PROD"  // À REMPLACER
    }
  }
};

/**
 * Retrieves the configuration for the specified system type.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @return {object} The configuration object for the system type.
 * @throws {Error} If the system type is invalid.
 */
function getConfiguration_(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  const envSpecificConfig = ENV_CONFIG[systemTypeUpper];
  if (!envSpecificConfig) {
    throw new Error(`Configuration non valide pour le type de système : ${typeSysteme}. Doit être "DEV", "TEST", ou "PROD".`);
  }
  return { ...COMMON_API_SETTINGS, ...envSpecificConfig };
}

// Définition des types d'objets à créer (structure de base)
const OBJECT_DEFINITIONS = [
  { key: "PAC_360scID", alphaId: "v0:OF_PRINCIPAL", nameSuffix: "" },
  { key: "PAC_360scID_ENV", alphaId: "v0:OF_ENVELOPPE", nameSuffix: "-ENV" },
  { key: "PAC_360scID_DALLE", alphaId: "v0:OF_DALLE", nameSuffix: "-DALLE" },
  { key: "PAC_360scID_TOIT", alphaId: "v0:OF_TOIT", nameSuffix: "-TOIT" },
  { key: "PAC_360scID_ELEC", alphaId: "v0:OF_ELEC", nameSuffix: "-ELEC" }
];