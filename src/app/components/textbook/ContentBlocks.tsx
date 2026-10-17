'use client';

import type { ReactNode } from 'react';
import type { ContentBlock, ExternalResourceBlock, ExternalResourceType, QuestionContext, RichText, SourceRef } from '@/lib/textbook/types';
import { DiagramView } from '@/app/components/textbook/diagrams';

// Declarative lesson content → React. Content is data, never HTML: every
// block type has its own renderer and text goes through RichTextView, which
// knows only "strong" and "term".

export function RichTextView({ text }: { text: RichText }) {
  if (typeof text === 'string') return <>{text}</>;
  return (
    <>
      {text.map((segment, index) => {
        if (segment.emphasis === 'strong') return <strong key={index}>{segment.text}</strong>;
        if (segment.emphasis === 'term') return <mark key={index} className='tb-term'>{segment.text}</mark>;
        return <span key={index}>{segment.text}</span>;
      })}
    </>
  );
}

// "Allikas: õpik, lk 44" / "Lisaallikas: …" under a block that names one.
export function SourceMarker({ source }: { source: SourceRef }) {
  const textbook = source.kind === 'textbook';
  const parts = textbook
    ? ['õpik', source.pages ? `lk ${source.pages}` : null, source.attribution ?? null]
    : [source.attribution ?? 'lisamaterjal', source.pages ? `lk ${source.pages}` : null];
  const label = parts.filter(Boolean).join(', ');
  return (
    <p className='tb-source' data-source-kind={source.kind}>
      <span>{textbook ? 'Allikas' : 'Lisaallikas'}: {label}</span>
      {source.url ? <> · <a href={source.url} target='_blank' rel='noopener noreferrer'>vaata allikat</a></> : null}
    </p>
  );
}

const RESOURCE_TYPE_LABELS: Record<ExternalResourceType, string> = {
  article: 'Artikkel',
  gallery: 'Pildigalerii',
  video: 'Video',
  interactive: 'Interaktiivne'
};

const RESOURCE_ICONS: Record<ExternalResourceType, string> = {
  article: '📰',
  gallery: '🖼️',
  video: '🎬',
  interactive: '🧭'
};

// A plain link card. No embed and no third-party script is ever loaded; the
// resource is optional and never needed for unlocking. `qr` is reserved.
export function ExternalResourceCard({ block }: { block: ExternalResourceBlock }) {
  return (
    <aside className='tb-resource' aria-label={`Lisamaterjal: ${block.title}`}>
      <p className='tb-resource-kind'><span aria-hidden>{RESOURCE_ICONS[block.resourceType]}</span> {RESOURCE_TYPE_LABELS[block.resourceType]} · {block.publisher}</p>
      <h4 className='tb-resource-title'>{block.title}</h4>
      <p>{block.intro}</p>
      {block.observe ? <p className='tb-resource-observe'><strong>Mida jälgida?</strong> {block.observe}</p> : null}
      {block.imageCredit ? <p className='tb-resource-credit'>Pildid: {block.imageCredit}</p> : null}
      <a className='tb-resource-link' href={block.url} target='_blank' rel='noopener noreferrer'>
        Ava {RESOURCE_TYPE_LABELS[block.resourceType].toLowerCase()} <span aria-hidden>↗</span>
        <span className='sr-only'> (avaneb uues aknas)</span>
      </a>
      <p className='tb-resource-note'>Lisamaterjal ei ole kohustuslik.</p>
    </aside>
  );
}

function BlockBody({ block }: { block: ContentBlock }): ReactNode {
  switch (block.type) {
    case 'heading':
      return block.level === 3 ? <h4 className='tb-block-heading tb-block-heading-small'>{block.text}</h4> : <h3 className='tb-block-heading'>{block.text}</h3>;
    case 'paragraph':
      return <p className='tb-paragraph'><RichTextView text={block.text} /></p>;
    case 'list':
      return block.ordered
        ? <ol className='tb-list'>{block.items.map((item, index) => <li key={index}><RichTextView text={item} /></li>)}</ol>
        : <ul className='tb-list'>{block.items.map((item, index) => <li key={index}><RichTextView text={item} /></li>)}</ul>;
    case 'definition':
      return (
        <dl className='tb-definition'>
          <dt>{block.term}</dt>
          <dd><RichTextView text={block.definition} /></dd>
        </dl>
      );
    case 'keyFact':
      return (
        <aside className='tb-keyfact' aria-label={block.title ?? 'Jäta meelde!'}>
          <p className='tb-keyfact-title'><span aria-hidden>💡</span> {block.title ?? 'Jäta meelde!'}</p>
          <ul>{block.items.map((item, index) => <li key={index}><RichTextView text={item} /></li>)}</ul>
        </aside>
      );
    case 'comparison':
      return (
        <section className='tb-comparison' aria-label={block.title ?? 'Võrdlus'}>
          {block.title ? <h4 className='tb-comparison-title'>{block.title}</h4> : null}
          <div className='tb-comparison-columns'>
            {block.columns.map((column, index) => (
              <div key={index} className='tb-comparison-column'>
                <h5>{column.heading}</h5>
                <ul>{column.points.map((point, pointIndex) => <li key={pointIndex}><RichTextView text={point} /></li>)}</ul>
              </div>
            ))}
          </div>
        </section>
      );
    case 'table':
      return <DataTable caption={block.caption} headers={block.headers} rows={block.rows} />;
    case 'diagram':
      return (
        <figure className='tb-figure'>
          <DiagramView diagramId={block.diagramId} mode='lesson' description={block.description} />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    case 'caption':
      return <p className='tb-caption'>{block.text}</p>;
    case 'externalResource':
      return <ExternalResourceCard block={block} />;
    case 'enrichment': {
      const fallback = block.variant === 'fun_fact' ? 'Huvitav fakt' : 'Lisateadmine';
      return (
        <aside className='tb-enrichment' data-variant={block.variant} aria-label={block.title ?? fallback}>
          <p className='tb-enrichment-title'><span aria-hidden>{block.variant === 'fun_fact' ? '✨' : '🔍'}</span> {block.title ?? fallback}</p>
          {block.body.map((paragraph, index) => <p key={index}><RichTextView text={paragraph} /></p>)}
        </aside>
      );
    }
  }
}

export function DataTable({ caption, headers, rows }: { caption?: string; headers: string[]; rows: string[][] }) {
  return (
    <div className='tb-table-wrap'>
      <table className='tb-table'>
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>{headers.map((header, index) => <th key={index} scope='col'>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>{row.map((cell, cellIndex) => (cellIndex === 0 ? <th key={cellIndex} scope='row'>{cell}</th> : <td key={cellIndex}>{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ContentBlockView({ block }: { block: ContentBlock }) {
  return (
    <div className='tb-block' data-block-type={block.type} data-block-id={block.id}>
      <BlockBody block={block} />
      {block.source && block.type !== 'externalResource' ? <SourceMarker source={block.source} /> : null}
    </div>
  );
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return <>{blocks.map((block) => <ContentBlockView key={block.id} block={block} />)}</>;
}

// The presentation context above a question stem (never part of grading).
export function QuestionContextView({ context, hotspotDiagramId }: { context: QuestionContext; hotspotDiagramId?: string }) {
  switch (context.kind) {
    case 'text':
      return (
        <div className='tb-context tb-context-text'>
          {context.title ? <p className='tb-context-title'>{context.title}</p> : null}
          {context.paragraphs.map((paragraph, index) => <p key={index}><RichTextView text={paragraph} /></p>)}
        </div>
      );
    case 'table':
      return <div className='tb-context'><DataTable caption={context.caption} headers={context.headers} rows={context.rows} /></div>;
    case 'diagram':
      // A hotspot question on the same diagram draws it itself, label-free.
      if (hotspotDiagramId === context.diagramId) return null;
      return <div className='tb-context'><DiagramView diagramId={context.diagramId} mode='lesson' description={context.description} /></div>;
  }
}
