import type { Block } from 'payload'

export const TableBlock: Block = {
  slug: 'table',
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
  fields: [
    {
      name: 'caption',
      type: 'text',
      label: 'Table Caption (optional)',
      admin: {
        description: 'Appears above the table as a heading',
      },
    },
    // ---------- Columns ----------
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      minRows: 1,
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
          label: 'Column Header',
        },
        {
          name: 'columnType',
          type: 'select',
          label: 'Content Type',
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Currency', value: 'currency' },
          ],
        },
        {
          name: 'currencySymbol',
          type: 'text',
          label: 'Currency Symbol',
          admin: {
            condition: (_, siblingData) => siblingData?.columnType === 'currency',
            description: 'e.g. $, BZD$, USD',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          label: 'Text Alignment',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          name: 'width',
          type: 'text',
          label: 'Column Width (CSS class)',
          admin: {
            description: 'e.g. w-50, w-25',
          },
        },
      ],
    },
    // ---------- Rows ----------
    {
      name: 'rows',
      type: 'array',
      label: 'Table Rows',
      minRows: 1,
      fields: [
        {
          name: 'cells',
          type: 'array',
          label: 'Cells',
          minRows: 1,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Content',
            },
          ],
        },
        {
          name: 'rowVariant',
          type: 'select',
          label: 'Row Style (optional)',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Active (bold subtotal)', value: 'active' },
            { label: 'Success (green)', value: 'success' },
            { label: 'Warning (yellow)', value: 'warning' },
            { label: 'Danger (red)', value: 'danger' },
            { label: 'Info (light blue)', value: 'info' },
          ],
        },
      ],
    },
    {
      name: 'striped',
      type: 'checkbox',
      label: 'Striped rows',
      defaultValue: true,
    },
    {
      name: 'hover',
      type: 'checkbox',
      label: 'Hover effect',
      defaultValue: true,
    },
  ],
}
