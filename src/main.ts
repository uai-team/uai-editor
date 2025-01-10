// Copyright (c) 2024-present AI-Labs

import { UAIEditor } from "./core/UAIEditor.ts";

new UAIEditor({
    element: "#uai-editor",
    content: `> UAI Editor 是一个面向 AI 的、现代 UI 风格的下一代富文本编辑器。开箱即用、支持所有前端框架。\n\n

# 冬日游记

北风呼啸，白雪皑皑，冬日踏上了这片宁静的大地。我独自一人，踏着轻盈的步伐，走进了这个银装素裹的世界，去感受那冬日的诗意与宁静。

清晨，阳光透过窗户洒在床头，我揉了揉惺忪的睡眼，拉开窗帘，眼前的景象让我陶醉。那一片片洁白的雪花，像无数只蝴蝶翩翩起舞，在空中划过优美的弧线，最终静静地躺在地上，与大地拥抱。我迫不及待地穿上厚厚的羽绒服，戴上手套和帽子，踏上了寻雪之旅。

沿着蜿蜒的小路，我来到了一片雪原。脚下传来“咯吱咯吱”的声音，那是雪与鞋底相触的旋律。我深吸一口冷空气，那股清新的气息瞬间让我神清气爽。四周一片寂静，只有雪花飘落的声音，仿佛是大自然在诉说着冬日的秘密。

我漫步在雪原上，任雪花飘落在我的发梢、肩头。忽然，我发现了一只小松鼠，它正忙碌地从树上摘下松果，然后迅速地藏进树洞。我静静地注视着它，心中涌起一股暖意。在这个寒冷的冬日，小松鼠的勤劳和智慧让我敬佩不已。

午后，我来到了一座雪山。站在山脚下，仰望那巍峨的山峰，我仿佛看到了天地相连的壮丽景象。我沿着蜿蜒的山路向上攀登，一路上，雪花纷飞，将我包裹在一片白色的世界里。当我爬到山顶时，眼前豁然开朗，一片雪原尽收眼底。我倚靠在山石上，闭上眼睛，感受着阳光的温暖和风儿的轻拂，那一刻，我仿佛与大自然融为一体。

夜幕降临，我来到了一个村庄。这里的房屋都披上了银白的雪衣，宛如童话世界一般。我走进一家小酒馆，点了一壶热酒，品尝着浓郁的酒香，与酒馆老板闲聊着。他告诉我，这里的冬天虽然寒冷，但村民们都十分热情好客。我心中涌起一股暖意，仿佛感受到了这个村庄的温暖。

归途中，我漫步在雪地中，看着那一盏盏明亮的路灯，照亮了我前行的道路。我感慨万分，这个冬日，让我领略了大自然的美妙，也让我感受到了人间的温情。

时光荏苒，冬日的旅程即将结束。我带着满满的回忆，踏上了回家的路。虽然冬天即将过去，但我相信，那些美好的瞬间将永远留在我的心中，成为我人生中最宝贵的财富。
`,
    header: "ribbon",
    ai: {
        chat: {
            models: {
                "default": {
                    modelType: 'openai',
                    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
                    apiKey: process.env.CHATGLM_APIKEY,
                    model: 'glm-4-flash'
                },
                "GLM-4": {
                    modelType: 'openai',
                    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
                    apiKey: process.env.CHATGLM_APIKEY,
                    model: 'glm-4-flash'
                },
                "InternLM2.5": {
                    modelType: 'openai',
                    baseUrl: 'https://internlm-chat.intern-ai.org.cn/puyu/api/v1',
                    apiKey: process.env.INTERNLM_TOKEN,
                    model: 'internlm2.5-latest'
                },
            },
        },
        image: {
            models: {
                text2image: {
                    "default": {
                        modelType: 'openai',
                        baseUrl: 'https://open.bigmodel.cn/api/paas/v4', // images/generations
                        apiKey: process.env.CHATGLM_APIKEY,
                        model: 'cogview-3-flash'
                    },
                    "CogView-3": {
                        modelType: 'openai',
                        baseUrl: 'https://open.bigmodel.cn/api/paas/v4', // images/generations
                        apiKey: process.env.CHATGLM_APIKEY,
                        model: 'cogview-3-flash'
                    },
                }
            }
        }
    }
})
