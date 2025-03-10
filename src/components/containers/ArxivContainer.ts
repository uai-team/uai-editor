// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor.ts";
import { createAvatar } from "../../utils/CreateAvatar.ts";
import { Icons } from "../Icons.ts";
import { markdownToHtml } from "../../utils/MarkdownUtil.ts";
import { AIRequestAction } from "../ai/AIAction.ts";

import closeIcon from "../../assets/icons/close.svg";
import titleIcon from "../../assets/icons/arxiv.svg";
import sendIcon from "../../assets/icons/send-message.svg";
import { FullScreenModal } from "../modals/FullScreenModal.ts";

export class ArxivContainer extends HTMLElement implements UAIEditorEventListener {
    // 容器元素
    container!: HTMLElement;

    // 标题元素
    arxivTitle!: HTMLElement;

    // 内容元素
    content!: HTMLElement;

    // 文本输入框
    messageTextarea!: HTMLTextAreaElement;
    imageButton!: HTMLButtonElement;
    categorySelect!: HTMLSelectElement;
    subCategorySelect!: HTMLSelectElement;
    querySelect!: HTMLSelectElement;

    event!: EditorEvents["create"];
    options!: UAIEditorOptions;

    currentPage = 1;
    pageSize = 10;

    categories = [
        {
            value: 'all', label: 'All Categories', children: [
                { value: 'all', label: 'All Categories' }
            ]
        },
        {
            value: 'cs', label: 'Computer Science', children: [
                { value: 'cs', label: 'All Computer Science' },
                { value: 'cs.AI', label: 'Artificial Intelligence' },
                { value: 'cs.AR', label: 'Hardware Architecture' },
                { value: 'cs.CC', label: 'Computational Complexity' },
            ]
        },
        {
            value: 'econ', label: 'Economics', children: [
                { value: 'econ', label: 'All Economics' },
                { value: 'econ.EM', label: 'Econometrics' },
                { value: 'econ.GN', label: 'General Economics' },
                { value: 'econ.TH', label: 'Theoretical Economics' },
            ]
        },
        {
            value: 'eess', label: 'Electrical Engineering and Systems Science', children: [
                { value: 'eess', label: 'Electrical Engineering and Systems Science' }
            ]
        },
        {
            value: 'math', label: 'Mathematics', children: [
                { value: 'math', label: 'Mathematics' }
            ]
        },
        {
            value: 'physics', label: 'Physics', children: [
                { value: 'physics', label: 'Physics' }
            ]
        },
        {
            value: 'q-bio', label: 'Quantitative Biology', children: [
                { value: 'q-bio', label: 'Quantitative Biology' }
            ]
        },
        {
            value: 'q-fin', label: 'Quantitative Finance', children: [
                { value: 'q-fin', label: 'Quantitative Finance' }
            ]
        },
        {
            value: 'stat', label: 'Statistics', children: [
                { value: 'stat', label: 'Statistics' }
            ]
        },
    ];
    queries = [
        { value: 'all', label: 'All Papers' },
        { value: 'ti', label: 'Titles' },
        { value: 'au', label: 'Authors' },
        { value: 'abs', label: 'Abstracts' },
        { value: 'co', label: 'Comments' },
    ]
    constructor() {
        super();

        // 初始化容器
        this.container = document.createElement("div");
        this.container.classList.add("uai-pannel-container");
        this.appendChild(this.container);

        // 初始化标题
        this.arxivTitle = document.createElement("div");
        this.arxivTitle.classList.add("uai-pannel-title");
        this.arxivTitle.innerHTML = `<img src="${titleIcon}" height="24" width="24"/>&nbsp; ${t('tools.arxiv.title')}`
        this.container.appendChild(this.arxivTitle);
        // 初始化关闭按钮
        const dialogClose = document.createElement("div");
        dialogClose.classList.add("uai-pannel-close");
        dialogClose.innerHTML = `<img src="${closeIcon}" width="24"/>`;
        // 点击关闭按钮时关闭容器
        dialogClose.addEventListener("click", () => {
            this.style.display = "none";
        })
        this.arxivTitle.appendChild(dialogClose);

        const categorySelectDiv = document.createElement('div');
        categorySelectDiv.classList.add('uai-container-app-models');

        const categorySelectText = document.createElement('div');
        categorySelectText.innerText = "类别：";
        categorySelectDiv.appendChild(categorySelectText);

        this.categorySelect = document.createElement('select');
        this.categorySelect.classList.add('uai-model-select');
        categorySelectDiv.appendChild(this.categorySelect);
        this.container.appendChild(categorySelectDiv);

        const subCategorySelectDiv = document.createElement('div');
        subCategorySelectDiv.classList.add('uai-container-app-models');

        const subCategorySelectText = document.createElement('div');
        subCategorySelectText.innerText = "子类：";
        subCategorySelectDiv.appendChild(subCategorySelectText);

        this.subCategorySelect = document.createElement('select');
        this.subCategorySelect.classList.add('uai-model-select');
        subCategorySelectDiv.appendChild(this.subCategorySelect);
        this.container.appendChild(subCategorySelectDiv);

        const querySelectDiv = document.createElement('div');
        querySelectDiv.classList.add('uai-container-app-models');

        const querySelectText = document.createElement('div');
        querySelectText.innerText = "查询：";
        querySelectDiv.appendChild(querySelectText);

        this.querySelect = document.createElement('select');
        this.querySelect.classList.add('uai-model-select');
        querySelectDiv.appendChild(this.querySelect);
        this.container.appendChild(querySelectDiv);

        // 初始化对话内容容器
        this.content = document.createElement('div');
        this.content.classList.add('uai-ai-content');
        this.container.appendChild(this.content);

        // 定义一个监听，当聊天内容有变动时，聊天内容容器滚动到最底部
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    this.content.scrollTop = this.content.scrollHeight;
                }
            })
        })
        // 配置MutationObserver
        const config = { childList: true, characterData: true };

        // 开始监听div的变化
        observer.observe(this.content, config);

        // 定义对话输入框组件
        const divAppInput = document.createElement('div');
        divAppInput.classList.add('uai-container-app-input');

        const divMessageContainer = document.createElement('div');
        divMessageContainer.classList.add('uai-message-container');

        this.messageTextarea = document.createElement('textarea');
        this.messageTextarea.classList.add('uai-message-textarea');
        this.messageTextarea.rows = 1;
        this.messageTextarea.placeholder = '请输入内容... Shift+Enter换行；Enter发送';

        // 定义键盘事件，Enter发送数据
        this.messageTextarea.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        })
        // 定义输入事件，输入框自动根据输入内容调整大小
        this.messageTextarea.addEventListener('input', () => {
            this.messageTextarea.style.height = 'auto';
            this.messageTextarea.style.height = this.messageTextarea.scrollHeight + 'px';
        })
        divMessageContainer.appendChild(this.messageTextarea);

        // 初始化发送按钮
        this.imageButton = document.createElement('button');
        this.imageButton.classList.add('uai-image-button');
        this.imageButton.innerHTML = `<img src="${sendIcon}" height="24" />`;
        this.imageButton.addEventListener('click', () => {
            this.handleSearch(this.messageTextarea.value)
        })
        divMessageContainer.appendChild(this.imageButton);

        divAppInput.appendChild(divMessageContainer);
        this.container.appendChild(divAppInput);
    }

    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.event = event;
        this.options = options;

        this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.value;
            option.textContent = cat.label;
            this.categorySelect.appendChild(option);
        });

        this.categorySelect.addEventListener('change', () => {
            const subCategories = this.categories.filter(cat => cat.value === this.categorySelect.value).flatMap(cat => cat.children);
            this.subCategorySelect.innerHTML = '';
            subCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.value;
                option.textContent = cat.label;
                this.subCategorySelect.appendChild(option);
            });
        });

        // 触发 categorySelect 的 change 事件，以初始化子类选项
        this.categorySelect.dispatchEvent(new Event('change'));

        this.queries.forEach(query => {
            const option = document.createElement('option');
            option.value = query.value;
            option.textContent = query.label;
            this.querySelect.appendChild(option);
        });
    }

    onTransaction(event: EditorEvents["transaction"], options: UAIEditorOptions) {

    }

    onEditableChange(editable: boolean) {

    }

    handleKeyDown(event: KeyboardEvent) {
        // 检查是否按下了 Shift 和 Enter 键
        if (event.shiftKey && event.key === 'Enter') {
            // 如果是 Shift + Enter，允许默认行为（通常是换行）
            return;
        }
        // 检查是否按下了 Enter 键
        if (event.key === 'Enter') {
            // 阻止默认的换行行为
            event.preventDefault();
            // 处理发送消息的逻辑
            this.handleSearch(this.messageTextarea.value);
        }
    }

    handleSearch(message: string) {
        try {
            if (message.trim() !== '') {
                // 创建用户消息容器
                const userMessageDiv = document.createElement('div');
                userMessageDiv.classList.add('message');
                userMessageDiv.classList.add('message-sent');

                // 创建用户发送消息容器
                const userBubbleDiv = document.createElement('div');
                userBubbleDiv.classList.add('markdown-body');
                userBubbleDiv.classList.add('bubble');
                userBubbleDiv.classList.add('bubble-sent');
                userBubbleDiv.innerHTML = markdownToHtml(message);
                userBubbleDiv.setAttribute("InnerContent", message);

                // 创建用户输入的功能按钮
                const userActionDown = document.createElement(
                    'uai-editor-ai-action-request-action'
                ) as AIRequestAction;
                userActionDown.classList.add('hidden-content');
                userActionDown.onCreate(this.event, this.options);
                userActionDown.bindSourceElement(userBubbleDiv, this.messageTextarea);

                // 创建用户头像容器
                const userAvatarDiv = createAvatar(Icons.UserAvatar);
                userAvatarDiv.classList.add('user-avatar');

                // 用户消息容器中，添加功能按钮
                userMessageDiv.appendChild(userActionDown);
                // 用户消息容器中，添加用户发送内容
                userMessageDiv.appendChild(userBubbleDiv);
                // 用户消息容器中，添加用户头像
                userMessageDiv.appendChild(userAvatarDiv);

                // 展示用户发送的消息
                this.content.appendChild(userMessageDiv);

                // 清空消息输入框
                this.messageTextarea.value = '';
                this.messageTextarea.style.height = 'auto';
                this.messageTextarea.style.height = this.messageTextarea.scrollHeight + 'px';
                this.messageTextarea.focus();

                // 发送消息并等待响应
                this.fetchArxivData(message);
            }
        } catch (error) {
            console.error('arXiv API error:', error);
        }
    }

    fetchArxivData(message: string) {
        // 创建模型响应消息容器
        const botResponseDiv = document.createElement('div');
        botResponseDiv.classList.add('message');
        botResponseDiv.classList.add('message-received');

        // 定义模型头像容器
        const botAvatarDiv = createAvatar(Icons.BotAvatar);
        botAvatarDiv.classList.add('bot-avatar');

        // 定义模型输出内容容器
        const botBubbleDiv = document.createElement('div');
        botBubbleDiv.classList.add('markdown-body');
        botBubbleDiv.classList.add('bubble');
        botBubbleDiv.classList.add('bubble-received');
        botBubbleDiv.innerHTML = Icons.Loading;

        // 在模型响应消息容器中，添加头像
        botResponseDiv.appendChild(botAvatarDiv);
        // 在模型响应消息容器中，添加模型响应消息内容
        botResponseDiv.appendChild(botBubbleDiv);

        this.content.appendChild(botResponseDiv);

        const searchQuery = this.subCategorySelect.value === "all" ? `${this.querySelect.value}:${message}` : `cat:${this.subCategorySelect.value} AND ${this.querySelect.value}:${message}`;
        const start = (this.currentPage - 1) * this.pageSize;
        fetch(
            `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(searchQuery)}&start=${start}&max_results=${this.pageSize}&sortBy=submittedDate&sortOrder=descending`
        )
            .then(response => response.text())
            .then(xmlData => {
                const arxivs = this.parseXmlResponse(xmlData);
                botBubbleDiv.innerHTML = "";
                arxivs.items.forEach(arxiv => {
                    const arxivItem = document.createElement('div');
                    const title = document.createElement('h3');
                    title.textContent = arxiv.title;
                    arxivItem.appendChild(title);
                    const authors = document.createElement('p');
                    authors.textContent = `作者：${arxiv.authors}`;
                    arxivItem.appendChild(authors);
                    const published = document.createElement('p');
                    published.textContent = `日期：${arxiv.published}`;
                    arxivItem.appendChild(published);
                    const summary = document.createElement('p');
                    summary.textContent = `摘要：${arxiv.summary}`;
                    arxivItem.appendChild(summary);
                    const link = document.createElement('a');
                    link.style.margin = '5px';
                    link.textContent = '查看原文';
                    link.addEventListener('click', () => {
                        window.open(arxiv.link, '_blank');
                    });
                    arxivItem.appendChild(link);
                    const pdf = document.createElement('a');
                    pdf.style.margin = '5px';
                    pdf.textContent = '查看论文';
                    pdf.addEventListener('click', () => {
                        const modal = new FullScreenModal(arxiv.title);
                        const body = document.createElement('div');
                        body.classList.add("uai-file-preview-modal-body");
                        const iframe = document.createElement('iframe');
                        iframe.src = arxiv.pdf;
                        body.appendChild(iframe);
                        modal.modalBody.appendChild(body);
                        modal.show();
                    });
                    arxivItem.appendChild(pdf);
                    const ref = document.createElement('a');
                    ref.style.margin = '5px';
                    ref.textContent = '添加引用';
                    ref.addEventListener('click', () => {
                        const {
                            state: { selection }
                        } = this.event.editor;

                        this.event.editor.commands.insertContentAt(selection.from, {
                            type: 'file',
                            attrs: {
                                ['url']: arxiv.pdf,
                                name: `${arxiv.title}.pdf`,
                                size: 0,
                                type: "application/pdf",
                                previewType: "application/pdf",
                            },
                        });
                    });
                    arxivItem.appendChild(ref);
                    botBubbleDiv.appendChild(arxivItem);
                    botBubbleDiv.appendChild(document.createElement('hr'));
                });
            })
            .catch(error => {
                console.error('arXiv API error:', error);
            });
    }

    parseXmlResponse(xml: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');

        const entries = Array.from(doc.querySelectorAll('entry'));
        return {
            total: parseInt(doc.querySelector('opensearch>totalResults')?.textContent || '0'),
            items: entries.map(entry => ({
                title: entry.querySelector('title')?.textContent?.trim() || '',
                authors: Array.from(entry.querySelectorAll('author')).map(a =>
                    a.querySelector('name')?.textContent?.trim() || ''
                ).join(', '),
                published: new Date(
                    entry.querySelector('published')?.textContent || ''
                ).toLocaleDateString(),
                summary: entry.querySelector('summary')?.textContent?.trim() || '',
                link: entry.querySelector('link[type="text/html"]')?.getAttribute('href') || '',
                pdf: entry.querySelector('link[type="application/pdf"]')?.getAttribute('href') || '',
            }))
        };
    }
}
