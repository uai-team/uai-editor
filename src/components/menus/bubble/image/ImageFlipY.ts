// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import { getSelectionNode } from "../../../../extensions/Selection.ts";

import icon from "../../../../assets/icons/image-flip.svg";

/**
 * 定义水平翻转功能
 */
export class ImageFlipY extends HTMLElement implements UAIEditorEventListener {
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: true,
        text: '水平翻转',
        tooltip: '水平翻转',
    }

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

        // 给按钮添加点击事件
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                const image = getSelectionNode(event.editor);
                const { flipY } = image?.attrs ?? {};
                if (image) {
                    // 如果文档内容是图片，则对图片进水平翻转
                    event.editor.commands.updateAttributes(image.type, {
                        flipY: !flipY,
                    })
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
        if (this.menuButton.menuButton) {
            if (this.menuButtonOptions.enable) {
                // 判断图片是否有水平翻转
                var active = event.editor.getAttributes('image')?.flipY;
                if (active) {
                    // 如果有水平翻转，则功能按钮是激活状态
                    this.menuButton.menuButton.classList.add("active");
                } else {
                    // 如果没有水平翻转，则功能按钮是非激活状态
                    this.menuButton.menuButton.classList.remove("active");
                }
            }
        }
    }

    onEditableChange(editable: boolean) {
        this.menuButtonOptions.enable = editable;
        this.menuButton.onEditableChange(editable);
    }
}

