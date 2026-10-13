const MVA = 0.25;

function valgt(id) {
    return document.getElementById(id).selectedOptions[0];
}

function kr(tall) {
    return Math.round(tall).toLocaleString("nb-NO") + " kr";
}

function beregnPris() {
    let total = 0;

    document.querySelectorAll("select").forEach(function (valg) {
        total += Number(valg.value) || 0;
    });

    document.getElementById("pris").textContent = total;
}

function lagTilbud() {
    const antall = Number(document.getElementById("antall").value) || 1;

    const komponenter = [
        ["GPU", "GPU"],
        ["RAM", "ram"],
        ["CPU", "CPU"],
        ["Hovedkort", "motherboard"],
        ["PSU", "PSU"],
        ["Lagring", "Storage"]
    ];

    let enhetspris = 0;
    let rader = "";

    komponenter.forEach(function ([navn, id]) {
        const valg = valgt(id);
        const pris = Number(valg.value) || 0;
        enhetspris += pris;

        const lager = valg.dataset.lager ? " (" + valg.dataset.lager + ")" : "";
        rader += "<tr><td>" + navn + "</td><td>" + valg.textContent + lager +
                 "</td><td>" + kr(pris) + "</td></tr>";
    });

    document.querySelectorAll(".tillegg:checked").forEach(function (boks) {
        const pris = Number(boks.value);
        enhetspris += pris;
        rader += "<tr><td>Tillegg</td><td>" + boks.parentElement.textContent.trim() +
                 "</td><td>" + kr(pris) + "</td></tr>";
    });

    document.getElementById("tilbudRader").innerHTML = rader;

    let sum = enhetspris * antall;
    let rabattTekst = "Rabatt lagt til: 25% (mer enn 5 stk)";

    if (antall > 5) {
        const rabatt = sum * 0.10;
        sum -= rabatt;
        rabattTekst = "Bedriftsrabatt 10 % (mer enn 5 stk): -" + kr(rabatt);
    }

    const mva = sum * MVA;

    document.getElementById("pris").textContent = Math.round(sum + mva);
    document.getElementById("eksMva").textContent = kr(sum);
    document.getElementById("mva").textContent = kr(mva);
    document.getElementById("inklMva").textContent = kr(sum + mva);
    document.getElementById("rabattTekst").textContent = rabattTekst;

    sjekkKompatibilitet();
}

function sjekkKompatibilitet() {
    const feil = [];

    const merke = valgt("CPU").dataset.merke;
    const sokkel = valgt("motherboard").dataset.sokkel;

    const cpuOk = (merke === "intel" && sokkel === "LGA1700") ||
                  (merke === "amd" && sokkel === "AM5");
    if (!cpuOk) {
        feil.push("Prosessoren passer ikke til hovedkortet (Intel krever LGA1700, AMD krever AM5).");
    }

    const kravWatt = Number(valgt("GPU").dataset.watt) || 0;
    const psuWatt = Number(valgt("PSU").dataset.watt) || 0;
    if (psuWatt < kravWatt) {
        feil.push("Strømforsyningen er for svak: skjermkortet anbefaler minst " +
                  kravWatt + "W, du har valgt " + psuWatt + "W.");
    }

    const melding = document.getElementById("melding");
    if (feil.length === 0) {
        melding.className = "ok";
        melding.textContent = "Alle komponentene er kompatible ✓";
    } else {
        melding.className = "feil";
        melding.innerHTML = feil.map(function (f) { return "⚠ " + f; }).join("<br>");
    }

    return feil.length === 0;
}

if (antall > 5) {
    const rabatt = sum * 0.25;
    sum -= rabatt;
    rabattTekst = "Bedriftsrabatt 25 % (mer enn 5 stk): -" + kr(rabatt);
}