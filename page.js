/* eslint-disable no-plusplus, no-console, no-multiple-empty-lines, no-param-reassign,
   class-methods-use-this */
class Ginko {
  constructor(idReq, urlNomStation) {
    this.nbReq = 0;
    this.rendered = 0;
    this.idReq = idReq;
    this.url = `https://www.ginkoopenapi.fr/TR/getTempsLieu.do?nom=${urlNomStation}`;
    this.dom = document.getElementById(idReq);
  }

  timeIso(date = new Date()) {
    /* eslint-disable prefer-template */
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
      + ':' + ('0' + date.getSeconds()).slice(-2);
    /* eslint-enable prefer-template */
  }

  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  promFetch() {
    const nbReq = ++this.nbReq;
    const nbReqDom = this.dom.querySelector('.nbReq');
    nbReqDom.innerHTML = `${nbReq}…`;
    return fetch(this.url)
    .then((r) => { nbReqDom.innerHTML = `${nbReq} (${this.timeIso()})`; return r.json(); });
  }

  fetch() {
    const prom = this.promFetch();

    if (!this.rendered) {
      prom.then(data => this.firstReq(data));
      this.rendered++;
    }
    prom.then(data => this.nextReq(data));
    prom.catch(r => console.log('Error', r));
  }

  firstReq(data) {
    const tpldest = document.getElementById('tplDestination').innerHTML;

    // nom de la station
    this.dom.querySelector('.nomArret .value').innerHTML = data.objets.nomExact;

    // ne garde que les lignes de tram
    let r = data.objets.listeTemps.filter(a => ['101', '102'].includes(a.idLigne));

    // ne garde que le nom de destination puis unique
    r = r.map(a => a.destination).filter((x, i, a) => a.indexOf(x) === i);

    // pour chaque destination
    r.forEach((nomdest) => {
      const tpl = this.replaceAll(tpldest, '#{NOMDEST}', nomdest);
      this.dom.querySelector('.destinations').innerHTML += tpl;
    });

    return data;
  }

  nextReq(r) {
    this.dom.querySelectorAll('ul li.destination').forEach((domdest) => {
      const domdestvalue = domdest.getAttribute('data-nomdest');
      let temps = r.objets.listeTemps;
      temps = temps.filter(a => a.destination === domdestvalue && a.temps[0] !== 'I');
      temps = temps.map(a => parseInt(a.temps, 10)).sort((a, b) => a - b);
      domdest.querySelector('.horaires').innerHTML = temps;
    });
  }
}







class Velocite {
  constructor(idReq, contract, apiKey) {
    this.nbReq = 0;
    this.idReq = idReq;
    this.url = `https://api.jcdecaux.com/vls/v1/stations?contract=${contract}&apiKey=${apiKey}`;
    this.dom = document.getElementById(idReq);
  }

  timeIso(date = new Date()) {
    /* eslint-disable prefer-template */
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
      + ':' + ('0' + date.getSeconds()).slice(-2);
    /* eslint-enable prefer-template */
  }

  promFetch() {
    const nbReq = ++this.nbReq;
    const nbReqDom = this.dom.querySelector('.nbReq');
    nbReqDom.innerHTML = `${nbReq}…`;
    return fetch(this.url)
    .then((r) => { nbReqDom.innerHTML = `${nbReq} (${this.timeIso()})`; return r.json(); });
  }

  fetch() {
    const prom = this.promFetch();

    prom.then(data => this.nextReq(data));
    prom.catch(r => console.log('Erreur', r));
  }

  nextReq(r) {
    let txt = '';
    // trie par numéro
    r = r.sort((a, b) => a.number - b.number);

    r.forEach((st) => {
      txt += `${st.name.toLocaleLowerCase()}: ${st.available_bikes}/${st.bike_stands}<br />`;
    });
    this.dom.querySelector('.stations').innerHTML = txt;
  }
}
