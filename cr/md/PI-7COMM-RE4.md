# CR Réunion 4 - Groupe 7-COMM - 18/02/13

## Recherche d'idées

### Idées en vrac
- **Lier** une communauté avec une autre, avec des droits limités en lecture/écriture
- proposer un **résumé d'une discussion** : le résumé est le dernier post d'un fil de discussion et il est impossible de poster après, ce qui permet aux discussions de converger.
- Limiter les **notifications** : s'inscrire à un dossier/tag/forum et recevoir des notifications quand quelque chose de nouveau arrive ou uniquement quand un résumé est posté. Ainsi les managers n'ont pas trop de notifications et recoivent uniquement les résumés à haut SNR
- Permettre d'aggréger les résumés entre eux pour créer un résumé de plusieurs documents, exemple d'un projet composé de 5 parties, chacune discutée dans un fil de discussion séparé
- Chaque document aurait une section **ressources**, qui contient les tags qui la décrivent, la liste des discussions liées, des personnes liées, des URL à lire, des références
- Il faut penser à un système permettant de faire des liens facilement, sans avoir à connaître l'URL, par exemple par autocomplétion
- Pour un document, on pense à un système à 2 colonnes, avec dans la colonne de gauche le corps du document, dans la colonne de droite les informations annexes (titre, contributeurs, date, etc.) et des *commentaires* affichés le côté de la page, comme les commentaires Word ou Google Docs. Ainsi on aurait les informations annexes au paragraphe (par exemple un lien vers un post de forum) sur le côté
- **Valider** les documents (en partie ou en globalité)
- **voter** les posts de discussions pour faire ressortir le contenu pertinent ; il faut refléter ce score dans l'affichage
- gérer le **versionnement** simplifié des documents

On a désormais trouvé le nom du projet : **Détroit** *{Document, Discussion, Description}*.

*Notes :*

- itération du processus de création 1) discussion instantanée 2) Pérénnisation 3) Document, retour à l'étape 1. Permet d'appliquer les principes d'agilité à la création de documents. 
- Émergence d'un résumé exécutif
- Le document fait partie d'un tout
- Le document et le processus de création ne sont pas séparés

### Analyse fonctionnelle
Liste des fonctions, il faut pouvoir :

- discuter en temps réel
- pérenniser les discussions
- éditer de manière collaborative des documents
- référencer des discussions dans des documents
- référencer des ressources externes
- publier des résumés de discussions
- archiver et classer les documents pour les retrouver facilement
- suivre des discussions et être notifié des mises à jour
- exporter les documents dans un format pérenne, compatible avec les formats utilisés en entreprise
- gérer les utilisateurs et les groupes ainsi que leurs droits associés

Complémentaires :

- Proposer un système d'import/export :
  - export des documents vers Word, PDF, HTML, Markdown
  - import de discussions Facebook, de forum, de Stack Overflow (type middleware, *non prioritaire*)
- péréniser des ressources externes (bonus)
- lier avec une communauté externe

Contraintes :

- proposer un système utilisable par les non-experts
- proposer un système de rédaction simplifié
- fournir un système de sécurité robuste
- avoir un système utilisables sur plusieures plateformes


# Résumé du projet
## En trois lignes
Nous proposons une plateforme collaborative d'élaboration de documents, permettant aux utilisateurs de capitaliser sur les discussions et les contenus en facilitant l'échange, la réflexion et la convergence des idées. Notre projet permettra l'émergence de documents de qualité via une synergie entre discussions instantanées et discussions pérennes.

## Où est l'innovation ?
Notre outil permet l'application de principes agiles au processus de création de documents à travers l'itération d'un cycle de discussion/rédaction/validation.

## Cible
Les cibles principales sont les PME car toute entreprise a besoin d'améliorer sa productivité du processus de création et de rédaction des documents. Notre système propose une interface simple sans configuration ou installation, ce qui permet à l'entreprise de se concentrer sur son cœur de métier.

Notre outil permet d'augmenter la productivité des employés en accélérant le cycle de rédaction des documents tout en évitant les écueils liés aux emails tels que la présence de différentes versions de fichiers, l'impossibilité de savoir qui fait quoi et pourquoi, la fragmentation des fichiers, les problèmes liés aux listes de diffusion, etc.