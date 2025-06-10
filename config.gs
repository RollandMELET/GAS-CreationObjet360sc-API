// FILENAME: config.gs
// Version: 1.10.0
// Date: 2025-06-10 11:50
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Refactoring majeur pour gérer des metadataAvatarType spécifiques pour chaque sous-objet OF. OBJECT_DEFINITIONS est maintenant une fonction getObjectDefinitions_.
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// --- MAPPING DES PROFILS UTILISATEUR ---
const ROLE_MAPPING = {
  "Admin":             ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"], 
  "BOSS":              ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"],
  "Duhalde":           ["ROLE_USER", "ROLE_DUHALDETEST"], 
  "Operateur":         ["ROLE_USER", "ROLE_OPERATEUR"],
  "ControleurQualite": ["ROLE_USER", "ROLE_CONTROLEUR_QUALITE"],
  "Levageur":          null,
  "Transporteur":      null,
  "Client":            null
};

// Common settings for the API
const COMMON_API_SETTINGS = {
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  USERS_ENDPOINT_V2: "/api/v2/users",
  USERS_ENDPOINT_V1: "/api/users",
  MCS_SUFFIX_PATH: "/m_cs"
};

// --- MAPPING SPÉCIFIQUE POUR LES TYPES DE MOULES ---
const ALPHA_ID_MAPPING = {
  MouleEnveloppe: "v0:MOULE_ENVELOPPE",
  MouleToit: "v0:MOULE_TOIT",
  MouleDalle: "v0:MOULE_DALLE",
  Autre: "v0:MOULE_AUTRE"
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    USERS_API_BASE_URL: "https://api.360sc.yt", 
    COMPANY_ID: "/api/companies/683097e698355",
    GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
    METADATA_AVATAR_TYPES: {
      // Pour l'instant, on utilise le même ID pour les 3 types en DEV, comme demandé.
      OF_PRINCIPAL: "/api/metadata_avatar_types/68309961b20ee", // Placeholder
      OF_ELEC: "/api/metadata_avatar_types/68309961b20ee",      // Placeholder
      OF_COMPOSANT: "/api/metadata_avatar_types/68309961b20ee", // Placeholder
      MOULE: "/api/metadata_avatar_types/68309a60e3f94",
      DEFAULT: "/api/metadata_avatar_types/683097e6c75c7"
    }
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt", 
    USERS_API_BASE_URL: "https://api.360sc.yt",
    COMPANY_ID: "/api/companies/683fff330baf4",
    GENERATE_MC_FINGER: "/api/fingers/6364149b51f85",
    METADATA_AVATAR_TYPES: {
      // IDs spécifiques pour l'environnement de TEST
      OF_PRINCIPAL: "/api/metadata_avatar_types/6840002e05ac2",
      OF_ELEC: "/api/metadata_avatar_types/6847f9a0aa7ed",
      OF_COMPOSANT: "/api/metadata_avatar_types/6847f9be6e309", // Pour ENVELOPPE, TOIT, DALLE
      MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
      DEFAULT: "/api/metadata_avatar_types/68309961b20ee"
    }
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    USERS_API_BASE_URL: "https://api.360sc.yt",
    COMPANY_ID: "/api/companies/684468d6e74bb",
    GENERATE_MC_FINGER: "/api/fingers/684469bdb1ea0",
    METADATA_AVATAR_TYPES: {
      // Pour l'instant, on utilise le même ID pour les 3 types en PROD, comme demandé.
      OF_PRINCIPAL: "/api/metadata_avatar_types/684469d19d051", // Placeholder
      OF_ELEC: "/api/metadata_avatar_types/684469d19d051",      // Placeholder
      OF_COMPOSANT: "/api/metadata_avatar_types/684469d19d051", // Placeholder
      MOULE: "/api/metadata_avatar_types/684469e053ba5",
      DEFAULT: "/api/metadata_avatar_types/684469d19d051"
    }
  }
};

/**
 * Retrieves the configuration for the specified system type.
 */
function getConfiguration_(typeSysteme) {
  const systemTypeUpper = typeSysteme.toUpperCase();
  const envSpecificConfig = ENV_CONFIG[systemTypeUpper];
  if (!envSpecificConfig) {
    throw new Error(`Configuration non valide pour le type de système : ${typeSysteme}.`);
  }
  if (!envSpecificConfig.USERS_API_BASE_URL) {
    envSpecificConfig.USERS_API_BASE_URL = envSpecificConfig.API_BASE_URL;
  }
  return { ...COMMON_API_SETTINGS, ...envSpecificConfig };
}

/**
 * Construit la liste des définitions d'objets OF à créer,
 * en injectant les bons IDs de métadonnées selon l'environnement.
 * @param {string} typeSysteme - L'environnement (DEV, TEST, PROD).
 * @returns {Array<Object>} Le tableau des définitions d'objets.
 */
function getObjectDefinitions_(typeSysteme) {
  const config = getConfiguration_(typeSysteme);
  const metadataTypes = config.METADATA_AVATAR_TYPES;

  return [
    { key: "PAC_360scID",       alphaId: "v0:OF_PRINCIPAL", nameSuffix: "",         metadataId: metadataTypes.OF_PRINCIPAL },
    { key: "PAC_360scID_ENV",   alphaId: "v0:OF_ENVELOPPE", nameSuffix: "-ENV",   metadataId: metadataTypes.OF_COMPOSANT },
    { key: "PAC_360scID_DALLE", alphaId: "v0:OF_DALLE",     nameSuffix: "-DALLE", metadataId: metadataTypes.OF_COMPOSANT },
    { key: "PAC_360scID_TOIT",  alphaId: "v0:OF_TOIT",      nameSuffix: "-TOIT",  metadataId: metadataTypes.OF_COMPOSANT },
    { key: "PAC_360scID_ELEC",  alphaId: "v0:OF_ELEC",      nameSuffix: "-ELEC",  metadataId: metadataTypes.OF_ELEC }
  ];
}