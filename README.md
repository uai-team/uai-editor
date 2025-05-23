# UAI Editor：有爱文档，有爱、有AI、有UI。

> 💪打造现代 UI 风格、面向 AI 的最强、最轻量级的个人&团队文档。  
> UAI Editor 是一个面向 AI 的、现代 UI 风格的下一代富文本编辑器。开箱即用、支持所有前端框架。

- **【全行业】** 无论您是：金融、教育、医疗、零售、互联网还是传统行业。
- **【全场景】** 无论您是：文章创作、会议记录、学术论文还是知识库管理。
- **【全功能】** 功能丰富：文本编辑、格式排版、多媒体插入、表格制作等。
- **【全模态】** 人工智能：文字、语音、图片、视频，全模态功能创作体验。

## 与众不同

UAI Editor 提供了完善的文档编辑能力和 AI 创作能力，支持 Markdown 语法，支持基础的富文本编辑功能，支持插入多种节点类型，提供了多种类型的实用工具。作为一个独立的纯前端文档编辑器，UAI Editor 可以轻松无缝集成到 Vue、React、Layui、Angular 等几乎任何前端框架。

### 场景丰富

* 无论您是：金融、教育、医疗、零售、互联网还是传统行业。
* 无论您是：文章创作、会议记录、学术论文还是知识库管理。
* 即便是个人笔记整理，UAI Editor 都能成为您得力的助手。

### 功能全面

* **基础：** 标题、正文、字体、字号、加粗、斜体、下划线、删除线、链接、行内代码、上标、下标、分割线、引用...
* **增强：** 撤销、重做、格式刷、橡皮擦、字体颜色、背景颜色、对齐方式、行高、待办事项、有（无）序列表、段落缩进...
* **附件：** 支持图片、语音、视频、文件功能，支持选择上传、支持拖动调整大小...
* **Markdown：** 标题、引用、表格、图片、代码块、高亮块、各种列表、粗体、斜体、删除线...
* **AI：** AI 续写、AI 优化、AI 校对、AI 翻译、自定义 AI 菜单及其 Prompts...
* **更多：** 国际化、主题切换...

### 简单易用

* UAI Editor 基于 Web Component 开发，支持与任意主流的前端框架集成。
* UAI Editor 提供了友好的 UI 界面，强大的工具栏支持，助您轻松实现文档编辑。
* UAI Editor 提供了便捷的快捷键支持，让您的文档编辑快人一步。

### AI 驱动

* UAI Editor 旨在解决 Web 应用中文档编辑的复杂性，提供类似 Microsoft Word 的强大编辑能力，同时保持 Web 应用的便捷性。
* UAI Editor 打造了一个完全由 AI 驱动的富文本编辑器，同时支持对接任意大模型，包括私有的大模型。
* UAI Editor 支持全模态大模型，包括文本生成、语音识别、语音生成、文生图、图生图、局部重绘、图片理解、文生视频、图生视频、视频理解等。
* UAI Editor 私有模型适配多种环境，包括英伟达显卡、天数智芯显卡、Pytorch、IPEX等。

## 软件安装

### 基础软件安装

首先，我们需要安装 `nodejs`、`npm`等用于开发的基础软件。

Node.js 可以通过不同的方式安装，所有主要平台的官方软件包均可在 [https://nodejs.cn/download/](https://nodejs.cn/download/) 获得。

一种非常方便的安装 Node.js 的方法是通过包管理器，[https://nodejs.cn/download/package-manager/](https://nodejs.cn/download/package-manager/) 中列出了适用于 macOS、Linux 和 Windows 的其他软件包管理器。

### 有爱文档安装

其次，我们需要安装 UAI Editor 软件，软件已经打包发布到 [https://www.npmjs.com/](https://www.npmjs.com/) 平台，可以直接通过以下命令安装：

```bash
npm i @uai-team/uai-editor
```

## 软件集成

然后，我们可以将 UAI Editor 与自己的项目进行集成。

作为一个独立的纯前端文档编辑器，UAI Editor 可以独立使用，也可以轻松无缝集成到 Vue、React、Layui、Angular 等几乎任何前端框架。

### 独立使用

* index.html

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>UAI Editor</title>
    <link rel="icon" href="/favicon.png" />
</head>
<body>
    <div id="uai-editor"></div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

* main.ts

```js
import { UAIEditor } from '@uai-team/uai-editor';
import '@uai-team/uai-editor/dist/style.css';

new UAIEditor({
    element: "#uai-editor",
    content: 'UAI Editor 是一个面向 AI 的、现代 UI 风格的下一代富文本编辑器。开箱即用、支持所有前端框架。',
})
```

### 与 VUE 集成

```ts
<template>
  <div ref="editorDiv"/>
</template>

<script lang="ts">
import { UAIEditor } from '@uai-team/uai-editor';
import '@uai-team/uai-editor/dist/style.css';

export default {
  mounted(){
    new UAIEditor({
      element: this.$refs.editorDiv as Element,
      content: 'UAI Editor 是一个面向 AI 的、现代 UI 风格的下一代富文本编辑器。开箱即用、支持所有前端框架。',
    })
  }
}
</script>
```

### 与 React 集成

```js
import {useEffect, useRef} from 'react';
import { UAIEditor } from '@uai-team/uai-editor';
import '@uai-team/uai-editor/dist/style.css';

function App() {
    const divRef = useRef(null);
    useEffect(() => {
        if (divRef.current) {
            const uaiEditor = new UAIEditor({
                element: divRef.current,
                content: 'UAI Editor 是一个面向 AI 的、现代 UI 风格的下一代富文本编辑器。开箱即用、支持所有前端框架。',
            })
            return ()=>{
                uaiEditor.destroy();
            }
        }
    }, [])

    return (
        <>
            <div ref={divRef} />
        </>
    )
}

export default App
```

## 软件运行

最后，我们需要运行项目，执行以下命令可以运行项目或自己的项目：

```bash
npm i

npm run dev
```

### 与人工智能集成

如果要在 UAI Editor 中使用 AI 功能，需要在初始化 UAIEditor 的时候配置相关的配置项：

```js
new UAIEditor({
    element: "#uai-editor",
    content: 'UAI Editor 是一个面向 AI 的、现代 UI 风格的下一代富文本编辑器。开箱即用、支持所有前端框架。',
    ai: { // AI 配置项
        chat: { // 聊天配置项
            models: { // 模型配置项
                "default": {
                    modelType: 'openai',
                    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
                    apiKey: process.env.CHATGLM_APIKEY,
                    model: 'glm-4-flash'
                },
                "GLM-4": { // 聊天功能选择使用的模型，配置智谱AI的GLM-4-Flash模型
                    modelType: 'openai',
                    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
                    apiKey: process.env.CHATGLM_APIKEY, // 此处填写您智谱AI的 API Key
                    model: 'glm-4-flash'
                },
                "InternLM2.5": { // 聊天功能选择使用的模型，配置上海人工智能实验室的InternLM2.5模型
                    modelType: 'openai',
                    baseUrl: 'https://internlm-chat.intern-ai.org.cn/puyu/api/v1',
                    apiKey: process.env.INTERNLM_TOKEN, // 此处填写您上海人工智能实验室的 API Key
                    model: 'internlm2.5-latest'
                },
            },
        },
        image: { // 图像配置项
            models: { // 模型配置项
                text2image: { // 文本生成图像模型配置项
                    "default": {
                        modelType: 'openai',
                        baseUrl: 'https://open.bigmodel.cn/api/paas/v4', // images/generations
                        apiKey: process.env.CHATGLM_APIKEY,
                        model: 'cogview-3-flash'
                    },
                    "CogView-3": { // 绘图功能选择使用的模型，配置智谱AI的CogView-3-Flash模型
                        modelType: 'openai',
                        baseUrl: 'https://open.bigmodel.cn/api/paas/v4', // images/generations
                        apiKey: process.env.CHATGLM_APIKEY, // 此处填写您智谱AI的 API Key
                        model: 'cogview-3-flash'
                    },
                }
            }
        }
    }
})
```

## 帮助文档

UAI Editor 提供了一份使用文档，您可以通过以下方式访问：

安装必要的软件`docsify`：

```bash
npm i docsify -g
```

### 用户文档

启动文档服务：

```bash
docsify serve docs/user --port 3010
```

访问文档：

[http://localhost:3010](http://localhost:3010)。

### 开发者文档

启动文档服务：

```bash
docsify serve docs/developer --port 3020
```

访问文档：

[http://localhost:3020](http://localhost:3020)。

## 开源优势

* **免费使用：** 作为开源项目，UAI Editor 采用 [MIT 许可证](LICENSE) 对所有用户免费开放，无需担心版权问题。

* **持续更新：** UAI Editor 将持续迭代，不断优化功能，提升用户体验。

* **定制开发：** 开发者可根据项目需求进行定制化开发，打造专属的文档编辑器。

## 开源协议

UAI Editor 采用 [MIT 许可证](LICENSE)，您可以自由地使用、修改和分发软件，可以用于个人项目或商业项目，**但禁止用于参加创新、创意类比赛**。

## 支持我们

如果您觉得 UAI Editor 有用，请考虑通过以下方式支持我们：

* ⭐ 给 UAI Editor 仓库 点个 Star，表示对项目的支持。
* 🔗 如果您在项目中使用了 UAI Editor，请添加一个链接到 [https://gitee.com/uai-team/uai-editor](https://gitee.com/uai-team/uai-editor) 或者 [https://github.com/uai-team/uai-editor](https://github.com/uai-team/uai-editor)。
* ⛓️ UAI Editor 很多功能还存在不足，如果您感兴趣，欢迎优化 PR。
