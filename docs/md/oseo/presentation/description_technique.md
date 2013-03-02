# Description technique
Réaliser un outil tel que décrit précédemment nécessite l'utilisation d'un ensemble de technologies logicielles ainsi qu'une plateforme matérielle gérant l'hébergement de la solution.

## Architecture logicielle
Notre outil sera composé de deux parties principales : le *front-end* et le *back-end*, basés intégralement sur des technologies libres. L'utilisation de technologies libres permettra d'accélérer notablement la conception de l'outil.

Le *front-end* est la partie visible par les utilisateurs et constiste en une interface web, ansi utilisable dans un navigateur internet. Nous utiliserons des technologies libres basées sur Javascript afin de construire ce module. Ce mode de fonctionnement permet une mise à jour de l'application transparente : il suffit que les utilisateurs visitent le site de l'application pour utiliser la dernière version de l'outil. D'un point de vue expérience utilisateur, l'utilisation de langages clients tels que Javascript permet la création d'interfaces plus réactives que l'utilisation de langages serveurs tels que PHP ou Java. Il n'est pas exclu de créer une application mobile en tant que deuxième *front-end*, bien que ce ne soit pas la priorité du développement.

Le *back-end* est la partie invisible par les utilisateurs : elle contient toutes les données des utilisateurs ainsi qu'une partie logicielle permettant au *front-end* d'acquérir et de mettre à jour les données. Nous utiliserons également des technologies libres pour stocker et tratier les données.

## Architecture matérielle
Afin de permettre une flexbilité maximale, nous utiliserons un hébergement basé 
*cloud*.