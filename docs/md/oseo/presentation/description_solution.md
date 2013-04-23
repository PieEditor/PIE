# Description de la solution proposée
Afin de pallier les problèmes soulevés dans la section précédente, nous proposons un outil de rédaction collaborative de documents dont nous allons désormais décrire les fonctionnalités.

## Rédaction
Nous proposons avant tout un outil de rédaction et de production de documents. Les utilisateurs pourront ainsi créer leurs propres documents et les éditer, dans le but de produire un document final qui pourra être exporté dans un format standard tel que le PDF. Il sera également possible pour plusieurs collaborateurs d'éditer le même document en temps réel.

Afin d'augmenter la productivité des utilisateurs, il nous semble primordial de proposer un système permettant de séparer le fond et la forme du document. Pour ce faire, nous proposons un outil d'édition des styles parallèlement à la rédaction d'un document.

Il sera également possible d'intégrer des ressources externes telles que des images ou des graphiques.

## Capitalisation sur les discussions

Nous partons de l'observation suivante : *les discussions et critiques sont centrales à la rédaction d'un document*. Il est alors impératif de ne pas séparer le document de son processus de rédaction. Nous pouvons citer l'exemple du monde scientifique, où la relecture d'articles de recherche occupe une part importante du métier de chercheur et garantit la qualité des documents produits.

Quand une personne rédige un premier brouillon d'un document, elle va demander l'avis de ses collaborateurs qui proposent leurs commentaires, améliorant ainsi le document. Notre outil permet de **capitaliser sur les discussions en les intégrant de manière forte aux documents** auxquelles elles sont reliées. Un commentaire pourra alors être relié à un paragraphe précis, permettant ainsi de le lire dans son contexte. Une fois la discussion engagée, les différents participants pourront y répondre en constituant un véritable fil de discussion centré autour d'un paragraphe du document. Nous ajoutons à chaque fil de discussion la possibilité d'en rédiger un **résumé**. Il complète la discussion en proposant aux participants un court paragraphe résumant la discussion et la décision prise par le groupe ; il permet ainsi aux lecteurs de prendre connaissance de la décision finale sans avoir à lire le fil de discussion entier. Une fois ce résumé rédigé, la conversation est figée et ne peut plus évoluer.

L'ensemble des fils de discussions servira alors de base pour l'amélioration et la création d'une nouvelle version du document. Au cours de sa rédaction les différents résumés des discussions seront affichés pour aider le rédacteur à prendre en compte les commentaires des participants.

Chaque post et discussion aura un *score d'importance*, calculé automatiquement en fonction du nombre de réactions engendrées ou de l'importance des participants. Cela nous permettra de **mettre en avant les points de vue pertinents** afin d'aider les rédacteurs à améliorer leurs documents.

Nous proposons également la possibilité de tenir une discussion instantanée parmi les différents lecteurs d'un document, permettant ainsi d'obtenir des retours rapides. Si la discussion instantanée est jugée importante, elle pourra être **pérennisée** en étant transformée en fil de discussion.

Ce principe de **rédaction itérative**, centrée sur un cycle de rédaction et de discussion, a également l'avantage de conserver une trace de l'évolution du document au cours du temps en maintenant un historique des discussions importantes. Enfin, nous proposons un **système de gestion de versions** : il sera possible de visualiser les différences entre deux versions d'un même document, ainsi que les discussions associées qui ont permis à ce document d'évoluer.

## Collaboration
Comme précisé dans la section précédente, une organisation basée sur l'e-mail comme outil de travail principal n'est pas optimale. Nous proposons un outil où l'ensemble des participants sont organisés en **communautés de travail**. Chaque participant peut faire partie de plusieurs communautés de travail, qui peuvent alors s'apparenter aux services des entreprises mais peuvent aussi regrouper des personnes aux intérêts communs, telles qu'un groupe de travail transversal.

Fort de cette organisation, un utilisateur sera alors notifié de chaque discussion se déroulant dans les communautés auxquelles il appartient.

Dans la même optique de collaboration, il est également possible d'**inviter** une personne à une discussion ou de l'inviter à relire un document afin de demander son opinion ou ses conseils. La personne invitée peut alors lire le document et l'intégralité des discussions associées.

Ces fonctionnalités de collaboration, de rédaction multi-utilisateurs ainsi que de discussion contribuent ainsi à **améliorer l'organisation des personnes** lors de leur travail.

## Inter-opérabilité
Bien conscients de la nécessité de créer un outil utilisable avec les systèmes déjà en place, nous proposons un ensemble de fonctionnalités visant à intégrer notre outil dans l'écosystème logiciel existant.

Tout d'abord, l'ensemble des documents rédigés sont exportables dans un format générique et standard tel que le PDF ou bien des formats largement utilisés tels que le format Word. Cela permet aux personnes de créer un fichier à partir d'un document créé dans notre outil.

Nous proposons également une intégration avec les e-mails. Le principe est le suivant : à chaque publication de document, les personnes recevront le PDF généré automatiquement par e-mail. Si elles répondent à l'e-mail, le système ré-intègre la réponse dans l'outil en tant que commentaire à propos du document. Ce système simple propose une inter-opérabilité forte avec l'e-mail tout en permettant d'interagir de manière aisée avec l'outil via un protocole standard.