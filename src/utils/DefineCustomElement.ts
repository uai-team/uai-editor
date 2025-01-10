// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
/**
 * 注册Web组件
 * @param name 
 * @param element 
 */
export const defineCustomElement = (name: string, element: CustomElementConstructor) => {
    if (!window.customElements.get(name)) {
        window.customElements.define(name, element);
    }
}