module.exports = {
    success(res, data) {
        return res.status(200).json({
            success: true,
            data: data
        })
    },
    created(res, data) {
        return res.status(201).json({
            success: true,
            data: data
        })
    },
    notFound(res, message) {
        return res.status(404).json({
            success: false,
            message: message || 'Resource not found'
        })
    },
    error(res, message, code = 500) {
        return res.status(code).json({
            success: false,
            message 
        });
    }
}