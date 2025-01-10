// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../MenuButton.ts";

import icon from "../../../assets/icons/font-size-increase.svg";

/**
 * 公共菜单：增大字号
 */
export class FontSizeIncrease extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.fontSize.increase'),
        tooltip: t('base.fontSize.increase'),
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
        this.appendChild(this.menuButton);

        // 定义按钮点击事件，设置增大字号
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                // 获取当前字号
                var fontSize = event.editor.getAttributes('textStyle').fontSize;
                if (fontSize) {
                    const size = options.dicts?.fontSizes?.find(({ value }) => value === fontSize);
                    if (!size) {
                        return;
                    }
                    // 获取比当前字号大的字号
                    const nextFont = options.dicts?.fontSizes?.find(({ order }) => order === +size.order + 1);
                    if (nextFont) {
                        event.editor.chain().focus().setFontSize(nextFont.value).run();
                    }
                } else {
                    event.editor.chain().focus().setFontSize("18px").run();
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
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}

