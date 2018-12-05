function isWindow(obj: any) {
    return obj !== null && obj === obj.window;
}

function getWindow(elem: any) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
}
export function exactPosition(elem: HTMLElement) {
    let docElem: any, win: any,
        box = {top: 0, left: 0};
    const doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
        box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
        top: box.top + win.pageYOffset - docElem.clientTop,
        left: box.left + win.pageXOffset - docElem.clientLeft
    };
}
