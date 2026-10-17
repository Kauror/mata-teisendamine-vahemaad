// Kaardimäng: the hand-curated decisions the data build applies on top of the
// downloaded sources (see sources.json). Everything a person decided lives
// here, in one reviewable file; everything a source says is read by
// build-map-data.mjs and never retyped.
//
// Row: [iso3, EKI short name (exact, bold row), world part, subregions, wellKnown, capitals]
// capitals: [] (none) or a list of { ne | coord, role, quiz, note? }. When a row
// has one capital and no override, its Estonian name comes from the EKI row.
//
// Subregions follow the package's learning sets (MAAILMAJAOD_JA_TASEMED.json),
// completed to cover every country of the world part; overlaps are allowed
// where the package allows them. wellKnown marks the Avastaja (easy) pool.

import type { CapitalRole, WorldPartId } from '../../src/content/kaardimang/regions';

export type CapitalSpec = {
  ne?: string;
  coord?: [number, number];
  coordSource?: string;
  role: CapitalRole;
  quiz: boolean;
  et?: string;
  note?: string;
  otherNames?: string[];
  nameSource?: string;
};
export type CountryRow = [string, string, Exclude<WorldPartId, 'antarctica'>, string[], boolean, CapitalSpec[]];
export type SpecialRow = [string, string, Exclude<WorldPartId, 'antarctica'>, string[], 'un_observer' | 'partially_recognised' | 'disputed', CapitalSpec[], string];

const C = (ne: string, role: CapitalRole = 'official', quiz = true, extra: Partial<CapitalSpec> = {}): CapitalSpec => ({ ne, role, quiz, ...extra });

export const COUNTRIES: CountryRow[] = [
  // Euroopa
  ['ALB', 'Albaania', 'europe', ['balkans'], false, [C('Tirana')]],
  ['AND', 'Andorra', 'europe', ['southern'], false, [C('Andorra')]],
  ['AUT', 'Austria', 'europe', ['western', 'central'], true, [C('Vienna')]],
  ['BLR', 'Valgevene', 'europe', ['eastern'], false, [C('Minsk')]],
  ['BEL', 'Belgia', 'europe', ['western'], false, [C('Brussels')]],
  ['BIH', 'Bosnia ja Hertsegoviina', 'europe', ['balkans'], false, [C('Sarajevo')]],
  ['BGR', 'Bulgaaria', 'europe', ['eastern', 'balkans'], false, [C('Sofia')]],
  ['HRV', 'Horvaatia', 'europe', ['southern', 'balkans'], false, [C('Zagreb')]],
  ['CZE', 'Tšehhi', 'europe', ['central'], false, [C('Prague')]],
  ['DNK', 'Taani', 'europe', ['nordic'], true, [C('København')]],
  ['EST', 'Eesti', 'europe', ['baltics'], true, [C('Tallinn')]],
  ['FIN', 'Soome', 'europe', ['nordic'], true, [C('Helsinki')]],
  ['FRA', 'Prantsusmaa', 'europe', ['western'], true, [C('Paris')]],
  ['DEU', 'Saksamaa', 'europe', ['western', 'central'], true, [C('Berlin')]],
  ['GRC', 'Kreeka', 'europe', ['southern', 'balkans'], true, [C('Athens')]],
  ['HUN', 'Ungari', 'europe', ['central'], false, [C('Budapest')]],
  ['ISL', 'Island', 'europe', ['nordic'], false, [C('Reykjavík')]],
  ['IRL', 'Iirimaa', 'europe', ['western'], false, [C('Dublin')]],
  ['ITA', 'Itaalia', 'europe', ['southern'], true, [C('Rome')]],
  ['LVA', 'Läti', 'europe', ['baltics'], true, [C('Riga')]],
  ['LIE', 'Liechtenstein', 'europe', ['western', 'central'], false, [C('Vaduz')]],
  ['LTU', 'Leedu', 'europe', ['baltics'], true, [C('Vilnius')]],
  ['LUX', 'Luksemburg', 'europe', ['western'], false, [C('Luxembourg')]],
  ['MLT', 'Malta', 'europe', ['southern'], false, [C('Valletta')]],
  ['MCO', 'Monaco', 'europe', ['western'], false, [C('Monaco')]],
  ['MNE', 'Montenegro', 'europe', ['balkans'], false, [C('Podgorica')]],
  ['NLD', 'Holland', 'europe', ['western'], false, [
    C('Amsterdam', 'official', true, { et: 'Amsterdam', note: 'Amsterdam on põhiseaduse järgi pealinn. Valitsus ja parlament asuvad Haagis.' }),
    C('The Hague', 'seat_of_government', false, { et: 'Haag' })
  ]],
  ['MKD', 'Põhja-Makedoonia', 'europe', ['balkans'], false, [C('Skopje')]],
  ['NOR', 'Norra', 'europe', ['nordic'], true, [C('Oslo')]],
  ['POL', 'Poola', 'europe', ['central', 'eastern'], true, [C('Warsaw')]],
  ['PRT', 'Portugal', 'europe', ['southern'], true, [C('Lisbon')]],
  ['MDA', 'Moldova', 'europe', ['eastern'], false, [C('Chișinău')]],
  ['ROU', 'Rumeenia', 'europe', ['eastern'], false, [C('Bucharest')]],
  ['RUS', 'Venemaa', 'europe', ['eastern'], true, [C('Moscow')]],
  ['SMR', 'San Marino', 'europe', ['southern'], false, [C('San Marino')]],
  ['SRB', 'Serbia', 'europe', ['balkans'], false, [C('Belgrade')]],
  ['SVK', 'Slovakkia', 'europe', ['central'], false, [C('Bratislava')]],
  ['SVN', 'Sloveenia', 'europe', ['southern', 'central'], false, [C('Ljubljana')]],
  ['ESP', 'Hispaania', 'europe', ['southern'], true, [C('Madrid')]],
  ['SWE', 'Rootsi', 'europe', ['nordic'], true, [C('Stockholm')]],
  ['CHE', 'Šveits', 'europe', ['western', 'central'], false, [C('Bern')]],
  ['UKR', 'Ukraina', 'europe', ['eastern'], true, [C('Kyiv')]],
  ['GBR', 'Suurbritannia', 'europe', ['western'], true, [C('London')]],
  ['VAT', 'Vatikan', 'europe', ['southern'], false, []],

  // Aasia
  ['AFG', 'Afganistan', 'asia', ['south'], false, [C('Kabul')]],
  ['ARM', 'Armeenia', 'asia', ['west'], false, [C('Yerevan')]],
  ['AZE', 'Aserbaidžaan', 'asia', ['west'], false, [C('Baku')]],
  ['BHR', 'Bahrein', 'asia', ['west'], false, [C('Manama')]],
  ['BGD', 'Bangladesh', 'asia', ['south'], false, [C('Dhaka')]],
  ['BTN', 'Bhutan', 'asia', ['south'], false, [C('Thimphu')]],
  ['BRN', 'Brunei', 'asia', ['southeast'], false, [C('Bandar Seri Begawan')]],
  ['KHM', 'Kambodža', 'asia', ['southeast'], false, [C('Phnom Penh')]],
  ['CHN', 'Hiina', 'asia', ['east'], true, [C('Beijing')]],
  ['CYP', 'Küpros', 'asia', ['west'], false, [C('Nicosia')]],
  ['PRK', 'Põhja-Korea', 'asia', ['east'], false, [C('Pyongyang')]],
  ['GEO', 'Gruusia', 'asia', ['west'], false, [C('Tbilisi')]],
  ['IND', 'India', 'asia', ['south'], true, [C('New Delhi')]],
  ['IDN', 'Indoneesia', 'asia', ['southeast'], true, [
    C('Jakarta', 'official', true, { note: 'Indoneesia ehitab uut pealinna Nusantarat, kuid EKI 21.08.2026 loendi järgi on pealinn Jakarta.' })
  ]],
  ['IRN', 'Iraan', 'asia', ['south', 'west'], true, [C('Tehran')]],
  ['IRQ', 'Iraak', 'asia', ['west'], false, [C('Baghdad')]],
  ['ISR', 'Iisrael', 'asia', ['west'], false, [
    C('Jerusalem', 'claimed', false, { et: 'Jeruusalemm', note: 'Iisrael on kuulutanud oma pealinnaks Jeruusalemma, kuid enamik riike ei ole seda tunnustanud.' }),
    C('Tel Aviv', 'other', false, { et: 'Tel Aviv', note: 'Enamiku riikide saatkonnad asuvad Tel Avivis.' })
  ]],
  ['JPN', 'Jaapan', 'asia', ['east'], true, [C('Tokyo')]],
  ['JOR', 'Jordaania', 'asia', ['west'], false, [C('Amman')]],
  ['KAZ', 'Kasahstan', 'asia', ['central'], true, [C('Nur-Sultan')]],
  ['KWT', 'Kuveit', 'asia', ['west'], false, [C('Kuwait City')]],
  ['KGZ', 'Kõrgõzstan', 'asia', ['central'], false, [C('Bishkek')]],
  ['LAO', 'Laos', 'asia', ['southeast'], false, [C('Vientiane')]],
  ['LBN', 'Liibanon', 'asia', ['west'], false, [C('Beirut')]],
  ['MYS', 'Malaisia', 'asia', ['southeast'], false, [
    C('Kuala Lumpur', 'official', true, { note: 'Paljud valitsusasutused asuvad Putrajayas.' }),
    C('Putrajaya', 'seat_of_government', false, { et: 'Putrajaya' })
  ]],
  ['MDV', 'Maldiivid', 'asia', ['south'], false, [C('Malé')]],
  ['MNG', 'Mongoolia', 'asia', ['east'], true, [C('Ulaanbaatar')]],
  ['MMR', 'Myanmar', 'asia', ['southeast'], false, [C('Naypyidaw')]],
  ['NPL', 'Nepal', 'asia', ['south'], false, [C('Kathmandu')]],
  ['OMN', 'Omaan', 'asia', ['west'], false, [C('Muscat')]],
  ['PAK', 'Pakistan', 'asia', ['south'], true, [C('Islamabad')]],
  ['PHL', 'Filipiinid', 'asia', ['southeast'], true, [C('Manila')]],
  ['QAT', 'Katar', 'asia', ['west'], false, [C('Doha')]],
  ['KOR', 'Lõuna-Korea', 'asia', ['east'], true, [C('Seoul')]],
  ['SAU', 'Saudi Araabia', 'asia', ['west'], true, [C('Riyadh')]],
  ['SGP', 'Singapur', 'asia', ['southeast'], false, [C('Singapore')]],
  ['LKA', 'Sri Lanka', 'asia', ['south'], false, [
    C('Sri Jayawardenepura Kotte', 'legislative', false, { et: 'Sri Jayawardenepura Kotte', note: 'Parlament asub Sri Jayawardenepura Kottes.' }),
    C('Colombo', 'other', false, { et: 'Colombo', note: 'Colombo on suurim linn ja paljude valitsusasutuste asukoht.' })
  ]],
  ['SYR', 'Süüria', 'asia', ['west'], false, [C('Damascus')]],
  ['TJK', 'Tadžikistan', 'asia', ['central'], false, [C('Dushanbe')]],
  ['THA', 'Tai', 'asia', ['southeast'], true, [C('Bangkok')]],
  ['TLS', 'Ida-Timor', 'asia', ['southeast'], false, [C('Dili')]],
  ['TUR', 'Türgi', 'asia', ['west'], true, [C('Ankara')]],
  ['TKM', 'Türkmenistan', 'asia', ['central'], false, [C('Ashgabat')]],
  ['ARE', 'Araabia Ühendemiraadid', 'asia', ['west'], false, [C('Abu Dhabi')]],
  ['UZB', 'Usbekistan', 'asia', ['central'], false, [C('Tashkent')]],
  ['VNM', 'Vietnam', 'asia', ['southeast'], true, [C('Hanoi')]],
  ['YEM', 'Jeemen', 'asia', ['west'], false, [C('Sanaa')]],

  // Aafrika
  ['DZA', 'Alžeeria', 'africa', ['north'], true, [C('Algiers')]],
  ['AGO', 'Angola', 'africa', ['central'], false, [C('Luanda')]],
  ['BEN', 'Benin', 'africa', ['west'], false, [
    C('Porto-Novo', 'official', true, { note: 'Valitsus asub suures osas Cotonous.' })
  ]],
  ['BWA', 'Botswana', 'africa', ['south'], false, [C('Gaborone')]],
  ['BFA', 'Burkina Faso', 'africa', ['west'], false, [C('Ouagadougou')]],
  ['BDI', 'Burundi', 'africa', ['east'], false, [
    C('Gitega', 'official', true, { note: 'Gitega on pealinn alates 2019. aastast; varem oli see Bujumbura.' })
  ]],
  ['CPV', 'Roheneemesaared', 'africa', ['west'], false, [C('Praia')]],
  ['CMR', 'Kamerun', 'africa', ['central'], false, [C('Yaoundé')]],
  ['CAF', 'Kesk-Aafrika Vabariik', 'africa', ['central'], false, [C('Bangui')]],
  ['TCD', 'Tšaad', 'africa', ['central'], false, [C("N'Djamena")]],
  ['COM', 'Komoorid', 'africa', ['east'], false, [C('Moroni')]],
  ['COD', 'Kongo DV', 'africa', ['central'], true, [C('Kinshasa')]],
  ['COG', 'Kongo Vabariik', 'africa', ['central'], false, [C('Brazzaville')]],
  ['CIV', 'Elevandiluurannik', 'africa', ['west'], false, [
    C('Yamoussoukro', 'official', true, { note: 'Suurim linn ja paljude asutuste asukoht on Abidjan.' })
  ]],
  ['DJI', 'Djibouti', 'africa', ['east'], false, [C('Djibouti')]],
  ['EGY', 'Egiptus', 'africa', ['north'], true, [C('Cairo')]],
  ['GNQ', 'Ekvatoriaal-Guinea', 'africa', ['central'], false, [
    { coord: [1.58888889, 10.8225], coordSource: 'https://en.wikipedia.org/wiki/Ciudad_de_la_Paz', role: 'official', quiz: true,
      note: 'Ciudad de la Paz on pealinn alates 2. jaanuarist 2026. Varem oli pealinn Malabo.' }
  ]],
  ['ERI', 'Eritrea', 'africa', ['east'], false, [C('Asmara')]],
  ['SWZ', 'Svaasimaa', 'africa', ['south'], false, [
    C('Mbabane', 'administrative', false, { et: 'Mbabane', note: 'Mbabane on halduspealinn.' }),
    C('Lobamba', 'legislative', false, { et: 'Lobamba', note: 'Lobambas asuvad parlament ja kuninglik residents.' })
  ]],
  ['ETH', 'Etioopia', 'africa', ['east'], true, [C('Addis Ababa')]],
  ['GAB', 'Gabon', 'africa', ['central'], false, [C('Libreville')]],
  ['GMB', 'Gambia', 'africa', ['west'], false, [C('Banjul')]],
  ['GHA', 'Ghana', 'africa', ['west'], true, [C('Accra')]],
  ['GIN', 'Guinea', 'africa', ['west'], false, [C('Conakry')]],
  ['GNB', 'Guinea-Bissau', 'africa', ['west'], false, [C('Bissau')]],
  ['KEN', 'Keenia', 'africa', ['east'], true, [C('Nairobi')]],
  ['LSO', 'Lesotho', 'africa', ['south'], false, [C('Maseru')]],
  ['LBR', 'Libeeria', 'africa', ['west'], false, [C('Monrovia')]],
  ['LBY', 'Liibüa', 'africa', ['north'], false, [C('Tripoli')]],
  ['MDG', 'Madagaskar', 'africa', ['east'], true, [C('Antananarivo')]],
  ['MWI', 'Malawi', 'africa', ['east'], false, [C('Lilongwe')]],
  ['MLI', 'Mali', 'africa', ['west'], false, [C('Bamako')]],
  ['MRT', 'Mauritaania', 'africa', ['west'], false, [C('Nouakchott')]],
  ['MUS', 'Mauritius', 'africa', ['east'], false, [C('Port Louis')]],
  ['MAR', 'Maroko', 'africa', ['north'], true, [C('Rabat')]],
  ['MOZ', 'Mosambiik', 'africa', ['east'], false, [C('Maputo')]],
  ['NAM', 'Namiibia', 'africa', ['south'], false, [C('Windhoek')]],
  ['NER', 'Niger', 'africa', ['west'], false, [C('Niamey')]],
  ['NGA', 'Nigeeria', 'africa', ['west'], true, [C('Abuja')]],
  ['RWA', 'Rwanda', 'africa', ['east'], false, [C('Kigali')]],
  ['STP', 'São Tomé ja Príncipe', 'africa', ['central'], false, [C('São Tomé')]],
  ['SEN', 'Senegal', 'africa', ['west'], false, [C('Dakar')]],
  ['SYC', 'Seišellid', 'africa', ['east'], false, [C('Victoria')]],
  ['SLE', 'Sierra Leone', 'africa', ['west'], false, [C('Freetown')]],
  ['SOM', 'Somaalia', 'africa', ['east'], false, [C('Mogadishu')]],
  ['ZAF', 'Lõuna-Aafrika Vabariik', 'africa', ['south'], true, [
    C('Pretoria', 'administrative', false, { et: 'Pretoria', note: 'Pretorias asub valitsus.' }),
    C('Cape Town', 'legislative', false, { et: 'Kaplinn', note: 'Kaplinnas asub parlament.' }),
    C('Bloemfontein', 'judicial', false, { et: 'Bloemfontein', note: 'Bloemfonteinis asub ülemkohus.', nameSource: 'https://www.gov.za/about-sa/south-africa-glance-0' })
  ]],
  ['SSD', 'Lõuna-Sudaan', 'africa', ['east'], false, [C('Juba')]],
  ['SDN', 'Sudaan', 'africa', ['north'], false, [C('Khartoum')]],
  ['TZA', 'Tansaania', 'africa', ['east'], true, [
    C('Dodoma', 'official', true, { note: 'Suurim linn on Dar es Salaam.' })
  ]],
  ['TGO', 'Togo', 'africa', ['west'], false, [C('Lomé')]],
  ['TUN', 'Tuneesia', 'africa', ['north'], false, [C('Tunis')]],
  ['UGA', 'Uganda', 'africa', ['east'], false, [C('Kampala')]],
  ['ZMB', 'Sambia', 'africa', ['east'], false, [C('Lusaka')]],
  ['ZWE', 'Zimbabwe', 'africa', ['east'], false, [C('Harare')]],

  // Ameerika
  ['ATG', 'Antigua ja Barbuda', 'americas', ['caribbean'], false, [C("Saint John's")]],
  ['ARG', 'Argentina', 'americas', ['south'], true, [C('Buenos Aires')]],
  ['BHS', 'Bahama', 'americas', ['caribbean'], false, [C('Nassau')]],
  ['BRB', 'Barbados', 'americas', ['caribbean'], false, [C('Bridgetown')]],
  ['BLZ', 'Belize', 'americas', ['central'], false, [C('Belmopan')]],
  ['BOL', 'Boliivia', 'americas', ['south'], false, [
    C('Sucre', 'official', false, { et: 'Sucre', note: 'Sucre on põhiseaduse järgi pealinn.' }),
    C('La Paz', 'seat_of_government', false, { et: 'La Paz', note: 'La Pazis asuvad valitsus ja parlament.' })
  ]],
  ['BRA', 'Brasiilia', 'americas', ['south'], true, [C('Brasília')]],
  ['CAN', 'Kanada', 'americas', ['north-large'], true, [C('Ottawa')]],
  ['CHL', 'Tšiili', 'americas', ['south'], true, [C('Santiago')]],
  ['COL', 'Colombia', 'americas', ['south'], true, [C('Bogota')]],
  ['CRI', 'Costa Rica', 'americas', ['central'], false, [C('San José')]],
  ['CUB', 'Kuuba', 'americas', ['caribbean'], true, [C('Havana')]],
  ['DMA', 'Dominica', 'americas', ['caribbean'], false, [C('Roseau')]],
  ['DOM', 'Dominikaani Vabariik', 'americas', ['caribbean'], false, [C('Santo Domingo')]],
  ['ECU', 'Ecuador', 'americas', ['south'], false, [C('Quito')]],
  ['SLV', 'El Salvador', 'americas', ['central'], false, [C('San Salvador')]],
  ['GRD', 'Grenada', 'americas', ['caribbean'], false, [C("Saint George's")]],
  ['GTM', 'Guatemala', 'americas', ['central'], false, [C('Guatemala City')]],
  ['GUY', 'Guyana', 'americas', ['south'], false, [C('Georgetown')]],
  ['HTI', 'Haiti', 'americas', ['caribbean'], false, [C('Port-au-Prince')]],
  ['HND', 'Honduras', 'americas', ['central'], false, [C('Tegucigalpa')]],
  ['JAM', 'Jamaica', 'americas', ['caribbean'], true, [C('Kingston')]],
  ['MEX', 'Mehhiko', 'americas', ['north-large', 'central'], true, [C('Mexico City')]],
  ['NIC', 'Nicaragua', 'americas', ['central'], false, [C('Managua')]],
  ['PAN', 'Panama', 'americas', ['central'], false, [C('Panama City')]],
  ['PRY', 'Paraguay', 'americas', ['south'], false, [C('Asunción')]],
  ['PER', 'Peruu', 'americas', ['south'], true, [C('Lima')]],
  ['KNA', 'Saint Kitts ja Nevis', 'americas', ['caribbean'], false, [C('Basseterre')]],
  ['LCA', 'Saint Lucia', 'americas', ['caribbean'], false, [C('Castries')]],
  ['VCT', 'Saint Vincent ja Grenadiinid', 'americas', ['caribbean'], false, [C('Kingstown')]],
  ['SUR', 'Suriname', 'americas', ['south'], false, [C('Paramaribo')]],
  ['TTO', 'Trinidad ja Tobago', 'americas', ['caribbean'], false, [C('Port-of-Spain')]],
  ['USA', 'Ameerika Ühendriigid', 'americas', ['north-large'], true, [
    C('Washington,  D.C.', 'official', true, { et: 'Washington', otherNames: ['Washington, D.C.'] })
  ]],
  ['URY', 'Uruguay', 'americas', ['south'], false, [C('Montevideo')]],
  ['VEN', 'Venezuela', 'americas', ['south'], true, [C('Caracas')]],

  // Austraalia ja Okeaania
  ['AUS', 'Austraalia', 'oceania', ['australia-nz'], true, [C('Canberra')]],
  ['FJI', 'Fidži', 'oceania', ['melanesia'], true, [C('Suva')]],
  ['KIR', 'Kiribati', 'oceania', ['micronesia'], false, [
    C('Tarawa', 'official', false, { note: 'Valitsusasutused asuvad Tarawa atollil, peamiselt Bairikil.' })
  ]],
  ['MHL', 'Marshalli Saared', 'oceania', ['micronesia'], false, [
    C('Majuro', 'official', false, { note: 'Pealinn asub Majuro atollil.' })
  ]],
  ['FSM', 'Mikroneesia', 'oceania', ['micronesia'], false, [C('Palikir')]],
  ['NRU', 'Naoero', 'oceania', ['micronesia'], false, [
    { coord: [-0.54555556, 166.925], coordSource: 'https://en.wikipedia.org/wiki/Yaren', role: 'other', quiz: false,
      note: 'Naurul ei ole ametlikku pealinna. Valitsusasutused asuvad Yarenis.' }
  ]],
  ['NZL', 'Uus-Meremaa', 'oceania', ['australia-nz'], true, [C('Wellington')]],
  ['PLW', 'Belau', 'oceania', ['micronesia'], false, [
    { coord: [7.50055556, 134.62416667], coordSource: 'https://en.wikipedia.org/wiki/Ngerulmud', role: 'official', quiz: true }
  ]],
  ['PNG', 'Paapua Uus-Guinea', 'oceania', ['melanesia'], true, [C('Port Moresby')]],
  ['WSM', 'Samoa', 'oceania', ['polynesia'], true, [C('Apia')]],
  ['SLB', 'Saalomoni Saared', 'oceania', ['melanesia'], false, [C('Honiara')]],
  ['TON', 'Tonga', 'oceania', ['polynesia'], false, [C("Nuku'alofa")]],
  ['TUV', 'Tuvalu', 'oceania', ['polynesia'], false, [
    C('Funafuti', 'official', false, { note: 'Valitsusasutused asuvad Funafuti atollil Vaiaku külas.' })
  ]],
  ['VUT', 'Vanuatu', 'oceania', ['melanesia'], false, [C('Port Vila')]]
];

// Shown and explained in Uuri, never a scored target. EKI marks Palestiina and
// Taiwan as non-independent areas and notes Kosovo's partial recognition.
export const SPECIAL_ENTITIES: SpecialRow[] = [
  ['PSE', 'Palestiina', 'asia', ['west'], 'un_observer', [C('Ramallah', 'de_facto', false, { et: 'Rām Allāh' })],
    'Palestiina on ÜRO vaatlejariik. Paljud riigid tunnustavad seda, paljud mitte. Rām Allāhis asub Palestiina valitsus.'],
  ['XKX', 'Kosovo', 'europe', ['balkans'], 'partially_recognised', [C('Pristina', 'official', false, { et: 'Prishtina' })],
    'Kosovo kuulutas end iseseisvaks 2008. aastal. Paljud riigid, ka Eesti, tunnustavad seda, kuid Serbia ja mõned teised riigid mitte.'],
  ['TWN', 'Taiwan', 'asia', ['east'], 'disputed', [C('Taipei', 'de_facto', false, { et: 'Taibei' })],
    'Taiwanil on oma valitsus, kuid Hiina peab saart enda osaks. Taiwan ei ole ÜRO liige.']
];

// Genitive (omastav) of every country name that does not end in a vowel, for
// "Mis on Jaapani pealinn?" and "Tokyo on Jaapani pealinn." A name ending in a
// vowel keeps its form (Läti, Kreeka). The build refuses a consonant-final name
// that is missing here, so no question is ever built on a guessed form.
export const GENITIVE_ET: Record<string, string> = {
  Island: 'Islandi', Liechtenstein: 'Liechtensteini', Luksemburg: 'Luksemburgi', Holland: 'Hollandi', Portugal: 'Portugali',
  Šveits: 'Šveitsi', Vatikan: 'Vatikani', Afganistan: 'Afganistani', Aserbaidžaan: 'Aserbaidžaani', Bahrein: 'Bahreini',
  Bangladesh: 'Bangladeshi', Bhutan: 'Bhutani', Küpros: 'Küprose', Iraan: 'Iraani', Iraak: 'Iraagi', Iisrael: 'Iisraeli',
  Jaapan: 'Jaapani', Kasahstan: 'Kasahstani', Kuveit: 'Kuveidi', Kõrgõzstan: 'Kõrgõzstani', Laos: 'Laose', Liibanon: 'Liibanoni',
  Maldiivid: 'Maldiivide', Myanmar: 'Myanmari', Nepal: 'Nepali', Omaan: 'Omaani', Pakistan: 'Pakistani', Filipiinid: 'Filipiinide',
  Katar: 'Katari', Singapur: 'Singapuri', Tadžikistan: 'Tadžikistani', 'Ida-Timor': 'Ida-Timori', Türkmenistan: 'Türkmenistani',
  'Araabia Ühendemiraadid': 'Araabia Ühendemiraatide', Usbekistan: 'Usbekistani', Vietnam: 'Vietnami', Jeemen: 'Jeemeni',
  Benin: 'Benini', Roheneemesaared: 'Roheneemesaarte', Kamerun: 'Kameruni', 'Kesk-Aafrika Vabariik': 'Kesk-Aafrika Vabariigi',
  Tšaad: 'Tšaadi', Komoorid: 'Komooride', 'Kongo DV': 'Kongo DV', 'Kongo Vabariik': 'Kongo Vabariigi',
  Elevandiluurannik: 'Elevandiluuranniku', Egiptus: 'Egiptuse', Gabon: 'Gaboni', Madagaskar: 'Madagaskari', Mauritius: 'Mauritiuse',
  Mosambiik: 'Mosambiigi', Niger: 'Nigeri', Senegal: 'Senegali', Seišellid: 'Seišellide',
  'Lõuna-Aafrika Vabariik': 'Lõuna-Aafrika Vabariigi', 'Lõuna-Sudaan': 'Lõuna-Sudaani', Sudaan: 'Sudaani', Barbados: 'Barbadose',
  'Dominikaani Vabariik': 'Dominikaani Vabariigi', Ecuador: 'Ecuadori', 'El Salvador': 'El Salvadori', Honduras: 'Hondurase',
  Paraguay: 'Paraguay', 'Saint Kitts ja Nevis': 'Saint Kittsi ja Nevise', 'Saint Vincent ja Grenadiinid': 'Saint Vincenti ja Grenadiinide',
  'Ameerika Ühendriigid': 'Ameerika Ühendriikide', Uruguay: 'Uruguay', 'Marshalli Saared': 'Marshalli Saarte',
  'Saalomoni Saared': 'Saalomoni Saarte', Taiwan: 'Taiwani'
};

// Map geometry crosswalk: catalog id → Natural Earth ADM0_A3 where they differ,
// and NE features merged into a country (de facto areas the UN counts as part of it).
export const NE_CODE: Record<string, string> = { SSD: 'SDS', PSE: 'PSX', XKX: 'KOS', ESH: 'SAH', ALA: 'ALD' };
export const MERGE_INTO: Record<string, string> = { BRT: 'KAZ', USG: 'CUB' };

// Non-country features that stay on the map as grey context, with an Estonian
// label (EKI starred rows; others described plainly). Owner in parentheses.
export const CONTEXT_NAMES: Record<string, string> = {
  ALA: 'Ahvenamaa (Soome)', ASM: 'Ameerika Samoa (USA)', AIA: 'Anguilla (Suurbritannia)', ABW: 'Aruba (Holland)',
  BMU: 'Bermuda (Suurbritannia)', IOT: 'Briti India ookeani ala', VGB: 'Briti Neitsisaared', COK: 'Cooki saared (Uus-Meremaa)',
  CUW: 'Curaçao (Holland)', FLK: 'Falklandi (Malviini) saared (Suurbritannia)', FRO: 'Fääri saared (Taani)',
  GIB: 'Gibraltar (Suurbritannia)', GRL: 'Gröönimaa (Taani)', GUM: 'Guam (USA)', GGY: 'Guernsey (Suurbritannia)',
  HMD: 'Heard ja McDonald (Austraalia)', HKG: 'Hongkong (Hiina)', JEY: 'Jersey (Suurbritannia)',
  CYM: 'Kaimanisaared (Suurbritannia)', SGS: 'Lõuna-Georgia ja Lõuna-Sandwichi saared (Suurbritannia)',
  ESH: 'Lääne-Sahara (staatus vaidlustatud)', MAC: 'Macau (Hiina)', IMN: 'Mani saar (Suurbritannia)',
  MSR: 'Montserrat (Suurbritannia)', NIU: 'Niue (Uus-Meremaa)', NFK: 'Norfolk (Austraalia)', PCN: 'Pitcairn (Suurbritannia)',
  ATF: 'Prantsuse Lõunaalad', PYF: 'Prantsuse Polüneesia', PRI: 'Puerto Rico (USA)', MNP: 'Põhja-Mariaanid (USA)',
  BLM: 'Saint-Barthélemy (Prantsusmaa)', SHN: 'Saint Helena (Suurbritannia)', MAF: 'Saint-Martin (Prantsusmaa)',
  SPM: 'Saint-Pierre ja Miquelon (Prantsusmaa)', SXM: 'Sint Maarten (Holland)', TCA: 'Turks ja Caicos (Suurbritannia)',
  VIR: 'USA Neitsisaared', NCL: 'Uus-Kaledoonia (Prantsusmaa)', WLF: 'Wallis ja Futuna (Prantsusmaa)',
  UMI: 'Ühendriikide hajasaared (USA)', IOA: 'Austraalia saared India ookeanis', ATC: 'Ashmore ja Cartier (Austraalia)',
  CSI: 'Korallimere saared (Austraalia)', CLP: 'Clippertoni saar (Prantsusmaa)', ESB: 'Dhekelia (Suurbritannia)',
  WSB: 'Akrotiri (Suurbritannia)', BRI: 'Bir Tawil (ühegi riigi oma)', PGA: 'Spratly saared (vaidlustatud)',
  SCR: 'Scarborough karid (vaidlustatud)', ATA: 'Antarktis'
};

// Overseas parts of a country that sit in another world part (by the part's
// own location), so the Maailmajaod and Mandrid questions stay geographic.
// A part whose centroid falls in a box takes that world part and continent.
export const OVERSEAS_PARTS: Record<string, Array<{ box: [number, number, number, number]; worldPart: WorldPartId; continent: string | null; noteEt: string }>> = {
  FRA: [
    { box: [-90, -10, -30, 60], worldPart: 'americas', continent: 'south-america', noteEt: 'Prantsusmaa ülemeremaa' },
    { box: [30, -30, 80, 0], worldPart: 'africa', continent: 'africa', noteEt: 'Prantsusmaa ülemeremaa' }
  ],
  NLD: [{ box: [-90, 0, -30, 30], worldPart: 'americas', continent: 'north-america', noteEt: 'Hollandi Kariibi saared' }],
  USA: [{ box: [-180, 15, -150, 25], worldPart: 'oceania', continent: null, noteEt: 'Hawaii (USA osariik)' }]
};

// Europe/Asia divide for the Maailmajaod view, in lon/lat: the Ural mountains,
// the Ural river, the Caspian, the Kuma–Manych depression, the Black Sea and the
// Bosporus. Only the three transcontinental countries are split by it.
export const EUROPE_ZONE: Array<[number, number]> = [
  [-30, 72], [68, 80], [66, 69], [60, 68], [59.5, 60], [59.3, 55], [58.5, 52], [57.5, 51.2], [51.5, 50.5],
  [51.5, 47.0], [49.0, 46.0], [47.5, 45.6], [45.0, 45.8], [42.0, 46.4], [38.5, 46.8], [36.5, 45.2],
  [36.6, 44.6], [33.0, 41.6], [29.1, 41.25], [28.9, 40.9], [26.3, 40.0], [26.0, 39.5], [-30, 30], [-30, 72]
];
export const TRANSCONTINENTAL = ['RUS', 'KAZ', 'TUR'];

// Continents (mandrid, textbook unit 15) follow the world part (Euroopa and
// Aasia → Euraasia; Ameerika → Põhja- or Lõuna-Ameerika by M49 sub-region),
// with these exceptions. Oceania's islands other than Australia are on no continent.
export const CONTINENT_OVERRIDES: Record<string, string> = { AUS: 'australia', GRL: 'north-america', ATA: 'antarctica' };

// Large-country recognition for the Maailm view (the 14 largest by area).
export const LARGEST_COUNTRIES = ['RUS', 'CAN', 'USA', 'CHN', 'BRA', 'AUS', 'IND', 'ARG', 'KAZ', 'DZA', 'COD', 'SAU', 'MEX', 'IDN'];

// Deep-ocean touch areas (lon/lat ellipses: [lon, lat, rx°, ry°]); a tap in the
// sea outside them is answered with a neutral "puuduta ookeani keskele".
export const OCEAN_AREAS: Record<string, Array<[number, number, number, number]>> = {
  pacific: [[-140, 20, 22, 18], [-125, -25, 22, 18], [165, 25, 12, 14], [-175, -10, 9, 12]],
  atlantic: [[-40, 32, 14, 14], [-20, -22, 16, 16]],
  indian: [[75, -18, 22, 14]],
  arctic: [[0, 83, 60, 4], [-150, 77, 18, 2.5]],
  southern: [[-100, -64, 40, 3], [20, -60, 40, 3], [140, -61, 30, 2.5]]
};

// The Antarktika view (south polar map): the Southern Ocean as a ring, the
// other oceans as blobs north of it.
export const ANTARCTIC_OCEAN_AREAS: Record<string, Array<[number, number, number, number] | 'band'>> = {
  southern: ['band'],
  atlantic: [[-25, -38, 16, 7]],
  indian: [[80, -38, 18, 7]],
  pacific: [[-135, -42, 22, 7], [-165, -50, 8, 4]]
};

// The Antarktika view's extra target.
export const SOUTH_POLE: [number, number] = [0, -90];
