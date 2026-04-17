import React from 'react'
import { DecoratorNode, LexicalEditor, NodeKey, SerializedLexicalNode } from 'lexical'

export type SerializedImageNode = SerializedLexicalNode & {
  src: string
  altText: string
  width?: number
  height?: number
  maxWidth?: number
}

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string
  __altText: string
  __width?: number
  __height?: number
  __maxWidth?: number

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__maxWidth,
      node.__key,
    )
  }

  constructor(
    src: string,
    altText: string,
    width?: number,
    height?: number,
    maxWidth?: number,
    key?: NodeKey,
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__width = width
    this.__height = height
    this.__maxWidth = maxWidth
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span')
    span.style.display = 'inline-block'
    span.style.maxWidth = '100%'
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(editor: LexicalEditor): React.ReactElement {
    return (
      <img
        src={this.__src}
        alt={this.__altText}
        style={{
          width: this.__width ? `${this.__width}px` : 'auto',
          height: 'auto',
          maxWidth: '100%',
          cursor: 'pointer',
        }}
      />
    )
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      maxWidth: this.__maxWidth,
    }
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.height,
      serializedNode.maxWidth,
    )
  }
}
