'use client';

import { SELECTION_STAGES, SELECTION_STATUSES } from '@/lib/constants';

interface Selection {
  id: string;
  stage: string;
  status: string;
  date: string | null;
}

export default function SelectionPipeline({ selections }: { selections: Selection[] }) {
  // SELECTION_STAGESの順番に並び替え
  const sortedSelections = [...selections].sort((a, b) => {
    const orderA = SELECTION_STAGES.find(s => s.value === a.stage)?.order || 99;
    const orderB = SELECTION_STAGES.find(s => s.value === b.stage)?.order || 99;
    return orderA - orderB;
  });

  return (
    <div className="pipeline">
      {sortedSelections.map((selection, index) => {
        const stageInfo = SELECTION_STAGES.find(s => s.value === selection.stage);
        if (!stageInfo) return null;

        // ステータスに応じたクラス名の付与
        let className = 'pipeline-stage';
        if (selection.status === 'PASSED') className += ' passed';
        if (selection.status === 'FAILED') className += ' failed';
        if (selection.status === 'SCHEDULED') className += ' scheduled';
        
        // 現在の進行中ステージかどうか（前のステージがPASSEDで、自身がPENDING/SCHEDULEDの場合など簡易判定）
        const isCurrent = selection.status === 'SCHEDULED' || 
          (selection.status === 'PENDING' && index > 0 && sortedSelections[index - 1].status === 'PASSED');
        if (isCurrent) className += ' current';

        return (
          <div key={selection.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={className}>
              <span>{stageInfo.label}</span>
              {selection.status !== 'PENDING' && (
                <span style={{ fontSize: '0.7em', marginLeft: '0.25rem', opacity: 0.8 }}>
                  ({SELECTION_STATUSES.find(s => s.value === selection.status)?.label})
                </span>
              )}
            </div>
            
            {index < sortedSelections.length - 1 && (
              <div className="pipeline-connector" style={{ margin: '0 0.5rem' }}>
                ▶
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
