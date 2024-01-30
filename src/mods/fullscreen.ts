"use strict";
type FullscreenAPI = {
    enabled: string;
    element: string;
    request: string;
    exit: string;
    events: {
        change: string;
        error: string;
    };
};

interface DocumentWithFullscreen extends Document {
    [key: string]: any;
}
interface HTMLElementWithFullscreen extends HTMLElement {
    [key: string]: any;
}
(function(doc: DocumentWithFullscreen) {
    let pollute: boolean = true,
        api: FullscreenAPI | undefined,
        vendor: string,
        apis: { [key: string]: FullscreenAPI } = {
            w3: {
                enabled: "fullscreenEnabled",
                element: "fullscreenElement",
                request: "requestFullscreen",
                exit: "exitFullscreen",
                events: {
                    change: "fullscreenchange",
                    error: "fullscreenerror"
                }
            },
            webkit: {
                enabled: "webkitFullscreenEnabled",
                element: "webkitCurrentFullScreenElement",
                request: "webkitRequestFullscreen",
                exit: "webkitExitFullscreen",
                events: {
                    change: "webkitfullscreenchange",
                    error: "webkitfullscreenerror"
                }
            },
            moz: {
                enabled: "mozFullScreenEnabled",
                element: "mozFullScreenElement",
                request: "mozRequestFullScreen",
                exit: "mozCancelFullScreen",
                events: {
                    change: "mozfullscreenchange",
                    error: "mozfullscreenerror"
                }
            },
            ms: {
                enabled: "msFullscreenEnabled",
                element: "msFullscreenElement",
                request: "msRequestFullscreen",
                exit: "msExitFullscreen",
                events: {
                    change: "MSFullscreenChange",
                    error: "MSFullscreenError"
                }
            }
        },
        w3: FullscreenAPI = apis.w3;

    // Loop through each vendor's specific API
    for (vendor in apis) {
        if (apis[vendor].enabled in doc) {
            api = apis[vendor];
            break;
        }
    }

    function dispatch(type: string, target: EventTarget): void {
        let event: Event = new Event(type, { bubbles: true, cancelable: false });
        target.dispatchEvent(event);
    }

    function handleChange(e: Event): void {
        e.stopPropagation();
        e.stopImmediatePropagation();

        doc[w3.enabled] = doc[api!.enabled];
        doc[w3.element] = doc[api!.element];

        dispatch(w3.events.change, e.target as EventTarget);
    }

    function handleError(e: Event): void {
        dispatch(w3.events.error, e.target as EventTarget);
    }

    function createResolver(method: string): (resolve: () => void, reject: (reason?: any) => void) => void {
        return function resolver(resolve: () => void, reject: (reason?: any) => void): void {
            if (method === w3.exit && !doc[api!.element]) {
                setTimeout(() => {
                    reject(new TypeError());
                }, 1);
                return;
            }

            function change(): void {
                resolve();
                doc.removeEventListener(api!.events.change, change, false);
            }

            function error(): void {
                reject(new TypeError());
                doc.removeEventListener(api!.events.error, error, false);
            }

            doc.addEventListener(api!.events.change, change, false);
            doc.addEventListener(api!.events.error, error, false);
        };
    }

    if (pollute && !(w3.enabled in doc) && api) {
        doc.addEventListener(api.events.change, handleChange, false);
        doc.addEventListener(api.events.error, handleError, false);

        doc[w3.enabled] = doc[api.enabled];
        doc[w3.element] = doc[api.element];

        doc[w3.exit] = function(): Promise<void> | void {
            let result: void | Promise<void> = doc[api!.exit]();
            return result === undefined && window.Promise ? new Promise(createResolver(w3.exit)) : result;
        };

        Element.prototype[w3.request as "requestFullscreen"] = function(): Promise<void> {
            let result: Promise<void> = this[api!.request as "requestFullscreen"]!.apply(this, arguments as any);
            return result === undefined && window.Promise ? new Promise(createResolver(w3.request)) : result;
        };
    }

    return api;
}(document as DocumentWithFullscreen));
