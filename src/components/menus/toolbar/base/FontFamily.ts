// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

/**
 * 基础菜单：设置字体
 */
export class FontFamily extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "select",
        enable: true,
        hideText: true,
        text: t('base.fontFamily.text'),
        tooltip: t('base.fontFamily.text'),
    }

    // 功能按钮
    menuButton: MenuButton;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        this.menuButton.container.classList.add("uai-editor-menu-select");
        this.menuButton.menuButtonContent.style.fontSize = "11px";
        this.menuButton.menuButtonContent.style.width = "125px";
        // 设置可选字体
        options.dicts?.fontFamilies?.forEach(font => {
            const option = document.createElement("option");
            option.label = font.label;
            option.value = `${font.value}`;
            (this.menuButton.menuButtonContent as HTMLSelectElement).options.add(option);
        })
        this.appendChild(this.menuButton);

        // 定义按钮点击事件，设置当前内容的字体
        this.addEventListener("change", (e: Event) => {
            if (this.menuButtonOptions.enable) {
                const fontFamily = (e.target as HTMLSelectElement).value;
                if (fontFamily === "") {
                    event.editor.chain().focus().unsetFontFamily().run();
                } else {
                    event.editor.chain().focus().setFontFamily(fontFamily).run();
                }
            }
        })
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
        this.menuButton.onTransaction(event, options);
        if (this.menuButton.menuButtonContent && this.menuButtonOptions.enable) {
            var fontFamily = event.editor.getAttributes('textStyle').fontFamily;
            // 清除所有选项的选中状态
            (this.menuButton.menuButtonContent as HTMLSelectElement).querySelectorAll("option").forEach(option => {
                option.selected = false;
            });
            // 设置指定值的选项为选中状态
            const optionToSelect = (this.menuButton.menuButtonContent as HTMLSelectElement).querySelector(`option[value="${fontFamily}"]`) as HTMLOptionElement;
            if (optionToSelect) {
                optionToSelect.selected = true;
            }
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}

