// FILENAME: config.gs
// Version: 1.5.0
// Date: 2025-06-07 10:30 // Modifié pour la date actuelle
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout de USERS_ENDPOINT pour la création d'utilisateurs.
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// Common settings for the API
const COMMON_API_SETTINGS = {
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  USERS_ENDPOINT: "/api/v2/users", // Nouvel endpoint pour les utilisateurs
  MCS_SUFFIX_PATH: "/m_cs"
};

// --- MAPPING SPÉCIFIQUE POUR LES TYPES DE MOULES ---
// Fait le lien entre le type de moule choisi dans AppSheet et l'alphaId technique envoyé à l'API.
const ALPHA_ID_MAPPING = {
  // NOTE: Ces alphaId sont des exemples et doivent être confirmés ou adaptés.
  MouleEnveloppe: "v0:MOULE_ENVELOPPE",
  MouleToit: "v0:MOULE_TOIT",
  MouleDalle: "v0:MOULE_DALLE",
  Autre: "v0:MOULE_AUTRE" // Un alphaId générique pour les autres types
};

// Environment-specific configurations
const ENV_CONFIG = {
  DEV: {
    API_BASE_URL: "https://apiv2preprod.360sc.yt",
    COMPANY_ID: "/api/companies/683097e698355", // Cet ID sera utilisé pour l'utilisateur aussi
    GENERATE_MC_FINGER: "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/68309961b20ee",
      MOULE: "/api/metadata_avatar_types/68309a60e3f94",
      DEFAULT: "/api/metadata_avatar_types/683097e6c75c7"
    }
  },
  TEST: {
    API_BASE_URL: "https://apiv2.360sc.yt", // URL de base pour les utilisateurs sur TEST
    COMPANY_ID: "/api/companies/683fff330baf4", // Cet ID sera utilisé pour l'utilisateur aussi
    GENERATE_MC_FINGER: "/api/fingers/6364149b51f85",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/6840002e05ac2",
      MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
      DEFAULT: "/api/metadata_avatar_types/68309961b20ee"
    }
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt", // URL de base pour les utilisateurs sur PROD
    COMPANY_ID: "VOTRE_ID_COMPANIE_PROD", // Cet ID sera utilisé pour l'utilisateur aussi
    GENERATE_MC_FINGER: "VOTRE_MC_FINGER_ID_POUR_PROD",
    METADATA_AVATAR_TYPES: {
      OF: "VOTRE_METADATA_ID_OF_POUR_PROD",
      MOULE: "VOTRE_METADATA_ID_MOULE_POUR_PROD",
      DEFAULT: "VOTRE_METADATA_ID_DEFAULT_POUR_PROD"
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
  // Important: Assurez-vous que API_BASE_URL de ENV_CONFIG est utilisé, car il peut différer pour l'API /auth vs /api/v2/users
  // L'URL de base pour les utilisateurs est https://api.360sc.yt (sans "v2preprod" pour DEV dans votre exemple,
  // mais cela semble être une API unifiée pour /api/v2. Nous utiliserons API_BASE_URL tel que défini par environnement)
  // Votre exemple pour users utilisait `https://api.360sc.yt/api/v2/users` pour l'env TEST (companyId: 683fff330baf4)
  // qui correspond à `API_BASE_URL` de TEST. 
  // Si DEV devait utiliser `https://api.360sc.yt` pour `/api/v2/users` et `https://apiv2preprod.360sc.yt` pour le reste,
  // la logique de getConfiguration_ ou la structure de ENV_CONFIG devrait être adaptée.
  // Pour l'instant, on suppose que `API_BASE_URL` est le même pour tous les endpoints d'un environnement donné.
  return { ...COMMON_API_SETTINGS, ...envSpecificConfig };
}

// Définition des types d'objets à créer (structure de base pour OF)
const OBJECT_DEFINITIONS = [
  { key: "PAC_360scID", alphaId: "v0:OF_PRINCIPAL", nameSuffix: "" },
  { key: "PAC_360scID_ENV", alphaId: "v0:OF_ENVELOPPE", nameSuffix: "-ENV" },
  { key: "PAC_360scID_DALLE", alphaId: "v0:OF_DALLE", nameSuffix: "-DALLE" },
  { key: "PAC_360scID_TOIT", alphaId: "v0:OF_TOIT", nameSuffix: "-TOIT" },
  { key: "PAC_360scID_ELEC", alphaId: "v0:OF_ELEC", nameSuffix: "-ELEC" }
];