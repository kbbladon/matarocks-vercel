'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

type ColorPickerProps = {
  path: string
  field: {
    label?: string
    required?: boolean
  }
}

const PRESET_COLORS = [
  '#FFD700',
  '#E6B800',
  '#FFC0CB',
  '#87CEEB',
  '#98FB98',
  '#FFA07A',
  '#F5F5F5',
  '#1E293B',
  '#000000',
]

const ColorPicker: React.FC<ColorPickerProps> = ({ path, field }) => {
  const { value = '#000000', setValue } = useField<string>({ path })

  const label = field?.label
  const required = field?.required

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handlePresetClick = (color: string) => {
    setValue(color)
  }

  return (
    <div className="mb-5">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Flex row – now with flex-nowrap to prevent wrapping */}
      <div className="flex flex-nowrap items-center gap-3 mb-3">
        {/* Main swatch – perfectly clipped */}
        <div
          className="relative w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden cursor-pointer shrink-0"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-0"
            style={{ boxShadow: 'none', outline: 'none' }}
          />
        </div>

        {/* Hex input – slightly smaller to fit alongside swatch */}
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#000000"
          className="w-24 sm:w-28 px-2 py-1.5 text-sm font-mono rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Color value badge */}
        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300 shrink-0">
          {value}
        </span>
      </div>

      {/* Preset swatches row */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handlePresetClick(color)}
            className="rounded border cursor-pointer hover:scale-110 transition-transform"
            style={{
              width: '1.75rem',
              height: '1.75rem',
              backgroundColor: color,
              borderColor: 'var(--theme-elevation-200, #d1d5db)',
              padding: 0,
              display: 'inline-block',
              flexShrink: 0,
            }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorPicker
