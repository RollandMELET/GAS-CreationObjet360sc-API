// <!-- START OF FILE: config.gs -->
// FILENAME: config.gs
// Version: 1.12.0
// Date: 2025-06-22 11:45
// Author: Rolland MELET & AI Senior Coder
// Description: Intégration du nouveau type d'objet "ETIQUETTE" et correction de la casse de la clé "AUTRE" dans ALPHA_ID_MAPPING.

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

// --- MAPPING SPÉCIFIQUE POUR LES SOUS-TYPES (alphaId) ---
const ALPHA_ID_MAPPING = {
  MouleEnveloppe: "v0:OF_ENVELOPPE",
  MouleToit: "v0:OF_TOIT",
  MouleDalle: "v0:OF_DALLE",
  AUTRE: "v0:MOULE_AUTRE",  // [CORRIGÉ] La clé est maintenant en majuscules.
  ETIQUETTE: "v0:ETIQUETTE" // [AJOUTÉ] Notre convention pour le nouvel alphaId.
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    USERS_API_BASE_URL: "https://api.360sc.yt", 
    COMPANY_ID: "/api/companies/683097e698355",
    GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
    METADATA_AVATAR_TYPES: {
      OF_PRINCIPAL: "/api/metadata_avatar_types/68309961b20ee",
      OF_ELEC: "/api/metadata_avatar_types/68309961b20ee",      
      OF_COMPOSANT: "/api/metadata_avatar_types/68309961b20ee",
      MOULE: "/api/metadata_avatar_types/68309a60e3f94",
      DEFAULT: "/api/metadata_avatar_types/683097e6c75c7",
      ETIQUETTE: "/api/metadata_avatar_types/6857ca820fb47" // [AJOUTÉ] Placeholder : ID de TEST utilisé pour DEV en l'absence de valeur.
    }
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt", 
    USERS_API_BASE_URL: "https://api.360sc.yt",
    COMPANY_ID: "/api/companies/683fff330baf4",
    GENERATE_MC_FINGER: "/api/fingers/684469bdb1ea0",
    METADATA_AVATAR_TYPES: {
      OF_PRINCIPAL: "/api/metadata_avatar_types/6840002e05ac2",
      OF_ELEC: "/api/metadata_avatar_types/6847f9a0aa7ed",
      OF_COMPOSANT: "/api/metadata_avatar_types/6847f9be6e309",
      MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
      DEFAULT: "/api/metadata_avatar_types/68309961b20ee",
      ETIQUETTE: "/api/metadata_avatar_types/6857ca820fb47" // [AJOUTÉ] ID fourni pour TEST.
    }
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt",
    USERS_API_BASE_URL: "https://api.360sc.yt",
    COMPANY_ID: "/api/companies/684468d6e74bb",
    GENERATE_MC_FINGER: "/api/fingers/684469bdb1ea0",
    METADATA_AVATAR_TYPES: {
      OF_PRINCIPAL: "/api/metadata_avatar_types/684469d19d051", 
      OF_ELEC: "/api/metadata_avatar_types/68488d1af19e8",
      OF_COMPOSANT: "/api/metadata_avatar_types/68488cd628176",
      MOULE: "/api/metadata_avatar_types/684469e053ba5",
      DEFAULT: "/api/metadata_avatar_types/684469d19d051",
      ETIQUETTE: "/api/metadata_avatar_types/6857ca94cca78" // [AJOUTÉ] ID fourni pour PROD.
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
 * Construit la liste des définitions d'objets OF à créer.
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
// <!-- END OF FILE: config.gs -->