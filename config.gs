// FILENAME: config.gs
// Version: 1.1.1
// Date: 2025-06-01 17:30
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Mise à jour du COMPANY_ID pour l'environnement TEST.
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// Common settings for the API
const API_SETTINGS = {
  GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
  // METADATA_AVATAR_TYPE: "/api/metadata_avatar_types/68309961b20ee", // Devenu dynamique
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  MCS_SUFFIX_PATH: "/m_cs"
};

// Metadata Avatar Type IDs
const METADATA_AVATAR_TYPES = {
  OF: "/api/metadata_avatar_types/6840002e05ac2",
  MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
  DEFAULT: "/api/metadata_avatar_types/68309961b20ee" // Fallback, ancien type par défaut
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    COMPANY_ID: "/api/companies/683097e698355" // ID Duhalde en Dev (selon doc originale)
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    COMPANY_ID: "/api/companies/683fff330baf4" // COMPANY_ID pour TEST fourni par Rolland
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt", // URL mise à jour
    COMPANY_ID: "/api/companies/VOTRE_ID_COMPANIE_PROD" // À REMPLACER par le vrai ID PROD
  }
};

/**
 * Retrieves the configuration for the specified system type.
 * @param {string} typeSysteme "DEV", "TEST", ou "PROD".
 * @return {object} The configuration object for the system type.
 * @throws {Error} If the system type is invalid.
 */
function getConfiguration_(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase(); // Normalisation
  const config = ENV_CONFIG[systemTypeUpper];
  if (!config) {
    throw new Error(`Configuration non valide pour le type de système : ${typeSysteme}. Doit être "DEV", "TEST", ou "PROD".`);
  }
  // Merge common settings with environment-specific settings
  return { ...API_SETTINGS, ...config };
}

// --- Définition des types d'objets à créer (structure de base) ---
// Le type d'avatar (OF, MOULE) sera appliqué globalement à ces 5 objets lors d'un appel.
const OBJECT_DEFINITIONS = [
  { key: "PAC_360scID", alphaId: "v0:OF_PRINCIPAL", nameSuffix: "" },
  { key: "PAC_360scID_ENV", alphaId: "v0:OF_ENVELOPPE", nameSuffix: "-ENV" },
  { key: "PAC_360scID_DALLE", alphaId: "v0:OF_DALLE", nameSuffix: "-DALLE" },
  { key: "PAC_360scID_TOIT", alphaId: "v0:OF_TOIT", nameSuffix: "-TOIT" },
  { key: "PAC_360scID_ELEC", alphaId: "v0:OF_ELEC", nameSuffix: "-ELEC" }
];