// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Node, mergeAttributes } from '@tiptap/core';
import { t } from 'i18next';

import prettyBytes from 'pretty-bytes';

import { FullScreenModal } from '../components/modals/FullScreenModal.ts';
import { base64ToBlob, getFileIcon } from '../utils/File.ts';

import downloadIcon from "../assets/icons/download.svg";
import previewIcon from "../assets/icons/view.svg";

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setFile: {
            setFile: (options: any) => ReturnType
        }
    }
}

/**
 * 定义文件选择扩展
 */
export default Node.create({
    name: 'file',
    group: 'block',
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
            url: {
                default: null,
            },
            name: {
                default: null,
            },
            type: {
                default: null,
            },
            size: {
                default: null,
            },
            uploaded: {
                default: false,
            },
            previewType: {
                default: null,
            },
            width: {
                default: '500px',
            },
            height: {
                default: 'auto',
            },
        }
    },
    parseHTML() {
        return [{ tag: 'file' }]
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'file',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ]
    },
    addNodeView() {
        return (props) => {
            const attrs = props.node.attrs;
            const { nodeAlign, margin } = attrs;

            const wrapper = document.createElement('div');
            wrapper.classList.add("uai-node-view");
            wrapper.style.justifyContent = nodeAlign;
            const marginTop = margin?.top && margin?.top !== '' ? `${margin.top}px` : undefined;
            if (marginTop) {
                wrapper.style.marginTop = marginTop;
            }
            const marginBottom = margin?.bottom && margin?.bottom !== '' ? `${margin.bottom}px` : undefined;
            if (marginBottom) {
                wrapper.style.marginBottom = marginBottom;
            }
            const container = document.createElement('div');
            container.classList.add("uai-node-container");
            container.classList.add("hover-shadow");
            container.classList.add("uai-select-outline");
            container.classList.add("uai-node-file");
            wrapper.appendChild(container);

            const icon = document.createElement('div');
            icon.classList.add("uai-file-icon");
            container.appendChild(icon);
            const img = document.createElement('img');
            img.classList.add("icon-file");
            img.src = `https://unpkg.com/@uai-team/uai-resources@latest/dist/static/images/${getFileIcon(attrs.name)}.svg`;
            icon.appendChild(img);

            const info = document.createElement('div');
            info.classList.add("uai-file-info");
            container.appendChild(info);
            const name = document.createElement('div');
            name.classList.add("uai-file-name");
            name.title = attrs.name ?? t('file.unknownName');
            name.innerHTML = attrs.name ?? t('file.unknownName');
            info.appendChild(name);
            const meta = document.createElement('div');
            meta.classList.add("uai-file-meta");
            meta.innerHTML = attrs.size ? prettyBytes(attrs.size) : t('file.unknownSize');
            info.appendChild(meta);

            const action = document.createElement('div');
            action.classList.add("uai-file-action");
            container.appendChild(action);

            const preview = document.createElement('div');
            preview.classList.add("uai-action-item");
            preview.title = t('file.preview');
            preview.innerHTML = `<img src="${previewIcon}" width="16" />`;
            preview.addEventListener("click", () => {
                if (['image', 'video', 'audio'].includes(attrs.previewType)) {
                    props.editor.commands.insertContent({
                        type: attrs.previewType,
                        attrs: {
                            ...attrs,
                            src: attrs.url,
                        },
                    });
                } else if (["application/pdf"].includes(attrs.previewType)) {
                    const modal = new FullScreenModal(attrs.name ?? t('file.unknownName'));
                    const body = document.createElement('div');
                    body.classList.add("uai-file-preview-modal-body");
                    const iframe = document.createElement('iframe');
                    iframe.src = URL.createObjectURL(base64ToBlob(attrs.url, attrs.previewType));
                    body.appendChild(iframe);
                    modal.modalBody.appendChild(body);
                    modal.show();
                    const tippyRoot = document.querySelector<HTMLDivElement>('div[data-tippy-root]');
                    if (tippyRoot) {
                        tippyRoot.style.visibility = "hidden";
                    }
                    document.querySelector<HTMLDivElement>('.tippy-box')?.setAttribute("data-state", "hidden");
                    tippyRoot?.parentElement?.removeChild(tippyRoot);
                }
            });
            action.appendChild(preview);

            const download = document.createElement('a');
            download.classList.add("uai-action-item");
            download.title = t('file.downlod');
            download.href = attrs.url;
            download.target = "_blank";
            download.download = attrs.name;
            download.innerHTML = `<img src="${downloadIcon}" width="16" />`;
            action.appendChild(download);

            return {
                dom: wrapper,
            }
        }
    },
    addCommands() {
        return {
            setFile:
                (options) =>
                    ({ commands, editor }) => {
                        return commands.insertContentAt(editor.state.selection.anchor, {
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },
})
