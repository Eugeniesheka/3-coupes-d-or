// Algorithme : Les trois coupes d'or
// Barre de vie + Point plus importants si nombre de coupe important + Utilisation de ChargerSon
// Une image aléatoire d'un animal s'affiche au début du JEU
// BUG corrigé : a la fin du jeu le comptage des points se poursuivait
// Auteurs : Eugénie sheka et Annais ducteil 
turtleEnabled=false;
Initialiser();
	var sImage			= 'http://www.l-olive.fr/anais/images/',
        sMedia			= 'http://www.l-olive.fr/anais/medias/';
	var Monde			= { x: 20, y: 20, pas: 30, nLongueur: 0, nHauteur:0, nNavigateur:0, bSilence: false, nP oint:0, nArme:9 }; // navigateur:30 sur Edge, 0 sur les autres navigateur
		Monde.nLongueur	= Monde.x*Monde.pas;		
		Monde.nHauteur	= Monde.y*Monde.pas;
	var tabMonde		= Tableau(Monde.x, Monde.y); 											// Tableau sur Monde.x X Monde.y
	var avatar			= { x: Monde.x/2, y: Monde.y/2, nAttaque: 5,nDefense: 100, nArme: 0, nPas:0},
        faune			= {	nNombre: 0,	nTrouve: 0},
        coupe			= { nNombre: 3,	nTrouve: 0},
        hopital			= { nNombre:15,	nPoint: 20},
        caserne			= { nNombre:15, nPoint: 10};

////////////////////////////////////////////////////////////////////////////////////////
/////////                              ARMES                               /////////////
////////////////////////////////////////////////////////////////////////////////////////
	var tabArme =	Tableau(Monde.nArme);
	for (var i=1 ; i <= Taille(tabArme) ; i++) {
      tabArme[i-1] = {sNom: 'Arc '+enChaine(i), nForce: (i%2)+i, sImage:'arc'+enChaine(i)+'.png', nMunition: 10*(i)};
    }


////////////////////////////////////////////////////////////////////////////////////////
/////////                              MUSIQUES & SONS                     /////////////
////////////////////////////////////////////////////////////////////////////////////////
	var sonTir			= ChargerSon(sMedia+'son.mp3'),
        sonCri			= ChargerSon(sMedia+'cri.mp3'),
        sonDebut		= ChargerSon(sMedia+'debut-jungle.mp3'),
        sonForet		= ChargerSon(sMedia+'ambiance-forest.mp3'),
        sonBrouillard	= ChargerSon(sMedia+'son_brouillard.mp3'),        
        
        sonBeau			= ChargerSon(sMedia+'son_beau.mp3'),						// Sons météo 
        sonPluie		= ChargerSon(sMedia+'son_pluie.mp3'),        
        sonOrage		= ChargerSon(sMedia+'son_orage.mp3'),
        sonTempete		= ChargerSon(sMedia+'son_tempete.mp3'),
        sonNeige		= ChargerSon(sMedia+'son_neige.mp3'),
        sonCyclone		= ChargerSon(sMedia+'son_cyclone.mp3'),
        sonTsunami		= ChargerSon(sMedia+'son_tsunami.mp3'),
        sonVolcan		= ChargerSon(sMedia+'son_volcan.mp3'),
        
        sonFin			= ChargerSon(sMedia+'fin.mp3'),
        // On a besoin de stopper tous les sons avant le démarrage d'un nouveau
        tabSon = [sonBeau,sonPluie, sonOrage, sonTempete,sonNeige,sonCyclone,sonTsunami,sonVolcan, sonBrouillard];

////////////////////////////////////////////////////////////////////////////////////////
/////////                                 METEO                            /////////////
////////////////////////////////////////////////////////////////////////////////////////
	var tabMeteo		= [
		{sNom:'Beau', sIcone:'soleil.png', nAttaque: -1, media: sonBeau},		{sNom:'Pluie',sIcone:'pluie.png', nAttaque: 0, media: sonPluie},
		{sNom:'Orage',sIcone:'orage.png', nAttaque: 1, media: sonOrage},		{sNom:'Tempête',sIcone:'tempete.png', nAttaque: 2, media: sonTempete},
		{sNom:'Neige',sIcone:'neige.png', nAttaque: 3, media: sonNeige},		{sNom:'Cyclone',sIcone:'cyclone.png', nAttaque: 4, media: sonCyclone},
		{sNom:'Tsunami',sIcone:'tsunami.png', nAttaque: 4, media: sonTsunami},	{sNom:'Volcan',sIcone:'volcan.png', nAttaque: 5, media: sonVolcan}],
        MeteoBrouillard	= {sNom:'Inconnu', sIcone:'brouillard.png', nAttaque: 0, media: sonBrouillard},
        MeteoBeau		= {sNom:'Beau', sIcone:'soleil.png', nAttaque: 0, media: sonBeau};


////////////////////////////////////////////////////////////////////////////////////////
///////////                            LES ANIMAUX                            //////////
////////////////////////////////////////////////////////////////////////////////////////
	var Jaguar			=	{sNom:	'Jaguar', 					nAttaque:	9,	nDefense:5, sImage: 'lion.png', 			nPoint:100 },
        Anaconda		=	{sNom:	'Anaconda', 				nAttaque:	9,	nDefense:6, sImage: 'serpent.png',			nPoint:100},
        Tityus			=	{sNom:	'Tityus', 					nAttaque:	9,	nDefense:1, sImage: 'tityus.png',			nPoint:100},
        Fourmis			=	{sNom:	'Fourmis légionnaires', 	nAttaque:	9,	nDefense:1, sImage: 'fourmis.png',			nPoint: 30},
        Lynx			=	{sNom:	'Lynx boréal', 				nAttaque:	9,	nDefense:4, sImage: 'lynx.png',				nPoint: 80},
        Aigle			=	{sNom:	'Aigle royal', 				nAttaque:	9,	nDefense:6, sImage: 'aigle.png',			nPoint:100},
        Serpent1		=	{sNom:	'Serpent', 					nAttaque:	9,	nDefense:3, sImage: 'serpent.png',			nPoint: 50},
        Lion			=	{sNom:	'Lion', 					nAttaque:	15,	nDefense:10, sImage: 'lion.png',			nPoint:200},
        Sanglier		=	{sNom:	'Sanglier', 				nAttaque:	12,	nDefense:6, sImage: 'sanglier.png',			nPoint:150},
        ChauveSouris	=	{sNom:	'Chauve-souris',			nAttaque:	9,	nDefense:1, sImage: 'chauve-souris.png',	nPoint:100},
        GuepeDeMer		=	{sNom:	'Guêpe de mer', 			nAttaque: 	8,	nDefense:2,	sImage: 'guepe-de-mer.png', 	nPoint:100},
        Hydrophiinae	=	{sNom:	'Hydrophiinae',				nAttaque:	8,	nDefense:2,	sImage: 'serpent.png', 			nPoint:100},
        PoissonPierre	=	{sNom:	'Poisson-pierre',			nAttaque:	8,	nDefense:3,	sImage: 'poisson-pierre.png', 	nPoint:100},
		GrandRequinBlanc=	{sNom:	'Grand requin blanc',		nAttaque:	9,	nDefense:10,sImage: 'requin.png',			nPoint:200},
        OursBlanc		=	{sNom:	'Ours Blanc', 				nAttaque:	15,	nDefense:10, sImage: 'ours.png',			nPoint:200},
        RenardPolaire	=	{sNom:	'Renard Polaire',			nAttaque:	6,	nDefense:3, sImage: 'renard.png',			nPoint:100},
        LoupArctique	=	{sNom:	'Loup Arctique',			nAttaque:	8,	nDefense:7, sImage: 'loup.png',				nPoint:100},
        Elephant		=	{sNom:	'Eléphant',					nAttaque:	15,	nDefense:10, sImage: 'elephant.png',		nPoint:100},
        Scorpion		=	{sNom:	'Scorpion', 				nAttaque:	9,	nDefense:2, sImage: 'scorpion.png',			nPoint:100},
        RecluseBrune	=	{sNom:	'Recluse brune',			nAttaque:	9,	nDefense:2, sImage: 'recluse-brune.png',	nPoint:100},
        VeuveNoire		=	{sNom:	'Veuve Noire', 				nAttaque:	9,	nDefense:2, sImage: 'veuve-noire.png',		nPoint:100},
        MambaNoir		=	{sNom:	'Mamba noir', 				nAttaque:	9,	nDefense:3, sImage: 'serpent.png',			nPoint:120},
        Serpent2		=	{sNom:	'Serpent taïpan du désert', nAttaque:	9,	nDefense:2, sImage: 'serpent.png',			nPoint:50},
        Moustique		=	{sNom:	'Moustiques', 				nAttaque:	9,	nDefense:1,	sImage: 'moustique.png',		nPoint:20},
        CaimanNoir		=	{sNom:	'Caïman noir', 				nAttaque:	15,	nDefense:10, sImage: 'caiman-noir.png',		nPoint:200},
        Rhinoceros		=	{sNom:	'Rhinoceros', 				nAttaque:	12,	nDefense:15, sImage: 'rhinoceros.png',		nPoint:150},
        Invisible		=	{sNom:	'Invisible', 				nAttaque:	'',	nDefense:'', sImage: 'invisible.png',		nPoint:0},
        Aucun			=	{sNom:	'Aucun', 					nAttaque:	'',	nDefense:'', sImage: 'invisible.png',		nPoint:0};
	var tabAnimaux		= [Aigle,Anaconda,CaimanNoir,ChauveSouris,Elephant,Fourmis,GuepeDeMer,Hydrophiinae,Jaguar,Lion,LoupArctique,Lynx,MambaNoir,
                           Moustique,OursBlanc,PoissonPierre,RecluseBrune,RenardPolaire,Rhinoceros,Sanglier,Scorpion,Serpent1,Serpent2,Tityus,VeuveNoire];
	var tabBestiaire	= [];
////////////////////////////////////////////////////////////////////////////////////////
///////////                      LES ENVIRONNEMENTS                           //////////
////////////////////////////////////////////////////////////////////////////////////////
	var foret		= { sNom:'Forêt tropicale',		sCouleur:'#397817',	tabAnimal: [Aucun,Jaguar,Anaconda,Tityus,Fourmis]},
        montagne	= { sNom:'Montagne ardue',		sCouleur:'#786517',	tabAnimal: [Aucun,Aucun,Lynx,Aigle]},
        plaine		= { sNom:'Plaine paisible',		sCouleur:'#BBE777',	tabAnimal: [Aucun,Aucun,Aucun,Serpent1,Lion,Sanglier,ChauveSouris,Elephant, Rhinoceros]},
        ocean		= { sNom:'Océan profond',		sCouleur:'#188FE6',	tabAnimal: [Aucun,GuepeDeMer,Hydrophiinae,PoissonPierre,GrandRequinBlanc]},
        toundra		= { sNom:'Toundra gelée',		sCouleur:'#C6CFD5',	tabAnimal: [Aucun,Aucun,OursBlanc,RenardPolaire,LoupArctique]},
        desert		= { sNom:'Désert',				sCouleur:'#CAC8B5',	tabAnimal: [Aucun,Aucun,Aucun,Aucun,Aucun,Scorpion,RecluseBrune,VeuveNoire,MambaNoir,Serpent2]},
        riviere		= { sNom:'Rivière tumultueuse',	sCouleur:'#B5CAC9',	tabAnimal: [Aucun,Aucun,Moustique,Moustique,CaimanNoir,Serpent1]},
        mare		= { sNom:'Mare mystique',		sCouleur:'#18aaaa',	tabAnimal: [Aucun,Aucun,Moustique]},
        marecage	= { sNom:'Marécage boueux',		sCouleur:'#88762f',	tabAnimal: [Aucun,Moustique,Anaconda]},
        Brouillard	= { sNom:'Brouillard de guerre',sCouleur:'#939393',	tabAnimal: [Invisible]},
        tabEnvironnement = [foret,montagne,plaine,ocean,toundra,desert,riviere, mare, marecage];			// Le tableau des 9 Environnements

////////////////////////////////////////////////////////////////////////////////////////
///////////                      LES FONCTIONS 'OUTILS'                       //////////
////////////////////////////////////////////////////////////////////////////////////////	
	function CaseLibre() {																// Permet de trouver au hasard x et y disponible" dans le monde
		var Gps;	
      do 
		{
			Gps = {x: Hasard(Monde.x), y: Hasard(Monde.y)};
		} while (((avatar.x == Gps.x)	&&	(avatar.y == Gps.y)) || tabMonde[Gps.x][Gps.y].actif());
		return Gps;
	}

	function message(tabMessage,sIcone) {														// Affiche un message sur 4 lignes 
		setCanvasFont('Arial', '16px', 'normal');
		RectanglePlein(Monde.nLongueur+10,460,280,120,'white');
		RectanglePlein(Monde.nLongueur+10,460,280,120,'white');
		Rectangle(Monde.nLongueur+10,460,280,120,'blue');
		for (i=0; i<4;i++) {
          Texte(Monde.nLongueur+15,485+i*30,enChaine(tabMessage[i]),'black');
        }
		RectanglePlein(Monde.nLongueur+243,435,38,36,'white');
		DrawImage(sImage+sIcone,Monde.nLongueur+247,438,30,30);
		Rectangle(Monde.nLongueur+243,435,38,36,'blue');
	}

	function messageBestiaire(sNom, sIcone,sPoint) {													// Permet d'afficher une attaque dans "message".
		switch (tabBestiaire[sNom]) {
			case undefined : // Premier animal de ce type
				tabBestiaire[sNom] = 1;
				message(["Vous venez de tuer votre premier","'"+sNom+"'","",sPoint+" points."],sIcone);
				break;
			case 1 : // Second
				tabBestiaire[sNom]++;
				message(["Vous venez de tuer votre second","'"+sNom+"'","",sPoint+" points."],sIcone);
				break;
			case 2 : // Troisième
				tabBestiaire[sNom]++;
				message(["Vous venez de tuer votre troisième","'"+sNom+"'","",sPoint+" points."],sIcone);
				break;
			default:
				tabBestiaire[sNom]++;
				message(["Vous venez de tuer","'"+sNom+"'","C'est le numéro "+tabBestiaire[sNom]+".",sPoint+" points."],sIcone);
		}
	}

	function CreationCase() {																			// Création d'une case
		var nEnvironnement	= Hasard(Taille(tabEnvironnement)),											// On cherche un environnement aléatoire
            nAnimal			= Hasard(Taille(tabEnvironnement[nEnvironnement].tabAnimal)),				// On cherche un animal aléatoire dans l'environnement choisi
            nMeteo			= Hasard(Taille(tabMeteo));													// On cherche une météo aléatoire 
		var objCase		= {
			actif: function()
				{
					return (this.coupe || this.hopital || this.caserne || this.arme || (this.animal !== Aucun));
				},
			environnement:	tabEnvironnement[nEnvironnement],											// Objet - On affecte cet environnement
			animal:			tabEnvironnement[nEnvironnement].tabAnimal[nAnimal],						// Objet - On affecte cet animal
			meteo:			tabMeteo[nMeteo],															// Objet - On affecte la météo choisie
			brouillard:		true,																		// Booléen
			coupe:			false,
			hopital:		false,
			caserne:		false,
			arme:			false
			};  
		if (objCase.animal !== Aucun) {
			faune.nNombre++;}										// Comptabilise le nombre d'animaux créés
		return objCase;
	}


////////////////////////////////////////////////////////////////////////////////////////
///////////                  LES FONCTIONS "CREATION DU MONDE"                //////////
////////////////////////////////////////////////////////////////////////////////////////	
	function Introduction() {
		DrawImage(sImage+'Introduction.png',0,0,Monde.nLongueur,Monde.nHauteur);
		for (var j = 0; j < Monde.y; j++) {										// Remplissage du tableau Monde
			for (var i = 0; i < Monde.x; i++) {
				tabMonde[i][j] = CreationCase();								// Création d'une case, c'est un objet
			}
		}
		message([enChaine(hopital.nNombre)+" hôpitaux pour "+enChaine(hopital.nPoint)+" points de vie.",
                 enChaine(caserne.nNombre)+" caches d'armes pour "+enChaine(caserne.nPoint)+" munitions.",
                 Taille(tabArme)+" améliorations de votre arme.","Cherchez et trouvez-les !"],tabAnimaux[Hasard(Taille(tabAnimaux))].sImage);
		CreationDashboard();
		Dashboard(0, 0);
    }

	function CreationDashboard() {
		Rectangle(Monde.longueur+1,0,299,599,'blue');

		setCanvasFont("Arial", "18px", "bold");
		Texte(Monde.nLongueur+ 17, 185, "Gestion",			'black');
		Texte(Monde.nLongueur+ 17, 450, "Notifications",	'black');
      
		Rectangle(Monde.nLongueur+10, 90,280,50,'bleu');
      
		setCanvasFont("Arial", "12px", "italic");
		Texte(40, Monde.nHauteur+60, "Nombre de pas",	'blue');
		Texte(Monde.nLongueur/2+60, Monde.nHauteur+60, "Dommage(s)",	'blue');      

		Texte(Monde.nLongueur+130,  17, "Coupe",	'blue');
		Texte(Monde.nLongueur+130,  67,	"Santé",	'blue');
		Texte(Monde.nLongueur+130, 120, "Force",	'blue');
		Texte(Monde.nLongueur+61 , 120, "Munitions",'blue');
		Texte(Monde.nLongueur+210, 120, "Arme",		'blue');      

		RectanglePlein(Monde.nLongueur+10,190,280,205,'black');
		Rectangle(Monde.nLongueur+10,190,280,205,'blue');
		Texte(Monde.nLongueur+ 65, 375, "Attaque",	'white');
		Texte(Monde.nLongueur+132, 375, "Défense",	'white');
		Texte(Monde.nLongueur+200, 375, "Abattus ",	'white');

		setCanvasFont("Arial", "18px", "bold");
		Texte(Monde.nLongueur+17,Monde.nHauteur+5,  "Point(s)",	'black');
		
		Dashboard(avatar.x, avatar.y);
    }

	function CreationCoupe() {													// On crée 'coupe.nNombre' coupes, au hasard dans le "Monde".
		var Case;
		for (var i = 1; i <= coupe.nNombre; i++) {
			Case = CaseLibre();
			tabMonde[Case.x][Case.y].coupe = true;
		}
	}

	function CreationHopital() {												// On crée 'hopital.nNombre' hopital, au hasard dans le "Monde".
		var Case;
		for (var i = 1; i <= hopital.nNombre; i++) {
			Case = CaseLibre();
			tabMonde[Case.x][Case.y].hopital = true;
		}
	}
	
	function CreationCaserne() {												// On crée 'caserne.nNombre' casernes, au hasard dans le "Monde".
		var Case;      
		for (var i = 1; i <= caserne.nNombre; i++) {
			Case = CaseLibre();
			tabMonde[Case.x][Case.y].caserne = true;
		}
	}

	function CreationArme() {												// On crée 'Taille(tabArme)-1' arme, au départ l'avatar a déjà une arme.
		var Case;      
		for (var i = 1; i < Taille(tabArme); i++) {
			Case = CaseLibre();
			tabMonde[Case.x][Case.y].arme = true;
		}
	}


	function CreationAvatar() {													// Permet d'initialiser l'avatar
		tabMonde[avatar.x][avatar.y].environnement	= plaine;					// Dans une plaine, 
		tabMonde[avatar.x][avatar.y].animal			= Aucun;					// ... sans animal
		tabMonde[avatar.x][avatar.y].meteo			= MeteoBeau;				// ... un jour de beau temps
		Debrouillage();															// retire le brouillard autours de l'avatar
	}
	
	function CreationAmbiance() {
		if (!Monde.bSilence) {
			//sonForet.loop = true;          
			sonForet.play();														// On démarre la musique de fond 'foret'.
			sonDebut.loop = true;
			sonDebut.play();														// On démarre la musique de début.
        }
    }

	function CreationMonde() {													// Création du monde 'Monde.x' x 'Monde.y'
		for (var j = 0; j < Monde.y; j++) {										// Remplissage du tableau Monde
			for (var i = 0; i < Monde.x; i++) {
				AfficherCase(i, j);												// Dessin de la case que l'on vient créer
			}
		}
		CreationCoupe();
		CreationHopital();
		CreationCaserne();
		CreationArme();
		CreationAvatar();
		CreationAmbiance();
		CreationDashboard();
		message(["Bienvenue dans votre Monde","","",""],'');      
	}

////////////////////////////////////////////////////////////////////////////////////////
///////////  AFFICHAGE D'UNE CASE DANS LE MONDE                               //////////
////////////////////////////////////////////////////////////////////////////////////////
	
	function AfficherAvatar(x,y) {											// On dessine un avatar : un cercle rouge bordé de blanc, et de position (x, y).
		DrawImage(sImage+'avatar.png',x*Monde.pas, y*Monde.pas,30,30);
	}

	function AfficherIcone(x,y) {													// On affiche une Icone
		var sIcone;
		if (!tabMonde[x][y].brouillard) {											// ... si on est pas dans le brouillard
			switch(true) {
				case tabMonde[x][y].coupe: 											// On affiche une coupe     
					sIcone	= 'coupe.png';
					break;
				case tabMonde[x][y].hopital:										// On affiche un hôpital
					sIcone	= 'hopital.png';
					break;
				case tabMonde[x][y].caserne:										// On affiche deux épés qui se croisent      
					sIcone	= 'caserne.png';
					break;
				case tabMonde[x][y].arme:											// On affiche un cadeau      
					sIcone	= 'arme.png';
                break;
				default:														// On affiche un animal ou aucun animal
					sIcone	= tabMonde[x][y].animal.sImage;
			}
			if (sIcone !=='') {
				DrawImage(sImage+sIcone,x*Monde.pas, y*Monde.pas,30,30);
              
            }
          
		}
    }

	function AfficheEnvironnement(x, y) {
		var Environnement = {};
		if (tabMonde[x][y].brouillard) {
			Environnement = Brouillard;
		} else {
			Environnement = tabMonde[x][y].environnement;
        }
		RectanglePlein(x*Monde.pas, y*Monde.pas, Monde.pas-1, Monde.pas-1,'black'); // Si pas brouillard de guerre, elle sera de la couleur de l'environnement      
		RectanglePlein(x*Monde.pas, y*Monde.pas, Monde.pas-3, Monde.pas-3,Environnement.sCouleur); // Si pas brouillard de guerre, elle sera de la couleur de l'environnement
    }

	function AfficherCase(x, y) {										// On dessine une case de Longueur 'nPas-', et de position de (x, y).
		AfficheEnvironnement(x, y);										// On crée un carré
		AfficherIcone(x, y);											// On affiche soit une coupe, soit un hopital, soit une caserne ou soit un animal même l'animal 'Aucun'
	}

////////////////////////////////////////////////////////////////////////////////////////
///////////            AFFICHAGE DANS LE DASHBOARD                            //////////
////////////////////////////////////////////////////////////////////////////////////////
	function AfficheDashGPS(x, y) {										// Position de la souris dans la grille Monde.
		setCanvasFont('Arial', '14px', 'normal');						// La taille du GPS change en fonction de la taille de l'écran utilisé
		RectanglePlein(Monde.nLongueur+220,5,70,30,'white');		
		if (x <10) {							
				Texte(Monde.nLongueur+232, 30, enChaine(x), 'black');
		} else {
				Texte(Monde.nLongueur+225, 30, enChaine(x), 'black');
		}
		if (y <10) {		
				Texte(Monde.nLongueur+257, 30, enChaine(y), 'black');
		} else {
				Texte(Monde.nLongueur+250, 30, enChaine(y), 'black');
		}
	}

	function AfficheDashAvatar() {									// Afficher les informations liées à l'Avatar dans le Dashboard
		setCanvasFont('Arial', '24px',	'normal');
		// Affichage des coupes
		RectanglePlein(Monde.nLongueur+95, 20,110,30,'white');
		switch(coupe.nTrouve) {
			case 1:
				DrawImage(sImage+'coupe.png',Monde.nLongueur+135, 20,30,30);
				break;
			case 2:
				DrawImage(sImage+'coupe.png',Monde.nLongueur+115, 20,30,30);
				DrawImage(sImage+'coupe.png',Monde.nLongueur+155, 20,30,30);
				break;
			case 3:
				DrawImage(sImage+'coupe.png',Monde.nLongueur+ 95, 20,30,30);
				DrawImage(sImage+'coupe.png',Monde.nLongueur+135, 20,30,30);
				DrawImage(sImage+'coupe.png',Monde.nLongueur+175, 20,30,30);
				break;
        }
      
		// Affichage les points de vie		
		setCanvasFont('Arial', '26px',	'normal');
		RectanglePlein(Monde.nLongueur+123, 74,50,27,'white');
		Rectangle(Monde.nLongueur+123, 74,50,27,'blue'); 
		if (avatar.nDefense<100) {      
			Texte(Monde.nLongueur+126+7,  97,  enChaine(avatar.nDefense),'black');					// Création du texte 'Défense'
        } else {
			Texte(Monde.nLongueur+126+0,  97,  enChaine(avatar.nDefense),'black');					// Création du texte 'Défense'
        }
		RectanglePlein(Monde.nLongueur+75, 74,150,27,'white');
		Rectangle(Monde.nLongueur+75, 74,150,27,'blue');
		RectanglePlein(Monde.nLongueur+75, 75,150*(avatar.nDefense/300),25,'green');
      
		// Affichage la puissance de l'arme
      
		setCanvasFont('Arial', '24px',	'normal');
		RectanglePlein(Monde.nLongueur+ 123,126,52,29,'white');
		Rectangle(Monde.nLongueur+ 123,127,50,27,'blue');
		Texte(Monde.nLongueur+138 , 150, 	enChaine(tabArme[avatar.nArme].nForce),	'black');

		// Affichage les munitions
		setCanvasFont('Arial', '24px',	'normal');
		RectanglePlein(Monde.nLongueur+ 39,126,72,29,'white');
		if (avatar.nAttaque == 0) {	
			Rectangle(Monde.nLongueur+ 40,127,70,27,'red');
			Texte(Monde.nLongueur+45 , 150, "---/"+enChaine(tabArme[avatar.nArme].nMunition),	'red');
        } else {
			Rectangle(Monde.nLongueur+ 40,127,70,27,'blue');
			if (avatar.nAttaque<10) {
				Texte(Monde.nLongueur+53 , 150, enChaine(avatar.nAttaque)+"/"+enChaine(tabArme[avatar.nArme].nMunition),	'black');
            } else {
				Texte(Monde.nLongueur+46 , 150, enChaine(avatar.nAttaque)+"/"+enChaine(tabArme[avatar.nArme].nMunition),	'black');
            }
        }

		// Affichage le nom l'arme
		setCanvasFont('Arial', '24px',	'normal');      
		RectanglePlein(Monde.nLongueur+190,127,90,27,'white');
		Rectangle(Monde.nLongueur+190,127,90,27,'blue');
		Texte(Monde.nLongueur+200, 150, tabArme[avatar.nArme].sNom,'black');
      
		RectanglePlein(Monde.nLongueur+90,195,120,120,'black'); // inutil ?
		DrawImage(sImage+tabArme[avatar.nArme].sImage,Monde.nLongueur+90,195,120,120);
		setCanvasFont('Arial', '18px',	'normal');
		RectanglePlein(Monde.nLongueur+ 20,325 ,260,30,'black'); 
		Texte(Monde.nLongueur+ 30, 348 , tabArme[avatar.nArme].sNom,	'white');

		// Points
		setCanvasFont('Arial', '48px',	'normal');
		RectanglePlein(Monde.nLongueur+10,Monde.nHauteur+10,280,70,		'white');
		Rectangle(Monde.nLongueur+10,Monde.nHauteur+10,280,70,'blue');
		Texte(Monde.nLongueur+ 130, Monde.nHauteur+65 ,enChaine(Monde.nPoint),"black");
	}

	function AfficheDashEnvironnement(x, y) {								// Afficher le nom d'un environnement avec sa météo dans le Dashboard

		var Environnement={};
		if (tabMonde[x][y].brouillard) {
			Environnement	= Brouillard;
        } else { 
			Environnement	= tabMonde[x][y].environnement;
        }
		
		// Affichage du texte 'Nom de l'environnement'
		setCanvasFont('Arial', '16px',	'normal');
		// Nom de l'environement
		RectanglePlein(  5,Monde.nHauteur+ 4,190,30,'white');
		Rectangle(  5,Monde.nHauteur+ 4,190,30,'blue');
		Texte(5+ 20, Monde.nHauteur+4+20, Environnement.sNom,	'black');
		// ... le nombre de pas 
		RectanglePlein(135,Monde.nHauteur+40,60,30,				'white');
		Rectangle(135,Monde.nHauteur+40,60,30,					'blue');
		Texte(135+ 20, Monde.nHauteur+40+20, enChaine(avatar.nPas),	'black');
		// ... l'image      
		RectanglePlein(200, Monde.nHauteur+4,100,66,Environnement.sCouleur);      
	}

	function AfficheDashMeteo(x, y) {

		var Meteo = {};
		if (tabMonde[x][y].brouillard) {
			Meteo			= MeteoBrouillard;
        } else { 
			Meteo			= tabMonde[x][y].meteo;
        }
		
		// Affichage la 'Météo'
		// Le temps ...
		RectanglePlein(  5+Monde.nLongueur/2,Monde.nHauteur+ 4,190,30,	'white');
		Rectangle(  5+Monde.nLongueur/2,Monde.nHauteur+ 4,190,30,		'blue');      
		Texte(Monde.nLongueur/2+5+20, Monde.nHauteur+4+20, Meteo.sNom,	'black');
		// ... les dommages ...
		RectanglePlein(135+Monde.nLongueur/2,Monde.nHauteur+40,60,30,	'white');
		Rectangle(135+Monde.nLongueur/2,Monde.nHauteur+40,60,30,		'blue');
		Texte(Monde.nLongueur/2+135+ 20, Monde.nHauteur+40+20, enChaine(Meteo.nAttaque),	'black');
		// ... l'image
		DrawImage(sImage+ Meteo.sIcone,Monde.nLongueur/2+200, Monde.nHauteur,100,75);

	}

	function AfficheDashAnimal(x, y)	{								// Afficher les statistiques d'un animal dans le Dashboard
		var animal ={};
		if (tabMonde[x][y].brouillard) {
			animal = Invisible;
		} else { 
			animal = tabMonde[x][y].animal;
		}
      
		RectanglePlein(Monde.nLongueur+ 60,380 ,50,27,'white');
		Rectangle(Monde.nLongueur+ 60,380 ,50,27,'blue');
      
		RectanglePlein(Monde.nLongueur+127,380 ,50,27,'white');
		Rectangle(Monde.nLongueur+127,380 ,50,27,'blue');
      
		RectanglePlein(Monde.nLongueur+195,380 ,50,27,'white');
		Rectangle(Monde.nLongueur+195,380 ,50,27,'blue');
      
		if ((animal !== Invisible) && (animal !== Aucun)) {
			RectanglePlein(Monde.nLongueur+90,195,120,120,'black'); // inutil ?
			DrawImage(sImage+'grand/'+animal.sImage,Monde.nLongueur+90,195,120,120);
			setCanvasFont('Arial', '18px',	'normal');
			RectanglePlein(Monde.nLongueur+ 20,325 ,260,30,'black'); 
			Texte(Monde.nLongueur+ 30, 348 , animal.sNom,	'white');
        }
      
      
		setCanvasFont('Arial', '24px',	'normal');
		Texte(Monde.nLongueur+ 83, 402 , enChaine(animal.nAttaque),	'black');
		Texte(Monde.nLongueur+143, 402 , enChaine(animal.nDefense),	'black');
		Texte(Monde.nLongueur+205, 402 , enChaine(faune.nTrouve),	'black');

	}

	function Dashboard(x, y) {
		AfficheDashGPS(x, y);
		AfficheDashAvatar();
		AfficheDashEnvironnement(x, y);
		AfficheDashMeteo(x, y);
		AfficheDashAnimal(x, y); 
	}

////////////////////////////////////////////////////////////////////////////////////////
///////////                          DEPLACEMENT & ATTAQUE AVATAR             //////////
////////////////////////////////////////////////////////////////////////////////////////
	function Debrouillage() {													// Affichage du déplacement du personnage dans le tableau
		if (avatar.nDefense !== 0) {
			if (coupe.nTrouve == coupe.nNombre) {
				fin();
              Monde.nPoint+=1000;
              AfficheDashAvatar();
				message(["Les "+enChaine(coupe.nNombre)+" coupes ont été trouvées.",
                         "Félicitation, vous avez gagné !","",""],'coupe.png');
              
			} else {		
                  for (var j = (avatar.y-1); j <= (avatar.y+1); j++) {
                      for (var i = (avatar.x-1); i <= (avatar.x+1); i++) {
                          if (((0<=i) && (i <= (Monde.x-1))) && ((0<=j) && (j<= (Monde.y-1)))) {
                              tabMonde[i][j].brouillard	= false;
                              AfficherCase(i,j);											// i, j, et pas x, y,  car ce sont des "compteurs", pas des "coordonnées"
                          }
                      }
                  }
            }
        } else {
			fin();
			message(["Vous êtes mort","","",""],'');
        }
		AfficherAvatar(avatar.x, avatar.y);
	}

	function CalculAttaqueAnimal(nAttaque, nDefense) {						// Calcul Attaque Animal
		if (nDefense <= 6) {
			return Math.ceil(nAttaque * (nDefense/10));
		} else {
			return nAttaque;
		}
    }

	function AttaqueAnimal(x, y) {											// Messages quand on attaque un animal
		if ((tabMonde[x][y].animal !== Aucun) && (avatar.nDefense > 0 )) {
			// Attaque à main nues
			if (avatar.nAttaque!==0) {
				avatar.nAttaque--;
			} else {
				avatar.nDefense-=10;
				message(["Vous n'avez plus de munitions.","Vous vous battez à main nue.","",""],'');
			}

			// Perte de points de défense : Avatar
			avatar.nDefense-= CalculAttaqueAnimal(tabMonde[x][y].animal.nAttaque, tabMonde[x][y].animal.nDefense);
			if (avatar.nDefense <= 0 )
				avatar.nDefense = 0;

			// Perte de points de défense : Animal 
			if (tabMonde[x][y].animal.nDefense > tabArme[avatar.nArme].nForce) {
				tabMonde[x][y].animal.nDefense-=tabArme[avatar.nArme].nForce;
				message(["Vous venez de rencontrer : ","'"+tabMonde[x][y].animal.sNom+"'","",tabMonde[x][y].animal.nPoint+" points."],tabMonde[x][y].animal.sImage);
				sonTir.play();
			} else {
				faune.nTrouve++;
				Monde.nPoint +=tabMonde[x][y].animal.nPoint;
				sonCri.play();
				messageBestiaire(tabMonde[x][y].animal.sNom,tabMonde[x][y].animal.sImage,tabMonde[x][y].animal.nPoint);
				tabMonde[x][y].animal = Aucun;
			}

		}
	}
	
	function AttaqueMeteo(x, y) {
		if ((!((avatar.x == x) && (avatar.y == y))) && (avatar.nDefense !== 0))	{					// L'attaque météo ne s'exécute qu'une fois
			// Perte de points de défense : Avatar          
			avatar.nDefense-= tabMonde[x][y].meteo.nAttaque;			// La météo peut nous faire perdre des points de vie
			if (avatar.nDefense <= 0 ){
				avatar.nDefense = 0;          
			}
			// On démarre le son de la météo si le son est activé
			// On éteint tous les sons... y a t'il un atre moyen
			for(var i= 0; i<Taille(tabSon) ; i++)							
			{
				tabSon[i].pause();
				tabSon[i].currentTime = 0;
			}
			if (!Monde.bSilence) {
				tabMonde[x][y].meteo.media.play(); 
            }
		}
    }

	function MouseClick(SourisX, SourisY) {										// On calcule la position relative du curseur de la souris
		sonDebut.loop = false;
		sonDebut.pause();
		var Xcurseur = SourisX -  0;											// On rapporte la position de la souris à sa position relative dans le "monde".
		var Ycurseur = SourisY - Monde.nNavigateur;
		if ((Xcurseur < Monde.nLongueur) && (Ycurseur < Monde.nHauteur)) {
			var x = Math.min(Math.abs(Math.floor(Xcurseur/Monde.pas)),(Monde.x-1));
			var y = Math.min(Math.abs(Math.floor(Ycurseur/Monde.pas)),(Monde.y-1));
			if (!Monde.bCree) {
				switch (y) {
					case 18:
						Monde.nNavigateur = 30;
                        break;
					case 17:
                        Monde.nNavigateur = 0;
                        break;
                      default:
						return;
				}
				RectanglePlein(0,0,Monde.nLongueur, Monde.nHauteur,"white");
				CreationMonde();				
				Monde.bCree = true;
            }
			if ((!tabMonde[x][y].brouillard) && ((Math.abs(avatar.x-x)<=1) && (Math.abs(avatar.y-y)<=1))) {
				if ((avatar.x == x) && (avatar.y == y)) {
					AttaqueAnimal(x,y);
				} else {
					if (tabMonde[avatar.x][avatar.y].animal == Aucun) {
						if (avatar.nDefense !== 0) {
							AttaqueMeteo(x,y);
							AttaqueAnimal(x,y);
							avatar.x	= x;
							avatar.y	= y;
							avatar.nPas++;
							Monde.nPoint++;
						}
                    } else {
						message(["Vous devez tuer",
                                  ": '"+tabMonde[avatar.x][avatar.y].animal.sNom+"'",
                                  "pour sortir de la case.",
                                  "Cliquez sur la case ["+avatar.x+";"+avatar.y+"]"],tabMonde[avatar.x][avatar.y].animal.sImage);
                    }
				}
              
			if (avatar.nDefense !== 0) {
				if (tabMonde[avatar.x][avatar.y].coupe) {
					tabMonde[avatar.x][avatar.y].coupe = false;
					coupe.nTrouve++;
					Monde.nPoint+=100*coupe.nTrouve;
					message(["Vous avez récupéré","une coupe !","",""],'coupe.png');
				}
				if (tabMonde[avatar.x][avatar.y].hopital) {
					tabMonde[avatar.x][avatar.y].hopital = false;
					avatar.nDefense += hopital.nPoint;
					message(["Vous avez récupéré","'"+hopital.nPoint+" points' de vie !","",""],'hopital.png');
				}
				if (tabMonde[avatar.x][avatar.y].caserne) {
					tabMonde[avatar.x][avatar.y].caserne = false;
					avatar.nAttaque += caserne.nPoint;
					if (tabArme[avatar.nArme].nMunition < avatar.nAttaque)
						avatar.nAttaque = tabArme[avatar.nArme].nMunition;
					message(["Vous avez récupéré","'"+caserne.nPoint+" munitions' !","N.B : Avec '"+tabArme[avatar.nArme].sNom+"' vous ne pouvez",
                           "dépasser les '"+tabArme[avatar.nArme].nMunition+"' munitions."],'caserne.png');
				}
				if (tabMonde[avatar.x][avatar.y].arme) {
					tabMonde[avatar.x][avatar.y].arme = false;
					avatar.nArme++;
					Monde.nPoint+=10;
					message(["Vous avez récupéré","une nouvelle arme : " +tabArme[avatar.nArme].sNom+".","Maintenant, vous pouvez",
                           "transporter les '"+tabArme[avatar.nArme].nMunition+"' munitions."],'arme.png');
				}
              }
			}
			Dashboard(x, y);
			Debrouillage();														// Retire le brouillard autours de l'avatar
        }
	}

////////////////////////////////////////////////////////////////////////////////////////
///////////                            FIN DU  JEU                            //////////
////////////////////////////////////////////////////////////////////////////////////////	
	
	function fin() {
		for (var j = 0; j < Monde.y; j++) {
			for (var i = 0; i < Monde.x; i++) {
				tabMonde[i][j].brouillard = false;
				AfficherCase(i,j);
			}
		}
	}

////////////////////////////////////////////////////////////////////////////////////////
///////////                             DEBUT DU JEU                          //////////
////////////////////////////////////////////////////////////////////////////////////////
Introduction();


