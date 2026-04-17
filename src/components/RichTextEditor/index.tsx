'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { Toolbar } from './Toolbar'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'
import { ImageNode } from './nodes/ImageNode'
import type { EditorState } from 'lexical'

const editorConfig = {
  namespace: 'MyEditor',
  theme: {
    link: 'text-blue-500 underline',
    list: {
      ul: 'list-disc pl-5',
      ol: 'list-decimal pl-5',
    },
    table: 'border-collapse border border-gray-300',
    tableCell: 'border border-gray-300 p-2',
  },
  onError: (error: Error) => console.error(error),
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    ImageNode,
  ],
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) {
  // Parse the JSON string into an EditorState object
  const initialEditorState = value
    ? (() => {
        try {
          return JSON.parse(value)
        } catch (e) {
          console.error('Failed to parse rich text value', e)
          return undefined
        }
      })()
    : undefined

  const handleChange = (editorState: EditorState) => {
    const serialized = JSON.stringify(editorState.toJSON())
    onChange?.(serialized)
  }

  return (
    <LexicalComposer initialConfig={{ ...editorConfig, editorState: initialEditorState }}>
      <div className="border rounded-md">
        <Toolbar />
        <RichTextPlugin
          contentEditable={<ContentEditable className="p-4 min-h-[200px] outline-none" />}
          placeholder={<div className="p-4 text-gray-400">Start writing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <LinkPlugin />
        <ListPlugin />
        <TablePlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  )
}
