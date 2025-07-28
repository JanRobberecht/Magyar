/*

Je zei:
document.getElementsByTagName("body")[0].addEventListener("click", clickEventHandler); 

if (e.target.matches("#btn-increase")) { increaseFontSizeRem() }

hoe kan je dit click event anders schrijven


ChatGPT zei:
Je huidige code gebruikt een event listener op het hele document om clicks af te vangen, en vervolgens controleer je of het geklikte element overeenkomt met een specifieke selector. Dit is een vorm van event delegation.

Je vroeg hoe je dit click event "anders" kunt schrijven. Hieronder geef ik je drie alternatieven:

✅ 1. Directe event listener op het element zelf (meest specifiek)
Als je weet dat de knop altijd aanwezig is in de DOM:

javascript
Kopiëren
Bewerken
document.getElementById("btn-increase").addEventListener("click", function() {
    increaseFontSizeRem();
});
✔️ Voordelen: eenvoudiger, beter leesbaar, geen matches nodig
❌ Nadeel: werkt alleen als #btn-increase al in de DOM staat bij het uitvoeren van dit script (dus niet bij dynamisch geladen content).

✅ 2. Event delegation, maar specifieker en leesbaarder geschreven
Een meer gestructureerde vorm van wat je al doet:

javascript
Kopiëren
Bewerken
document.body.addEventListener("click", function(e) {
    if (e.target.closest("#btn-increase")) {
        increaseFontSizeRem();
    }
});
✔️ Voordelen:

Werkt ook voor dynamisch toegevoegde knoppen

closest() is veiliger dan matches() als de klik op een kind-element gebeurt

✅ 3. Gebruik van één algemene handler met meerdere condities
Als je meerdere knoppen hebt, kun je dit ook uitbreiden:

javascript
Kopiëren
Bewerken
document.body.addEventListener("click", function(e) {
    const target = e.target;

    if (target.closest("#btn-increase")) {
        increaseFontSizeRem();
    } else if (target.closest("#btn-decrease")) {
        decreaseFontSizeRem();
    }
    // etc.
});
✅ Bonus: moderne, compacte syntax (met arrow function)
javascript
Kopiëren
Bewerken
document.body.addEventListener("click", (e) => {
    if (e.target.closest("#btn-increase")) increaseFontSizeRem();
});
*/
