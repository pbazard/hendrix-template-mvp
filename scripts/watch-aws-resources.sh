#!/bin/bash

# Script de surveillance des changements AWS Resources
# Ce script surveille les changements dans amplify_outputs.json et peut être utilisé 
# pour déclencher une mise à jour automatique des ressources affichées

AMPLIFY_CONFIG_FILE="/workspaces/qrartistry-mvp/amplify_outputs.json"
LAST_MODIFIED_FILE="/tmp/.aws-resources-last-modified"

# Fonction pour obtenir la date de modification du fichier
get_file_modified_time() {
    if [ -f "$1" ]; then
        stat -c %Y "$1" 2>/dev/null || stat -f %m "$1" 2>/dev/null
    else
        echo "0"
    fi
}

# Fonction pour envoyer une notification de changement
notify_resource_change() {
    echo "$(date): AWS Resources configuration changed - $1"
    
    # Ici, vous pourriez ajouter d'autres notifications :
    # - Webhook vers votre application
    # - Notification Slack
    # - Email
    # - Mise à jour d'un cache Redis
    
    # Exemple d'appel API local pour déclencher un refresh
    # curl -X POST http://localhost:3000/api/aws-resources/refresh
}

# Fonction principale de surveillance
watch_aws_resources() {
    echo "Démarrage de la surveillance des ressources AWS..."
    echo "Fichier surveillé: $AMPLIFY_CONFIG_FILE"
    
    # Obtenir la dernière modification connue
    last_known_modified="0"
    if [ -f "$LAST_MODIFIED_FILE" ]; then
        last_known_modified=$(cat "$LAST_MODIFIED_FILE")
    fi
    
    while true; do
        current_modified=$(get_file_modified_time "$AMPLIFY_CONFIG_FILE")
        
        if [ "$current_modified" != "$last_known_modified" ]; then
            echo "$current_modified" > "$LAST_MODIFIED_FILE"
            
            if [ "$last_known_modified" != "0" ]; then
                notify_resource_change "amplify_outputs.json updated"
                
                # Analyser les changements si possible
                if command -v jq >/dev/null 2>&1 && [ -f "$AMPLIFY_CONFIG_FILE" ]; then
                    echo "Nouvelles ressources détectées:"
                    
                    # Afficher les ressources Cognito
                    auth_user_pool=$(jq -r '.auth.user_pool_id // "N/A"' "$AMPLIFY_CONFIG_FILE")
                    if [ "$auth_user_pool" != "N/A" ]; then
                        echo "  - Cognito User Pool: $auth_user_pool"
                    fi
                    
                    # Afficher les ressources AppSync
                    data_url=$(jq -r '.data.url // "N/A"' "$AMPLIFY_CONFIG_FILE")
                    if [ "$data_url" != "N/A" ]; then
                        echo "  - AppSync GraphQL API: $data_url"
                    fi
                    
                    # Afficher les ressources S3
                    storage_bucket=$(jq -r '.storage.bucket_name // "N/A"' "$AMPLIFY_CONFIG_FILE")
                    if [ "$storage_bucket" != "N/A" ]; then
                        echo "  - S3 Bucket: $storage_bucket"
                    fi
                fi
            fi
            
            last_known_modified="$current_modified"
        fi
        
        # Attendre 5 secondes avant la prochaine vérification
        sleep 5
    done
}

# Fonction pour générer un rapport des ressources actuelles
generate_resources_report() {
    echo "=== Rapport des Ressources AWS ==="
    echo "Date: $(date)"
    echo ""
    
    if [ -f "$AMPLIFY_CONFIG_FILE" ]; then
        echo "Configuration Amplify trouvée: $AMPLIFY_CONFIG_FILE"
        echo "Dernière modification: $(date -r "$AMPLIFY_CONFIG_FILE" 2>/dev/null || echo "Inconnue")"
        echo ""
        
        if command -v jq >/dev/null 2>&1; then
            echo "Ressources détectées:"
            
            # Authentification
            echo "  Auth:"
            jq -r '.auth | to_entries[] | "    \(.key): \(.value)"' "$AMPLIFY_CONFIG_FILE" 2>/dev/null || echo "    Aucune ressource d'auth détectée"
            
            # Données
            echo "  Data:"
            jq -r '.data | to_entries[] | "    \(.key): \(.value)"' "$AMPLIFY_CONFIG_FILE" 2>/dev/null || echo "    Aucune ressource de données détectée"
            
            # Stockage
            echo "  Storage:"
            jq -r '.storage | to_entries[] | "    \(.key): \(.value)"' "$AMPLIFY_CONFIG_FILE" 2>/dev/null || echo "    Aucune ressource de stockage détectée"
            
        else
            echo "jq non installé - impossible d'analyser le contenu JSON"
        fi
    else
        echo "Aucun fichier de configuration Amplify trouvé"
        echo "Vérifiez que Amplify est correctement configuré"
    fi
    
    echo ""
    echo "=== Fin du rapport ==="
}

# Interface en ligne de commande
case "${1:-watch}" in
    "watch")
        watch_aws_resources
        ;;
    "report")
        generate_resources_report
        ;;
    "check")
        if [ -f "$AMPLIFY_CONFIG_FILE" ]; then
            echo "Configuration Amplify: ✓ Trouvée"
            echo "Dernière modification: $(date -r "$AMPLIFY_CONFIG_FILE" 2>/dev/null || echo "Inconnue")"
        else
            echo "Configuration Amplify: ✗ Non trouvée"
            echo "Lancez 'amplify push' pour créer les ressources"
        fi
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  watch   - Surveiller en continu les changements (défaut)"
        echo "  report  - Générer un rapport des ressources actuelles"
        echo "  check   - Vérifier l'état de la configuration"
        echo "  help    - Afficher cette aide"
        echo ""
        echo "Exemples:"
        echo "  $0 watch   # Surveiller les changements"
        echo "  $0 report  # Générer un rapport"
        echo "  $0 check   # Vérifier la configuration"
        ;;
    *)
        echo "Commande inconnue: $1"
        echo "Utilisez '$0 help' pour voir les commandes disponibles"
        exit 1
        ;;
esac
