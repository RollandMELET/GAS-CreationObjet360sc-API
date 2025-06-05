// FILENAME: config.gs
// Version: 1.1.3
// Date: 2025-06-01 19:30
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de l'ID Finger spécifique pour l'environnement TEST.
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// Common settings for the API (celles qui sont vraiment communes)
const COMMON_API_SETTINGS = {
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  MCS_SUFFIX_PATH: "/m_cs"
};

// Metadata Avatar Type IDs
const METADATA_AVATAR_TYPES = {
  OF: "/api/metadata_avatar_types/6840002e05ac2",
  MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
  DEFAULT: "/api/metadata_avatar_types/68309961b20ee" // Fallback
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    COMPANY_ID: "/api/companies/683097e698355",
    GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487" // Spécifique à DEV
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    COMPANY_ID: "/api/companies/683fff330baf4",
    GENERATE_MC_FINGER: "6364149b51f85" // ID Finger pour TEST (Option 1: ID simple)
                                        // Si cela ne fonctionne pas, essayer "/api/fingers/6364149b51f85"
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    COMPANY_ID: "VOTRE_ID_COMPANIE_PROD", // À REMPLACER
    GENERATE_MC_FINGER: "VOTRE_MC_FINGER_ID_POUR_PROD" // À REMPLACER
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