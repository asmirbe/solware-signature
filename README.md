# Solware Signature

Générateur de signature email pour Solware, développé avec SvelteKit. Une application web permettant aux employés de Solware de créer facilement leur signature email professionnelle.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-2C39BD?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🚀 Fonctionnalités

- Création de signature email personnalisée
- Upload et gestion d'avatar
- Intégration des réseaux sociaux Solware
- Prévisualisation en temps réel
- Copie directe dans le presse-papiers
- Bannière d'annonce optionnelle
- Avertissement de sécurité configurable
- Interface responsive et moderne

## 🛠️ Technologies

- SvelteKit
- SASS pour le styling
- Cloudinary pour la gestion des images
- Vercel pour le déploiement
- LocalForage pour le stockage local

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/solware-signature.git

# Installer les dépendances
cd solware-signature
npm install

# Variables d'environnement
cp .env.example .env
# Remplir les variables Cloudinary

# Démarrer le serveur de développement
npm run dev
```

## 🔧 Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
CLOUD_NAME="votre_cloud_name"
API_KEY="votre_api_key"
API_SECRET="votre_api_secret"
```

## 🚀 Déploiement

L'application est configurée pour être déployée sur Vercel :

```bash
npm run build
```

## 📝 Utilisation

1. Remplissez vos informations personnelles
2. Ajoutez votre photo de profil (optionnel)
3. Personnalisez les options supplémentaires
4. Prévisualisez votre signature
5. Copiez la signature dans votre presse-papiers
6. Collez dans les paramètres de signature d'Outlook


## 📄 Licence

Ce projet est la propriété de Solware. Tous droits réservés.

## 👤 Contact

Développé par [Asmir Belkic](https://hiasmir.com)
