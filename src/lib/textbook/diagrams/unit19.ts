import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 19 "Maakera siseehitus" (lk 70–73). Original
// teaching schematics, not copies of the textbook pictures and not to scale.
// Region IDs follow UNIT19_DIAGRAMS.md exactly (the questions' answer keys use
// them). The world map draws Natural Earth land outlines as a background only:
// its seven markers are APPROXIMATE plate locations, never plate boundaries.
// Spread into DIAGRAMS.
export const UNIT19_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u19-earth-layers',
    title: 'Maa läbilõige',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Maa läbilõige neljast kihist väljast sissepoole: väga õhuke maakoor, paks vahevöö, vedel välistuum ja keskel tahke sisetuum. Maakoor on joonisel paksem kui päriselt, et seda oleks näha. Paremal on neli tähist, igast läheb joon ühe kihini.',
    drawingNote: 'Cross-section disk on the left (viewBox 360×300, centre 112,150): crust ring 6 units (exaggerated), mantle to r 55, outer core to r 24, inner core r 24 — roughly the real proportions apart from the crust. Four rows on the right, each with a leader line to one layer; the rows are the tap areas, the layers themselves are tappable too.',
    demo: false,
    regions: [
      { id: 'crust', label: 'maakoor', marker: 'A', position: 'paremal esimene tähis ülalt' },
      { id: 'mantle', label: 'vahevöö', marker: 'B', position: 'paremal teine tähis ülalt' },
      { id: 'outer-core', label: 'välistuum', marker: 'C', position: 'paremal kolmas tähis ülalt' },
      { id: 'inner-core', label: 'sisetuum', marker: 'D', position: 'paremal alumine tähis' }
    ]
  },
  {
    id: 'u19-crust-thickness',
    title: 'Maakoore paksus',
    description: 'Lihtsustatud skeem. Kolm kõrvuti tulpa näitavad maakoore paksust maapinnast allapoole: vasakul ookeani all umbes 7 km, keskel mandri all keskmiselt 40 km ja paremal kõrge mäestiku all kuni 80 km. Tulpade pikkused on nende näitearvudega võrdelised. Need on näited, mitte iga koha täpsed mõõtmised.',
    drawingNote: 'Three columns (viewBox 360×316) hanging down from one surface line at y 70; bar lengths 16 : 90 : 180 units (7 : 40 : 80 km). Above them: waves (ocean), flat land (continent), a mountain. km figures are lesson notes only.',
    demo: false,
    regions: [
      { id: 'oceanic', label: 'ookeaniline maakoor', marker: 'A', position: 'vasak tulp' },
      { id: 'continental', label: 'mandriline maakoor', marker: 'B', position: 'keskmine tulp' },
      { id: 'mountain', label: 'maakoor mäestiku all', marker: 'C', position: 'parem tulp' }
    ]
  },
  {
    id: 'u19-evidence',
    title: 'Kuidas uuritakse Maa sisemust?',
    description: 'Kolm kaarti. Vasakul puurtorn ja kitsas puurauk, mis ulatub kivimikihtidesse, kuid jääb Maa sügavustega võrreldes väga madalaks. Keskel maavärina koht sügaval maa all, kust lained levivad igas suunas, ja maapinnal neid mõõtev seade. Paremal vulkaan, mille kaudu jõuab pinnale sulanud kivim. Tuuma ainet ei saa ükski neist otse kätte.',
    drawingNote: 'Three cards side by side (viewBox 360×260): a drilling rig with a narrow hole into rock layers; an underground quake point with wave arcs and a seismograph on the surface; a volcano cone with a magma channel and lava at the top.',
    demo: false,
    regions: [
      { id: 'borehole', label: 'puurauk', marker: 'A', position: 'vasak kaart' },
      { id: 'waves', label: 'maavärinalained', marker: 'B', position: 'keskmine kaart' },
      { id: 'volcano', label: 'vulkaan ja kivimid', marker: 'C', position: 'parem kaart' }
    ]
  },
  {
    id: 'u19-plate-motion',
    title: 'Laamade liikumine',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Pealmine jäik kiht on jagunenud kaheks laamaks, vasakpoolseks ja parempoolseks; kumbki laam koosneb maakoorest ja selle all olevast jäigast vahevöö ülaosast. Laamade vahel on piir. Nende all on kuum, valdavalt tahke vahevöö, mis voolab väga aeglaselt. Nooled näitavad üht võimalikku liikumist: siin laamad eemalduvad teineteisest, teistes kohtades need põrkuvad või libisevad teineteisest mööda. Laamad liiguvad vaid mõne sentimeetri aastas.',
    drawingNote: 'Side view (viewBox 360×260): two rigid slabs (thin crust band on a rigid upper-mantle band) side by side at y 90–130, split at x 180 with a little magma wedge rising into the gap; arrows above point away from each other; the mantle below with slow dashed flow arrows.',
    demo: false,
    regions: [
      { id: 'left-plate', label: 'vasakpoolne laam', marker: 'A', position: 'ülemine vasak osa' },
      { id: 'right-plate', label: 'parempoolne laam', marker: 'B', position: 'ülemine parem osa' },
      { id: 'boundary', label: 'laamade piir', marker: 'C', position: 'ülemine keskmine kitsas osa' },
      { id: 'mantle', label: 'vahevöö', marker: 'D', position: 'alumine lai osa' }
    ]
  },
  {
    id: 'u19-plate-world',
    title: 'Suured laamad maailmakaardil',
    description: 'Maailmakaart, millel on seitse tähist seitsme suure laama ligikaudsete asukohtade juures: Vaikse ookeani, Põhja-Ameerika, Lõuna-Ameerika, Euraasia, Aafrika, Austraalia ja Antarktika laam. Tähised näitavad ainult ligikaudset kohta. Laamade piire kaardil ei ole: laamad ulatuvad ookeanide alla ja nende piirid ei kattu rannajoontega. Vaikse ookeani laam on kaardi mõlemas servas sama laam.',
    drawingNote: 'Equirectangular world map 360×180 (Natural Earth land outlines from data/world_continent_paths.json at scale 0.5) in a 360×214 frame. Seven small dots with markers near the plate centres; no boundary lines, coastlines are only geography.',
    demo: false,
    regions: [
      { id: 'pacific', label: 'Vaikse ookeani laam', marker: 'A', position: 'kaardi vasak serv' },
      { id: 'north-america', label: 'Põhja-Ameerika laam', marker: 'B', position: 'ülemine vasak osa' },
      { id: 'south-america', label: 'Lõuna-Ameerika laam', marker: 'C', position: 'keskmine vasak osa' },
      { id: 'eurasia', label: 'Euraasia laam', marker: 'D', position: 'ülemine parem osa' },
      { id: 'africa', label: 'Aafrika laam', marker: 'E', position: 'kaardi keskosa' },
      { id: 'australia', label: 'Austraalia laam', marker: 'F', position: 'alumine parem osa' },
      { id: 'antarctica', label: 'Antarktika laam', marker: 'G', position: 'kaardi alumine serv' }
    ]
  },
  {
    id: 'u19-continental-drift',
    title: 'Mandrite triiv',
    description: 'Kaks lihtsustatud vaadet. Vasakul väga ammu: kõik mandrid on kokku liitunud üheks hiidmandriks Pangaeaks; katkendjooned näitavad, kust see hiljem lõhenes. Paremal tänapäev: mandrid on teineteisest eemal. Vasak pilt on põhimõtte skeem, mitte täpne kaart minevikust.',
    drawingNote: 'Two panels (viewBox 360×240). Left: one schematic supercontinent blob with dashed future rift lines (not a reconstruction). Right: today\'s land outlines from data/world_continent_paths.json at scale 0.2333.',
    demo: false,
    regions: [
      { id: 'pangaea', label: 'Pangaea ehk hiidmanner', marker: 'A', position: 'vasak pilt' },
      { id: 'today', label: 'mandrid tänapäeval', marker: 'B', position: 'parem pilt' }
    ]
  }
];
