declare type TCallback<A extends any[], R = any> = (...args: A) => R;

interface HTMLElement {
    mozRequestFullScreen?(): Promise<void>;
    webkitRequestFullscreen?(): Promise<void>;
    msRequestFullscreen?(): Promise<void>;
}
