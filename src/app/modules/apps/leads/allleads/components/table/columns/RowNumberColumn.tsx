import React from 'react';
import { Skeleton } from 'antd';

interface RowNumberColumnProps {
  showRowNumbers: boolean;
  index: number;
  getRowNumber: (index: number) => number;
  loading?: boolean;
}

export const RowNumberColumn: React.FC<RowNumberColumnProps> = ({
  showRowNumbers,
  index,
  getRowNumber,
  loading = false
}) => {
  if (!showRowNumbers) return null;

  return (
    <td className="ps-4">
      {loading ? (
        <Skeleton.Input style={{ width: 30 }} active size="small" />
      ) : (
        <span className="text-muted fs-8 fw-medium">
          {getRowNumber(index)}
        </span>
      )}
    </td>
  );
};
