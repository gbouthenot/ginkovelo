class Ginko {
  constructor(idReq, urlNomStation) {
    this.nbReq = 0;
    this.idReq = idReq;
    this.url = `https://www.ginkoopenapi.fr/TR/getTempsLieu.do?nom=${urlNomStation}`;
    this.dom = document.getElementById(idReq);
  }

  replaceAll (string, search, replace) {
    return string.split(search).join(replace)
  }

  promFetch () {
    const nbReq = ++this.nbReq;
    const nbReqDom = this.dom.querySelector(".nbReq")
    nbReqDom.innerHTML = nbReq + "…";
    return fetch(this.url)
    .then((r)=>{nbReqDom.innerHTML = nbReq; return r.json();})
  }

  fetchFirst () {
    this.promFetch()
    .then(data=>this.firstReq(data))
    .then(data=>this.nextReq(data))
    .catch(r=>console.log("Erreur", r))
  }

  fetchNext () {
    this.promFetch()
    .then(data=>this.nextReq(data))
    .catch(err=>console.log("Erreur", err))
  }

  firstReq(data) {
    const tpldest = document.getElementById("tplDestination").innerHTML;

    // nom de la station
    this.dom.querySelector(".nomArret .value").innerHTML = data.objets.nomExact;

    // ne garde que les lignes de tram
    let r = data.objets.listeTemps.filter(a=>["101", "102"].includes(a.idLigne));

    // ne garde que le nom de destination puis unique
    r = r.map(a=>a.destination).filter((x, i, a) => a.indexOf(x) == i);

    // pour chaque destination
    r.forEach((nomdest)=>{
      let tpl = this.replaceAll(tpldest, "${NOMDEST}", nomdest);
      this.dom.querySelector(".destinations").innerHTML += tpl;
    });

    return data;
  }

  nextReq(r) {
    this.dom.querySelectorAll("ul li.destination").forEach( (domdest) => {
      const domdestvalue = domdest.getAttribute("data-nomdest");
      let temps = r.objets.listeTemps;
      temps = temps.filter((a)=>a.destination==domdestvalue&&a.temps[0]!='I');
      temps = temps.map((a)=>parseInt(a.temps,10)).sort((a,b)=>a-b);
      domdest.querySelector(".horaires").innerHTML = temps;
    });
  }
}
