export const defaultErrorHandler = (error, handler) => {
    if (handler) {
        handler.call();
    }
};