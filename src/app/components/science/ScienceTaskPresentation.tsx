import type { ScienceData, ScienceTaskType } from '@/lib/loodusopetus/types';

// Shared presentation for a Loodusõpetus task, so the runner and Kordamine show
// the same diagram, reading text and data table for the same task instead of
// each drifting into its own version.

export const SCIENCE_EYEBROW: Record<ScienceTaskType, string> = {
  visual_choice: 'Vaata skeemi ja vali õige vastus',
  reading_choice: 'Loe tekst ja vali õige vastus',
  sort: 'Pane iga asi õigesse rühma',
  match: 'Ühenda mõiste õige seletusega',
  data_evidence: 'Vaata andmeid ja vali õige järeldus'
};

export function ScienceDataPanel({ data }: { data: ScienceData }) {
  return (
    <div className='science-data'>
      {data.diagram ? <div className='science-diagram'>{data.diagram}</div> : null}
      {data.table?.length ? (
        <div className='science-table-wrap'>
          <table className='science-table'>
            <tbody>
              {data.table.map((rawRow, rowIndex) => (
                <tr key={rowIndex}>
                  {rawRow.map((cell, cellIndex) =>
                    rowIndex === 0
                      ? <th key={cellIndex}>{cell}</th>
                      : <td key={cellIndex}>{cell}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {data.cards?.length ? (
        <div className='science-data-cards'>
          {data.cards.map((card, cardIndex) => (
            <div key={cardIndex} className='science-data-card'>
              <strong>{card[0]}</strong>
              <span>{card.slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      ) : null}
      {data.setup ? <p className='science-info-box'>{data.setup}</p> : null}
      {data.example ? <p className='science-info-box'>{data.example}</p> : null}
    </div>
  );
}
