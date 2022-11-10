export const handleSuccessResponse = (res, message, payload) => {
    return res.status(200).json({
        message: message,
        success: true,
        payload: payload
    });
}

export const handleErrorResponse = (res, error, message) => {
    if (!error.code) error.code = 500;
    return res.status(error.code).json({
        message: message,
        error: '' + error
    });
}