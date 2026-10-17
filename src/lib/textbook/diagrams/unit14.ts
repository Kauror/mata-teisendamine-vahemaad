import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 14 "Kaartide mitmekesisus" (lk 58–59). Original
// teaching schematics of FICTIONAL places — not copies of the textbook maps,
// not real borders, coastlines or population figures. Spread into DIAGRAMS.
// Region labels, markers and positions follow UNIT14_DIAGRAMS.md exactly.
export const UNIT14_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u14-physical-features',
    title: 'Väljamõeldud füüsiline kaart',
    description: 'Väljamõeldud maastiku lihtne kaart, mitte päris koha kaart. Ülal vasakul on mäestik, mäestiku jalamilt voolab looklev jõgi paremale merre, all vasakul on maismaa sees järv ja paremal meres on saar, mida ümbritseb igast küljest vesi.',
    drawingNote: 'Pale green land on the left, pale blue sea on the right (viewBox 360×260). Three brown snow-capped peaks top left; one blue river that starts at the foot of the mountains and winds to the sea; an inland lake bottom left, separate from the river and the sea; an island fully surrounded by water at the right.',
    demo: false,
    regions: [
      { id: 'mountains', label: 'mäestik', marker: 'A', position: 'ülemine vasak osa' },
      { id: 'river', label: 'jõgi', marker: 'B', position: 'keskmine looklev osa' },
      { id: 'lake', label: 'järv', marker: 'C', position: 'alumine vasak osa' },
      { id: 'island', label: 'saar', marker: 'D', position: 'parempoolne vees asuv ala' }
    ]
  },
  {
    id: 'u14-political-elements',
    title: 'Väljamõeldud riikide kaart',
    description: 'Väljamõeldud kahe riigi kaart, mitte päris riigid. Üks maismaa on katkendliku riigipiiriga jagatud kaheks eri tooniga riigiks, Lepamaaks ja Kivimaaks. Vasakpoolse riigi ülaosas on tärn, mis tähistab pealinna, parempoolses riigis on ring, mis tähistab teist linna.',
    drawingNote: 'One land mass in the sea (viewBox 360×270), split by a dark dashed border into a pale yellow left country and a pale pink right country. A red star (capital) in the upper left country, a small dark dot with a white ring (other town) in the upper right country. The dashed border looks unlike a river (no blue, no solid line).',
    demo: false,
    regions: [
      { id: 'country', label: 'riigi ala', marker: 'A', position: 'vasak alumine ala' },
      { id: 'border', label: 'riigipiir', marker: 'B', position: 'kaardi keskel olev joon' },
      { id: 'capital', label: 'pealinn', marker: 'C', position: 'vasak ülemine märk' },
      { id: 'city', label: 'teine linn', marker: 'D', position: 'parem ülemine märk' }
    ]
  },
  {
    id: 'u14-map-pair',
    title: 'Sama ala kaks kaarti',
    description: 'Kaks kõrvuti kaarti samast väljamõeldud alast, rannajoon on mõlemal sama. Vasakul on mäed ja jõgi, paremal on sama ala jagatud riigipiiriga kaheks riigiks, kus on pealinn ja linnad.',
    drawingNote: 'Two framed mini-maps side by side (viewBox 360×230) with the identical coastline silhouette. Left: green land with mountains and a river. Right: the same land split by a dashed border into two tinted countries with a capital star and town dots.',
    demo: false,
    regions: [
      { id: 'physical', label: 'füüsiline kaart', marker: 'A', position: 'vasakpoolne kaardivaade' },
      { id: 'political', label: 'poliitiline kaart', marker: 'B', position: 'parempoolne kaardivaade' }
    ]
  },
  {
    id: 'u14-population-map',
    title: 'Elanike arv piirkondades',
    description: 'Täiesti väljamõeldud rahvastikukaart „Elanike arv piirkondades”. Kolm kõrvuti piirkonda: vasakul A on kõige heledam, keskel B kõige tumedam ja paremal C keskmise tooniga. Legend: hele tähendab 4 000 elanikku, keskmine 6 000 elanikku ja tume 9 000 elanikku.',
    drawingNote: 'Visible heading "Elanike arv piirkondades" (viewBox 360×300). Three fictional regions side by side in one frame: A left lightest blue with dots, B centre darkest blue with cross-hatching, C right mid blue with diagonal lines. A fixed legend below: light = 4 000, mid = 6 000, dark = 9 000 elanikku (same fill and pattern swatches).',
    demo: false,
    regions: [
      { id: 'a', label: '4 000', marker: 'A', position: 'vasakpoolne ala' },
      { id: 'b', label: '9 000', marker: 'B', position: 'keskmine ala' },
      { id: 'c', label: '6 000', marker: 'C', position: 'parempoolne ala' }
    ]
  }
];
