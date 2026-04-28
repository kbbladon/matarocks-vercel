import React from 'react'

// ---------- Types ----------
interface Column {
  heading: string
  columnType?: ('text' | 'currency') | null
  currencySymbol?: string | null
  alignment?: ('left' | 'center' | 'right') | null
  width?: string | null
  id?: string | null
}
interface Cell {
  value: string
  id?: string | null
}
interface Row {
  cells?: Cell[] | null
  rowVariant?: ('default' | 'active' | 'success' | 'warning' | 'danger' | 'info') | null
  id?: string | null
}
interface TableBlockProps {
  caption?: string | null
  columns?: Column[] | null
  rows?: Row[] | null
  striped?: boolean | null
  hover?: boolean | null
  settings?: {
    headingFontFamily?: string | null
    bodyFontFamily?: string | null
    primaryColor?: string | null
    secondaryColor?: string | null
    linkColor?: string | null
  }
}

// ---------- Row variants ----------
const rowVariantClasses: Record<string, { bg: string; text: string; extra: string }> = {
  default: { bg: 'transparent', text: 'inherit', extra: '' },
  active: { bg: '#e2e8f0', text: '#1a202c', extra: 'font-semibold' },
  success: { bg: '#bbf7d0', text: '#1a202c', extra: '' },
  warning: { bg: '#fef08a', text: '#1a202c', extra: '' },
  danger: { bg: '#fecaca', text: '#1a202c', extra: '' },
  info: { bg: '#bfdbfe', text: '#1a202c', extra: '' },
}

const alignmentClasses: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

// ======================
// Component
// ======================
export const TableBlockComponent: React.FC<TableBlockProps> = ({
  caption,
  columns,
  rows,
  striped = true,
  hover = true,
  settings,
}) => {
  const headingFont = settings?.headingFontFamily || 'Baskervville, serif'
  const bodyFont = settings?.bodyFontFamily || 'Prompt, sans-serif'
  const primaryColor = settings?.primaryColor || '#FFD700'
  const secondaryColor = settings?.secondaryColor || '#E6B800'
  const linkColor = settings?.linkColor || '#FFD700'

  return (
    <section className="w-full py-6 lg:py-8">
      <div className="flex justify-center px-6">
        <div className="w-full max-w-[850px] lg:max-w-[1024px]">
          <div
            className="overflow-x-auto rounded-lg border"
            style={{ borderColor: secondaryColor + '80' }}
          >
            <table className="w-full border-collapse">
              {caption && (
                <caption
                  className="text-base sm:text-lg font-semibold my-3 text-center"
                  style={{ fontFamily: headingFont, color: linkColor }}
                >
                  {caption}
                </caption>
              )}

              <thead>
                <tr className="bg-gray-900/50 dark:bg-gray-800">
                  {columns?.map((col, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className={`px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 border-b font-semibold whitespace-normal lg:whitespace-nowrap text-sm sm:text-base lg:text-lg ${
                        alignmentClasses[col.alignment ?? 'left']
                      } ${col.width ?? ''}`}
                      style={{
                        fontFamily: headingFont,
                        color: primaryColor,
                        borderBottomColor: secondaryColor + '80',
                      }}
                    >
                      {col.heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows?.map((row, rIdx) => {
                  const variant = row.rowVariant ?? 'default'
                  const variantStyle = rowVariantClasses[variant]

                  // ----- STRIPE & HOVER -----
                  // Apply to all rows, but inline background for default rows is omitted
                  const stripeClass =
                    striped && rIdx % 2 === 0 ? 'bg-gray-100/40 dark:bg-gray-800/50' : ''
                  const hoverClass = hover ? 'hover:bg-gray-200/20 dark:hover:bg-gray-700/30' : ''

                  return (
                    <tr
                      key={rIdx}
                      className={`${stripeClass} ${hoverClass} ${variantStyle.extra} transition-colors`}
                      style={
                        variant === 'default'
                          ? undefined // ← no inline background, Tailwind takes over
                          : {
                              backgroundColor: variantStyle.bg,
                              color: variantStyle.text,
                            }
                      }
                    >
                      {row.cells?.map((cell, cellIdx) => {
                        const col = columns?.[cellIdx]
                        const isCurrency = col?.columnType === 'currency'
                        const symbol = col?.currencySymbol ?? '$'
                        const displayValue = isCurrency ? `${symbol}${cell.value}` : cell.value

                        return (
                          <td
                            key={cellIdx}
                            className={`px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 border-b whitespace-normal lg:whitespace-nowrap text-xs sm:text-sm lg:text-base ${
                              alignmentClasses[col?.alignment ?? 'left']
                            }`}
                            style={{
                              fontFamily: bodyFont,
                              borderBottomColor: secondaryColor + '30',
                            }}
                          >
                            {displayValue}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
