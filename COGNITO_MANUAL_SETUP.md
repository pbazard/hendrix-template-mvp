# Configuration Manuelle des Groupes Cognito

Si vous ne pouvez pas utiliser AWS CLI, suivez ce guide pour configurer manuellement les groupes Cognito via la console AWS.

## 🔐 Étape 1 : Accéder à la Console AWS Cognito

1. Connectez-vous à la [Console AWS](https://aws.amazon.com/console/)
2. Naviguez vers **Cognito** dans les services
3. Sélectionnez **User Pools**
4. Cliquez sur votre User Pool : `eu-west-1_7muhJha11`

## 👥 Étape 2 : Créer les Groupes

### Groupe Administrators

1. Dans le menu de gauche, cliquez sur **Groups**
2. Cliquez sur **Create group**
3. Remplissez les informations :
   - **Group name** : `Administrators`
   - **Description** : `Administrateurs avec accès complet à l'interface d'administration`
   - **Precedence** : `1`
   - **IAM role** : Laissez vide (optionnel)
4. Cliquez sur **Create group**

### Groupe Staff

1. Cliquez à nouveau sur **Create group**
2. Remplissez les informations :
   - **Group name** : `Staff`
   - **Description** : `Personnel avec accès limité à l'interface d'administration`
   - **Precedence** : `2`
   - **IAM role** : Laissez vide (optionnel)
3. Cliquez sur **Create group**

### Groupe Moderators

1. Cliquez à nouveau sur **Create group**
2. Remplissez les informations :
   - **Group name** : `Moderators`
   - **Description** : `Modérateurs avec permissions spécifiques`
   - **Precedence** : `3`
   - **IAM role** : Laissez vide (optionnel)
3. Cliquez sur **Create group**

## 👤 Étape 3 : Ajouter des Utilisateurs aux Groupes

### Créer un utilisateur test (si nécessaire)

1. Dans le menu de gauche, cliquez sur **Users**
2. Cliquez sur **Create user**
3. Remplissez les informations :
   - **Username** : `admin@example.com`
   - **Email** : `admin@example.com`
   - **Temporary password** : Créez un mot de passe temporaire
   - **Send invitation** : Cochez si vous voulez envoyer un email
4. Cliquez sur **Create user**

### Ajouter l'utilisateur au groupe Administrators

1. Dans la liste des utilisateurs, cliquez sur votre utilisateur
2. Allez dans l'onglet **Groups**
3. Cliquez sur **Add user to group**
4. Sélectionnez **Administrators**
5. Cliquez sur **Add**

## 🔧 Étape 4 : Vérification

### Vérifier les groupes créés

1. Retournez dans **Groups**
2. Vous devriez voir vos 3 groupes :
   - Administrators (Precedence: 1)
   - Staff (Precedence: 2)
   - Moderators (Precedence: 3)

### Vérifier l'appartenance aux groupes

1. Allez dans **Users**
2. Cliquez sur votre utilisateur test
3. Dans l'onglet **Groups**, vérifiez qu'il appartient bien au groupe **Administrators**

## 🚀 Étape 5 : Test de l'Interface

1. Démarrez votre application : `npm run dev`
2. Accédez à : `http://localhost:3000/admin/test`
3. Lancez les tests automatiques
4. Connectez-vous avec votre utilisateur test
5. Accédez à : `http://localhost:3000/admin`

## 📋 Structure des Permissions

### Administrators
- ✅ Accès complet à toutes les fonctionnalités
- ✅ Gestion des utilisateurs
- ✅ Gestion des groupes
- ✅ Accès au journal d'audit
- ✅ Configuration du système

### Staff
- ✅ Accès limité selon la configuration des modèles
- ✅ Gestion des contenus
- ❌ Gestion des utilisateurs (selon configuration)
- ✅ Accès en lecture au journal d'audit

### Moderators
- ✅ Permissions de modération
- ✅ Gestion des contenus signalés
- ❌ Gestion des utilisateurs
- ✅ Actions de modération spécifiques

## ⚠️ Dépannage

### Erreur "Accès non autorisé"
- Vérifiez que l'utilisateur appartient bien à un des groupes autorisés
- Assurez-vous que les noms des groupes correspondent exactement : `Administrators`, `Staff`, `Moderators`

### L'utilisateur n'apparaît pas dans l'interface
- Vérifiez la configuration dans `amplify_outputs.json`
- Assurez-vous que l'utilisateur est confirmé (statut `CONFIRMED`)

### Erreurs de compilation
- Installez les dépendances manquantes :
  ```bash
  npm install @aws-sdk/client-cognito-identity-provider @radix-ui/react-dropdown-menu
  ```

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs de la console de développement
2. Assurez-vous que la configuration Cognito est correcte
3. Testez avec un utilisateur différent
4. Consultez la documentation AWS Cognito

## 🔄 Automatisation Future

Une fois que vous avez configuré manuellement, vous pouvez automatiser ces étapes avec :

- **AWS CDK** pour l'infrastructure as code
- **Terraform** pour la gestion des ressources
- **Scripts AWS CLI** pour les opérations répétitives

Cette configuration manuelle vous donne une base solide pour comprendre la structure des permissions de l'interface d'administration Hendrix.
