'use client'

import { ReactNode } from 'react'

interface CollapsibleProps {
    isOpen: boolean
    children: ReactNode
    direction?: 'vertical' | 'horizontal' | 'custom'
    className?: string
}

export function Collapsible({
    isOpen,
    children,
    direction = 'vertical',
    className = ''
}: CollapsibleProps) {
    let gridClass;
    if (direction === "custom") {
        gridClass = ''
    } else if (direction === 'vertical') {
        gridClass = 'accordion-grid-v'
    } else if (direction === 'horizontal') {
        gridClass = 'accordion-grid-h'
    }

    return (
        <div className={`${gridClass} ${isOpen ? 'expanded' : ''} ${className}`}>
            <div className="accordion-inner">
                {children}
            </div>
        </div>
    )
}
