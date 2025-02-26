// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { NodeViewRendererProps } from '@tiptap/core'
import Image from '@tiptap/extension-image'

import { resize } from '../utils/Resize.ts'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setImage: {
            /**
             * 设置图片
             * @param options 
             * @param replace 
             * @returns 
             */
            setImage: (options: any, replace?: any) => ReturnType
        }
    }
}
export default Image.extend({
    atom: true,
    addAttributes() {
        return {
            vnode: {
                default: true,
            },
            id: {
                default: null,
            },
            type: {
                default: 'image',
            },
            name: {
                default: null,
            },
            size: {
                default: null,
            },
            file: {
                default: null,
            },
            src: {
                default: null,
            },
            content: {
                default: null,
            },
            width: {
                default: '500px',
            },
            height: {
                default: 'auto',
            },
            left: {
                default: 0,
            },
            top: {
                default: 0,
            },
            angle: {
                default: null,
            },
            draggable: {
                default: false,
            },
            rotatable: {
                default: false,
            },
            equalProportion: {
                default: true,
            },
            flipX: {
                default: false,
            },
            flipY: {
                default: false,
            },
            uploaded: {
                default: false,
            },
            error: {
                default: false,
            },
            previewType: {
                default: 'image',
            },
        }
    },
    parseHTML() {
        return [{ tag: 'img' }]
    },
    addNodeView() {
        return (props: NodeViewRendererProps) => {
            const container = document.createElement('div');
            const { src, width, height, nodeAlign, alt, flipX, flipY } = props.node.attrs;
            container.classList.add(`uai-node-view`);
            container.style.justifyContent = nodeAlign;

            const wrapperStyle = `${width}`.indexOf("%") > 0 ? `style="width: ${width};"` : "";

            var transform = "none";

            if (flipX || flipY) {
                transform = `rotateX(${flipX ? '180' : '0'}deg) rotateY(${flipY ? '180' : '0'}deg)`
            }

            if (!this.editor.isEditable) {
                container.innerHTML = `
        <div class="uai-resize-wrapper" ${wrapperStyle}>
          <img alt="${alt}" src="${src}" style="width: ${width}; height: ${height || 'auto'}; transform: ${transform};" class="resize-obj">
        </div>
        `
                return {
                    dom: container,
                }
            }

            container.innerHTML = `
      <div class="uai-resize-wrapper" ${wrapperStyle}>
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
          <img alt="${alt}" src="${src}" style="width: ${width}; height: ${height || 'auto'}; transform: ${transform};" class="resize-obj">
      </div>
      `
            resize(container, this.editor.view.dom, (attrs) => this.editor.commands.updateAttributes("image", attrs));
            return {
                dom: container,
            }
        }
    },
    addCommands() {
        return {
            setImage:
                (
                    options: { src: string; alt?: string; title?: string },
                    replace?: boolean,
                ) =>
                    ({ commands, editor }) => {
                        if (replace) {
                            return commands.insertContent({
                                type: this.name,
                                attrs: options,
                            })
                        }
                        return commands.insertContentAt(editor.state.selection.anchor, {
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },
})
