// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/redo.svg";

/**
 * 基础菜单：重做
 */
export class Redo extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('base.redo'),
        tooltip: t('base.redo'),
        shortcut: "Ctrl+Y / Ctrl+Shift+Z",
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
        
        // 定义按钮点击事件，重做
        this.addEventListener("click", ()=> {
            if(this.menuButtonOptions.enable) {
                event.editor.chain().redo().run();
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
        if (this.menuButton.menuButton) {
            // 根据当前是否有可重做操作决定按钮是否可用
            var disable = event.editor.can().chain().redo().run();
            this.onEditableChange(disable);
        }
    }

    onEditableChange(editable: boolean){
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}

