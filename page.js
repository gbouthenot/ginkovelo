var go_ginko = () => {
    console.log("go_ginko");
    return fetch("https://www.ginkoopenapi.fr/TR/getTempsLieu.do?nom=Chamars")
    .then(r=>r.json())
    .then(r=>r.objets.listeTemps.filter((a)=>a.idArret=="t_cham2"&&a.temps[0]!='I').map((a)=>parseInt(a.temps,10)).sort((a,b)=>a-b))
    .then(r=>`Tramway dans: ${r.join(", ")} minutes`)
}
