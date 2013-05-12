# CR Réunion 1 - Groupe 7 - 06/05/2013

La réunion s'est tenue de 11h à 12h. Étaient présents :

- *Encadrants* : Pascal Clerc, Patrice HEYDE
- *Groupe projet* : Paul Mougel (Chef de projet), Guillaume Burel, Xiao Yu Feng, Fabio Guigou, Baptiste Metge

## Présentation du projet
L'équipe a tout d'abord présenté son projet ainsi que l'ensemble des concepts innovants qu'elle souhaitait développer. S'en en suivi une discussions sur l'ensemble de ces points, ainsi que sur l'orientation que devait prendre le prototype. Nous listons ci-dessous les points clés :

- *une offre SaaS* correspond à la demande, et la possibilité d'installer l'outil en interne pour les grandes entreprises correspond à un réel besoin de confidentialité des données ;
- *gestion des permissions :* chaque document devrait appartenir à un leader, qui en sera le rédacteur principal et pourra orchestrer l'ensemble des contributions. Cela fait ressortir le besoin de structurer la rédaction de documents à travers une gestion fine des permissions (en lecture, écriture, discussions), point que nous avons peu travaillé dans le cahier OSEO.
- *processus* : il serait intéressant de proposer aux rédacteurs un processus de rédaction, en leur permettant de passer d'un brouillon à un document fini à travers des étapes structurées. Cela met en évidence l'absence de scénarios d'usages dans notre cahier OSEO.

## Prototype

 Le prototype que nous avions envisagé de réaliser ressemblait trop fortement à Google Docs ce qui mettait en doute le côté innovant de notre solution. À la suite de cette discussion, l'équipe a décidé de re-centrer son prototype sur quelques fonctions clés.

La partie rédaction en temps réel ne sera pas développée, et nous proposerons des fonctions d'édition simples pouvant être réalisées rapidement. Bien qu'envisagée, une intégration avec Google Docs pour la partie rédaction nous semble peu intuitive et rendra difficile l'interaction avec la partie "discussions" de notre outil.

L'objectif est de développer au plus vite les fonctions de base afin de pouvoir rapidement se concentrer sur trois points principaux :

- la mise en place d'un *workflow* de rédaction, en passant par les étapes suivantes : Création de la structure du document / Rédaction des sous-parties / Discussions / Création d'une nouvelle version à partir des discussions validées. Ces étapes boucleront jusqu'à la production d'un document PDF finalisé. Nous espérons ainsi pouvoir montrer l'intérêt d'une approche itérative et inspirée des méthodes agiles appliquée à rédaction de documents ;
- la gestion fine des permissions, en donnant à chaque document un propriétaire, et à chaque sous-partie un responsable. Chaque utilisateur pourra commenter tout le document, mais ne pourra rédiger que les parties dont il fait partie de l'équipe rédactionnelle.
- la notion de réseaux sociaux : en implémentant la mise en valeur des documents et posts intéressants, nous pourrons créer une notion d'experts sur un sujet particulier. Ainsi, notre outil peut se transformer en outil de knowledge management, où chacun peut facilement identifier le ou les experts sur le sujet qui l'intéresse.