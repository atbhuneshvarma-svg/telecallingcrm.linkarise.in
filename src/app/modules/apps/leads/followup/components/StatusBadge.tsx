import React, { useState } from 'react';

interface StatusBadgeProps {
    text: string;
    onStatusClick?: () => void;
    getStatusColor: (status: string) => string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ text, onStatusClick, getStatusColor }) => {
    const [hover, setHover] = useState(false);

    return (
        <span
            className="badge p-3 w-75"
            style={{
                backgroundColor: getStatusColor(text),
                color: '#fff',
                cursor: onStatusClick ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                alignItems:'center'
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onStatusClick}
        >
            {hover ? <i className="bi bi-pencil-square fs-4 mx-6"></i> : text}
        </span>
    );
};
