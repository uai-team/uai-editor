// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../../core/UAIEditor.ts";
import { MenuButton, MenuButtonOptions } from "../../MenuButton.ts";
import { FullScreenModal } from "../../../modals/FullScreenModal.ts";
import DiagramEditor from "../../../../utils/DiagramEditor.ts";
import { uuid } from "../../../../utils/UUID.ts";

import icon from "../../../../assets/icons/diagrams.svg";

/**
 * 工具菜单：插入流程图
 */
export class Diagrams extends HTMLElement implements UAIEditorEventListener {
    // 按钮选项
    menuButtonOptions: MenuButtonOptions = {
        menuType: "button",
        enable: true,
        icon: icon,
        hideText: false,
        text: t('tools.diagrams.text'),
        tooltip: t('tools.diagrams.text'),
    }

    // 功能按钮
    menuButton: MenuButton;
    // 模态框
    modal: FullScreenModal;

    constructor(options: MenuButtonOptions) {
        super();

        // 初始化功能按钮选项
        this.menuButtonOptions = { ...this.menuButtonOptions, ...options };

        // 创建功能按钮
        this.menuButton = new MenuButton(this.menuButtonOptions);

        // 创建模态框
        this.modal = new FullScreenModal(this.menuButtonOptions.text!);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.menuButton.onCreate(event, options);
        this.appendChild(this.menuButton);
        // 创建模态框容器
        const container = document.createElement("div");
        container.classList.add("uai-diagrams-container");
        container.classList.add("uai-diagrams-container-insert");
        this.modal.modalBody.appendChild(container);
        const editor = event.editor;

        // 添加鼠标点击事件，弹出模态框
        this.addEventListener("click", () => {
            if (this.menuButtonOptions.enable) {
                container.innerHTML = "";
                const diagramEditor = new DiagramEditor({
                    container: `.uai-diagrams-container-insert`,
                })
                this.modal.show();
                diagramEditor.edit('');

                // 添加回调消息监听
                const messageListener = (evt: MessageEvent) => {
                    if (
                        evt?.type !== 'message' ||
                        typeof evt?.data !== 'string'
                    ) {
                        return
                    }

                    // 获取回调消息内容
                    const { event, bounds, data } = JSON.parse(evt.data);
                    if (event === 'export') {
                        const { width, height } = bounds
                        const name = `diagrams-${uuid()}.svg`
                        // 将回调消息转换成图片
                        const { size } = new Blob([data], {
                            type: 'image/svg+xml',
                        })
                        const image = {
                            type: 'diagrams',
                            name,
                            size,
                            src: data,
                            width: `${width}`,
                            height,
                            content: data,
                        }
                        this.modal.hide();

                        // 在编辑器中插入图片
                        diagramEditor.stopEditing();
                        if (image?.type) {
                            editor.chain().focus().setImage(image, false).run()
                        }
                        window.removeEventListener('message', messageListener);
                    }
                    if (event === 'exit') {
                        // 如果回调消息是关闭，则关闭模态框
                        this.modal.hide();
                        window.removeEventListener('message', messageListener);
                    }
                }

                // 移除、添加监听
                window.removeEventListener('message', messageListener);
                window.addEventListener('message', messageListener);
                this.modal.registerListener(messageListener);
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

