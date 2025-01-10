// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { type Editor, Extension, findParentNode } from '@tiptap/core'
import { type NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

const LIST_TYPE = ['table'];

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setCurrentNodeSelection: {
            setCurrentNodeSelection: () => ReturnType
        }
        deleteSelectionNode: {
            deleteSelectionNode: () => ReturnType
        }
    }
}

/**
 * 定义内容选择扩展
 */
export default Extension.create({
    name: 'selection',
    addProseMirrorPlugins() {
        const { editor } = this

        return [
            new Plugin({
                key: new PluginKey('selection'),
                props: {
                    decorations(state) {
                        if (state.selection.empty) {
                            return null
                        }

                        if (editor.isFocused) {
                            return null
                        }

                        return DecorationSet.create(state.doc, [
                            Decoration.inline(state.selection.from, state.selection.to, {
                                class: 'uai-text-selection',
                            }),
                        ])
                    },
                },
            }),
        ]
    },
    addCommands() {
        return {
            setCurrentNodeSelection:
                () =>
                    ({ editor, chain }) => {
                        const parentNode = findParentNode((node) =>
                            LIST_TYPE.includes(node.type.name),
                        )(editor.state.selection)
                        if (parentNode) {
                            return chain().setNodeSelection(parentNode.pos).run()
                        }
                        const { $anchor, node } = editor.state.selection as NodeSelection
                        const pos = node?.attrs?.vnode
                            ? $anchor.pos
                            : $anchor.pos - $anchor.parentOffset - 1
                        return chain().setNodeSelection(pos).run()
                    },
            deleteSelectionNode:
                () =>
                    ({ editor, chain }) => {
                        const node = getSelectionNode(editor)
                        if (!node) {
                            return false
                        }
                        if (node.attrs.vnode) {
                            chain().focus().deleteSelection().run()
                            return true
                        }
                        if (editor.isActive('table')) {
                            chain().focus().deleteTable().run()
                            return true
                        }
                        return chain().focus().deleteNode(node.type.name).run()
                    },
        }
    },
})

/**
 * 获取当前选中的节点
 * @param editor 
 * @returns 
 */
export function getSelectionNode(editor: Editor) {
    const { node } = editor.state.selection as NodeSelection
    if (node) {
        return node
    }
    const parentNode = findParentNode((node) =>
        LIST_TYPE.includes(node.type.name),
    )(editor.state.selection)
    const { $anchor } = editor.state.selection
    if (parentNode) {
        return $anchor.node(parentNode.depth)
    }
    editor.commands.selectParentNode()
    return (editor.state.selection as NodeSelection).node
}

/**
 * 获取选中的文本
 * @param editor 
 * @returns 
 */
export function getSelectionText(editor: Editor) {
    const { from, to, empty } = editor.state.selection
    if (empty) {
        return ''
    }
    return editor.state.doc.textBetween(from, to, '')
}
