// Copyright (c) 2024-present AI-Labs

import { Extension } from '@tiptap/core'

export interface FontSizeOptions {
    types: string[]
    defaultFontSize: string
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setFontSize: {
            /**
             * 设置字体大小
             */
            setFontSize: (fontSize: any) => ReturnType
        }
        unsetFontSize: {
            /**
             * 取消字体大小设置
             */
            unsetFontSize: () => ReturnType
        }
    }
}

export default Extension.create<FontSizeOptions>({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
            defaultFontSize: '14px',
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: this.options.defaultFontSize,
                        parseHTML: (element) =>
                            element.style.fontSize || this.options.defaultFontSize,
                        renderHTML: (attributes) => {
                            if (attributes.fontSize === this.options.defaultFontSize) {
                                return {}
                            }
                            return { style: `font-size: ${attributes.fontSize}` }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize:
                (fontSize) =>
                    ({ chain }) => {
                        return chain().setMark('textStyle', { fontSize }).run()
                    },
            unsetFontSize:
                () =>
                    ({ chain }) => {
                        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
                    },
        }
    },
})
