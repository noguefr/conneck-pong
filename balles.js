//===== Texte au format UTF-8 =====
/*globals document, setTimeout*/
var div_cadre, div_compteur, div_balle, div_vitesse;

var largeurBalle = 60;
var nbCouleurs = 10; // pour les images des balles
// Position et taille du cadre
var cadreTop = 50;
var cadreLeft = 150;
var cadreWidth = 900;
var cadreHeight = 600;
// balles qui rebondissent
var enMarche = true;

// entier au hasard entre a et b
function nombreAuHasard(a, b) {
	return Math.floor(Math.random() * (b - a) + a);
}

// entier au hasard différent de 0 entre a et b
function nombreAuHasardNonNul(a, b) {
	var h = nombreAuHasard(a, b);
	while (h === 0) {
		h = nombreAuHasard(a, b);
	}
	return h;
}

// bouge toutes les balles du cadre d'un pas
// selon le vecteur de direction de chacune
function bougerBalles() {
	var vecth, vectv, posh, posv, k;
	var vitesse  =document.getElementById("vitesse").value;
	for (k = 0 ; k < div_balle.length; ++k) {
		// pour chacune des balles actives
		// récupère le vecteur actuel de la balle
		vecth = div_balle[k].getAttribute("vecth");
		vectv = div_balle[k].getAttribute("vectv");
		// récupère la position actuelle de la balle
		posh = parseFloat(div_balle[k].style.left);
		posv = parseFloat(div_balle[k].style.top);
		//console.log("posv =="+posv+" Vs "+div_balle[k].style.top);

		// calcule le pas suivant
		posh += vitesse * vecth;
		posv += vitesse * vectv;

        //console.log("vitesse =="+vitesse);

		if (posh < 0 || posh > cadreWidth - largeurBalle) {
			// rebond gauche / droite
			div_balle[k].setAttribute("vecth", -vecth.toString());
		} else if (posv < 0 || posv > cadreHeight - largeurBalle) {
			// rebond haut / bas
			div_balle[k].setAttribute("vectv", -vectv.toString());
		} else {
			// avance d'un pas
			div_balle[k].style.left = posh + "px";
			div_balle[k].style.top = posv + "px";
		}
	}
	if (enMarche) {
		// si en mode Marche on appelle à nouveau
		setTimeout(bougerBalles, 0);
	}
}

// crée et retourne un élément <img> initialisé
function nouvelleBalle() {

//temps = t
//vitesse = v
//origine = (x, y, z)
//vecteur directeur = (a, b, c)

//nouvelle position à l'instant t:
//pos = (x + (t*v)*cos(a), y + (t*v)*cos(b), z + (t*v)*cos(c))
//posx = x + t*

	// numéro d'une image d'une certaine couleur
	var num = div_balle.length % nbCouleurs;
	var balle = document.createElement("img");
	balle.className = "balle";
	balle.src = "img/tennis" + 1/*num*/ + ".png";
	// position de départ (au hasard près du centre)
	balle.style.left = nombreAuHasard(cadreWidth / 2 - largeurBalle, cadreWidth / 2 + largeurBalle) + "px";
	balle.style.top = nombreAuHasard(cadreHeight / 2 - largeurBalle, cadreHeight / 2 + largeurBalle) + "px";
	/// vecteur de déplacement (vectv,vecth) au hasard
	/// mémorisé dans les attributs de chaque balle
	balle.setAttribute("vectv", nombreAuHasardNonNul(-4, 4));
	balle.setAttribute("vecth", nombreAuHasardNonNul(-4, 4));
	// Vitesse de départ egale sur toutes les balles 
	var angle = Math.random() * (2*Math.PI - 0) + 0;

	console.log("vAngle =="+angle+"  -- 2PI --"+2*Math.PI);
    balle.setAttribute("vectv", 3*Math.sin(angle));
	balle.setAttribute("vecth", 3*Math.cos(angle)); 
	//console.log("vYY =="+Math.sin(angle));
	//console.log("vXX =="+Math.cos(angle));
	balle.setAttribute("number", num);
	var myBall = num+1;
    balle.setAttribute("title", "balle numero : "+myBall);

	// on ajoute à la liste des balles actives
	div_balle.push(balle);
	return balle;
}

// affiche le texte du compteur
function actualiserCompteur() {
	var txt = (enMarche ? "" : "Pause : ");
	if (div_balle.length === 0) {
		txt += "pas de balle";
	} else {
		txt += div_balle.length + " balle" + (div_balle.length > 1 ? "s" : "");
	}
	div_compteur.innerHTML = txt;
}

// bouton Marche / Arrêt
function clicMarcheArret(bouton) {
	if (enMarche) {
		bouton.innerHTML = "Marche";
		// balles figées sur fond gris
		div_cadre.className = "stop";
	} else {
		bouton.innerHTML = "Arrêt";
		// balles mobiles sur fond blanc
		div_cadre.className = "running";
		setTimeout(bougerBalles, 0);
		//
		afficheNumeroBalles();
	}
	// chnge de mode
	enMarche = ! enMarche;
	actualiserCompteur();
}

function afficheNumeroBalles(){
    //var k;
	//for (k = 0 ; k < div_balle.length; k++) {
	//	//div_balle[k].setAttribute("p", div_balle[k].getAttribute("number").value);
	//	console.log("numeros balles = "+div_balle[k].getAttribute("number"));
	//}
}


// bouton Nouvelle Balle
function clicNouvelleBalle() {
	div_cadre.appendChild(nouvelleBalle());
	actualiserCompteur();
}

// bouton Effacer
function clicEffacer() {
	// vide le cadre des <img> des balles
	while (div_cadre.firstChild) {
		div_cadre.removeChild(div_cadre.firstChild);
	}
	// on vide la liste des balles actives
	div_balle = [];
	actualiserCompteur();
}

// Initialisation
function init() {
	// récupère la <div> du compteur
	div_compteur = document.getElementById("compteur");
	// récupère la <div> du cadre
	div_cadre = document.getElementById("cadre");

    div_cadre.className = "running";
	console.log("vistesse balle =="+div_vitesse);
	// fixe position et taille
	div_cadre.style.top = cadreTop + "px";
	div_cadre.style.left = cadreLeft + "px";
	div_cadre.style.width = cadreWidth + "px";
	div_cadre.style.height = cadreHeight + "px";
	// initialise à vide la liste des balles actives
	div_balle = [];
	// placer une balle dans le cadre
	div_cadre.appendChild(nouvelleBalle());
	setTimeout(bougerBalles, 0);
}


