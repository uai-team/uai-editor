// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Extension, Extensions, getTextBetween } from "@tiptap/core";
import { UAIEditor, UAIEditorOptions } from "./UAIEditor";

import { StarterKit } from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";

import { Export } from '@tiptap-pro/extension-export';
import { Mathematics } from '@tiptap-pro/extension-mathematics';
import { TableOfContents, getHierarchicalIndexes } from '@tiptap-pro/extension-table-of-contents'

import BulletList from "../extensions/BulletList.ts";
import FontSize from "../extensions/FontSize.ts";
import Image from "../extensions/Image.ts";
import Indent from "../extensions/Indent.ts";
import LineHeight from "../extensions/LineHeight.ts"
import NodeAlign from "../extensions/NodeAlign.ts";
import OrderedList from "../extensions/OrderedList.ts";
import SelectFile from "../extensions/SelectFile.ts";
import Selection from "../extensions/Selection.ts";
import Video from "../extensions/Video.ts";
import Audio from "../extensions/Audio.ts";
import { uuid } from "../utils/UUID.ts";
import Toc from "../extensions/Toc.ts";

import { BubbleMenuPluginOptions, BubbleMenuPlugin } from "../components/menus/bubble/BubbleMenuPlugin.ts";
import { TextSelectionBubbleMenu } from "../components/menus/bubble/TextSelectionBubbleMenu.ts";
import { ImageBubbleMenu } from "../components/menus/bubble/ImageBubbleMenu.ts";
import { VideoBubbleMenu } from "../components/menus/bubble/VideoBubbleMenu.ts";

/**
 * 创建浮动菜单功能
 * @param name 
 * @param options 
 * @returns 
 */
function createBubbleMenu(name: string, options: BubbleMenuPluginOptions) {
    return Extension.create<BubbleMenuPluginOptions>({
        name: name,
        addOptions() {
            return {
                ...options
            }
        },
        addProseMirrorPlugins() {
            if (!this.options.element) {
                return []
            }

            return [
                BubbleMenuPlugin({
                    pluginKey: this.options.pluginKey,
                    editor: this.editor,
                    element: this.options.element,
                    tippyOptions: this.options.tippyOptions,
                    shouldShow: this.options.shouldShow,
                }),
            ]
        },
    })
}

/**
 * 创建文本内容的浮动菜单
 * @param uaiEditor 
 * @returns 
 */
const createTextSelectionBubbleMenu = (uaiEditor: UAIEditor) => {
    const container = new TextSelectionBubbleMenu(uaiEditor);

    return createBubbleMenu("textSelectionBubbleMenu", {
        pluginKey: 'textSelectionBubbleMenu',
        element: container,
        tippyOptions: {
            appendTo: uaiEditor.editor.editorContainer,
            arrow: false,
            interactive: true,
            hideOnClick: false,
            placement: 'top',
        },
        shouldShow: ({ editor }) => {
            if (!editor.isEditable) {
                return false;
            }
            const { state: { selection } } = editor;
            return !selection.empty && getTextBetween(editor.state.doc, {
                from: selection.from,
                to: selection.to
            }).trim().length > 0
                && !editor.isActive("image");
        }
    })
}

/**
 * 创建图片内容的浮动菜单
 * @param uaiEditor 
 * @returns 
 */
const createImageBubbleMenu = (uaiEditor: UAIEditor) => {
    const container = new ImageBubbleMenu(uaiEditor);

    return createBubbleMenu("imageBubbleMenu", {
        pluginKey: 'imageBubbleMenu',
        element: container,
        tippyOptions: {
            appendTo: uaiEditor.editor.editorContainer,
            arrow: false,
            interactive: true,
            hideOnClick: false,
            placement: 'top',
        },
        shouldShow: ({ editor }) => {
            if (!editor.isEditable) {
                return false;
            }
            return editor.isActive("image")
        }
    })
}

/**
 * 创建视频内容的浮动菜单
 * @param uaiEditor 
 * @returns 
 */
const createVideoBubbleMenu = (uaiEditor: UAIEditor) => {
    const container = new VideoBubbleMenu(uaiEditor);

    return createBubbleMenu("videoBubbleMenu", {
        pluginKey: 'videoBubbleMenu',
        element: container,
        tippyOptions: {
            appendTo: uaiEditor.editor.editorContainer,
            arrow: false,
            interactive: true,
            hideOnClick: false,
            placement: 'top',
        },
        shouldShow: ({ editor }) => {
            if (!editor.isEditable) {
                return false;
            }
            return editor.isActive("video")
        }
    })
}

/**
 * 定义编辑器的所有自定义扩展组件
 * @param uaiEditor 
 * @param _options 
 * @returns 
 */
export const allExtensions = (uaiEditor: UAIEditor, _options: UAIEditorOptions): Extensions => {
    let extensions: Extensions = [
        StarterKit.configure({
            bulletList: false,
            orderedList: false,
        }),
        Audio,
        BulletList,
        Color,
        Export.configure({
            appId: process.env.TIPTAP_APP_ID,
            token: process.env.TIPTAP_JWT_TOKEN,
        }),
        FontFamily,
        FontSize.configure({

        }),
        Highlight.configure({
            multicolor: true
        }),
        Image,
        Indent,
        LineHeight,
        Link,
        Mathematics.configure({
            shouldRender: (state, pos, node) => {
                const $pos = state.doc.resolve(pos)
                return node.type.name === 'text' && $pos.parent.type.name !== 'codeBlock'
            }
        }),
        NodeAlign,
        OrderedList,
        SelectFile.configure({
            allowedMimeTypes: []
        }),
        Selection,
        Subscript,
        Superscript,
        Table.configure({
            resizable: true,
            lastColumnResizable: true,
            allowTableNodeSelection: true,
        }),
        TableCell,
        TableHeader,
        TableRow,
        TableOfContents.configure({
            getIndex: getHierarchicalIndexes,
            onUpdate: (content) => {
                uaiEditor.tableOfContents = content;
                uaiEditor.tocContainer.renderContents(uaiEditor);
            },
            scrollParent: () =>
                document.querySelector(
                    ".uai-main",
                ) as HTMLElement,
            getId: () => uuid(),
        }),
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Toc,
        Underline,
        Video,
        createTextSelectionBubbleMenu(uaiEditor),
        createImageBubbleMenu(uaiEditor),
        createVideoBubbleMenu(uaiEditor),
    ];

    return extensions;
}
