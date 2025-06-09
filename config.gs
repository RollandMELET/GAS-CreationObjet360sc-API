// FILENAME: config.gs
// Version: 1.7.0
// Date: 2025-06-09 10:25
// Author: Rolland MELET (Collaboratively with AI Senior Coder)
// Description: Ajout des configurations pour l'environnement de Production (PROD).
/**
 * @fileoverview Configuration settings for the 360sc API interaction script.
 */

// --- MAPPING DES PROFILS UTILISATEUR ---
// Fait le lien entre le profil choisi dans AppSheet et les rôles techniques de l'API.
// IMPORTANT : Les listes de rôles techniques ci-dessous sont des hypothèses et DOIVENT être confirmées.
const ROLE_MAPPING = {
  // Profils à activer
  "Admin":             ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"], 
  "BOSS":              ["ROLE_USER", "ROLE_ADMIN", "ROLE_DUHALDETEST"], // Supposé identique à Admin
  "Duhalde":           ["ROLE_USER", "ROLE_DUHALDETEST"], 
  "Operateur":         ["ROLE_USER", "ROLE_OPERATEUR"],
  "ControleurQualite": ["ROLE_USER", "ROLE_CONTROLEUR_QUALITE"], // Clé sans accent pour la sécurité

  // Profils configurés comme non activables pour le moment
  "Levageur":          null,
  "Transporteur":      null,
  "Client":            null
};


// Common settings for the API
const COMMON_API_SETTINGS = {
  GENERATE_MC_QUANTITY: 1,
  AUTH_ENDPOINT: "/auth",
  AVATARS_ENDPOINT: "/api/avatars",
  USERS_ENDPOINT: "/api/v2/users", 
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
      OF: "/api/metadata_avatar_types/6840002e05ac2",
      MOULE: "/api/metadata_avatar_types/6840003b7c7b6",
      DEFAULT: "/api/metadata_avatar_types/68309961b20ee"
    }
  },
  PROD: {
    API_BASE_URL: "https://apiv2.360sc.yt", // SUPPOSITION - À CONFIRMER SI DIFFÉRENT
    COMPANY_ID: "/api/companies/684468d6e74bb",
    GENERATE_MC_FINGER: "/api/fingers/684469bdb1ea0",
    METADATA_AVATAR_TYPES: {
      OF: "/api/metadata_avatar_types/684469d19d051",
      MOULE: "/api/metadata_avatar_types/684469e053ba5",
      DEFAULT: "/api/metadata_avatar_types/684469d19d051" // SUPPOSITION: Default est le même que OF. À ajuster si nécessaire.
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

// Définition des types d'objets à créer (structure de base pour OF)
const OBJECT_DEFINITIONS = [
  { key: "PAC_360scID", alphaId: "v0:OF_PRINCIPAL", nameSuffix: "" },
  { key: "PAC_360scID_ENV", alphaId: "v0:OF_ENVELOPPE", nameSuffix: "-ENV" },
  { key: "PAC_360scID_DALLE", alphaId: "v0:OF_DALLE", nameSuffix: "-DALLE" },
  { key: "PAC_360scID_TOIT", alphaId: "v0:OF_TOIT", nameSuffix: "-TOIT" },
  { key: "PAC_360scID_ELEC", alphaId: "v0:OF_ELEC", nameSuffix: "-ELEC" }
];