// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Extension } from '@tiptap/core'

export interface LineHeightOptions {
    types: string[];
    defaultLineHeight: number;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setLineHeight: {
            /**
             * 设置行高
             * @param lineHeight 
             * @returns 
             */
            setLineHeight: (lineHeight: number) => ReturnType
        }
        unsetLineHeight: {
            /**
             * 取消设置行高
             * @returns 
             */
            unsetLineHeight: () => ReturnType
        }
    }
}

export default Extension.create<LineHeightOptions>({
    name: 'lineHeight',
    addOptions() {
        return {
            types: ["heading", "paragraph"],
            defaultLineHeight: 1.5,
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: this.options.defaultLineHeight,
                        parseHTML: (element) =>
                            element.style.lineHeight || this.options.defaultLineHeight,
                        renderHTML: (attributes) => {
                            if (attributes.lineHeight === this.options.defaultLineHeight) {
                                return {}
                            }
                            return { style: `line-height: ${attributes.lineHeight}` }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setLineHeight:
                (lineHeight) =>
                    ({ commands }) => {
                        return this.options.types.every((type: string) =>
                            commands.updateAttributes(type, { lineHeight: lineHeight }),
                        )
                    },
            unsetLineHeight:
                () =>
                    ({ commands }) => {
                        return this.options.types.every((type: string) =>
                            commands.resetAttributes(type, 'lineHeight'),
                        )
                    },
        }
    },
})
