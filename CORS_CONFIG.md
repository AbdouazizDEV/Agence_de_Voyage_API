# 🔧 Configuration CORS pour Render

## ✅ Problème résolu

Les erreurs CORS lors des tests avec Swagger ont été corrigées. La configuration CORS supporte maintenant :
- ✅ Plusieurs origines (séparées par virgules)
- ✅ Requêtes depuis le même domaine (Swagger)
- ✅ Headers supplémentaires pour Swagger
- ✅ Gestion automatique développement/production

## 📋 Configuration sur Render

### Option 1 : Autoriser toutes les origines (Recommandé pour tests)

**Variable d'environnement :**
```
CORS_ORIGIN=
```
(Laissez vide - toutes les origines seront autorisées)

**⚠️ Note :** Moins sécurisé, mais pratique pour les tests et le développement.

### Option 2 : Origines spécifiques (Recommandé pour production)

**Variable d'environnement :**
```
CORS_ORIGIN=https://votre-frontend.com,https://agence-de-voyage-api-1.onrender.com
```

**Exemple complet :**
```
CORS_ORIGIN=https://mon-frontend.vercel.app,https://agence-de-voyage-api-1.onrender.com,http://localhost:5173
```

**Origines autorisées :**
1. Votre frontend (production)
2. L'URL Render de l'API (pour Swagger)
3. Localhost (pour développement local)

### Option 3 : Une seule origine

**Variable d'environnement :**
```
CORS_ORIGIN=https://votre-frontend.com
```

## 🔍 Comment vérifier la configuration

1. **Allez sur votre dashboard Render**
2. **Sélectionnez votre service** `agence-de-voyage-api-1`
3. **Allez dans "Environment"**
4. **Vérifiez ou ajoutez** la variable `CORS_ORIGIN`
5. **Redéployez** si nécessaire (Render redéploie automatiquement après un push)

## 🧪 Tester CORS

### Test 1 : Swagger UI
1. Allez sur `https://agence-de-voyage-api-1.onrender.com/api/docs`
2. Essayez d'exécuter une requête (ex: `GET /api/v1/offers`)
3. ✅ **Devrait fonctionner sans erreur CORS**

### Test 2 : Depuis le navigateur (Console)
```javascript
fetch('https://agence-de-voyage-api-1.onrender.com/api/v1/offers')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('CORS Error:', err));
```

### Test 3 : Depuis votre frontend
```typescript
// Dans votre frontend React
const response = await fetch('https://agence-de-voyage-api-1.onrender.com/api/v1/offers', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

## 📝 Headers CORS autorisés

La configuration autorise maintenant ces headers :
- `Content-Type`
- `Authorization`
- `Accept`
- `X-Requested-With`
- `Origin`
- `Access-Control-Request-Method`
- `Access-Control-Request-Headers`

## 🔒 Sécurité

### En développement
- Toutes les origines sont autorisées (`CORS_ORIGIN` vide ou non défini)
- Pratique pour les tests locaux

### En production
- **Recommandé :** Spécifier les origines exactes
- **Exemple :** `CORS_ORIGIN=https://mon-site.com,https://api.mon-site.com`
- Évite les attaques CSRF depuis des domaines non autorisés

## 🚀 Déploiement

Après avoir modifié `CORS_ORIGIN` sur Render :
1. Render redéploie automatiquement après un push sur GitHub
2. OU redéployez manuellement depuis le dashboard Render
3. Attendez 2-3 minutes pour le redéploiement
4. Testez à nouveau Swagger

## ❓ Problèmes courants

### Erreur : "Access-Control-Allow-Origin header is missing"
- **Solution :** Vérifiez que `CORS_ORIGIN` est bien configuré sur Render
- **Solution :** Laissez `CORS_ORIGIN` vide pour autoriser toutes les origines

### Erreur : "Credentials flag is true, but Access-Control-Allow-Credentials is not set"
- **Solution :** Déjà géré dans le code (`credentials: true`)

### Swagger fonctionne mais le frontend ne fonctionne pas
- **Solution :** Ajoutez l'URL de votre frontend dans `CORS_ORIGIN`
- **Exemple :** `CORS_ORIGIN=https://votre-frontend.com`

## 📚 Documentation

- [NestJS CORS](https://docs.nestjs.com/security/cors)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

