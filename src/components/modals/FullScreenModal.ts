// Copyright (c) 2024-present AI-Labs

import { Modal } from "bootstrap";
import closeIcon from "../../assets/icons/close.svg";

import 'bootstrap/dist/css/bootstrap.css';

/**
 * 全屏的模态弹出框
 */
export class FullScreenModal extends Modal {

    modalHeader!: HTMLElement;
    modalBody!: HTMLElement;
    modalFooter!: HTMLElement;
    messageListener?: (evt: MessageEvent) => void

    constructor(title: string, options?: Partial<Modal.Options>) {
        const modal = document.createElement("div");
        // 设置模态弹出框
        modal.classList.add("modal");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-labelledby", "exampleModalCenterTitle");

        // 模态弹出框全屏样式
        const modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog");
        modalDialog.classList.add("modal-fullscreen");
        modalDialog.classList.add("modal-dialog-centered");
        modalDialog.setAttribute("role", "document");

        // 模态弹出框内容
        const modalContent = document.createElement("div");
        modalContent.classList.add("modal-content");
        modalDialog.appendChild(modalContent);

        modal.appendChild(modalDialog);
        super(modal, options);

        // 标题区
        this.modalHeader = document.createElement("div");
        this.modalHeader.classList.add("modal-header");

        // 标题
        const titleDiv = document.createElement("div");
        titleDiv.innerHTML = `<h5 class="modal-title" style="width:calc(100vw - 55px)">${title}</h5>`
        this.modalHeader.appendChild(titleDiv);

        // 关闭按钮
        const closeDiv = document.createElement("div");
        closeDiv.innerHTML = `<img src="${closeIcon}" width="24"/>`;
        closeDiv.addEventListener("click", () => {
            this.hide();
            if (this.messageListener) {
                window.removeEventListener('message', this.messageListener);
            }
        });
        this.modalHeader.appendChild(closeDiv);

        modalContent.appendChild(this.modalHeader);

        // 主体区
        this.modalBody = document.createElement("div");
        this.modalBody.classList.add("modal-body");
        modalContent.appendChild(this.modalBody);

    }

    /**
     * 添加回调监听
     * @param messageListener 
     */
    registerListener(messageListener: (evt: MessageEvent) => void) {
        this.messageListener = messageListener;
    }
}