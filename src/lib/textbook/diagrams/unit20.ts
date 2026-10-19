import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 20 "Vulkaanid" (lk 74–77). Original teaching
// schematics built from the package mockups, not copies of the textbook
// pictures and not to scale. The location picture is an invented cross-section,
// not a map: it does not say that every plate boundary has volcanoes, and the
// volcano-state picture shows invented examples, not a diagnosis of a real
// volcano. A geyser throws out hot water and steam, never lava; volcanic ash is
// rock and glass dust, not smoke. Spread into DIAGRAMS.
// Region IDs and markers follow UNIT20_DIAGRAMS.md exactly; every region is
// drawn, also those no question asks for (they are the wrong choices).
// Titles never name a region (the hotspot question shows the title): the
// package titles "Magma ja laava", "Vulkaanide erinevad seisundid" and
// "Kuumaveeallikas ja geiser" were renamed for that reason.
export const UNIT20_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u20-magma-lava',
    title: 'Sulakivimi teekond',
    description: 'Lihtsustatud läbilõige, mitte mõõtkavas. Maa sees, maakoore kivimite all, on kogunenud sulakivim ehk magma. Sealt tõuseb see läbi vulkaani üles. Vulkaani tipust väljunud sulakivim voolab mööda nõlva ja maapinda: see on laava.',
    drawingNote: 'Cross-section (viewBox 360×250): sky, a grey volcano cone on the ground line, layered crust below. A red-orange magma pocket at the bottom with a narrow magma channel up to the crater; from the crater a lava flow runs down the right slope onto the ground. Neutral letters: magma pocket (bottom centre), lava flow (right), crust (left, low).',
    demo: false,
    regions: [
      { id: 'underground', label: 'maa sees olev magma', marker: 'A', position: 'all keskmine tähis' },
      { id: 'surface', label: 'pinnal voolav laava', marker: 'B', position: 'parempoolne pinnatähis' },
      { id: 'crust', label: 'maakoor', marker: 'C', position: 'vasakpoolne alumine tähis' }
    ]
  },
  {
    id: 'u20-volcano-cutaway',
    title: 'Vulkaani läbilõige',
    description: 'Lihtsustatud koonusvulkaani läbilõige, mitte mõõtkavas. Maa sees on magmakolle, kuhu magma koguneb. Sealt viib lõõr magma üles vulkaani tippu, kus on kraater. Kraatrist voolab laavavool mööda nõlva alla ja vulkaani kohal tõuseb tuhapilv.',
    drawingNote: 'Cone cross-section (viewBox 360×280): a grey cone on the ground line with a dip at the top, a narrow magma channel from a wide magma pocket under the ground up to the dip, a lava flow down the right slope and a grey ash cloud on a short column above the top.',
    demo: false,
    regions: [
      { id: 'crater', label: 'kraater', marker: 'A', position: 'üleval keskmine tähis' },
      { id: 'conduit', label: 'lõõr', marker: 'B', position: 'keskmine tähis' },
      { id: 'chamber', label: 'magmakolle', marker: 'C', position: 'all keskmine tähis' },
      { id: 'lava-flow', label: 'laavavool', marker: 'D', position: 'parempoolne keskmine tähis' },
      { id: 'ash-cloud', label: 'tuhapilv', marker: 'E', position: 'ülemine tähis' }
    ]
  },
  {
    id: 'u20-eruption-products',
    title: 'Mida vulkaanist välja tuleb?',
    description: 'Lihtsustatud skeem purskavast vulkaanist. Kraatri kohal on hall tuhapilv: peened kivimi- ja klaasiosakesed, mitte suits. Paremale paiskuvad õhku kivimitükid. Mööda paremat nõlva voolab laava.',
    drawingNote: 'Erupting cone (viewBox 360×250): a big grey ash cloud above the top, dark rock lumps flying up and to the right on dashed paths, a red-orange lava flow down the right slope onto the ground.',
    demo: false,
    regions: [
      { id: 'ash', label: 'tuhapilv', marker: 'A', position: 'ülemine tähis' },
      { id: 'lava', label: 'laavavool', marker: 'B', position: 'parempoolne alumine tähis' },
      { id: 'rocks', label: 'kivimitükid', marker: 'C', position: 'parempoolne ülemine tähis' }
    ]
  },
  {
    id: 'u20-layers-growth',
    title: 'Kuidas vulkaan kasvab?',
    description: 'Kolm järjestikust kujuteldavat etappi, mitte mõõtkavas. Esimeses voolab väikese vulkaani nõlval kuum laava. Teises on see laava jahtunud ja tardunud tumedaks kivimikihiks. Kolmandas on järgmise purske materjal kattunud selle peale uue kihina ja vulkaan on kõrgem.',
    drawingNote: 'Three panels side by side (viewBox 360×236), arrows between them: 1) a small grey cone with a bright lava flow on its right slope; 2) the same cone with that flow turned into a dark solid layer; 3) a taller cone where a new glowing layer covers the old cone and the dark layer.',
    demo: false,
    regions: [
      { id: 'fresh', label: 'värske laavavoog', marker: 'A', position: 'vasaku paneeli tähis' },
      { id: 'cooled', label: 'tardunud kivimikiht', marker: 'B', position: 'keskmise paneeli tähis' },
      { id: 'new-layer', label: 'järgmise purske kiht', marker: 'C', position: 'parema paneeli tähis' }
    ]
  },
  {
    id: 'u20-volcano-locations',
    title: 'Kus vulkaanid tekivad?',
    description: 'Väljamõeldud lihtsustatud läbilõige, mitte kaart. Kaks laama kohtuvad; nende piiril on vulkaan, mille alla tõuseb magma mööda laamade vahelist piiri. Parema laama keskel on teine vulkaan kuuma täpi kohal: magma tõuseb sinna sügavalt alt. Vasaku laama keskel on vaikne ala, kus vulkaani ei ole. Kõigil laamapiiridel vulkaane ei ole.',
    drawingNote: 'Invented cross-section (viewBox 360×240), not a map: two plates in different tints meet at a jagged seam with arrows; a cone sits on the seam with magma rising along it; a second cone in the middle of the right plate has a magma column from a hot blob deep below; the middle of the left plate is flat land without a volcano.',
    demo: false,
    regions: [
      { id: 'boundary', label: 'laamade piiri piirkond', marker: 'A', position: 'vasaku koonuse tähis' },
      { id: 'hotspot', label: 'laama sisemuse kuum täpp', marker: 'B', position: 'parema koonuse tähis' },
      { id: 'quiet-interior', label: 'muu piirkond laama sees', marker: 'C', position: 'vasakpoolne alumine tähis' }
    ]
  },
  {
    id: 'u20-volcano-states',
    title: 'Kolm vulkaani',
    description: 'Kolm väljamõeldud näidet, mitte päris vulkaanid. Esimesest purskab laava ja tõuseb tuhapilv. Teine on järsk ja vähese taimestikuga noor koonus, mille nõlvadel on varasemate pursete tardunud laavavoolud, kuid praegu see ei purska. Kolmas on madal, ümaraks kulunud ja metsaga kaetud mägi, mille kraatris on järv. Päris vulkaani seisundit ei saa ainult kuju järgi määrata.',
    drawingNote: 'Three panels side by side (viewBox 360×236): 1) a cone with lava and an ash cloud; 2) a steep bare cone with dark old lava streaks, nothing coming out; 3) a low rounded forested hill with a small lake in its top.',
    demo: false,
    regions: [
      { id: 'erupting', label: 'praegu purskav vulkaan', marker: 'A', position: 'vasaku kaardi tähis' },
      { id: 'dormant', label: 'uinunud vulkaan', marker: 'B', position: 'keskmise kaardi tähis' },
      { id: 'extinct', label: 'kustunuks hinnatud vulkaan', marker: 'C', position: 'parema kaardi tähis' }
    ]
  },
  {
    id: 'u20-geysers',
    title: 'Kuum vesi maa sees',
    description: 'Lihtsustatud läbilõige, mitte mõõtkavas. Vasakul imbub vihmavesi maasse ja koguneb põhjaveeks. Vesi liigub lõhedes kuumade kivimite kohale ja soojeneb. Kuum vesi voolab rahulikult pinnale kuumaveeallikast; paremal kitsas kanalis koguneb rõhk ja geiser paiskab aeg-ajalt üles kuuma vett ja auru, mitte laavat.',
    drawingNote: 'Ground cross-section (viewBox 360×250): rain arrows into the ground on the left feed a cool blue water layer; a channel leads right over a red hot-rock zone at the bottom; one branch rises to a calm pool on the surface (left of centre), another through a narrow pipe to a tall water-and-steam column (right).',
    demo: false,
    regions: [
      { id: 'geyser', label: 'geiser', marker: 'A', position: 'parem ülemine tähis' },
      { id: 'spring', label: 'kuumaveeallikas', marker: 'B', position: 'vasakpoolne pinnatähis' },
      { id: 'groundwater', label: 'põhjavesi', marker: 'C', position: 'alumine vasakpoolne tähis' },
      { id: 'heated-rock', label: 'kuumad kivimid', marker: 'D', position: 'alumine keskmine tähis' }
    ]
  }
];
