let authLS = [];

export const LS_KEY = {
    AUTH_TOKEN: 'AUTH_TOKEN',
};

export function getAuthLS(key) {
    return localStorage.getItem(key);
}
export function setAuthLS(key, value) {
    authLS.push(key);
    localStorage.setItem(key, value);
}
export function clearAuthLS() {
    [LS_KEY.AUTH_TOKEN].forEach((key) => {
        localStorage.removeItem(key);
    });
}