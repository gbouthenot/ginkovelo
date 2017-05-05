class Ginko {
  constructor(idReq, idTarget, idTarget2, idTarget3) {
    this.nbReq = 0;
    this.idReq = idReq;
    this.idTarget = idTarget;
    this.idTarget2 = idTarget2;
    this.idTarget3 = idTarget3;
    this.nomStation = "";
  }

  fetch1st () {
    fetch("https://www.ginkoopenapi.fr/TR/getTempsLieu.do?nom=Chamars")
    .then(r=>r.json())
    // obtient le nom de la station
    .then(r=>{
      this.nomStation = r.objets.nomExact;
      return r;
    })
    // ne garde que les temps
    .then(r => r.objets.listeTemps)
    // ne garde que les lignes de tram
    .then(r=>r.filter(a=>["101", "102"].includes(a.idLigne)))
    // ne garde que le nom de destination
    .then(r=>r.map(a=>a.destination))
    // unique
    .then(r=>r.filter((x, i, a) => a.indexOf(x) == i))
    .then(r=>console.log(r))
  }

  fetch () {
    console.log("fetch", this);

    var nbReq = ++this.nbReq;

    document.getElementById(this.idReq).innerHTML = nbReq + "…";
    return fetch("https://www.ginkoopenapi.fr/TR/getTempsLieu.do?nom=Chamars")
    .then(r=>r.json())
//    .then(r=>r.objets.listeTemps.filter((a)=>a.idArret=="t_cham2"&&a.temps[0]!='I').map((a)=>parseInt(a.temps,10)).sort((a,b)=>a-b))
    .then(r=> [
      r.objets.listeTemps.filter((a)=>a.destination=="Hauts du Chazal"&&a.temps[0]!='I').map((a)=>parseInt(a.temps,10)).sort((a,b)=>a-b)
      , r.objets.listeTemps.filter((a)=>a.destination=="Chalezeule"&&a.temps[0]!='I').map((a)=>parseInt(a.temps,10)).sort((a,b)=>a-b)
      , r.objets.listeTemps.filter((a)=>a.destination=="Gare Viotte"&&a.temps[0]!='I').map((a)=>parseInt(a.temps,10)).sort((a,b)=>a-b)
    ])
    .then(r=>[
      `Tramway dans: ${r[0].join(", ")} minutes`
      , `Tramway dans: ${r[1].join(", ")} minutes`
      , `Tramway dans: ${r[2].join(", ")} minutes`
    ])
    .then(r=>{
      document.getElementById(this.idReq).innerHTML = nbReq;
      document.getElementById(this.idTarget).innerHTML = r[0];
      document.getElementById(this.idTarget2).innerHTML = r[1];
      document.getElementById(this.idTarget3).innerHTML = r[2];
    })
  }
}
