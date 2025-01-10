// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";

import icon from "../../../../assets/icons/image.svg";

/**
 * 插入菜单：插入图片
 */
export class Image extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: false,
        text: t('insert.image'),
        tooltip: t('insert.image'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 文件选择
    fileInput: HTMLInputElement;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);

        // 初始化文件选择
        this.fileInput = document.createElement("input");
        this.fileInput.type = "file";
        this.fileInput.multiple = true;
        this.fileInput.accept = "image/*";
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        this.appendChild(this.menuButton);

        // this.fileInput.addEventListener("change", () => {
        //     const files = this.fileInput.files;
        //     if (files && files.length > 0) {
        //         for (let file of files) {
        //             event.editor.commands.uploadImage(file);
        //         }
        //     }
        //     (this.fileInput as any).value = "";
        // });

        // 定义按钮点击事件，插入图片
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                event.editor.chain().focus().selectFiles('image', true).run()
                // this.fileInput.click();
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
        if (this.menuButton.menuButton) {
            var disable = event.editor.isEditable;
            this.onEditableChange(disable);
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}

