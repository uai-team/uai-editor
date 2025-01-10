// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/outdent.svg";

/**
 * 基础菜单：向左缩进
 */
export class Outdent extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.outdent'),
        tooltip: t('base.outdent'),
        shortcut: "Shift+Tab",
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
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions){
        this.menuButton.onCreate(event, options);
        this.appendChild(this.menuButton);

        // 定义按钮点击事件，设置当前内容向左缩进
        this.addEventListener("click", ()=> {
            if(this.menuButtonOptions.enable) {
                event.editor.chain().focus().outdent().run();
            }
        })
    }

    /**
     * 定义Transaction监听方法
     * @param event 
     * @param options 
     */
    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions){
        this.menuButton.onTransaction(event, options);
    }

    onEditableChange(editable: boolean){
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}

