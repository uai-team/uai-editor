// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
import {
    Editor as TipTap,
    EditorEvents,
    EditorOptions,
} from "@tiptap/core";
import { DOMParser } from "@tiptap/pm/model";
import { TableOfContentData } from "@tiptap-pro/extension-table-of-contents";

import * as monaco from 'monaco-editor';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker.js?worker';
import i18next from "i18next";
import { Resource } from "i18next";

import "../components"
import { Header } from "../components/Header.ts";
import { ChatContainer } from "../components/containers/ChatContainer.ts";
import { ImageContainer } from "../components/containers/ImageContainer.ts";
import { TocContainer } from "../components/containers/TocContainer.ts";
import { Editor } from "../components/Editor.ts";
import { Footer } from "../components/Footer.ts";

import "../styles";

import { zh } from "../i18n/zh.ts";
import { allExtensions } from "./UAIExtensions.ts";
import { AICommand } from "../ai/config/AIConfig.ts";
import { AIChatConfig, Text2ImageConfig } from "../ai/config/AIConfig.ts";
import { markdownToHtml } from "../utils/MarkdownUtil.ts";
import { Uploader } from "../utils/FileUploader.ts";
import { Icons } from "../components/Icons.ts";

self.MonacoEnvironment = {
    getWorker(_workerId, _label) {
        return new HtmlWorker();
    },
}

/**
 * 定义全局键盘事件监听
 */
document.addEventListener('keydown', function (event) {
    // 阻止 Ctrl + P 快捷键（打印）
    if (event.ctrlKey && event.key === 'p') {
        event.preventDefault();
    }
    // 阻止 Ctrl + S 快捷键（保存）
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
    }
    // 阻止 Ctrl + Shift + I 快捷键（开发者工具）
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
    }
});

/**
 * 定义全局编辑器监听接口
 */
export interface UAIEditorEventListener {
    onCreate: (event: EditorEvents['create'], options: UAIEditorOptions) => void;
    onTransaction: (event: EditorEvents['transaction'], options: UAIEditorOptions) => void;
    onEditableChange: (editable: boolean) => void;
}

/**
 * 定义数据字典类型
 */
export type UAIEditorDict = {
    label: string,
    value: string | number,
    order?: number
}

/**
 * 定义编辑器选项配置类型
 */
export type UAIEditorOptions = {
    element: string | Element
    content?: string,
    onCreated?: (editor: UAIEditor) => void,
    dicts?: {
        fontFamilies?: UAIEditorDict[],
        fontSizes?: UAIEditorDict[],
        lineHeights?: UAIEditorDict[],
        symbols?: UAIEditorDict[],
        emojis?: UAIEditorDict[],
    },
    header?: "ribbon" | "classic",
    theme?: "light" | "dark",
    lang?: string,
    i18n?: Record<string, Record<string, string>>,
    image?: {
        uploadUrl?: string,
        uploadHeaders?: (() => Record<string, any>) | Record<string, any>,
        uploadFormName?: string,
        uploader?: Uploader,
    },
    video?: {
        uploadUrl?: string,
        uploadHeaders?: (() => Record<string, any>) | Record<string, any>,
        uploadFormName?: string,
        uploader?: Uploader,
    },
    audio?: {
        uploadUrl?: string,
        uploadHeaders?: (() => Record<string, any>) | Record<string, any>,
        uploadFormName?: string,
        uploader?: Uploader,
    },
    ai?: {
        chat?: {
            models?: Record<string, AIChatConfig>,
            commands?: AICommand[],
        },
        image?: {
            models?: {
                text2image?: Record<string, Text2ImageConfig>,
            },
            commands?: AICommand[]
        }
    }
}

/**
 * 定义默认的对话快捷命令
 */
const defaultChatCommands = [
    {
        icon: Icons.AiAsk,
        name: "AI 问答",
        model: "default",
    },
    {
        icon: Icons.AiContinue,
        name: "AI 续写",
        prompt: "请帮我继续扩展一下这段话的内容。",
        model: "default",
    },
    {
        icon: Icons.AiRewrite,
        name: "AI 重写",
        prompt: "请帮我重写写一下这段话的内容。",
        model: "default",
    },
    {
        icon: Icons.AiReview,
        name: "AI 校阅",
        prompt: "请帮我改正这段话中的错别字和语法错误。",
        model: "default",
    },
    {
        icon: Icons.AiTranslate,
        name: "AI 翻译",
        prompt: "请帮我做这段话的中英文互译。注意，你只需要返回翻译的结果，不需要对此进行任何解释，不需要除了翻译结果以外的其他任何内容。",
        model: "default",
    },
]

/**
 * 定义默认的文生图命令
 */
const defaultImageCommands = [
    {
        icon: Icons.AiImage,
        name: "AI 生图",
        model: "default",
    },
]

/**
 * 定义内部编辑器类
 */
export class InnerEditor extends TipTap {

    uaiEditor: UAIEditor;

    constructor(uaiEditor: UAIEditor, options: Partial<EditorOptions> = {}) {
        super(options);
        this.uaiEditor = uaiEditor;
    }

    parseHtml(html: string) {
        function bodyElement(value: string): HTMLElement {
            return new window.DOMParser().parseFromString(`<body>${value}</body>`, 'text/html').body;
        }

        const parser = DOMParser.fromSchema(this.schema);
        return parser.parse(bodyElement(html), {}).content;
    }
}

/**
 * 定义编辑器主类
 */
export class UAIEditor {
    options: UAIEditorOptions;
    innerEditor!: InnerEditor;
    container!: HTMLElement;
    center!: HTMLElement;

    eventComponents: UAIEditorEventListener[] = [];
    toggleContainers: HTMLElement[] = [];

    header!: Header;
    chatContainer!: ChatContainer;
    imageContainer!: ImageContainer;
    tocContainer!: TocContainer;
    editor!: Editor;
    footer!: Footer;
    source!: HTMLElement;
    tableOfContents?: TableOfContentData;
    sourceEditor!: monaco.editor.IStandaloneCodeEditor;

    constructor(customOptions: UAIEditorOptions) {
        // 使用默认的选项初始化编辑器选项
        this.options = {
            element: customOptions.element,
            content: customOptions.content,
            onCreated: customOptions.onCreated,
            header: customOptions.header ?? "ribbon",
            theme: customOptions.theme ?? "light",
            lang: customOptions.lang ?? "zh",
            i18n: customOptions.i18n,
            dicts: {
                fontFamilies: customOptions.dicts?.fontFamilies ?? [
                    { label: "默认字体", value: "" },
                    { label: "宋体", value: "SimSun" },
                    { label: "黑体", value: "SimHei" },
                    { label: "楷体", value: "KaiTi" },
                    { label: "楷体_GB2312", value: "KaiTi_GB2312" },
                    { label: '仿宋', value: 'FangSong' },
                    { label: '仿宋_GB2312', value: 'FangSong_GB2312' },
                    { label: '华文宋体', value: 'STSong' },
                    { label: '华文仿宋', value: 'STFangsong' },
                    { label: '方正仿宋简体', value: 'FZFangSong-Z02S' },
                    { label: '方正小标宋', value: 'FZXiaoBiaoSong-B05S' },
                    { label: '微软雅黑', value: 'Microsoft Yahei' },
                    { label: 'Arial', value: 'Arial' },
                    { label: 'Times New Roman', value: 'Times New Roman' },
                    { label: 'Verdana', value: 'Verdana' },
                    { label: 'Helvetica', value: 'Helvetica' },
                    { label: 'Calibri', value: 'Calibri' },
                    { label: 'Cambria', value: 'Cambria' },
                    { label: 'Tahoma', value: 'Tahoma' },
                    { label: 'Georgia', value: 'Georgia' },
                    { label: 'Comic Sans MS', value: 'Comic Sans MS' },
                    { label: 'Impact', value: 'Impact' },
                ],
                fontSizes: customOptions.dicts?.fontSizes ?? [
                    { label: "默认", value: "" },
                    { label: "初号", value: "42pt", order: 20 },
                    { label: "小初", value: "36pt", order: 19 },
                    { label: "一号", value: "26pt", order: 16 },
                    { label: "小一", value: "24pt", order: 15 },
                    { label: "二号", value: "22pt", order: 14 },
                    { label: "小二", value: "18pt", order: 11 },
                    { label: "三号", value: "16pt", order: 10 },
                    { label: "小三", value: "15pt", order: 9 },
                    { label: "四号", value: "14pt", order: 7 },
                    { label: "小四", value: "12pt", order: 4 },
                    { label: "五号", value: "10.5pt" },
                    { label: "小五", value: "9pt" },
                    { label: '10', value: '10px', order: 1 },
                    { label: '11', value: '11px', order: 2 },
                    { label: '12', value: '12px', order: 3 },
                    { label: '16', value: '16px', order: 5 },
                    { label: '18', value: '18px', order: 6 },
                    { label: '20', value: '20px', order: 8 },
                    { label: '22', value: '22px' },
                    { label: '24', value: '24px' },
                    { label: '26', value: '26px', order: 12 },
                    { label: '28', value: '28px', order: 13 },
                    { label: '32', value: '32px' },
                    { label: '36', value: '36px', order: 17 },
                    { label: '42', value: '42px', order: 18 },
                    { label: '48', value: '48px' },
                    { label: '72', value: '72px', order: 21 },
                    { label: '96', value: '96px', order: 22 }
                ],
                lineHeights: customOptions.dicts?.lineHeights ?? [
                    { label: '单倍行距', value: 1 },
                    { label: '1.5 倍行距', value: 1.5 },
                    { label: '2 倍行距', value: 2 },
                    { label: '2.5 倍行距', value: 2.5 },
                    { label: '3 倍行距', value: 3 },
                ],
                symbols: [
                    { label: '普通文本', value: '‹›«»‘’“”‚„¡¿‥…‡‰‱‼⁈⁉⁇©®™§¶⁋', },
                    { label: '货币符号', value: '$€¥£¢₠₡₢₣₤¤₿₥₦₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽', },
                    { label: '数学符号', value: '<>≤≥–—¯‾°−±÷⁄×ƒ∫∑∞√∼≅≈≠≡∈∉∋∏∧∨¬∩∪∂∀∃∅∇∗∝∠¼½¾', },
                    { label: '箭头', value: '←→↑↓⇐⇒⇑⇓⇠⇢⇡⇣⇤⇥⤒⤓↨' },
                    { label: '拉丁语', value: 'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŉŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ', },
                ],
                emojis: [
                    { label: '表情与角色', value: '😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😙 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🤧 🥵 🥶 🥴 😵 🤯 🤠 🥳 😎 🤓 🧐 😕 😟 🙁 ☹️ 😮 😯 😲 😳 🥺 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 👿 💀 ☠️ 💩 🤡 👹 👺 👻 👽 👾 🤖 👋 🤚 🖐️ ✋ 🖖 👌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦿 🦵 🦶 👂 🦻', },
                    { label: '动物与自然', value: '🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🦁 🐯 🐅 🐆 🐴 🐎 🦄 🦓 🦌 🐮 🐂 🐃 🐄 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒 🐘 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿️ 🦔 🦇 🐻 🐨 🐼 🦥 🦦 🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐧 🕊️ 🦅 🦆 🦢 🦉 🦩 🦚 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🐟 🐠 🐡 🦈 🐙 🐚 🐌 🦋 🐛 🐜 🐝 🐞 🦗 🕷️ 🕸️ 🦂 🦟 🦠 💐 🌸 💮 🏵️ 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🌲 🌳 🌴 🌵 🌾 🌿 ☘️ 🍀 🍁 🍂 🍃', },
                    { label: '食物与食品', value: '🥬 🥦 🧄 🧅 🍄 🥜 🌰 🍞 🥐 🥖 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🥙 🧆 🥚 🍳 🥘 🍲 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢 🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍦 🍧 🍨 🍩 🍪 🎂 🍰 🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂 🥃 🥤 🧃 🧉 🧊 🥢 🍽️ 🍴 🥄 🔪 🏺', },
                    { label: '活动', value: '🎗️ 🎟️ 🎫 🎖️ 🏆 🏅 🥇 🥈 🥉 ⚽ ⚾ 🥎 🏀 🏐 🏈 🏉 🎾 🥏 🎳 🏏 🏑 🏒 🥍 🏓 🏸 🥊 🥋 🥅 ⛳ ⛸️ 🎣 🤿 🎽 🎿 🛷 🥌 🎯 🪀 🪁 🎱 🔮 🧿 🎮 🕹️ 🎰 🎲 🧩 🧸 ♠️ ♥️ ♦️ ♣️ ♟️ 🃏 🀄 🎴 🎭 🖼️ 🎨 🧵 🧶', },
                    { label: '旅行与景点', value: '🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚍 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚜 🏎️ 🏍️ 🛵 🦽 🦼 🛺 🚲 🛴 🛹 🚏 🛣️ 🛤️ 🛢️ ⛽ 🚨 🚥 🚦 🛑 🚧 ⚓ ⛵ 🛶 🚤 🛳️ ⛴️ 🛥️ 🚢 ✈️ 🛩️ 🛫 🛬 🪂 💺 🚁 🚟 🚠 🚡 🛰️ 🚀 🛸 🛎️ 🧳 ⌛ ⏳ ⌚ ⏰ ⏱️ ⏲️ 🕰️ 🕛 🕧 🕐 🕜 🕑 🕝 🕒 🕞 🕓 🕟 🕔 🕠 🕕 🕡 🕖 🕢 🕗 🕣 🕘 🕤 🕙 🕥 🕚 🕦 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌛 🌜 🌡️ ☀️ 🌝 🌞 🪐 ⭐ 🌟 🌠 🌌 ☁️ ⛅ ⛈️ 🌤️ 🌥️ 🌦️ 🌧️ 🌨️ 🌩️ 🌪️ 🌫️ 🌬️ 🌀 🌈 🌂 ☂️ ☔ ⛱️ ⚡ ❄️ ☃️ ⛄ ☄️ 🔥 💧 🌊', },
                    { label: '物品', value: '📃 📜 📄 📰 🗞️ 📑 🔖 🏷️ 💰 💴 💵 💶 💷 💸 💳 🧾 💹 ✉️ 📧 📨 📩 📤 📥 📦 📫 📪 📬 📭 📮 🗳️ ✏️ ✒️ 🖋️ 🖊️ 🖌️ 🖍️ 📝 💼 📁 📂 🗂️ 📅 📆 🗒️ 🗓️ 📇 📈 📉 📊 📋 📌 📍 📎 🖇️ 📏 📐 ✂️ 🗃️ 🗄️ 🗑️ 🔒 🔓 🔏 🔐 🔑 🗝️ 🔨 🪓 ⛏️ ⚒️ 🛠️ 🗡️ ⚔️ 🔫 🏹 🛡️ 🔧 🔩 ⚙️ 🗜️ ⚖️ 🦯 🔗 ⛓️ 🧰 🧲 ⚗️ 🧪 🧫 🧬 🔬 🔭 📡 💉 🩸 💊 🩹 🩺 🚪 🛏️ 🛋️ 🪑 🚽 🚿 🛁 🪒 🧴 🧷 🧹 🧺 🧻 🧼 🧽 🧯 🛒 🚬 ⚰️ ⚱️ 🗿', },
                    { label: '符号', value: '➰ ➿ 〽️ ✳️ ✴️ ❇️ ©️ ®️ ™️ #️⃣ *️⃣ 0️⃣ 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟 🔠 🔡 🔢 🔣 🔤 🅰️ 🆎 🅱️ 🆑 🆒 🆓 ℹ️ 🆔 Ⓜ️ 🆕 🆖 🅾️ 🆗 🅿️ 🆘 🆙 🆚 🈁 🈂️ 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜ ◼️ ◻️ ◾ ◽ ▪️ ▫️ 🔶 🔷 🔸 🔹 🔺 🔻 💠 🔘 🔳 🔲', },
                    { label: '旗帜', value: '🏁 🎌 🏴󠁧󠁢󠁥󠁮󠁧󠁿', },
                ],
            },
            ai: {
                chat: {
                    models: customOptions.ai?.chat?.models,
                    commands: customOptions.ai?.chat?.commands ?? defaultChatCommands
                },
                image: {
                    models: {
                        text2image: customOptions.ai?.image?.models?.text2image,
                    },
                    commands: customOptions.ai?.image?.commands ?? defaultImageCommands
                }
            }
        };
        const i18nConfig = this.options.i18n || {};
        const resources = {
            zh: { translation: { ...zh, ...i18nConfig.zh } }
        } as Resource;
        i18next.init({
            lng: this.options.lang, resources,
        }, (_err, _t) => {
            this.initInnerEditor();
        })
    }

    /**
     * 初始化编辑器
     */
    protected initInnerEditor() {
        const rootEl = typeof this.options.element === "string"
            ? document.querySelector(this.options.element) as Element : this.options.element;
        this.container = document.createElement("div");
        this.container.classList.add("uai-editor-container");
        rootEl.appendChild(this.container);

        this.header = new Header();
        this.header.classList.add("uai-toolbar");
        this.header.classList.add("toolbar-ribbon");
        this.container.appendChild(this.header);

        this.center = document.createElement("div");
        this.center.style.display = "flex";
        this.center.style.height = "10vh";
        this.center.style.flex = "1";

        this.tocContainer = new TocContainer();
        this.tocContainer.style.display = "none";
        this.center.appendChild(this.tocContainer);
        this.toggleContainers.push(this.tocContainer);

        this.chatContainer = new ChatContainer();
        this.chatContainer.style.display = "none";
        this.center.appendChild(this.chatContainer);
        this.toggleContainers.push(this.chatContainer);

        this.imageContainer = new ImageContainer();
        this.imageContainer.style.display = "none";
        this.center.appendChild(this.imageContainer);
        this.toggleContainers.push(this.imageContainer);

        this.editor = new Editor();
        this.editor.classList.add("uai-main");
        this.center.appendChild(this.editor);
        this.container.appendChild(this.center);

        this.footer = new Footer();
        this.footer.classList.add("uai-footer");
        this.container.appendChild(this.footer);

        this.source = document.createElement("div");
        this.source.classList.add("uai-source-editor");
        this.sourceEditor = monaco.editor.create(this.source, {
            value: '', // 编辑器初始显示文字
            language: 'html', // 语言
            autoIndent: "full",
            automaticLayout: true, // 自动布局
            theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
            minimap: { // 小地图
                enabled: true,
            },
            fontSize: 14,
            formatOnType: true,
            formatOnPaste: true,
            lineNumbersMinChars: 3,
            wordWrap: 'on',
            scrollbar: {
                verticalScrollbarSize: 5,
                horizontalScrollbarSize: 5,
            },
        })
        this.container.appendChild(this.source);

        this.sourceEditor.onDidChangeModelContent(() => {
            this.innerEditor.commands.setContent(this.sourceEditor.getValue());
        })

        let content = this.options.content;

        this.innerEditor = new InnerEditor(this, {
            element: this.editor.editorContainer,
            content: markdownToHtml(content ?? ""),
            extensions: allExtensions(this, this.options),
            onCreate: (props) => this.onCreate(props),
            onTransaction: (props) => this.onTransaction(props),
            onFocus: () => { },
            onBlur: () => { },
            onDestroy: () => { },
            editorProps: {
                attributes: {
                    class: "uai-editor"
                },
            }
        })
    }

    protected onCreate(event: EditorEvents['create']) {
        this.innerEditor.view.dom.style.height = "100%";
        if (this.options.onCreated) {
            this.options.onCreated(this);
        }
        this.header.onCreate(event, this.options);
        this.tocContainer.onCreate(event, this.options);
        this.chatContainer.onCreate(event, this.options);
        this.imageContainer.onCreate(event, this.options);
        this.editor.onCreate(event, this.options);
        this.footer.onCreate(event, this.options);
        this.eventComponents.forEach(component => {
            component.onCreate(event, this.options);
        })
    }

    protected onTransaction(event: EditorEvents['transaction']) {
        this.header.onTransaction(event, this.options);
        this.tocContainer.onTransaction(event, this.options);
        this.chatContainer.onTransaction(event, this.options);
        this.imageContainer.onTransaction(event, this.options);
        this.editor.onTransaction(event, this.options);
        this.footer.onTransaction(event, this.options);
        this.eventComponents.forEach(component => {
            component.onTransaction(event, this.options);
        });
    }

    switchEditor() {
        this.container.appendChild(this.center);
        this.container.appendChild(this.footer);
        try {
            this.container.removeChild(this.source);
        } catch (error) {
        }
    }

    switchSource() {
        this.container.removeChild(this.center);
        this.container.removeChild(this.footer);
        this.container.appendChild(this.source);
        this.sourceEditor.setValue(this.innerEditor.getHTML());
        this.sourceEditor.getAction('editor.action.formatDocument')!.run();
        this.sourceEditor.getModel()?.updateOptions({ tabSize: 2 });
    }
}