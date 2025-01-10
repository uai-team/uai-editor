// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Command, Extension } from '@tiptap/core';

import { AllSelection, TextSelection, Transaction } from 'prosemirror-state';

export interface IndentOptions {
    types: string[];
    minLevel: number;
    maxLevel: number;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        indent: {
            /**
             * 向右缩进
             * @returns 
             */
            indent: () => ReturnType;
            /**
             * 向左缩进
             * @returns 
             */
            outdent: () => ReturnType;
        };
    }
}

/**
 * 缩进样式前缀
 */
const classAttrPrefix = 'indent-';

export default Extension.create<IndentOptions>({
    name: 'indent',

    priority: 99,

    addOptions() {
        return {
            types: ['heading', 'listItem', 'taskItem', 'paragraph'],
            minLevel: 0,
            maxLevel: 8,
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    indent: {
                        default: 0,
                        parseHTML: element => {
                            let level = 0
                            for (const className of element.classList) {
                                if (className.startsWith(classAttrPrefix)) {
                                    level = +(className.split("-")[1])
                                    break
                                }
                            }
                            return level && level > this.options.minLevel ? level : null;
                        },

                        renderHTML: attributes => {
                            if (!attributes.indent) {
                                return {}
                            }

                            return {
                                class: `${classAttrPrefix}${attributes.indent}`,
                            }
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        const setNodeIndentMarkup = (tr: Transaction, pos: number, delta: number): Transaction => {
            const node = tr?.doc?.nodeAt(pos);

            if (node) {
                const nextLevel = (node.attrs.indent || 0) + delta;
                const { minLevel, maxLevel } = this.options;
                const indent = nextLevel < minLevel ? minLevel : nextLevel > maxLevel ? maxLevel : nextLevel;

                if (indent !== node.attrs.indent) {
                    const { indent: oldIndent, ...currentAttrs } = node.attrs;
                    const nodeAttrs = indent > minLevel ? { ...currentAttrs, indent } : currentAttrs;
                    return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
                }
            }
            return tr;
        };

        const updateIndentLevel = (tr: Transaction, delta: number): Transaction => {
            const { doc, selection } = tr;

            if (doc && selection && (selection instanceof TextSelection || selection instanceof AllSelection)) {
                const { from, to } = selection;
                doc.nodesBetween(from, to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        tr = setNodeIndentMarkup(tr, pos, delta);
                        return false;
                    }

                    return true;
                });
            }

            return tr;
        };

        const applyIndent: (direction: number) => () => Command =
            direction =>
                () =>
                    ({ tr, state, dispatch }) => {
                        const { selection } = state;
                        tr = tr.setSelection(selection);
                        tr = updateIndentLevel(tr, direction);

                        if (tr.docChanged) {
                            dispatch?.(tr);
                            return true;
                        }

                        return false;
                    };
        return {
            indent: applyIndent(1),
            outdent: applyIndent(-1),
        };
    },

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                return this.editor.commands.indent();
            },
            'Shift-Tab': () => {
                return this.editor.commands.outdent();
            },
        };
    },
});
