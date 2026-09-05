import type { ReactNode } from 'react';

type Props = {
  head: string[];
  rows: ReactNode[][];
  /** 표 하단 주석 (출처·기준일) */
  caption?: ReactNode;
  align?: ('left' | 'center')[];
  firstColHeader?: boolean;
};

/** 반응형 비교표 (모바일 가로 스크롤) */
export default function DataTable({ head, rows, caption, align = [], firstColHeader = true }: Props) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" style={{ textAlign: align[i] ?? 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) =>
                ci === 0 && firstColHeader ? (
                  <th key={ci} scope="row" style={{ textAlign: align[ci] ?? 'left', padding: '13px 16px', borderTop: '1px solid var(--border-color)', whiteSpace: 'normal', color: 'var(--text-primary)' }}>{c}</th>
                ) : (
                  <td key={ci} className={align[ci] === 'center' ? 'num' : undefined}>{c}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
