'use client'
import React, { useRef } from 'react'
import { useField } from '@payloadcms/ui'

type ColorPickerProps = {
  path: string
  field: {
    label?: string
    required?: boolean
  }
}

// Predefined color palette
const PRESET_COLORS = [
  '#FFD700', // gold
  '#E6B800', // dark gold
  '#FFC0CB', // pink
  '#87CEEB', // sky blue
  '#98FB98', // mint
  '#FFA07A', // light salmon
  '#F5F5F5', // off-white
  '#1E293B', // slate
  '#000000', // black
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
        <label className="block mb-1 font-medium text-[--theme-text] text-sm">
          {label}
          {required && <span className="text-[--theme-error] ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-3 mb-3">
        {/* Color Swatch with clickable input */}
        <div
          className="w-11 h-11 rounded-lg border border-[--theme-elevation-200] shadow-sm relative overflow-hidden cursor-pointer"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          />
        </div>

        {/* Hex input */}
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#000000"
          className="w-[110px] font-mono text-sm px-2 py-1.5 rounded-md border border-[--theme-elevation-200] bg-[--theme-input-bg] text-[--theme-text] outline-none focus:border-[--theme-primary]"
        />

        {/* Value badge */}
        <span className="font-mono text-xs bg-[--theme-elevation-100] px-2 py-1 rounded-md text-[--theme-text]">
          {value}
        </span>
      </div>

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handlePresetClick(color)}
            className="w-8 h-8 rounded-md border border-[--theme-elevation-200] cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            aria-label={`Preset color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorPicker
