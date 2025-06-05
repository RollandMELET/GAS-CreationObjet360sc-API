# FILENAME: creer_avatar.sh
# Version: 1.0.0
# Date: 2025-06-01 17:00
# Author: Rolland MELET (Initial version)
# Description: Script shell pour créer un avatar via l'API 360sc (test manuel).
#!/bin/bash

# --- Déclaration des Variables ---

# 1. Votre Token d'authentification (REMPLACEZ CECI PAR VOTRE VRAI TOKEN pour l'environnement cible)
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDg3OTQxNDIsImV4cCI6MTc0ODc5Nzc0Miwicm9sZXMiOltdLCJ1c2VybmFtZSI6IjM2MHNjX0R1aGFsZGUiLCJ1c2VyX2lkIjoxMzk0LCJlbWFpbCI6ImFkbWluLUR1aGFsZGVAMzYwc2MuaW8iLCJjb21wYW55X2lkIjoiNjgzMDk3ZTY5ODM1NSIsImNvbXBhbnlfbmFtZSI6IkR1aGFsZGUiLCJpc19hbm9ueW1vdXMiOmZhbHNlLCJjb21wYW55X2lkX2ZhY3R1cmF0aW9uIjoiZHVoYWxkZSIsImNvbXBhbnlfY2F0ZWdvcmllcyI6WzFdfQ.QwIu5esafYagLyhiquc_NYCUIwErUuzHOX_ZtaQhwxFiRrnkZh-1K-oeVnR7ZHCC8YgiEcxTIwYBhYHKWhiawWpCIlII1W5dF9dWXikmkRRJwlasLU55HfOtc0CS-NtqYZPv7agN7MuPIQpa8WSlXJJiB3WZsoVd_yKGzT0pKzQpdSaqREevdL7VJ59tBQf1R-AXJQQCICfUG3xY8up47u8kbIowqbjIgfXWaHhXE3ruecD9A6KB4tCUZ74sJV1toBYDn0hON-G-aZKHFPUhb_x64zTbzVwwB7XOtUz8T3Zmliv9rsl6x23nCff0J42seIOsF0CRBLAcweWSxL-EcLFEO5MywCsyA2MvrB2PNZZiyj92TWN1T9_IaL5ay9L_ZocEOO2XQzIWKJy5oo-k3SV8yvZyzodXMSWjckodCRE7gbyqFd14_io_Wze0wsEeauqq6gQBttAs4dWkYNOX-I2q0hhnsiA2UeHMwwKbngxKj4JLg6Pyqyug_zzKgQU6UTo2ZkoK3jVJu6sjugTaEUDVHwUFIpxQ_9k6RnsMiu8FqIi66XqLLBuI0TVrsS4jyrVFzMtWB3bRWf7C-9xQqFLAm47v6Ls4ec0pp3pVtOLol3qpdAWnoQzvqOPhPjbYVhjvQmWgP6ambxYBDPjq4s1I8tcSePcUTpx-4Eu0p5I"

# 2. URL de l'endpoint de l'API (adaptez apiv2preprod ou apiv2 selon l'environnement du token)
API_URL="https://apiv2preprod.360sc.yt/api/avatars" # ou https://apiv2.360sc.yt/api/avatars pour TEST/PROD

# 3. ID de déduplication (généré dynamiquement)
DEDUPLICATION_ID="test-avatar-$(date +%s)-$$"

# 4. Corps de la requête JSON
# Adaptez "company", "metadataAvatarType" et l'URL de l'API en fonction de l'environnement TEST/PROD si besoin.
JSON_PAYLOAD='{
    "name": "v0:OF_PRINCIPAL:TestBashShell",
    "alphaId": "v0:OF_PRINCIPAL",
    "generateMCFinger": "/api/fingers/53ad7037-b20f-11ea-9cf3-00505692e487",
    "generateMCQuantity": 1,
    "company": "/api/companies/683097e698355", /* Adaptez si TEST (/api/companies/683fff330baf4) ou PROD */
    "metadataAvatarType": "/api/metadata_avatar_types/6840002e05ac2" /* ID pour "OF", adaptez pour "MOULE" (6840003b7c7b6) ou autre */
}'

# --- Exécution de la commande cURL ---

echo "Envoi de la requête à : ${API_URL}"
echo "Avec le token : ${TOKEN:0:20}..."
echo "Avec l'ID de déduplication : ${DEDUPLICATION_ID}"
echo "Avec le payload : ${JSON_PAYLOAD}"

curl -X POST \
  "${API_URL}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "x-deduplication-id: ${DEDUPLICATION_ID}" \
  -d "${JSON_PAYLOAD}"

echo