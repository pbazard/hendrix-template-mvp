#!/bin/bash

# Script de configuration des groupes Cognito pour l'interface d'administration Hendrix

set -e

# Variables de configuration
USER_POOL_ID="eu-west-1_7muhJha11"
AWS_REGION="eu-west-1"

echo "🚀 Configuration des groupes Cognito pour l'interface d'administration Hendrix"
echo "User Pool ID: $USER_POOL_ID"
echo "Region: $AWS_REGION"
echo ""

# Fonction pour créer un groupe
create_group() {
    local group_name=$1
    local description=$2
    local precedence=$3
    
    echo "Création du groupe: $group_name"
    
    aws cognito-idp create-group \
        --group-name "$group_name" \
        --user-pool-id "$USER_POOL_ID" \
        --description "$description" \
        --precedence "$precedence" \
        --region "$AWS_REGION" \
        2>/dev/null || echo "  Groupe $group_name existe déjà ou erreur lors de la création"
}

# Création des groupes pour l'administration
echo "📋 Création des groupes d'administration..."

create_group "Administrators" "Administrateurs avec accès complet à l'interface d'administration" 1
create_group "Staff" "Personnel avec accès limité à l'interface d'administration" 2
create_group "Moderators" "Modérateurs avec permissions spécifiques" 3

echo ""
echo "✅ Configuration des groupes terminée!"
echo ""

# Affichage des groupes créés
echo "📋 Groupes existants dans le User Pool:"
aws cognito-idp list-groups \
    --user-pool-id "$USER_POOL_ID" \
    --region "$AWS_REGION" \
    --query 'Groups[*].[GroupName,Description,Precedence]' \
    --output table 2>/dev/null || echo "Erreur lors de la liste des groupes"

echo ""
echo "🔧 Pour ajouter un utilisateur à un groupe, utilisez:"
echo "aws cognito-idp admin-add-user-to-group \\"
echo "    --user-pool-id $USER_POOL_ID \\"
echo "    --username <EMAIL_UTILISATEUR> \\"
echo "    --group-name <NOM_GROUPE> \\"
echo "    --region $AWS_REGION"
echo ""

echo "📖 Guide d'utilisation:"
echo "1. Administrators: Accès complet à toutes les fonctionnalités"
echo "2. Staff: Accès limité selon la configuration des modèles"
echo "3. Moderators: Permissions de modération"
echo ""

echo "🌐 Interface d'administration disponible sur: http://localhost:3000/admin"
