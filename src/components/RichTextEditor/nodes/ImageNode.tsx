import React from 'react'
import { DecoratorNode, SerializedLexicalNode } from 'lexical'

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string
  __alt: string

  static getType(): string {
    return 'image'
  }
  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__key)
  }

  constructor(src: string, alt: string, key?: string) {
    super(key)
    this.__src = src
    this.__alt = alt
  }

  createDOM(): HTMLElement {
    return document.createElement('div')
  }
  updateDOM(): false {
    return false
  }
  decorate(): React.ReactElement {
    return <img src={this.__src} alt={this.__alt} className="max-w-full" />
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      alt: this.__alt,
    } as SerializedLexicalNode
  }
}

export function $createImageNode(src: string, alt: string): ImageNode {
  return new ImageNode(src, alt)
}
