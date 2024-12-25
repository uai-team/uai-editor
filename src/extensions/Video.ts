// Copyright (c) 2024-present AI-Labs

import { mergeAttributes, Node } from '@tiptap/core'
import { resize } from '../utils/resize'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setVideo: {
            /**
             * 设置视频
             * @param options 
             * @returns 
             */
            setVideo: (options: any) => ReturnType
        }
    }
}
export default Node.create({
    name: 'video',
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
            width: {
                default: '500px',
            },
            height: {
                default: 'auto',
            },
            controls: {
                default: true,
            },
            draggable: {
                default: false,
            },
            uploaded: {
                default: false,
            },
            previewType: {
                default: 'video',
            },
        }
    },
    parseHTML() {
        return [{ tag: 'video' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes)]
    },
    addCommands() {
        return {
            setVideo:
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
            const { src, width, nodeAlign } = props.node.attrs;
            container.classList.add(`uai-node-view`);
            container.style.justifyContent = nodeAlign;

            if (!this.editor.isEditable) {
                return {
                    dom: container
                }
            }

            container.innerHTML = `
        <div class="uai-resize-wrapper">
            <div class="uai-resize">
              <div class="uai-resize-btn-top-left" data-position="1" draggable="true"></div>
              <div class="uai-resize-btn-top-center" data-position="2" draggable="true"></div>
              <div class="uai-resize-btn-top-right" data-position="3" draggable="true"></div>
              <div class="uai-resize-btn-left-center" data-position="4" draggable="true"></div>
              <div class="uai-resize-btn-right-center" data-position="5" draggable="true"></div>
              <div class="uai-resize-btn-bottom-left" data-position="6" draggable="true"></div>
              <div class="uai-resize-btn-bottom-center" data-position="7" draggable="true"></div>
              <div class="uai-resize-btn-bottom-right" data-position="8" draggable="true"></div>
            </div>
            <video controls="controls" width="${width}" class="resize-obj">
                <source src="${src}">
            </video>
        </div>
      `
            resize(container, this.editor.view.dom, (attrs) => this.editor.commands.updateAttributes("video", attrs));
            return {
                dom: container,
            }
        }
    },
})
