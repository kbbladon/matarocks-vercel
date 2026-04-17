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

// Predefined color palette (you can customize these)
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
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Label */}
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '0.4rem',
            fontWeight: 500,
            color: 'var(--theme-text)',
            fontSize: '0.9rem',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--theme-error)', marginLeft: '0.25rem' }}>*</span>
          )}
        </label>
      )}

      {/* Main controls: color picker, hex input, value badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.75rem',
        }}
      >
        {/* Color Swatch */}
        <label
          style={{
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--theme-elevation-200)',
            background: value,
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >
          <input
            type="color"
            value={value}
            onChange={handleColorChange}
            style={{
              opacity: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          />
        </label>

        {/* Hex Input */}
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#000000"
          style={{
            width: '110px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: '0.4rem 0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--theme-elevation-200)',
            backgroundColor: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--theme-primary)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--theme-elevation-200)'
          }}
        />

        {/* Value badge */}
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            backgroundColor: 'var(--theme-elevation-100)',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem',
            color: 'var(--theme-text)',
          }}
        >
          {value}
        </span>
      </div>

      {/* Predefined colors row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginTop: '0.5rem',
        }}
      >
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handlePresetClick(color)}
            style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--theme-elevation-200)',
              background: color,
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
            aria-label={`Preset color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorPicker
