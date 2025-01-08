// Copyright (c) 2024-present AI-Labs

/**
 * 模型对话的基本配置信息
 */
export interface AIChatConfig {
    modelType: "openai" | "custom" | "LMDeploy";

    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
    frequency_penalty?: number;

    baseUrl?: string; // openai && gitee
    apiKey?: string; // openai && gitee && spark
    model?: string;  // openai

    appId?: string, // spark
    apiSecret?: string, // spark
    protocol?: string, // spark && wenxin
    version?: string, // spark && wenxin

    access_token?: string, // wenxin
}

/**
 * 快捷命令基本配置信息
 */
export interface AICommand {
    icon?: string,
    name: string,
    prompt?: string,
    text?: "selected" | "focusBefore",
    model?: string,
    action?: () => void,
}
