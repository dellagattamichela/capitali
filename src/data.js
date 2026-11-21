// percorso → unità (dalle più importanti alle meno note) → [codice ISO (per la bandiera), nome, capitale]
// unlockedBy: "percorso.unità" da completare per sbloccare il percorso
const RAW = [
  {
    id: 'europa', title: 'Europa', icon: '🌍',
    units: [
      { id: 'grandi', title: 'Le grandi capitali', countries: [
        ['it', 'Italia', 'Roma'], ['fr', 'Francia', 'Parigi'], ['de', 'Germania', 'Berlino'],
        ['es', 'Spagna', 'Madrid'], ['gb', 'Regno Unito', 'Londra'], ['pt', 'Portogallo', 'Lisbona'],
      ] },
      { id: 'ovest', title: 'Europa occidentale', countries: [
        ['ie', 'Irlanda', 'Dublino'], ['nl', 'Paesi Bassi', 'Amsterdam'], ['be', 'Belgio', 'Bruxelles'],
        ['ch', 'Svizzera', 'Berna'], ['at', 'Austria', 'Vienna'], ['gr', 'Grecia', 'Atene'],
      ] },
      { id: 'nord', title: 'Europa del nord', countries: [
        ['dk', 'Danimarca', 'Copenaghen'], ['se', 'Svezia', 'Stoccolma'], ['no', 'Norvegia', 'Oslo'],
        ['fi', 'Finlandia', 'Helsinki'], ['is', 'Islanda', 'Reykjavík'],
      ] },
      { id: 'est', title: "Europa dell'est", countries: [
        ['pl', 'Polonia', 'Varsavia'], ['cz', 'Repubblica Ceca', 'Praga'], ['hu', 'Ungheria', 'Budapest'],
        ['ru', 'Russia', 'Mosca'], ['ua', 'Ucraina', 'Kiev'], ['ro', 'Romania', 'Bucarest'],
      ] },
      { id: 'balcani', title: 'Balcani', countries: [
        ['hr', 'Croazia', 'Zagabria'], ['si', 'Slovenia', 'Lubiana'], ['rs', 'Serbia', 'Belgrado'],
        ['ba', 'Bosnia ed Erzegovina', 'Sarajevo'], ['me', 'Montenegro', 'Podgorica'],
        ['mk', 'Macedonia del Nord', 'Skopje'], ['al', 'Albania', 'Tirana'], ['bg', 'Bulgaria', 'Sofia'],
      ] },
      { id: 'confini', title: "Ai confini d'Europa", countries: [
        ['sk', 'Slovacchia', 'Bratislava'], ['ee', 'Estonia', 'Tallinn'], ['lv', 'Lettonia', 'Riga'],
        ['lt', 'Lituania', 'Vilnius'], ['by', 'Bielorussia', 'Minsk'], ['md', 'Moldavia', 'Chișinău'],
        ['tr', 'Turchia', 'Ankara'], ['cy', 'Cipro', 'Nicosia'],
      ] },
      { id: 'piccoli', title: 'Piccoli stati', countries: [
        ['lu', 'Lussemburgo', 'Lussemburgo'], ['mt', 'Malta', 'La Valletta'], ['ad', 'Andorra', 'Andorra la Vella'],
        ['sm', 'San Marino', 'San Marino'], ['li', 'Liechtenstein', 'Vaduz'],
      ] },
    ],
  },
  {
    // flagcdn non ha le bandiere delle regioni: si usa il tricolore
    id: 'italia', title: "Capoluoghi d'Italia", icon: '🇮🇹', unlockedBy: 'europa.grandi', question: 'Qual è il capoluogo?',
    units: [
      { id: 'nord', title: 'Nord Italia', countries: [
        ['it', 'Piemonte', 'Torino'], ['it', "Valle d'Aosta", 'Aosta'], ['it', 'Lombardia', 'Milano'],
        ['it', 'Trentino-Alto Adige', 'Trento'], ['it', 'Veneto', 'Venezia'], ['it', 'Friuli-Venezia Giulia', 'Trieste'],
        ['it', 'Liguria', 'Genova'], ['it', 'Emilia-Romagna', 'Bologna'],
      ] },
      { id: 'centro', title: 'Centro Italia', countries: [
        ['it', 'Toscana', 'Firenze'], ['it', 'Umbria', 'Perugia'], ['it', 'Marche', 'Ancona'], ['it', 'Lazio', 'Roma'],
      ] },
      { id: 'sud', title: 'Sud e isole', countries: [
        ['it', 'Abruzzo', "L'Aquila"], ['it', 'Molise', 'Campobasso'], ['it', 'Campania', 'Napoli'],
        ['it', 'Puglia', 'Bari'], ['it', 'Basilicata', 'Potenza'], ['it', 'Calabria', 'Catanzaro'],
        ['it', 'Sicilia', 'Palermo'], ['it', 'Sardegna', 'Cagliari'],
      ] },
    ],
  },
  {
    id: 'americhe', title: 'Americhe', icon: '🌎',
    units: [
      { id: 'grandi', title: 'Le grandi capitali', countries: [
        ['us', 'Stati Uniti', 'Washington'], ['ca', 'Canada', 'Ottawa'], ['mx', 'Messico', 'Città del Messico'],
        ['br', 'Brasile', 'Brasília'], ['ar', 'Argentina', 'Buenos Aires'],
      ] },
      { id: 'sud', title: 'Sud America', countries: [
        ['cl', 'Cile', 'Santiago'], ['pe', 'Perù', 'Lima'], ['co', 'Colombia', 'Bogotà'],
        ['ve', 'Venezuela', 'Caracas'], ['ec', 'Ecuador', 'Quito'], ['uy', 'Uruguay', 'Montevideo'],
        ['py', 'Paraguay', 'Asunción'],
      ] },
      { id: 'caraibi', title: 'Centro America e Caraibi', countries: [
        ['cu', 'Cuba', "L'Avana"], ['jm', 'Giamaica', 'Kingston'], ['cr', 'Costa Rica', 'San José'],
      ] },
    ],
  },
  {
    id: 'asia', title: 'Asia', icon: '🌏',
    units: [
      { id: 'grandi', title: 'Le grandi capitali', countries: [
        ['cn', 'Cina', 'Pechino'], ['jp', 'Giappone', 'Tokyo'], ['in', 'India', 'Nuova Delhi'],
        ['kr', 'Corea del Sud', 'Seul'], ['id', 'Indonesia', 'Giacarta'], ['th', 'Thailandia', 'Bangkok'],
      ] },
      { id: 'est', title: 'Asia orientale e sud-est', countries: [
        ['vn', 'Vietnam', 'Hanoi'], ['ph', 'Filippine', 'Manila'], ['my', 'Malesia', 'Kuala Lumpur'],
        ['kp', 'Corea del Nord', 'Pyongyang'], ['mn', 'Mongolia', 'Ulan Bator'],
      ] },
      { id: 'medio', title: 'Medio Oriente', countries: [
        ['sa', 'Arabia Saudita', 'Riad'], ['ae', 'Emirati Arabi Uniti', 'Abu Dhabi'], ['qa', 'Qatar', 'Doha'],
        ['ir', 'Iran', 'Teheran'], ['iq', 'Iraq', 'Baghdad'], ['jo', 'Giordania', 'Amman'],
        ['lb', 'Libano', 'Beirut'], ['sy', 'Siria', 'Damasco'],
      ] },
      { id: 'sud', title: 'Asia meridionale', countries: [
        ['pk', 'Pakistan', 'Islamabad'], ['bd', 'Bangladesh', 'Dacca'], ['np', 'Nepal', 'Katmandu'],
        ['af', 'Afghanistan', 'Kabul'],
      ] },
      { id: 'centro', title: 'Asia centrale e Caucaso', countries: [
        ['kz', 'Kazakistan', 'Astana'], ['uz', 'Uzbekistan', 'Tashkent'], ['ge', 'Georgia', 'Tbilisi'],
        ['am', 'Armenia', 'Erevan'], ['az', 'Azerbaigian', 'Baku'],
      ] },
    ],
  },
  {
    id: 'africa', title: 'Africa', icon: '🌍',
    units: [
      { id: 'grandi', title: 'Le grandi capitali', countries: [
        ['eg', 'Egitto', 'Il Cairo'], ['za', 'Sudafrica', 'Pretoria'], ['ng', 'Nigeria', 'Abuja'],
        ['ke', 'Kenya', 'Nairobi'], ['ma', 'Marocco', 'Rabat'], ['et', 'Etiopia', 'Addis Abeba'],
      ] },
      { id: 'nord', title: 'Nord Africa', countries: [
        ['dz', 'Algeria', 'Algeri'], ['tn', 'Tunisia', 'Tunisi'], ['ly', 'Libia', 'Tripoli'], ['sd', 'Sudan', 'Khartum'],
      ] },
      { id: 'ovest', title: 'Africa occidentale e centrale', countries: [
        ['gh', 'Ghana', 'Accra'], ['sn', 'Senegal', 'Dakar'], ['ml', 'Mali', 'Bamako'],
        ['cm', 'Camerun', 'Yaoundé'], ['cd', 'RD del Congo', 'Kinshasa'], ['ao', 'Angola', 'Luanda'],
      ] },
      { id: 'est', title: 'Africa orientale e meridionale', countries: [
        ['tz', 'Tanzania', 'Dodoma'], ['ug', 'Uganda', 'Kampala'], ['rw', 'Ruanda', 'Kigali'],
        ['so', 'Somalia', 'Mogadiscio'], ['mz', 'Mozambico', 'Maputo'], ['zw', 'Zimbabwe', 'Harare'],
        ['mg', 'Madagascar', 'Antananarivo'],
      ] },
    ],
  },
  {
    id: 'oceania', title: 'Oceania', icon: '🌏',
    units: [
      { id: 'grandi', title: 'Le grandi capitali', countries: [
        ['au', 'Australia', 'Canberra'], ['nz', 'Nuova Zelanda', 'Wellington'], ['fj', 'Figi', 'Suva'],
        ['pg', 'Papua Nuova Guinea', 'Port Moresby'],
      ] },
      { id: 'isole', title: 'Le isole del Pacifico', countries: [
        ['ws', 'Samoa', 'Apia'], ['vu', 'Vanuatu', 'Port Vila'], ['sb', 'Isole Salomone', 'Honiara'],
      ] },
    ],
  },
]

export const PATHS = RAW.map((p) => ({
  ...p,
  units: p.units.map((u) => ({ ...u, countries: u.countries.map(([code, name, capital]) => ({ code, name, capital })) })),
}))
