// Copyright (c) 2024-present AI-Labs

import { mergeAttributes, Node } from '@tiptap/core'
import { resize } from '../utils/resize.ts'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setAudio: {
            setAudio: (options: any) => ReturnType
        }
    }
}
export default Node.create({
    name: 'audio',
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            vnode: {
                default: true,
            },
            id: {
                default: null,
            },
            file: {
                default: null,
            },
            name: {
                default: null,
            },
            size: {
                default: null,
            },
            src: {
                default: null,
            },
            controls: {
                default: true,
            },
            uploaded: {
                default: false,
            },
            previewType: {
                default: 'audio',
            },
        }
    },
    parseHTML() {
        return [{ tag: 'audio' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['audio', mergeAttributes(HTMLAttributes)]
    },
    addCommands() {
        return {
            setAudio:
                (options) =>
                    ({ commands, editor }) => {
                        return commands.insertContentAt(editor.state.selection.anchor, {
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },
    addNodeView() {
        return (props) => {
            const container = document.createElement('div');
            const { nodeAlign, src } = props.node.attrs;
            container.classList.add(`uai-node-view`);
            container.style.justifyContent = nodeAlign;
            container.innerHTML = `
        <div class="uai-resize-wrapper">
          <div class="uai-resize">
          </div>
          <audio src="${src}" controls="true"></audio>
        </div>
      `
            resize(container, this.editor.view.dom, (attrs) => this.editor.commands.updateAttributes("audio", attrs));
            return {
                dom: container
            }
        }
    },
})
