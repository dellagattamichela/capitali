# Capitali

App per imparare le capitali del mondo in stile Duolingo: si sceglie un continente e si segue un percorso a unità, dalle capitali più famose a quelle meno note, con lezioni sempre più difficili.

**👉 Provala qui: [capitali-five.vercel.app](https://capitali-five.vercel.app/)**

<img src="public/favicon.svg" alt="Icona di Capitali" width="96">

## Perché esiste

Quest'app è nata per un motivo molto semplice: mi serviva. Cercavo qualcosa per imparare le capitali, ma online o non mi piaceva niente o era tutto pieno di pubblicità. Quindi niente, l'ho fatta io.

Se può essere utile anche a te, tanto meglio! 🤗❤️

## Cosa c'è

- **Percorsi**: Europa, Americhe, Asia, Africa, Oceania (194 stati: membri ONU + Vaticano), più due sotto-percorsi che si sbloccano completando la prima unità del continente: **Capoluoghi d'Italia** (20 regioni) e **Stati Uniti** (50 stati).
- **Lezioni**: ogni unità ha 5 passi — scelta multipla (2 volte, alla prima apparizione la risposta è mostrata), sillabe da comporre, risposta da scrivere, ripasso misto con le unità precedenti e domande al contrario ("di quale paese è capitale…"). Le risposte sbagliate si ripetono in fondo alla lezione.
- **Salta qui**: un test con 3 vite per saltare a un'unità più avanti.
- **Progressi**: XP, giorni di fila, record, città imparate. Tutto salvato nel browser (`localStorage`, chiave `capitali-progress`), nessun account né server.
- **Profilo e avatar**: nome e avatar personalizzabile (viso, capelli, barba, vestiti, accessori, sfondo). L'avatar reagisce nelle lezioni (felice / triste) e alcuni oggetti si sbloccano giocando:

  | Oggetto | Come si sblocca |
  |---|---|
  | Cappello da esploratore | completa la prima unità |
  | Cuffia da aviatore | 7 giorni di fila |
  | Corona | 500 XP |
  | Sfondo "mappa" | completa un intero continente |
  | Spille con bandiera | una per ogni paese imparato |

- **Installabile sul telefono**: "Aggiungi a schermata Home" usa l'icona e si apre a schermo intero.

## Avvio

Serve Node 20.19+ o 22.12+ (richiesto da Vite).

```sh
npm install
npm run dev       # sviluppo su http://localhost:5173
npm test          # test (node --test, senza dipendenze)
npm run lint      # oxlint
npm run build     # versione da pubblicare in dist/
npm run preview   # prova la build
npm run icons     # rigenera le icone PNG da public/favicon.svg (usa Google Chrome)
```

Per provarla sul telefono nella stessa rete: `npm run dev -- --host` e apri l'indirizzo "Network" che compare.

## Struttura

| File | Contenuto |
|---|---|
| `src/data.js` | Percorsi, unità e paesi: `[codice ISO per la bandiera, nome, capitale]` |
| `src/game.js` | Logica pura: sillabe, domande, lezioni, sblocchi del percorso, serie di giorni |
| `src/App.jsx` | Schermate: home, percorso, lezione (navigazione nell'hash dell'URL, così funziona il tasto indietro) |
| `src/Profile.jsx` | Profilo ed editor dell'avatar |
| `src/avatarData.js` | L'avatar come dati: parti, colori, opzioni, condizioni di sblocco |
| `src/Avatar.jsx` | Il disegno SVG dell'avatar |
| `src/*.test.js` | Test |
| `public/` | Icona (`favicon.svg` è l'originale), PNG per il telefono, manifest |

Bandiere da [flagcdn.com](https://flagcdn.com), font Nunito da Google Fonts: servono la connessione.

## Modificare i contenuti

**Paesi e unità** — in `src/data.js` ogni percorso ha delle unità in ordine di importanza:

```js
{ id: 'grandi', title: 'Le grandi capitali', countries: [
  ['it', 'Italia', 'Roma'], ['fr', 'Francia', 'Parigi'],
] },
```

Si possono spostare paesi e unità liberamente; non cambiare però gli `id` delle unità già esistenti, o chi le ha completate perde quei progressi. I test controllano che non ci siano doppioni e che ogni percorso abbia almeno 4 paesi (servono per le 4 opzioni di risposta).

**Avatar** — in `src/avatarData.js` ogni opzione è un elenco di forme `[colore, percorso SVG, spessore?]` disegnate in un riquadro 100×100 (testa centrata in 50,44). Il colore è un token (`base`, `shade`, `light`, ...) calcolato dal colore della parte, così ombre e riflessi vengono da soli. Aggiungere una voce a una tabella (es. `HAIR`) basta perché compaia nell'editor; con `unlock: { xp: 1000 }` diventa un oggetto da sbloccare. Gli avatar salvati con opzioni che non esistono più tornano al valore predefinito.

**Icona** — si modifica `public/favicon.svg`, poi `npm run icons`. Sul telefono va tolta e riaggiunta alla schermata Home per vedere la nuova.
