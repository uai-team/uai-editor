// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import { t } from "i18next";

import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";

import icon from "../../../../assets/icons/image.svg";

/**
 * 导出菜单：导出图片
 */
export class ExportImage extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: t('export.image.text'),
        tooltip: t('export.image.title'),
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

        // 定义按钮点击事件，导出文件
        this.addEventListener("click", async () => {
            if (this.menuButtonOptions.enable) {
                const content = document.querySelector(".uai-zoomable-content") as HTMLElement;
                const { toBlob } = domtoimage;
                const blob = await toBlob(content, {
                    style: {
                        transform: 'scale(1)', // 如果需要的话，可以通过transform来缩放元素
                        transformOrigin: 'top left', // 设置变换的原点
                    }
                });
                saveAs(blob, `export-${Date.now()}.jpg`,);
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

