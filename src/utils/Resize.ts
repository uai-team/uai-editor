// Copyright (c) 2024-present AI-Labs

// @ ts-nocheck
/**
 * 调整对象大小
 * @param container 
 * @param root 
 * @param updateAttrs 
 */
export const resize = (container: HTMLDivElement, root: HTMLElement, updateAttrs: (data: any) => void) => {

    const objResize = container.querySelector(".resize-obj") as HTMLElement,
        minWidth = 10;

    let startX: number, startY: number, objWidth: number, startPosition: string;

    const onMousedown = (e: any) => {
        e.preventDefault();

        root.addEventListener('mousemove', onMousemove);
        root.addEventListener('mouseup', onMouseup);
        root.addEventListener('mouseleave', onMouseup);

        // 获取鼠标初始位置
        startX = e.clientX;
        startY = e.clientY;

        objWidth = Number(objResize.getAttribute("data-with")) || objResize.clientWidth;
        startPosition = e.target.getAttribute("data-position");
    };

    const onMousemove = (event: MouseEvent) => {
        // 获取鼠标最新位置的变化
        const distanceX = event.clientX - startX;
        const distanceY = event.clientY - startY;
        if (distanceX == 0 && distanceY == 0) {
            return;
        }

        // 判断是做缩小还是做放大
        var zoomIn = false;
        var zoomSize = 0;
        if (startPosition === "1") {
            zoomIn = distanceX > 0 && distanceY > 0 ? false : true;
            zoomSize = Math.max(Math.abs(distanceX), Math.abs(distanceY));
        }
        if (startPosition === "2") {
            zoomIn = distanceY > 0 ? false : true;
            zoomSize = Math.abs(distanceY);
        }
        if (startPosition === "3") {
            zoomIn = distanceX < 0 && distanceY > 0 ? false : true;
            zoomSize = Math.max(Math.abs(distanceX), Math.abs(distanceY));
        }
        if (startPosition === "4") {
            zoomIn = distanceX > 0 ? false : true;
            zoomSize = Math.abs(distanceX);
        }
        if (startPosition === "5") {
            zoomIn = distanceX < 0 ? false : true;
            zoomSize = Math.abs(distanceX);
        }
        if (startPosition === "6") {
            zoomIn = distanceX > 0 && distanceY < 0 ? false : true;
            zoomSize = Math.max(Math.abs(distanceX), Math.abs(distanceY));
        }
        if (startPosition === "7") {
            zoomIn = distanceY < 0 ? false : true;
            zoomSize = Math.abs(distanceY);
        }
        if (startPosition === "8") {
            zoomIn = distanceX < 0 && distanceY < 0 ? false : true;
            zoomSize = Math.max(Math.abs(distanceX), Math.abs(distanceY));
        }
        let newWidth = objWidth + zoomSize * (zoomIn ? 1 : -1);

        if (newWidth >= root.clientWidth) {
            newWidth = root.clientWidth;
        }
        if (newWidth < minWidth) {
            newWidth = minWidth;
        }

        //及时修改节点宽度，拖动结束后再通知渲染视图
        objResize.style.width = `${newWidth}px`;
        objResize.setAttribute("data-width", newWidth.toString());

        objResize.parentElement!.removeAttribute("style");
    }

    const onMouseup = () => {
        root.removeEventListener('mousemove', onMousemove);
        root.removeEventListener('mouseup', onMouseup);
        root.removeEventListener('mouseleave', onMouseup);

        const attrs = { width: `${objResize.getAttribute("data-width")}px` };
        updateAttrs(attrs)
    };

    for (let child of container.querySelector(".uai-resize")!.children) {
        child.addEventListener("mousedown", onMousedown)
    }
}