# Security Policy

## Versions prises en charge

Nous prenons en charge les versions suivantes avec des mises à jour de sécurité :

| Version | Prise en charge     |
| ------- | ------------------ |
| 1.x     | ✅ Entièrement prise en charge |
| < 1.0   | ❌ Non prise en charge |

## Signaler une vulnérabilité

La sécurité de ce projet est importante pour nous. Si vous découvrez une vulnérabilité, nous apprécions votre aide pour la divulguer de manière responsable.

### Comment signaler

1. **NE PAS** créer une issue publique pour les problèmes de sécurité
2. Envoyez un rapport via [GitHub Security Advisories](https://github.com/[username]/hendrix-template-mvp/security/advisories/new)
3. Ou envoyez un email à : [security@yourcompany.com]

### Informations à inclure

Veuillez inclure autant d'informations que possible :

- Description de la vulnérabilité
- Étapes pour la reproduire
- Impact potentiel
- Versions affectées
- Suggestions de correction (si vous en avez)

### Délais de réponse

- **Accusé de réception** : Sous 48 heures
- **Évaluation initiale** : Sous 7 jours
- **Correction et publication** : Selon la gravité
  - Critique : 24-48 heures
  - Élevée : 1-2 semaines
  - Moyenne/Faible : 2-4 semaines

### Processus de divulgation

1. Nous confirmons la réception de votre rapport
2. Nous évaluons et reproduisons la vulnérabilité
3. Nous développons et testons une correction
4. Nous publions la correction
5. Nous publions un avis de sécurité avec les crédits appropriés

### Reconnaissance

Nous remercions les chercheurs en sécurité responsables et mentionnons leur contribution (avec permission).

## Bonnes pratiques de sécurité

### Pour les contributeurs

- Utilisez toujours les dernières versions des dépendances
- Exécutez `npm audit` régulièrement
- Ne committez jamais de secrets (clés API, mots de passe, etc.)
- Utilisez des variables d'environnement pour les données sensibles
- Activez l'authentification à deux facteurs sur GitHub

### Pour les utilisateurs

- Gardez vos dépendances à jour
- Utilisez des variables d'environnement pour les configurations
- Activez les alertes de sécurité Dependabot
- Examinez les dépendances avant l'installation
- Utilisez des secrets GitHub pour les déploiements

## Ressources

- [Guide de sécurité GitHub](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
