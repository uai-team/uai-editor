// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { Modal } from "bootstrap";

import 'bootstrap/dist/css/bootstrap.css';

/**
 * 居中的模态弹出框
 */
export class CenterModal extends Modal {

    modalHeader!: HTMLElement;
    modalBody!: HTMLElement;
    modalFooter!: HTMLElement;
    commit: HTMLButtonElement;

    constructor(title: string, options?: Partial<Modal.Options>) {
        const modal = document.createElement("div");
        // 设置模态弹出框
        modal.classList.add("modal");
        modal.setAttribute("role", "dialog");
        modal.setAttribute("tabindex", "-1");
        modal.setAttribute("aria-hidden", "true");
        modal.setAttribute("aria-labelledby", "exampleModalCenterTitle");

        // 模态弹出框居中样式
        const modalDialog = document.createElement("div");
        modalDialog.classList.add("modal-dialog");
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
        this.modalHeader.innerHTML = `<h5 class="modal-title">${title}</h5>`
        modalContent.appendChild(this.modalHeader);

        // 主体区
        this.modalBody = document.createElement("div");
        this.modalBody.classList.add("modal-body");
        modalContent.appendChild(this.modalBody);

        // 底部按钮区
        this.modalFooter = document.createElement("div");
        this.modalFooter.classList.add("modal-footer");
        modalContent.appendChild(this.modalFooter);

        // 关闭按钮
        const close = document.createElement("button");
        close.classList.add("btn");
        close.classList.add("btn-secondary");
        close.setAttribute("data-dismiss", "modal");
        close.innerHTML = "关闭";
        close.addEventListener("click", () => {
            this.hide();
        });
        this.modalFooter.appendChild(close);

        // 确定按钮
        this.commit = document.createElement("button")
        this.commit.classList.add("btn");
        this.commit.classList.add("btn-primary");
        this.commit.innerHTML = "确定";
        this.modalFooter.appendChild(this.commit);
    }
}