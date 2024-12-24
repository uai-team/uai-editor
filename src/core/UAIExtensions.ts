// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Extensions } from "@tiptap/core";
import { UAIEditor, UAIEditorOptions } from "./UAIEditor";

import { StarterKit } from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";

import BulletList from "../extensions/BulletList.ts";
import FontSize from "../extensions/FontSize.ts";
import Indent from "../extensions/Indent.ts";
import LineHeight from "../extensions/LineHeight.ts"
import NodeAlign from "../extensions/NodeAlign.ts";
import OrderedList from "../extensions/OrderedList.ts";

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
        BulletList,
        Color,
        FontFamily,
        FontSize.configure({

        }),
        Highlight.configure({
            multicolor: true
        }),
        Indent,
        LineHeight,
        Link,
        NodeAlign,
        OrderedList,
        Subscript,
        Superscript,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Underline,
    ];

    return extensions;
}
