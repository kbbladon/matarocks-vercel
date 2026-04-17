'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  ElementFormatType,
} from 'lexical'
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list'
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection'
import { useCallback, useState, useEffect } from 'react'
import { $createImageNode } from './nodes/ImageNode'
import { useSiteSettings } from '@/providers/SiteSettingsProvider'
import { presetFonts, heroFonts } from '@/lib/fontMapping'

export const Toolbar = () => {
  const [editor] = useLexicalComposerContext()

  let settings = null
  try {
    settings = useSiteSettings()
  } catch (e) {
    console.debug('SiteSettingsProvider not found, using default font options')
  }

  const fontPreset = settings?.typography?.fontPreset || 'luxury'
  const preset = presetFonts[fontPreset as keyof typeof presetFonts] || presetFonts.luxury

  const fontOptions = [
    { label: 'Default', value: 'inherit' },
    {
      label: `${preset.heading} (Heading)`,
      value: `var(${preset.headingVariable}), serif`,
    },
    {
      label: `${preset.body} (Body)`,
      value: `var(${preset.bodyVariable}), sans-serif`,
    },
    ...heroFonts,
  ]

  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [currentFont, setCurrentFont] = useState('inherit')

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'))
          setIsItalic(selection.hasFormat('italic'))

          const fontFamily = $getSelectionStyleValueForProperty(selection, 'font-family', 'inherit')
          setCurrentFont(fontFamily)

          const nodes = selection.getNodes()
          let isInsideLink = false
          for (const node of nodes) {
            const parent = node.getParent()
            if ($isLinkNode(parent)) {
              isInsideLink = true
              break
            }
          }
          setIsLink(isInsideLink)
        }
      })
    })
  }, [editor])

  const applyFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const applyAlign = (alignment: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment)
  }

  const insertLink = useCallback(() => {
    const url = prompt('Enter URL')
    if (!url) return
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
  }, [editor])

  const changeFontFamily = (value: string) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-family': value === 'inherit' ? '' : value })
      }
    })
    setCurrentFont(value)
  }

  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL')
    if (url) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertNodes([$createImageNode(url, 'image')])
        }
      })
    }
  }, [editor])

  const insertTable = useCallback(() => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: '3', columns: '3' })
  }, [editor])

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50">
      <button onClick={() => applyFormat('bold')} className={isBold ? 'bg-gray-300' : ''}>
        <strong>B</strong>
      </button>
      <button onClick={() => applyFormat('italic')} className={isItalic ? 'bg-gray-300' : ''}>
        <em>I</em>
      </button>
      <button onClick={insertLink} className={isLink ? 'bg-gray-300' : ''}>
        🔗
      </button>
      <button onClick={() => applyAlign('left')}>←</button>
      <button onClick={() => applyAlign('center')}>↔️</button>
      <button onClick={() => applyAlign('right')}>→</button>
      <button onClick={() => applyAlign('justify')}>≡</button>
      <button onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        • List
      </button>
      <button onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        1. List
      </button>
      <button onClick={insertTable}>📊 Table</button>
      <select value={currentFont} onChange={(e) => changeFontFamily(e.target.value)}>
        {fontOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button onClick={insertImage}>🖼️</button>
      <input
        type="color"
        onChange={(e) => {
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { color: e.target.value })
            }
          })
        }}
      />
    </div>
  )
}
