// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import './Modal.css';

export class CenterModal {
    modalHeader!: HTMLElement;
    modalBody!: HTMLElement;
    modalFooter!: HTMLElement;
    commit: HTMLButtonElement;

    private overlay: HTMLElement;
    private container: HTMLElement;
    private closeBtn: HTMLButtonElement;

    constructor(title: string) {
        // 创建遮罩层
        this.overlay = document.createElement('div');
        this.overlay.classList.add('modal-overlay');
        
        // 创建模态框容器
        this.container = document.createElement('div');
        this.container.classList.add('modal-container');
        this.container.classList.add('modal-container-center');

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

        // 底部区域
        this.modalFooter = document.createElement('div');
        this.modalFooter.classList.add('modal-footer');

        // 添加commit按钮
        this.commit = document.createElement('button');
        this.commit.classList.add('modal-button');
        this.commit.classList.add('modal-button-primary');
        this.commit.textContent = '确定';
        this.modalFooter.appendChild(this.commit);

        // 添加cancel按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.classList.add('modal-button');
        cancelBtn.classList.add('modal-button-secondary');
        cancelBtn.textContent = '关闭';
        cancelBtn.onclick = () => {
            this.hide();
        };
        this.modalFooter.appendChild(cancelBtn);

        // 组装结构
        this.modalHeader.appendChild(this.closeBtn);
        this.container.append(this.modalHeader, this.modalBody, this.modalFooter);
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

    addButton(text: string, onClick: () => void) {
        const btn = document.createElement('button');
        btn.className = 'modal-button';
        btn.textContent = text;
        btn.onclick = () => {
            onClick();
            this.hide();
        };
        this.modalFooter.appendChild(btn);
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
    }

    private handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') this.hide();
    };
}