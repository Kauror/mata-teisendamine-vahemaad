import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 12 "Kaart" (pages 50–53). Original teaching
// schematics, not copies of the textbook illustrations: no real photograph,
// no real Tartu geometry. The town map is an invented practice town.
//
// Titles stay neutral, because <title> is also present in hotspot questions:
// no "gloobus", "kaart" region names or "legend" there. Positions are neutral
// for the accessible region list in hotspot questions.
export const UNIT12_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u12-globe-flatmap',
    title: 'Kaks Maa mudelit',
    description: 'Näidisskeem. Vasakul on alusel seisev kerakujuline gloobus, millel on meri ja maismaa. Paremal on tasane nelinurkne paberkaart, millel on samuti meri ja maismaa. Maismaa kujud on väljamõeldud.',
    drawingNote: 'viewBox 360×230. Left: a globe (pale-blue sea, invented land shapes, a meridian ring) on a small stand. Right: a flat, slightly tilted rectangular paper map with invented land and sea. No text in the drawing.',
    demo: false,
    regions: [
      { id: 'globe', label: 'Gloobus', marker: 'A', position: 'vasakpoolne ümmargune kujutis' },
      { id: 'flat-map', label: 'Tasane kaart', marker: 'B', position: 'parempoolne nelinurkne kujutis' }
    ]
  },
  {
    id: 'u12-orange-peel',
    title: 'Apelsinikoore katse',
    description: 'Näidisskeem. Vasakul on terve ümmargune apelsin. Paremal laual on apelsini koor laiali laotatud: koor on rebenenud mitmeks ebaühtlaseks tükiks ja tükkide vahele jäävad tühjad lõhed.',
    drawingNote: 'viewBox 360×220. Left: an intact orange with a stem and leaf. Right: on a pale table, five irregular peel pieces with white pith edges and visible gaps between them, not arranged as a neat circle.',
    demo: false,
    regions: [
      { id: 'orange', label: 'Terve apelsin', marker: 'A', position: 'vasakpoolne ümmargune kujund' },
      { id: 'peel-pieces', label: 'Laiali laotatud koor', marker: 'B', position: 'parempoolsed eraldi kujundid' }
    ]
  },
  {
    id: 'u12-aerial-vs-map',
    title: 'Sama koht kahel pildil',
    description: 'Joonis, mitte päris foto. Kaks pilti samast väljamõeldud kohast. Vasakul on aerofotot meenutav joonistus: katused eri tooni, puulatvad, käänuline jõgi, teed ja varjud. Paremal on sama koht lihtsustatud kaardina: sinine jõgi, valged teed, roheline park, hallid hooned ja üks märk.',
    drawingNote: 'viewBox 380×265. Two 175×205 panels of the same invented neighbourhood (river, two roads with a bridge, a park, five buildings, one landmark). Left drawn like an aerial photo (roof tones, shadows, tree crowns); right as a simplified map. Placements match between the panels.',
    demo: false,
    regions: [
      { id: 'aerial-panel', label: 'Aerofotot meenutav vaade', marker: 'A', position: 'vasakpoolne pildiala' },
      { id: 'map-panel', label: 'Lihtsustatud kaart', marker: 'B', position: 'parempoolne pildiala' }
    ]
  },
  {
    id: 'u12-legend-town',
    title: 'Väljamõeldud näidislinn',
    description: 'Väljamõeldud näidiskaart, mitte Tartu kaart. Kaardi vasakul pool voolab ülevalt alla sinine jõgi, mille ületab tee sillaga. Ülal keskel on hallid hooned, paremal ülal on muuseumimärgiga hoone ja all on roheline park. Paremal ääres on eraldi kast: kaardi legend, mis seletab muuseumi, silla, jõe, pargi ja hoone märgid.',
    drawingNote: 'viewBox 400×340. Left 256×308 map: a blue river top to bottom on the left, a road crossing it on a bridge, a grey building block top-middle, a small building with a museum symbol top-right, a green park at the bottom. Right: a separate legend box (museum, bridge, river, park, building); its words are hidden in hotspot mode.',
    demo: false,
    regions: [
      { id: 'river', label: 'Jõgi', marker: 'A', position: 'kaardiala vasakpoolne pikk piirkond' },
      { id: 'park', label: 'Park', marker: 'B', position: 'kaardiala alumine ala' },
      { id: 'building', label: 'Hoone', marker: 'C', position: 'kaardiala ülemine keskmine nelinurk' },
      { id: 'bridge', label: 'Sild', marker: 'D', position: 'vasakpoolse pika piirkonna keskel' },
      { id: 'museum', label: 'Muuseumi märk', marker: 'E', position: 'kaardiala parempoolne väike kujund' },
      { id: 'legend', label: 'Kaardi legend', marker: 'F', position: 'paremal ääres olev ala' }
    ]
  }
];
