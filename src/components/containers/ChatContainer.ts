// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import { EditorEvents } from "@tiptap/core";
import OpenAI from "openai";
import { t } from "i18next";

import { UAIEditorEventListener, UAIEditorOptions } from "../../core/UAIEditor.ts";
import { createAvatar } from "../../utils/CreateAvatar.ts";
import { Icons } from "../Icons.ts";
import { AIChatConfig } from "../../ai/config/AIConfig.ts";
import { markdownToHtml } from "../../utils/MarkdownUtil.ts";
import { AIRequestAction, AIChatResponseAction } from "../ai/AIAction.ts";

import closeIcon from "../../assets/icons/close.svg";
import titleIcon from "../../assets/icons/chat-bot.svg";
import sendIcon from "../../assets/icons/send-message.svg";

/**
 * 定义聊天对话界面的容器
 */
export class ChatContainer extends HTMLElement implements UAIEditorEventListener {
    // 容器元素
    container!: HTMLElement;

    // 标题元素
    chatTitle!: HTMLElement;

    // 内容元素
    content!: HTMLElement;

    // 文本输入框
    messageTextarea!: HTMLTextAreaElement;
    imageButton!: HTMLButtonElement;
    modelSelect!: HTMLSelectElement;

    client?: OpenAI;
    modelConfig?: AIChatConfig;

    event!: EditorEvents["create"];
    options!: UAIEditorOptions;

    constructor() {
        super();
        // 初始化容器
        this.container = document.createElement("div");
        this.container.classList.add("uai-pannel-container");
        this.appendChild(this.container);

        // 初始化标题
        this.chatTitle = document.createElement("div");
        this.chatTitle.classList.add("uai-pannel-title");
        this.chatTitle.innerHTML = `<img src="${titleIcon}" width="18" />&nbsp; ${t('ai.chat.title')}`
        this.container.appendChild(this.chatTitle);

        // 初始化关闭按钮
        const dialogClose = document.createElement("div");
        dialogClose.classList.add("uai-pannel-close");
        dialogClose.innerHTML = `<img src="${closeIcon}" width="24"/>`;
        // 点击关闭按钮时关闭容器
        dialogClose.addEventListener("click", () => {
            this.style.display = "none";
        })
        this.chatTitle.appendChild(dialogClose);

        // 初始化对话模型选择
        const modelSelectDiv = document.createElement('div');
        modelSelectDiv.classList.add('uai-container-app-models');

        const modelSelectText = document.createElement('div');
        modelSelectText.innerText = "模型：";
        modelSelectDiv.appendChild(modelSelectText);

        this.modelSelect = document.createElement('select');
        this.modelSelect.classList.add('uai-model-select');
        modelSelectDiv.appendChild(this.modelSelect);
        this.container.appendChild(modelSelectDiv);

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
            this.sendMessage(this.messageTextarea.value)
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

        // 初始化模型对话客户端
        if (options.ai && options.ai.chat?.models) {
            // 初始化所有可选对话模型
            for (let model of Object.keys(options.ai.chat?.models)) {
                const option = document.createElement('option');
                option.textContent = model;
                this.modelSelect.appendChild(option);
            }
            // 获取当前选中的模型
            const model = this.modelSelect.selectedOptions[0].value;
            // 获取选中的模型的配置信息
            this.modelConfig = options.ai!.chat!.models![model];
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
                this.modelConfig = options.ai!.chat!.models![model];
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
            'uai-editor-ai-action-chat-response-action'
        ) as AIChatResponseAction;
        botActionDown.classList.add('hidden-content');
        botActionDown.onCreate(this.event, this.options);
        botActionDown.bindSourceElement(botBubbleDiv, this.messageTextarea);

        // 在模型响应消息容器中，添加头像
        botResponseDiv.appendChild(botAvatarDiv);
        // 在模型响应消息容器中，添加模型响应消息内容
        botResponseDiv.appendChild(botBubbleDiv);
        // 在模型响应消息容器中，添加功能按钮
        botResponseDiv.appendChild(botActionDown);

        this.content.appendChild(botResponseDiv);

        // 发起对话请求，并接收模型响应内容
        if (this.client && this.modelConfig) {
            const textQueue: string[] = [];
            const stream = this.modelConfig.modelType === "LMDeploy" ? false : true;
            // 通过客户端发起请求
            this.client.chat.completions.create({
                model: this.modelConfig.model ?? "o1",
                stream: stream,
                max_tokens: this.modelConfig.max_tokens,
                temperature: this.modelConfig.temperature,
                top_p: this.modelConfig.top_p,
                frequency_penalty: this.modelConfig.frequency_penalty,
                messages: [
                    {
                        "role": "user",
                        "content": message
                    }
                ],
            }).then(async response => {
                // 接收模型响应数据
                if (stream) {
                    // 流式响应
                    for await (var chunk of response) {
                        textQueue.push(chunk.choices[0]?.delta?.content || '');
                        botBubbleDiv.innerHTML = markdownToHtml(textQueue.join(''));
                        this.content.scrollTop = this.content.scrollHeight;
                    }
                } else {
                    // 非流式响应
                    textQueue.push(response.choices[0]?.message?.content || '');
                    botBubbleDiv.innerHTML = markdownToHtml(textQueue.join(''));
                    this.content.scrollTop = this.content.scrollHeight;
                }
                botBubbleDiv.setAttribute("InnerContent", textQueue.join(''));
            });
        }
    }
}
