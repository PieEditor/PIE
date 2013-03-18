# Découpage en lots

La phase de réalisation du projet est découpée en plusieurs sous-parties appelées *lots*.  La réalisation de chaque lot se conclut par la livraison d'une partie pleinement utilisable du projet et par une phase de tests, effectuée à la fois par l'équipe mais aussi par des intervenants extérieurs, permettant d'analyser la pertinence du développement et des orientations prises par l'équipe.

Afin que ce découpage en lots soit pertinent, nous avons cherché à isoler les différentes composantes du projet.

- Création d'une infrastructure de base
  - Back-end sommaire
  - Front-end sommaire
  - Système de gestion de bases de données fonctionnel
  - Système de gestion des utilisateurs  
- Édition de documents sans mise en page
  - interface de rédaction
  - API de stockage et de récupération des documents
  - stockage en bases de données
- Mise en page simple d'un document
  - support d'une mise en page intégrée au texte des documents
  - intégration d'une interface permettant d'éditer la mise en page des documents
- Discussions pérennes associées à un document
  - API de stockage et récupération de discussions
  - Interface de rédaction et de création de discussions
  - Mise en avant des posts pertinents
  - Rédaction d'un résumé exécutif
- Discussions instantanées liées à un document
  - API de stockage et récupération de discussions instantanées
  - Gestion d'un système "temps réel"
  - Interface de rédaction et de création de discussions instantanées
  - Pérennisation d'une discussion instantanée
- Export & Inter-opérabilité
  - export PDF
  - export Word
  - interactions e-mail