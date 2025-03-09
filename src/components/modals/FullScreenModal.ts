// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import './Modal.css';

export class FullScreenModal {
    modalHeader!: HTMLElement;
    modalBody!: HTMLElement;

    private overlay: HTMLElement;
    private container: HTMLElement;
    private closeBtn: HTMLButtonElement;

    messageListener?: (evt: MessageEvent) => void

    constructor(title: string) {
        // 创建遮罩层
        this.overlay = document.createElement('div');
        this.overlay.classList.add('modal-overlay');

        // 创建模态框容器
        this.container = document.createElement('div');
        this.container.classList.add('modal-container');
        this.container.classList.add('modal-container-fullscreen');

        // 头部区域
        this.modalHeader = document.createElement('div');
        this.modalHeader.classList.add('modal-header');
        this.modalHeader.innerHTML = `<h3>${title}</h3>`;

        // 关闭按钮
        this.closeBtn = document.createElement('button');
        this.closeBtn.classList.add('modal-close');
        this.closeBtn.innerHTML = '×';
        this.closeBtn.onclick = () => this.hide();

        // 内容区域
        this.modalBody = document.createElement('div');
        this.modalBody.classList.add('modal-body');

        // 组装结构
        this.modalHeader.appendChild(this.closeBtn);
        this.container.append(this.modalHeader, this.modalBody);
        this.overlay.appendChild(this.container);
    }

    setContent(content: string | HTMLElement) {
        this.modalBody.innerHTML = '';
        if (typeof content === 'string') {
            this.modalBody.innerHTML = content;
        } else {
            this.modalBody.appendChild(content);
        }
    }

    show() {
        document.body.appendChild(this.overlay);
        this.overlay.getBoundingClientRect(); // 强制重绘
        this.overlay.style.opacity = '1';
        this.container.style.transform = 'translateY(0)';

        // 点击遮罩层关闭
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) this.hide();
        };

        // ESC键关闭
        document.addEventListener('keydown', this.handleEscape);
    }

    hide() {
        this.overlay.style.opacity = '0';
        this.container.style.transform = 'translateY(-3rem)';
        setTimeout(() => {
            this.overlay.remove();
        }, 300);
        document.removeEventListener('keydown', this.handleEscape);
        if (this.messageListener) {
            window.removeEventListener('message', this.messageListener);
        }
    }

    private handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.hide();
    };

    /**
     * 添加回调监听
     * @param messageListener 
     */
    registerListener(messageListener: (evt: MessageEvent) => void) {
        this.messageListener = messageListener;
    }
}