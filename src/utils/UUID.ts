// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
/**
 * 生成UUID
 * @returns 
 */
export const uuid = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
