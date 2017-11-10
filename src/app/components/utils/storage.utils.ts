function getLocalStorage(): Storage {
    return window.localStorage;
}

export function storeDetails(key, value): boolean {
    getLocalStorage().setItem(key, value);
    return true;
}

export function getDetails(key): any {
    return getLocalStorage().getItem(key);
}
