import React from 'react';

interface RowNumberColumnProps {
  showRowNumbers: boolean;
  index: number;
  getRowNumber: (index: number) => number;
}

export const RowNumberColumn: React.FC<RowNumberColumnProps> = ({
  showRowNumbers,
  index,
  getRowNumber
}) => {
  if (!showRowNumbers) return null;
  
  return (
    <td className="ps-4">
      <span className="text-muted fs-8 fw-medium">
        {getRowNumber(index)}
      </span>
    </td>
  );
};