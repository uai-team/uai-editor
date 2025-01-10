// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
/**
 * 定义文件上传类
 */
export type Uploader = (file: File, uploadUrl?: string, headers?: Record<string, any>, formName?: string) => Promise<Record<string, any>>;

/**
 * 默认的Base64文件处理
 * @param file 
 * @param _uploadUrl 
 * @param _headers 
 * @param _formName 
 * @returns 
 */
export const Base64Uploader: Uploader = (file: File, _uploadUrl?: string, _headers?: Record<string, any>, _formName?: string): Promise<Record<string, any>> => {
    let reader = new FileReader;
    return new Promise((accept, fail) => {
        reader.onload = () => accept({ code: 200, data: { src: reader.result, href: file.name } });
        reader.onerror = () => fail(reader.error);
        setTimeout(() => reader.readAsDataURL(file), 1000);
    })
}