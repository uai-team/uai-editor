// Copyright (c) 2024-present AI-Labs

import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setNodeAlign: {
            /**
             * 设置节点对齐方式
             * @param options 
             * @returns 
             */
            setNodeAlign: (options: any) => ReturnType
        }
        unsetNodeAlign: {
            /**
             * 取消设置节点对齐方式
             * @returns 
             */
            unsetNodeAlign: () => ReturnType
        }
    }
}

/**
 * 定义节点对齐扩展
 */
export default Extension.create({
    name: 'nodeAlign',
    addOptions() {
        return {
            defaultAlignment: 'center',
            alignments: ['flex-start', 'center', 'flex-end'],
            types: ['image', 'video', 'audio', 'iframe', 'file'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    nodeAlign: {
                        default: this.options.defaultAlignment,
                        parseHTML: (element) => {
                            return (
                                element.style.justifyContent || this.options.defaultAlignment
                            )
                        },
                        renderHTML: (attributes) => {
                            if (attributes.nodeAlign === this.options.defaultAlignment) {
                                return {}
                            }
                            return { style: `justify-content: ${attributes.nodeAlign}` }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setNodeAlign:
                (alignment) =>
                    ({ commands }) => {
                        if (!this.options.alignments.includes(alignment)) {
                            return false
                        }
                        return this.options.types.forEach((type: string) => {
                            commands.updateAttributes(type, { nodeAlign: alignment })
                        })
                    },
            unsetNodeAlign:
                () =>
                    ({ commands }) => {
                        return this.options.types.every((type: string) =>
                            commands.resetAttributes(type, 'nodeAlign'),
                        )
                    },
        }
    },
})
