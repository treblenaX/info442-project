export const handleSuccessResponse = (res, message, payload) => {
    const json = {
        message: message,
        success: true
    };

    if (payload) json.payload = payload;

    return res.status(200).json(json);
}

export const handleErrorResponse = (res, error, message) => {
    if (!error.code) error.code = 500;
    return res.status(error.code).json({
        message: message,
        error: '' + error
    });
}

export const handleSuccessFileResponse = (res, filename) => {
    const tokens = filename.split('.');
    res.set('Content-Type', `image/${tokens[tokens.length - 1]}`);
    return res.status(200).sendFile(filename);
}