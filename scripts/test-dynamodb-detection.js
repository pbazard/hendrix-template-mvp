#!/usr/bin/env node

/**
 * Script de test pour vérifier la détection des tables DynamoDB
 */

const fs = require('fs');
const path = require('path');

// Charger le fichier amplify_outputs.json
const amplifyConfigPath = path.join(__dirname, '..', 'amplify_outputs.json');

console.log('🔍 Test de détection des ressources DynamoDB');
console.log('='.repeat(50));

try {
  // Charger la configuration
  const amplifyConfig = JSON.parse(fs.readFileSync(amplifyConfigPath, 'utf8'));
  
  console.log('✅ Configuration Amplify chargée');
  console.log(`📍 Région: ${amplifyConfig.data?.aws_region || amplifyConfig.data?.region || 'N/A'}`);
  
  // Vérifier la présence de model_introspection
  if (amplifyConfig.data?.model_introspection?.models) {
    const models = amplifyConfig.data.model_introspection.models;
    console.log(`📊 Modèles trouvés: ${Object.keys(models).length}`);
    
    Object.entries(models).forEach(([modelName, modelInfo]) => {
      console.log(`\n🗃️  Modèle: ${modelName}`);
      console.log(`   ├── Champs: ${Object.keys(modelInfo.fields).length}`);
      console.log(`   ├── Nom pluriel: ${modelInfo.pluralName}`);
      console.log(`   ├── Synchronisable: ${modelInfo.syncable}`);
      console.log(`   └── Clé primaire: ${modelInfo.primaryKeyInfo?.primaryKeyFieldName || 'id'}`);
      
      // Simuler la génération du nom de table
      const tableName = `${modelName}-dev`; // Logique simplifiée
      console.log(`   📋 Nom de table probable: ${tableName}`);
      
      // Générer l'ARN
      const region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || 'us-east-1';
      const arn = `arn:aws:dynamodb:${region}:*:table/${tableName}`;
      console.log(`   🏷️  ARN: ${arn}`);
    });
  } else {
    console.log('❌ Aucun modèle trouvé dans model_introspection');
  }
  
  // Vérifier les autres ressources
  console.log('\n🔍 Autres ressources détectées:');
  
  if (amplifyConfig.auth?.user_pool_id) {
    console.log(`✅ Cognito User Pool: ${amplifyConfig.auth.user_pool_id}`);
  }
  
  if (amplifyConfig.auth?.identity_pool_id) {
    console.log(`✅ Cognito Identity Pool: ${amplifyConfig.auth.identity_pool_id}`);
  }
  
  if (amplifyConfig.data?.url) {
    const apiId = amplifyConfig.data.url.split('/')[2].split('.')[0];
    console.log(`✅ AppSync GraphQL API: ${apiId}`);
  }
  
  if (amplifyConfig.storage?.bucket_name) {
    console.log(`✅ S3 Bucket: ${amplifyConfig.storage.bucket_name}`);
  }
  
} catch (error) {
  console.error('❌ Erreur lors du chargement de la configuration:', error.message);
  
  // Suggérer des solutions
  console.log('\n🛠️  Solutions possibles:');
  console.log('1. Vérifiez que amplify_outputs.json existe');
  console.log('2. Lancez "amplify push" pour régénérer la configuration');
  console.log('3. Vérifiez les permissions du fichier');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Test terminé');
