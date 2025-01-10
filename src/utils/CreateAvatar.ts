// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
/**
 * 创建头像
 * @param icon 
 * @returns 
 */
export function createAvatar(icon: string) {
    const avatarDiv = document.createElement('div')
    avatarDiv.style.fontSize = '30px'
    avatarDiv.style.marginLeft = '5px'
    avatarDiv.innerHTML = icon
    return avatarDiv
}
