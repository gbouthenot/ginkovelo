/* eslint-disable no-plusplus, no-console, no-multiple-empty-lines, no-param-reassign,
   class-methods-use-this, no-unused-vars, prefer-template */

// TODO: add timeout
// TODO: ginko: change should abort fetch

class Ginko {
  constructor(idReq, nomStation) {
    this.nbReq = 0;
    this.rendered = 0;
    this.idReq = idReq;
    this.dom = document.getElementById(idReq);
    this.busy = false;
    this.lastUpdate = 0;
    this.now = 0;
    // render stations:
    let stations = 'Hauts du Chazal; UFR Médecine Pharma; Pôle Santé; CHRU Minjoz; Ile de France; ' +
      'Epoisses; Allende; Micropolis; Malcombe; Rosemont; Brulard; Polygone; Chamars; Canot; Battant; ' +
      'Révolution; République; Parc Micaud; Fontaine Argent; Tristan Bernard; Brûlefoin; Les Vaîtes; ' +
      'Schweitzer; Croix de Palente; Lilas; Orchamps; Fort Benoît; Marnières; Chalezeule';
    stations = stations.split('; ');
    const el = this.dom.querySelector('select');
    stations.forEach((station) => {
      const selected = station === nomStation ? 'selected' : '';
      const html = `<option name="${station}" ${selected}>${station}</option>`;
      el.innerHTML += html;
    });

    // quand on change la station
    el.addEventListener('change', (e) => {
      this.rendered = 0;
      this.fetch();
    });

    // Appui sur bouton
    this.dom.querySelector('.nbReq').addEventListener('click', (e) => {
      this.fetch();
    });

    window.setInterval(_ => this.interrupt(), 1000);
  }

  interrupt() {
    this.now = Math.floor(Date.now() / 1000);
    const interval = parseInt(this.dom.querySelector('.interval').value, 10);
    if (!this.busy && interval > 0 && this.now - this.lastUpdate >= interval) {
      this.fetch();
    }
  }

  timeIso(date = new Date()) {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
      + ':' + ('0' + date.getSeconds()).slice(-2);
  }

  replaceAll(string, search, replace) {
    return string.split(search).join(replace);
  }

  delay(ms) {
    return value => new Promise(resolve => setTimeout(_ => resolve(value), ms));
  }

  promFetch() {
    const nbReq = ++this.nbReq;
    const nbReqDom = this.dom.querySelector('.nbReq');
    const nomStation = this.dom.querySelector('select').value;
    const url = `https://www.ginkoopenapi.fr/TR/getTempsLieu.do?nom=${nomStation}`;
    this.busy = true;
    nbReqDom.innerHTML = `${nbReq}…`;
    return fetch(url)
    .then((r) => {
      this.busy = false;
      this.lastUpdate = Math.floor(Date.now() / 1000);
      nbReqDom.innerHTML = `${nbReq} (${this.timeIso()})`;
      return r.json();
    });
  }


  fetch() {
    this.promFetch()
    .then((data) => {
      if (!this.rendered) {
        this.rendered++;
        return this.firstReq(data);
      }
      return data;
    })
    .then(data => this.nextReq(data))
    .catch(r => console.log('Error', r));
  }

  firstReq(data) {
    const tpldest = document.getElementById('tplDestination').innerHTML;

    // nom de la station
    this.dom.querySelector('.nomArret .value').innerHTML = data.objets.nomExact;

    // ne garde que les lignes de tram
    let r = data.objets.listeTemps.filter(a => ['101', '102'].includes(a.idLigne));

    // ne garde que le nom de destination puis unique
    r = r.map(a => a.destination).filter((x, i, a) => a.indexOf(x) === i);

    const eldests = this.dom.querySelector('.destinations');
    eldests.innerHTML = '';
    // pour chaque destination
    r.forEach((nomdest) => {
      const tpl = this.replaceAll(tpldest, '#{NOMDEST}', nomdest);
      eldests.innerHTML += tpl;
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
    this.busy = false;
    this.lastUpdate = 0;
    this.lastData = [];
    this.now = 0;

    // checkbox "show all"
    this.dom.querySelector('input[type=checkbox]').addEventListener('change', (_) => {
      this.render();
    });

    // Appui sur bouton
    this.dom.querySelector('.nbReq').addEventListener('click', (e) => {
      this.fetch();
    });

    window.setInterval(_ => this.interrupt(), 1000);
  }

  interrupt() {
    this.now = Math.floor(Date.now() / 1000);
    const interval = parseInt(this.dom.querySelector('.interval').value, 10);
    if (!this.busy && interval > 0 && this.now - this.lastUpdate >= interval) {
      this.fetch();
    }
  }

  timeIso(date = new Date()) {
    /* eslint-disable prefer-template */
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2)
      + ':' + ('0' + date.getSeconds()).slice(-2);
    /* eslint-enable prefer-template */
  }

  delay(ms) {
    return value => new Promise(resolve => setTimeout(_ => resolve(value), ms));
  }

  promFetch() {
    const nbReq = ++this.nbReq;
    const nbReqDom = this.dom.querySelector('.nbReq');
    this.busy = true;
    nbReqDom.innerHTML = `${nbReq}…`;
    return fetch(this.url)
    .then((r) => {
      this.busy = false;
      this.lastUpdate = Math.floor(Date.now() / 1000);
      nbReqDom.innerHTML = `${nbReq} (${this.timeIso()})`;
      return r.json();
    });
  }

  fetch() {
    this.promFetch()
    .then((data) => {
      this.lastData = data;
      this.render();
    })
    .catch(r => console.log('Erreur', r));
  }

  render() {
    const r = this.lastData;
    const showAll = this.dom.querySelector('input[type=checkbox]').checked;
    const show = [13, 11, 12, 17];
    let txt = '';
    let stations = [];

    if (showAll) {
      // trie par numéro
      stations = r.sort((a, b) => a.number - b.number);
    } else {
      show.forEach((a) => {
        const station = r.find(b => b.number === a);
        if (station) {
          stations.push(station);
        }
      });
    }

    stations.forEach((st) => {
      const name = st.name.toLocaleLowerCase().replace(' (cb)', '');
      const ava = st.available_bikes;
      const tot = st.bike_stands;
      const pc = ava / tot;
      let cls = '';console.log(pc);
      if (pc >= 0.7) {
        cls = 'verygood';
      } else if (pc < 0.2) {
        cls = 'verybad';
      } else if (pc < 0.5) {
        cls = 'warn';
      }

      txt += `${name}: <span class="${cls}">${ava}/${tot}</span><br />`;
    });
    this.dom.querySelector('.stations').innerHTML = txt;
  }
}
