// Configuration Amplify en dur comme fallback
// Ce fichier est généré automatiquement et peut être utilisé 
// si amplify_outputs.json n'est pas accessible

export const FALLBACK_AMPLIFY_CONFIG = {
  auth: {
    user_pool_id: "eu-west-1_7muhJha11",
    aws_region: "eu-west-1",
    user_pool_client_id: "1mgqpra2j31eam5l3vsrfi69mp",
    identity_pool_id: "eu-west-1:32ca1c31-e896-4f9b-a468-6b9dca1eccd1",
    mfa_methods: [],
    standard_required_attributes: ["email"],
    username_attributes: ["email"],
    user_verification_types: ["email"],
    groups: [],
    mfa_configuration: "NONE",
    password_policy: {
      min_length: 8,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: true,
      require_uppercase: true
    },
    unauthenticated_identities_enabled: true
  },
  data: {
    url: "https://6bprg7nwfjau7ickrvthl3gbjy.appsync-api.eu-west-1.amazonaws.com/graphql",
    aws_region: "eu-west-1",
    api_key: "da2-3oz4hmjulvdxdiwq3nm35hbcwu",
    default_authorization_type: "API_KEY",
    authorization_types: ["AMAZON_COGNITO_USER_POOLS", "AWS_IAM"],
    model_introspection: {
      version: 1,
      models: {
        Todo: {
          name: "Todo",
          fields: {
            id: {
              name: "id",
              isArray: false,
              type: "ID",
              isRequired: true,
              attributes: []
            },
            content: {
              name: "content",
              isArray: false,
              type: "String",
              isRequired: false,
              attributes: []
            },
            createdAt: {
              name: "createdAt",
              isArray: false,
              type: "AWSDateTime",
              isRequired: false,
              attributes: [],
              isReadOnly: true
            },
            updatedAt: {
              name: "updatedAt",
              isArray: false,
              type: "AWSDateTime",
              isRequired: false,
              attributes: [],
              isReadOnly: true
            }
          },
          syncable: true,
          pluralName: "Todos",
          attributes: [
            {
              type: "model",
              properties: {}
            },
            {
              type: "auth",
              properties: {
                rules: [
                  {
                    allow: "public",
                    provider: "apiKey",
                    operations: ["create", "update", "delete", "read"]
                  }
                ]
              }
            }
          ],
          primaryKeyInfo: {
            isCustomPrimaryKey: false,
            primaryKeyFieldName: "id",
            sortKeyFieldNames: []
          }
        }
      },
      enums: {},
      nonModels: {}
    }
  },
  version: "1.3"
};
