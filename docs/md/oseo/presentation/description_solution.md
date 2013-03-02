# Description de la solution proposée
Afin de pallier aux problèmes soulevés dans la section précédente, nous proposons un outil de rédaction collaborative de documents dont nous allons désormais décrire les fonctionnalités.

## Capitalisation sur les discussions

Nous partons de l'observation suivante : *les discussions et critiques sont centrales à la rédaction d'un document*. Il est alors impératif de ne pas séparer le document et son processus de rédaction.

Quand une personne rédige un premier brouillon d'un document, elle va demander l'avis de ses collègues qui proposent leurs commentaires, améliorant ainsi le document. Notre outil permet de **capitaliser sur les discussions en les intégrant de manière forte aux documents** auxquelles elles sont reliées. Un commentaire pourra alors être relié à un paragraphe précis, permettant ainsi de le lire dans son contexte. Une fois la discussion engagée, les différents participants pourront y répondre en constituant un véritable fil de discussion centré autour d'un paragraphe du document. Nous ajoutons à chaque fil de discussion la possibilité d'en rédiger un **résumé**. Il complète la discussion en proposant aux visiteurs un court paragraphe résumant la discussion et la décision prise par le groupe ; il permet ainsi aux lecteurs de prendre connaissance de la décision finale sans avoir à lire le fil de discussion entier. Une fois ce résumé rédigé, la conversation est figée et ne peut évoluer.

L'ensemble des fils de discussion servira alors de base pour l'amélioration et la création d'une nouvelle version du document. Au cours de sa rédaction les différents résumés des discussions seront affichés pour aider le rédacteur à prendre en compte les commentaires des participants.

Ce principe de rédaction itératif, centré sur un cycle de rédaction et discussion a également l'avantage de garder un historique complet des discussions.

INVERSE (discussion -> document)

## Collaboration entre individus
Comme précisé dans la section précédente, une organisation basée sur l'e-mail comme outil de travail principal n'est pas optimale. Nous proposons un outil où l'ensemble des participants sont organisés en **communautés de travail**. Chaque participant peut faire partie de plusieurs communautés de travail, qui peuvent alors s'apparenter aux services des entreprises mais peuvent aussi regrouper des personnes aux intérêts communs, tels qu'un groupe de travail transveral.

Fort de cette organisation, un utilisateur sera alors notifié de chaque discussion se déroulant dans les communautés auxquelles il est abonné.

Dans la même optique de collaboration, il est également possible d'**inviter** une personne à une discussion afin de demander son opinion ou ses conseils.

## Inter-opérabilité
Bien conscients de la nécessité de créer un outil utilisable avec les systèmes déjà en place, nous proposons un ensemble de fonctionnalités visant à intégrer notre outil dans un écosystème logiciel existant.

Tout d'abord, l'ensemble des documents rédigés sont exportables dans un format générique et standard tel que le PDF. Cela permet aux personnes de créer un fichier à partir d'un document créé dans notre outil.

Nous proposons également une intégration avec les emails. Le principe est le suivant : à chaque publication de document, les personnes recevront le PDF généré automatiquement par email. Si elles répondent à l'email, le système ré-intègre la réponse dans l'outil en tant que commentaire à propos du document. Ce système simple propose une inter-opérabilité forte avec l'email tout en permettant d'interagir de manière aisée avec l'outil via un protocole standard.