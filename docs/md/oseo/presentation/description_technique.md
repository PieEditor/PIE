# Description technique
Réaliser un outil tel que décrit précédemment nécessite l'utilisation d'un ensemble de technologies logicielles ainsi qu'une plateforme matérielle gérant l'hébergement de la solution.

## Architecture logicielle
Notre outil sera composé de deux parties principales : le *front-end* et le *back-end*, basés intégralement sur des technologies libres. L'utilisation de technologies libres permettra d'accélérer notablement la conception de l'outil et de diminuer les coûts de développement.

Le *front-end* est la partie visible par les utilisateurs et constiste en une interface Web, exécutée par un navigateur. Nous utiliserons des technologies libres basées sur Javascript afin de construire ce module. Ce mode de fonctionnement permet une mise à jour transparente de l'application : il suffit que les utilisateurs visitent le site pour utiliser la dernière version de l'outil. D'un point de vue expérience utilisateur, l'utilisation de langages clients tels que Javascript permet la création d'interfaces plus réactives que l'utilisation de langages serveur tels que PHP ou Java. Il n'est pas exclu de créer une application mobile en tant que deuxième *front-end*, bien que ce ne soit pas la priorité du développement.

Le *back-end* est la partie invisible par les utilisateurs et est composée de deux parties. Avant tout, le *back-end* doit contenir toutes les données de l'application telles que les informations associées aux utilisateurs, leurs conversations et les documents. Il devra également comporter une couche logicielle permettant au *front-end* d'acquérir et de mettre à jour les données.

## Architecture matérielle
Afin de mettre l'outil à la disposition des utilisateurs, il convient de proposer une structure d'hébergement de l'application. Dans le but de permettre une flexbilité maximale, nous utiliserons un hébergement de type *cloud*. Ces hébergements supportent une montée en charge rapide en cas de pic d'utilisation et permettent à l'équipe de se concentrer sur le développement de l'application et de passer le minimum de temps sur son implantation, car l'hébergeur prend en charge toutes les considérations matérielles.