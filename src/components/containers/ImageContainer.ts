// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import closeIcon from "../../assets/icons/close.svg";
import titleIcon from "../../assets/icons/image-bot.svg";
import sendIcon from "../../assets/icons/send-message.svg";
import { t } from "i18next";
import { UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor.ts";
import { EditorEvents } from "@tiptap/core";
import { createAvatar } from "../../utils/CreateAvatar.ts";
import { Icons } from "../Icons.ts";
import OpenAI from "openai";
import { AIChatConfig } from "../../ai/config/AIConfig.ts";
import { markdownToHtml } from "../../utils/MarkdownUtil.ts";
import { AIRequestAction, AIImageResponseAction } from "../ai/AIAction.ts";

/**
 * 定义图像处理容器
 */
export class ImageContainer extends HTMLElement implements UAIEditorEventListener {
    // 图像处理容器元素
    container!: HTMLElement;

    // 图像处理标题元素
    imageTitle!: HTMLElement;

    // 图像生成内容元素
    content!: HTMLElement;

    // 输入组件元素
    messageTextarea!: HTMLTextAreaElement;
    imageButton!: HTMLButtonElement;
    modelSelect!: HTMLSelectElement;

    client?: OpenAI;
    modelConfig?: AIChatConfig;

    event!: EditorEvents["create"];
    options!: UAIEditorOptions;

    constructor() {
        super();
        // 初始化图像处理容器
        this.container = document.createElement("div");
        this.container.classList.add("uai-pannel-container");
        this.appendChild(this.container);

        // 初始化标题
        this.imageTitle = document.createElement("div");
        this.imageTitle.classList.add("uai-pannel-title");
        this.imageTitle.innerHTML = `<img src="${titleIcon}" width="18" />&nbsp; ${t('ai.image.title')}`;
        this.container.appendChild(this.imageTitle);

        // 初始化关闭容器按钮
        const dialogClose = document.createElement("div");
        dialogClose.classList.add("uai-pannel-close");
        dialogClose.innerHTML = `<img src="${closeIcon}" width="24"/>`;
        // 点击关闭按钮关闭容器
        dialogClose.addEventListener("click", () => {
            this.style.display = "none";
        })
        this.imageTitle.appendChild(dialogClose);

        // 初始化画图模型选择容器
        const modelSelectDiv = document.createElement('div');
        modelSelectDiv.classList.add('uai-container-app-models');

        // 画图模型下拉选择
        const modelSelectText = document.createElement('div');
        modelSelectText.innerText = "模型：";
        modelSelectDiv.appendChild(modelSelectText);

        this.modelSelect = document.createElement('select');
        this.modelSelect.classList.add('uai-model-select');
        modelSelectDiv.appendChild(this.modelSelect);
        this.container.appendChild(modelSelectDiv);

        // 画图内容交互区域
        this.content = document.createElement('div');
        this.content.classList.add('uai-ai-content');
        this.container.appendChild(this.content);

        // 定义一个监听，当交互区域的内容发生变化时，滚动到最底部
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    this.content.scrollTop = this.content.scrollHeight
                }
            })
        })
        // 配置MutationObserver
        const config = { childList: true, characterData: true }

        // 开始监听div的变化
        observer.observe(this.content, config)

        // 初始化输入组件
        const divAppInput = document.createElement('div');
        divAppInput.classList.add('uai-container-app-input');

        const divMessageContainer = document.createElement('div');
        divMessageContainer.classList.add('uai-message-container');

        this.messageTextarea = document.createElement('textarea');
        this.messageTextarea.classList.add('uai-message-textarea');
        this.messageTextarea.rows = 1;
        this.messageTextarea.placeholder = '请输入内容... Shift+Enter换行；Enter发送';

        // 定义键盘事件，当按Enter键发送内容
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
            this.sendMessage(this.messageTextarea.value);
        })
        divMessageContainer.appendChild(this.imageButton);

        divAppInput.appendChild(divMessageContainer);
        this.container.appendChild(divAppInput);
    }

    /**
     * 定义创建方法
     * @param event 
     * @param options 
     */
    onCreate(event: EditorEvents["create"], options: UAIEditorOptions) {
        this.event = event;
        this.options = options;

        // 初始化画图客户端
        if (options.ai && options.ai.image?.models?.text2image) {
            // 初始化所有可选画图模型
            for (let model of Object.keys(options.ai.image?.models?.text2image)) {
                const option = document.createElement('option');
                option.textContent = model;
                this.modelSelect.appendChild(option);
            }
            // 获取当前选中的模型
            const model = this.modelSelect.selectedOptions[0].value;
            // 获取选中的模型的配置信息
            this.modelConfig = options.ai!.image!.models!.text2image![model];
            // 根据模型配置信息初始化一个客户端
            this.client = new OpenAI({
                baseURL: this.modelConfig.baseUrl,
                apiKey: this.modelConfig.apiKey,
                dangerouslyAllowBrowser: true,
            });
            // 定义模型选择的改变事件，当重新选择了对话模型，则需要重新创建一个客户端
            this.modelSelect.addEventListener("change", () => {
                // 获取当前选中的模型
                const model = this.modelSelect.selectedOptions[0].value;
                // 获取选中的模型的配置信息
                this.modelConfig = options.ai!.image!.models!.text2image![model];
                // 根据模型配置信息初始化一个客户端
                this.client = new OpenAI({
                    baseURL: this.modelConfig.baseUrl,
                    apiKey: this.modelConfig.apiKey,
                    dangerouslyAllowBrowser: true,
                });
            })
        }
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
            this.sendMessage(this.messageTextarea.value);
        }
    }

    /**
     * 定义发送消息的方法
     * @param message 
     */
    sendMessage(message: string) {
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
            this.receiveResponse(message);
        }
    }

    /**
     * 定义接收模型响应的方法
     * @param message 
     */
    receiveResponse(message: string) {
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

        // 定义模型输出的功能按钮
        const botActionDown = document.createElement(
            'uai-editor-ai-action-image-response-action'
        ) as AIImageResponseAction;
        botActionDown.classList.add('hidden-content');
        botActionDown.onCreate(this.event, this.options);
        botActionDown.bindSourceElement(botBubbleDiv, this.messageTextarea);

        // 在模型响应消息容器中，添加头像
        botResponseDiv.appendChild(botAvatarDiv);
        // 在模型响应消息容器中，添加模型响应图片内容
        botResponseDiv.appendChild(botBubbleDiv);
        // 在模型响应消息容器中，添加功能按钮
        botResponseDiv.appendChild(botActionDown);

        this.content.appendChild(botResponseDiv);

        // 发起画图请求，并接收模型响应图像
        if (this.client && this.modelConfig) {
            // 通过客户端发起请求
            this.client.images.generate({
                "model": this.modelConfig.model ?? "dall-e-3",
                "prompt": message,
                "size": "1024x1024",
            }).then(response => {
                // 接收模型响应图像，并进行图像展示
                if (response.data) {
                    botBubbleDiv.innerHTML = `<img src=${response.data[0].url ?? response.data[0].b64_json ?? response.data[0]} />`;
                } else if (response.images) {
                    botBubbleDiv.innerHTML = `<img src=${response.images[0].url ?? response.images[0].b64_json ?? response.images[0]} />`;
                }
                this.content.scrollTop = this.content.scrollHeight;
            });
        }
    }
}
