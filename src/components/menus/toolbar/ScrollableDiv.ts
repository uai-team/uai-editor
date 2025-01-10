// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";

import { UAIEditorEventListener, UAIEditorOptions } from "../../../core/UAIEditor.ts";

/**
 * 可滚动容器
 */
export class ScrollableDiv extends HTMLElement implements UAIEditorEventListener {
    private container: HTMLElement;
    scrollLeftBtn: HTMLElement;
    content: HTMLElement;
    scrollRightBtn: HTMLElement;
    private scrollAmount: number = 50; // 每次滚动的像素数
    private transform: number = 0; // 当前transform值

    constructor(content: HTMLElement) {
        super();
        this.content = content;

        this.scrollLeftBtn = document.createElement("div");
        this.scrollLeftBtn.classList.add("uai-scrollable-control-button");
        this.scrollLeftBtn.innerHTML = "<strong><</strong>";
        this.scrollLeftBtn.style.display = "none";
        this.container = document.createElement("div");
        this.container.appendChild(this.content);
        // this.container.style.overflow = "hidden";
        // this.container.style.position = "relative";
        this.scrollRightBtn = document.createElement("div");
        this.scrollRightBtn.classList.add("uai-scrollable-control-button");
        this.scrollRightBtn.innerHTML = "<strong>></strong>";
        this.scrollRightBtn.style.display = "none";

        this.scrollLeftBtn.addEventListener('click', () => {
            if (this.transform < 0) {
                this.transform += Math.min(this.scrollAmount, 0 - this.transform);
            }
            this.content.style.transform = `translateX(${this.transform}px)`;
            this.scrollButtonControl();
        });
        this.scrollRightBtn.addEventListener('click', () => {
            const scrollWidth = this.content.scrollWidth + this.transform - this.scrollRightBtn.clientWidth - this.container.clientWidth;
            if (scrollWidth > 0) {
                this.transform -= Math.min(this.scrollAmount, scrollWidth);
            }
            this.content.style.transform = `translateX(${this.transform}px)`;
            this.scrollButtonControl();
        });

        this.classList.add("uai-classic-scrollable-menu")
        this.appendChild(this.scrollLeftBtn)
        this.appendChild(this.container)
        this.appendChild(this.scrollRightBtn)
    }

    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === this.parentElement) {
                    this.scrollButtonControl();
                }
            }
        });

        resizeObserver.observe(this.parentElement!);
    }

    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {
    }

    onEditableChange(editable: boolean) {

    }

    scrollButtonControl() {
        if (this.transform < 0) {
            this.scrollLeftBtn.style.display = "flex";
        } else {
            this.scrollLeftBtn.style.display = "none";
        }
        if (this.parentElement!.scrollWidth + this.transform - this.scrollRightBtn.clientWidth < this.container.clientWidth) {
            this.scrollRightBtn.style.display = "flex";
        } else {
            this.scrollRightBtn.style.display = "none";
        }
        // 触发宽度变化事件
    }
}
