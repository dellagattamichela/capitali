// percorso → unità (dalle più importanti alle meno note) → [codice ISO (per la bandiera), nome, capitale]
// unlockedBy: "percorso.unità" da completare per sbloccare il percorso
// question/reverse: testo delle domande se diverso da "capitale"/"paese"
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
        ['sm', 'San Marino', 'San Marino'], ['li', 'Liechtenstein', 'Vaduz'], ['mc', 'Monaco', 'Monaco'],
        ['va', 'Vaticano', 'Città del Vaticano'],
      ] },
    ],
  },
  {
    // flagcdn non ha le bandiere delle regioni: si usa il tricolore
    id: 'italia', title: "Capoluoghi d'Italia", icon: '🇮🇹', unlockedBy: 'europa.grandi',
    question: 'Qual è il capoluogo?', reverse: 'Di quale regione è il capoluogo?',
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
        ['py', 'Paraguay', 'Asunción'], ['bo', 'Bolivia', 'Sucre'],
      ] },
      { id: 'centro', title: 'Centro America', countries: [
        ['gt', 'Guatemala', 'Città del Guatemala'], ['hn', 'Honduras', 'Tegucigalpa'], ['sv', 'El Salvador', 'San Salvador'],
        ['ni', 'Nicaragua', 'Managua'], ['cr', 'Costa Rica', 'San José'], ['pa', 'Panama', 'Città di Panama'],
        ['bz', 'Belize', 'Belmopan'],
      ] },
      { id: 'caraibi', title: 'Caraibi e Guiane', countries: [
        ['cu', 'Cuba', "L'Avana"], ['jm', 'Giamaica', 'Kingston'], ['ht', 'Haiti', 'Port-au-Prince'],
        ['do', 'Repubblica Dominicana', 'Santo Domingo'], ['bs', 'Bahamas', 'Nassau'],
        ['tt', 'Trinidad e Tobago', 'Port of Spain'], ['gy', 'Guyana', 'Georgetown'], ['sr', 'Suriname', 'Paramaribo'],
      ] },
      { id: 'antille', title: 'Piccole Antille', countries: [
        ['bb', 'Barbados', 'Bridgetown'], ['gd', 'Grenada', "Saint George's"], ['lc', 'Saint Lucia', 'Castries'],
        ['vc', 'Saint Vincent e Grenadine', 'Kingstown'], ['ag', 'Antigua e Barbuda', "Saint John's"],
        ['dm', 'Dominica', 'Roseau'], ['kn', 'Saint Kitts e Nevis', 'Basseterre'],
      ] },
    ],
  },
  {
    id: 'usa', title: 'Stati Uniti', icon: '🇺🇸', unlockedBy: 'americhe.grandi',
    question: 'Qual è la capitale dello stato?', reverse: 'Di quale stato è la capitale?',
    units: [
      { id: 'grandi', title: 'I grandi stati', countries: [
        ['us-ca', 'California', 'Sacramento'], ['us-tx', 'Texas', 'Austin'], ['us-fl', 'Florida', 'Tallahassee'],
        ['us-ny', 'New York', 'Albany'], ['us-il', 'Illinois', 'Springfield'], ['us-pa', 'Pennsylvania', 'Harrisburg'],
        ['us-wa', 'Washington', 'Olympia'],
      ] },
      { id: 'nordest', title: 'Nord-est', countries: [
        ['us-ma', 'Massachusetts', 'Boston'], ['us-nj', 'New Jersey', 'Trenton'], ['us-ct', 'Connecticut', 'Hartford'],
        ['us-ri', 'Rhode Island', 'Providence'], ['us-nh', 'New Hampshire', 'Concord'], ['us-vt', 'Vermont', 'Montpelier'],
        ['us-me', 'Maine', 'Augusta'],
      ] },
      { id: 'atlantico', title: 'Costa atlantica', countries: [
        ['us-md', 'Maryland', 'Annapolis'], ['us-de', 'Delaware', 'Dover'], ['us-va', 'Virginia', 'Richmond'],
        ['us-wv', 'Virginia Occidentale', 'Charleston'], ['us-nc', 'Carolina del Nord', 'Raleigh'],
        ['us-sc', 'Carolina del Sud', 'Columbia'], ['us-ga', 'Georgia', 'Atlanta'],
      ] },
      { id: 'sud', title: 'Il Sud', countries: [
        ['us-al', 'Alabama', 'Montgomery'], ['us-ms', 'Mississippi', 'Jackson'], ['us-la', 'Louisiana', 'Baton Rouge'],
        ['us-tn', 'Tennessee', 'Nashville'], ['us-ky', 'Kentucky', 'Frankfort'], ['us-ar', 'Arkansas', 'Little Rock'],
        ['us-ok', 'Oklahoma', 'Oklahoma City'],
      ] },
      { id: 'midwest', title: 'Midwest', countries: [
        ['us-oh', 'Ohio', 'Columbus'], ['us-mi', 'Michigan', 'Lansing'], ['us-in', 'Indiana', 'Indianapolis'],
        ['us-wi', 'Wisconsin', 'Madison'], ['us-mn', 'Minnesota', 'Saint Paul'], ['us-ia', 'Iowa', 'Des Moines'],
        ['us-mo', 'Missouri', 'Jefferson City'],
      ] },
      { id: 'pianure', title: 'Grandi pianure e Montagne Rocciose', countries: [
        ['us-ks', 'Kansas', 'Topeka'], ['us-ne', 'Nebraska', 'Lincoln'], ['us-nd', 'Dakota del Nord', 'Bismarck'],
        ['us-sd', 'Dakota del Sud', 'Pierre'], ['us-mt', 'Montana', 'Helena'], ['us-wy', 'Wyoming', 'Cheyenne'],
        ['us-co', 'Colorado', 'Denver'],
      ] },
      { id: 'ovest', title: 'Ovest', countries: [
        ['us-az', 'Arizona', 'Phoenix'], ['us-nv', 'Nevada', 'Carson City'], ['us-ut', 'Utah', 'Salt Lake City'],
        ['us-nm', 'Nuovo Messico', 'Santa Fe'], ['us-id', 'Idaho', 'Boise'], ['us-or', 'Oregon', 'Salem'],
        ['us-ak', 'Alaska', 'Juneau'], ['us-hi', 'Hawaii', 'Honolulu'],
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
        ['kp', 'Corea del Nord', 'Pyongyang'], ['mn', 'Mongolia', 'Ulan Bator'], ['sg', 'Singapore', 'Singapore'],
      ] },
      { id: 'sudest', title: 'Indocina e isole', countries: [
        ['mm', 'Myanmar', 'Naypyidaw'], ['la', 'Laos', 'Vientiane'], ['kh', 'Cambogia', 'Phnom Penh'],
        ['bn', 'Brunei', 'Bandar Seri Begawan'], ['tl', 'Timor Est', 'Dili'],
      ] },
      { id: 'medio', title: 'Medio Oriente', countries: [
        ['sa', 'Arabia Saudita', 'Riad'], ['ae', 'Emirati Arabi Uniti', 'Abu Dhabi'], ['qa', 'Qatar', 'Doha'],
        ['ir', 'Iran', 'Teheran'], ['iq', 'Iraq', 'Baghdad'], ['jo', 'Giordania', 'Amman'],
        ['lb', 'Libano', 'Beirut'], ['sy', 'Siria', 'Damasco'],
      ] },
      { id: 'golfo', title: 'Penisola arabica e Israele', countries: [
        ['il', 'Israele', 'Gerusalemme'], ['kw', 'Kuwait', 'Kuwait City'], ['bh', 'Bahrein', 'Manama'],
        ['om', 'Oman', 'Mascate'], ['ye', 'Yemen', "Sana'a"],
      ] },
      { id: 'sud', title: 'Asia meridionale', countries: [
        ['pk', 'Pakistan', 'Islamabad'], ['bd', 'Bangladesh', 'Dacca'], ['np', 'Nepal', 'Katmandu'],
        ['af', 'Afghanistan', 'Kabul'], ['lk', 'Sri Lanka', 'Sri Jayawardenepura Kotte'], ['mv', 'Maldive', 'Malé'],
        ['bt', 'Bhutan', 'Thimphu'],
      ] },
      { id: 'centro', title: 'Asia centrale e Caucaso', countries: [
        ['kz', 'Kazakistan', 'Astana'], ['uz', 'Uzbekistan', 'Tashkent'], ['ge', 'Georgia', 'Tbilisi'],
        ['am', 'Armenia', 'Erevan'], ['az', 'Azerbaigian', 'Baku'], ['tm', 'Turkmenistan', 'Ashgabat'],
        ['tj', 'Tagikistan', 'Dushanbe'], ['kg', 'Kirghizistan', 'Bishkek'],
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
        ['mr', 'Mauritania', 'Nouakchott'],
      ] },
      { id: 'ovest', title: 'Africa occidentale', countries: [
        ['gh', 'Ghana', 'Accra'], ['sn', 'Senegal', 'Dakar'], ['ml', 'Mali', 'Bamako'],
        ['ci', "Costa d'Avorio", 'Yamoussoukro'], ['bf', 'Burkina Faso', 'Ouagadougou'], ['ne', 'Niger', 'Niamey'],
        ['gn', 'Guinea', 'Conakry'],
      ] },
      { id: 'golfo', title: 'Golfo di Guinea', countries: [
        ['lr', 'Liberia', 'Monrovia'], ['sl', 'Sierra Leone', 'Freetown'], ['gw', 'Guinea-Bissau', 'Bissau'],
        ['gm', 'Gambia', 'Banjul'], ['tg', 'Togo', 'Lomé'], ['bj', 'Benin', 'Porto-Novo'],
      ] },
      { id: 'centro', title: 'Africa centrale', countries: [
        ['cm', 'Camerun', 'Yaoundé'], ['cd', 'RD del Congo', 'Kinshasa'], ['ao', 'Angola', 'Luanda'],
        ['cg', 'Repubblica del Congo', 'Brazzaville'], ['ga', 'Gabon', 'Libreville'],
        ['gq', 'Guinea Equatoriale', 'Malabo'], ['cf', 'Repubblica Centrafricana', 'Bangui'], ['td', 'Ciad', "N'Djamena"],
      ] },
      { id: 'est', title: 'Africa orientale', countries: [
        ['tz', 'Tanzania', 'Dodoma'], ['ug', 'Uganda', 'Kampala'], ['rw', 'Ruanda', 'Kigali'],
        ['so', 'Somalia', 'Mogadiscio'], ['ss', 'Sudan del Sud', 'Giuba'], ['er', 'Eritrea', 'Asmara'],
        ['dj', 'Gibuti', 'Gibuti'], ['bi', 'Burundi', 'Gitega'],
      ] },
      { id: 'sud', title: 'Africa meridionale', countries: [
        ['mz', 'Mozambico', 'Maputo'], ['zw', 'Zimbabwe', 'Harare'], ['zm', 'Zambia', 'Lusaka'],
        ['mw', 'Malawi', 'Lilongwe'], ['na', 'Namibia', 'Windhoek'], ['bw', 'Botswana', 'Gaborone'],
        ['ls', 'Lesotho', 'Maseru'], ['sz', 'eSwatini', 'Mbabane'],
      ] },
      { id: 'isole', title: 'Isole africane', countries: [
        ['mg', 'Madagascar', 'Antananarivo'], ['km', 'Comore', 'Moroni'], ['mu', 'Mauritius', 'Port Louis'],
        ['sc', 'Seychelles', 'Victoria'], ['st', 'São Tomé e Príncipe', 'São Tomé'], ['cv', 'Capo Verde', 'Praia'],
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
      { id: 'isole', title: 'Melanesia e Polinesia', countries: [
        ['ws', 'Samoa', 'Apia'], ['vu', 'Vanuatu', 'Port Vila'], ['sb', 'Isole Salomone', 'Honiara'],
        ['to', 'Tonga', "Nuku'alofa"], ['tv', 'Tuvalu', 'Funafuti'],
      ] },
      { id: 'micro', title: 'Micronesia', countries: [
        ['ki', 'Kiribati', 'Tarawa'], ['nr', 'Nauru', 'Yaren'], ['mh', 'Isole Marshall', 'Majuro'],
        ['fm', 'Micronesia', 'Palikir'], ['pw', 'Palau', 'Ngerulmud'],
      ] },
    ],
  },
]

export const PATHS = RAW.map((p) => ({
  ...p,
  units: p.units.map((u) => ({ ...u, countries: u.countries.map(([code, name, capital]) => ({ code, name, capital })) })),
}))
