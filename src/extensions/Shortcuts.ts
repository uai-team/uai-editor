// Copyright (c) 2024-present AI-Labs

import { Extension } from '@tiptap/core';
import { Fullscreen } from '../components/menus/statusbar/Fullscreen';
import { InnerEditor } from '../core/UAIEditor';
import { Print } from '../components/menus/toolbar/base/Print';

/**
 * 自定义快捷键
 */
export default Extension.create({
    name: 'shortcuts',

    addKeyboardShortcuts() {
        return {
            // 自定义快捷键
            'F11': () => {
                // 全屏
                (document.querySelector("uai-editor-statusbar-menu-fullscreen") as Fullscreen).fullButton.click();
                return true;
            },
            'Ctrl-p': () => {
                // 打印
                (document.querySelector("uai-editor-base-menu-print") as Print).click();
                return true;
            },
            'Ctrl-=': () => {
                const editor = (this.editor as InnerEditor).uaiEditor.editor;
                const transform = editor.zoomableContent.style.transform;
                const matrix = new WebKitCSSMatrix(transform);
                editor.zoomableContent.style.transform = `scale(${matrix.a + 0.1})`;
                return true;
            },
            'Ctrl--': () => {
                const editor = (this.editor as InnerEditor).uaiEditor.editor;
                const transform = editor.zoomableContent.style.transform;
                const matrix = new WebKitCSSMatrix(transform);
                editor.zoomableContent.style.transform = `scale(${matrix.a - 0.1})`;
                return true;
            },
            'Ctrl-1': () => {
                const editor = (this.editor as InnerEditor).uaiEditor.editor;
                editor.zoomableContent.style.transform = `scale(1)`;
                return true;
            },
        };
    },
});
