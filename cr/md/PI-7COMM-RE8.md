# CR Réunion 8 - Groupe 7-COMM - 15/04/13


## Organisation
Base de données :

- **Équipe** : Xiao Yu
- **Tâches**
  - Préparer une base de données stockant les données
  - Regarder les problèmes courants (joins), trouver 
  
*Back-end* :

- **Équipe** : Fabio, Paul
- **Tâches**
  - Réaliser un serveur capable de répondre aux requêtes client
  - Réaliser un serveur capable de communiquer avec la base de données
  - Mettre en place un protocole de communication
  
*Front-end* :

- **Équipe** : Guillaume, Baptiste
- **Tâches**
  - Lancer Yeoman
  - Faire les mockup en HTML
  - Utiliser des données bidon à injecter dans les vues HTML

## Documentation serveur
![](../ressources/sequence_sync.svg)

Structure d'un document :

	{
		id_: UUID,
		owner: "toto",
		collaborators: ["titi", "tata"],
		title: "Mon titre",
		content: [["Titre", 1], ["Sous-Titre", 2], "blabla", ["Sous-titre", 2], "blabla"]]
	}

Structure d'un utilisateur :
	
	{
		id_: UUID,
		name: "foo",
		password: "bar"
	}