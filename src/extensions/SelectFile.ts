// Copyright (c) 2024-present AI-Labs

import { Node, mergeAttributes } from '@tiptap/core';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { InnerEditor } from '../core/UAIEditor.ts';
import { Base64Uploader } from '../utils/FileUploader.ts';
import { uuid } from '../utils/UUID.ts';
import { Icons } from '../components/Icons.ts';

export type DecorationWaitingAction = {
    type: "add" | "remove";
    id: string;
    pos: number;
}
const key = new PluginKey("uai-waiting-plugin");
const actionKey = "uai_waiting_action";

export const createDecoration = (action: { pos: number, id: string }) => {
    const placeholder = document.createElement("div");
    placeholder.classList.add("uai-loader-placeholder");
    placeholder.innerHTML = Icons.Loading;
    return Decoration.widget(action.pos, placeholder, { id: action.id });
}

export interface SelectFileOptions {
    allowedMimeTypes: string[],
    HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        setFile: {
            setFile: (options: any) => ReturnType
        }
        insertFile: {
            insertFile: (options: any) => ReturnType
        }
        selectFiles: {
            selectFiles: (type: any, autoType: any) => ReturnType
        }
    }
}

/**
 * 指定可选文件的类型
 */
const mimeTypes: any = {
    image: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        'image/apng',
    ],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    audio: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac'],
}

/**
 * 判断是否接受选择的文件类型
 * @param options 
 * @param type 
 * @returns 
 */
const getAccept = (options: SelectFileOptions, type: string) => {
    const accept = options.allowedMimeTypes
    if (type === 'file' && accept.length === 0) {
        return ''
    }
    if (!type || !['image', 'video', 'audio'].includes(type)) {
        return accept.toString()
    }
    let acceptArray = [...accept]
    if (acceptArray.includes(`${type}/*`) || accept.length === 0) {
        acceptArray = mimeTypes[type]
    } else if (acceptArray.filter((item) => item.startsWith(type)).length > 0) {
        acceptArray = accept.filter((item: any) => mimeTypes[type].includes(item))
    } else {
        acceptArray = ['notAllow']
    }
    return acceptArray.length === 0 ? '' : acceptArray.toString()
}

/**
 * 定义文件选择扩展
 */
export default Node.create<SelectFileOptions>({
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
                default: null,
            },
            height: {
                default: 200,
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
    addCommands() {
        return {
            insertFile:
                ({ file, autoType }) =>
                    ({ editor }) => {
                        const { type, name, size } = file;
                        let previewType: string | null = null;
                        const id = uuid();
                        let uploader = Base64Uploader;
                        let editorOptions = (editor as InnerEditor).uaiEditor.options;
                        const { state: { tr }, view } = this.editor;
                        if (!tr.selection.empty) tr.deleteSelection();
                        view.dispatch(tr.setMeta(actionKey, {
                            type: "add",
                            id,
                            pos: tr.selection.from,
                        }));

                        // 图片
                        if (type.startsWith('image/') && mimeTypes.image.includes(type)) {
                            previewType = 'image';
                            uploader = editorOptions.image?.uploader ?? Base64Uploader;
                            uploader(file, editorOptions.image?.uploadUrl, editorOptions.image?.uploadHeaders, editorOptions.image?.uploadFormName || "image")
                                .then(json => {
                                    view.dispatch(tr.setMeta(actionKey, { type: "remove", id }));
                                    this.editor.commands.insertContentAt(tr.selection.from, {
                                        type: autoType ? (previewType ?? 'file') : 'file',
                                        attrs: {
                                            [previewType === 'file' ? 'url' : 'src']: json.data.src,
                                            name,
                                            type,
                                            size,
                                            file,
                                            previewType,
                                        },
                                    });
                                });
                        }
                        // 视频
                        if (type.startsWith('video/') && mimeTypes.video.includes(type)) {
                            previewType = 'video';

                            uploader = editorOptions.video?.uploader ?? Base64Uploader;
                            uploader(file, editorOptions.video?.uploadUrl, editorOptions.video?.uploadHeaders, editorOptions.video?.uploadFormName || "video")
                                .then(json => {
                                    view.dispatch(tr.setMeta(actionKey, { type: "remove", id }));
                                    this.editor.commands.insertContentAt(tr.selection.from, {
                                        type: autoType ? (previewType ?? 'file') : 'file',
                                        attrs: {
                                            [previewType === 'file' ? 'url' : 'src']: json.data.src,
                                            name,
                                            type,
                                            size,
                                            file,
                                            previewType,
                                        },
                                    });
                                });
                        }
                        // 音频
                        if (type.startsWith('audio/') && mimeTypes.audio.includes(type)) {
                            previewType = 'audio';
                            uploader = editorOptions.audio?.uploader ?? Base64Uploader;
                            uploader(file, editorOptions.audio?.uploadUrl, editorOptions.audio?.uploadHeaders, editorOptions.audio?.uploadFormName || "audio")
                                .then(json => {
                                    view.dispatch(tr.setMeta(actionKey, { type: "remove", id }));
                                    this.editor.commands.insertContentAt(tr.selection.from, {
                                        type: autoType ? (previewType ?? 'file') : 'file',
                                        attrs: {
                                            [previewType === 'file' ? 'url' : 'src']: json.data.src,
                                            name,
                                            type,
                                            size,
                                            file,
                                            previewType,
                                        },
                                    });
                                });
                        }
                        return true;
                    },
            selectFiles:
                (type, autoType = false) =>
                    ({ editor }) => {
                        const accept = getAccept(this.options, type)
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.multiple = true;
                        fileInput.accept = accept;
                        fileInput.click();
                        fileInput.addEventListener("change", () => {
                            for (const file of fileInput.files ?? []) {
                                editor.chain().focus().insertFile({ file, autoType }).run();
                            }
                        });
                        return true;
                    }
        }
    },
    addProseMirrorPlugins() {
        const editor = this.editor;
        return [
            new Plugin({
                key: key,
                state: {
                    init: () => DecorationSet.empty,
                    apply: (tr, set) => {
                        const action = tr.getMeta(actionKey) as DecorationWaitingAction;
                        if (action) {
                            // update decorations position
                            let removed = false;
                            const newSet = set.map(tr.mapping, tr.doc, {
                                onRemove: (_) => {
                                    removed = true;
                                }
                            });

                            if (!removed) {
                                set = newSet;
                            }

                            // add decoration
                            if (action.type === "add") {
                                set = set.add(tr.doc, [createDecoration(action)]);
                            }
                            // remove decoration
                            else if (action.type === "remove") {
                                set = set.remove(set.find(void 0, void 0,
                                    spec => spec.id == action.id));
                            }
                        }
                        return set;
                    }
                },

                props: {
                    decorations(state) {
                        return this.getState(state);
                    },

                    handlePaste: (_, event) => {
                        const items = Array.from(event.clipboardData?.items || []);
                        let isImagePasted = false;
                        let autoType = true;
                        for (const item of items) {
                            if (item.type.indexOf("image") === 0) {
                                const file = item.getAsFile();
                                if (file) {
                                    event.preventDefault();
                                    isImagePasted = true;

                                    editor.chain().focus().insertFile({ file, autoType }).run();
                                }
                            }
                        }
                        return isImagePasted;
                    },

                    handleDOMEvents: {
                        drop(view, event) {
                            let autoType = true;
                            const hasFiles = event.dataTransfer &&
                                event.dataTransfer.files &&
                                event.dataTransfer.files.length

                            if (!hasFiles) return false

                            const images = Array
                                .from(event.dataTransfer.files)
                                .filter(file => (/image/i).test(file.type))

                            if (images.length === 0) return false

                            event.preventDefault()

                            const { state: { tr, doc }, dispatch } = view
                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })
                            dispatch(tr.setSelection(TextSelection.create(doc, coordinates!.pos)).scrollIntoView())

                            images.forEach(image => {
                                editor.chain().focus().insertFile({ image, autoType }).run();
                            })

                            return true
                        }
                    },

                    transformPastedHTML(html) {
                        const parser = new DOMParser();
                        const document = parser.parseFromString(html, 'text/html');
                        const workspace = document.documentElement.querySelector('body');
                        if (workspace?.children) {
                            const imgNodes = document.documentElement.querySelectorAll('p > img');
                            for (const image of imgNodes) {
                                const imageParent = image.parentNode;
                                const position = Array.prototype.indexOf.call(workspace.children, imageParent);
                                image.parentElement!.prepend(image);
                                workspace.insertBefore(image, workspace.children[position]);
                            }
                            return workspace.innerHTML;
                        }
                        return html;
                    },
                }
            }),
        ]
    },
})
