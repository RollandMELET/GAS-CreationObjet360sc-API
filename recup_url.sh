#!/bin/bash

# --- Déclaration des Variables ---

# 1. Votre Token d'authentification (REMPLACEZ CECI PAR VOTRE VRAI TOKEN)
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDg3OTg2ODcsImV4cCI6MTc0ODgwMjI4Nywicm9sZXMiOltdLCJ1c2VybmFtZSI6IjM2MHNjX0R1aGFsZGUiLCJ1c2VyX2lkIjoxMzk0LCJlbWFpbCI6ImFkbWluLUR1aGFsZGVAMzYwc2MuaW8iLCJjb21wYW55X2lkIjoiNjgzMDk3ZTY5ODM1NSIsImNvbXBhbnlfbmFtZSI6IkR1aGFsZGUiLCJpc19hbm9ueW1vdXMiOmZhbHNlLCJjb21wYW55X2lkX2ZhY3R1cmF0aW9uIjoiZHVoYWxkZSIsImNvbXBhbnlfY2F0ZWdvcmllcyI6WzFdfQ.RlIjjIZQiuwnn3Qhts22qu40KtZ2RCXrbwmeY8O3jJh6MLiWGJjN3wEXSQDO4pPnj_6c5Da6A-HyUc-2lxzZ6SHeSo-FLjMRk7TxYnNqCfF7-DpENcnJxX6evWnViNddtWNxhYAf8wkTSzcNNSz-_ENOjlrd1bzSZAECvvsj3_U993xpoo6GFsWh6s1Me_B6lL7bTfhWNZd7kLXtjnYJelpTL5QcH-OKqSg0cAPuX87fgTmMAB3TJ-tn0rhNE5tp4OU18D6rLoXE1ypYdXNqTKH_iliE5tKHdMnZfq2NVk2gNyR-pQx6XIPf-lYAngY0jUlhwcVpoDmlbyLN2h1AXV_dqrCpAHyN1l3LPLUU1DCi6nsn06h8UI1TbwlXAU0AnTdR9wI13_jwYYAEjeaZlSpFsLMetZ6-QRjflYsl_3qNSBakHCYVOE7s-SAyeYTvIog_zukTxLfpBqqHWUX8WwW3oLJPXtf3b8HO50me4ARD2WNcnefxn107OYFpiH6gGA_2cbOa54IjdTKcIsi34vd3MuYQdWB4eDeIen1Wjo2Ctw8tELmb2Xw6NE8q_GM18t4VDE0gixEdXPy7ktYaFt4yTg7Twd5aa8KWVyhqeA6_g6CXUK7ikm_lj5WMVYwhKU2phAh0pqRYSHdi7MBfjYHNYrH6ndkJe3vqQODbI48" # Le même token que pour la création

# 2. L'identifiant de l'avatar obtenu lors de la création
# Important: Prenez la valeur du champ "@id" de la réponse de création.
AVATAR_AT_ID="/api/avatars/683c8629689db" # << ASSUREZ-VOUS QUE C'EST LE BON ID DE VOTRE TEST

# 3. URL de base de l'API
API_BASE_URL="https://apiv2preprod.360sc.yt"

# 4. Suffixe spécifique
SUFFIX_PATH="/m_cs"

# 5. Construction de l'URL complète
FULL_URL="${API_BASE_URL}${AVATAR_AT_ID}${SUFFIX_PATH}"

# --- Exécution de la commande cURL ---

echo "Envoi de la requête GET à : ${FULL_URL}"
echo "Avec le token : ${TOKEN:0:20}..."

curl -X GET \
  "${FULL_URL}" \
  -H "Authorization: Bearer ${TOKEN}"

echo # Nouvelle ligne pour la lisibilité