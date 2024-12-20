// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Extensions } from "@tiptap/core";
import { UAIEditor, UAIEditorOptions } from "./UAIEditor";

import { StarterKit } from "@tiptap/starter-kit";


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
    ];

    return extensions;
}
