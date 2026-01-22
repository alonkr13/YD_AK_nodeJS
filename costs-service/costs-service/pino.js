const Log = require('./models/log.model')

module.exports = {
    write(chunk) {
        try {
            const log = JSON.parse(chunk)

            Log.create({
                level: log.level,
                message: log.msg,
                time: new Date(log.time),
                method: log.req?.method,
                url: log.req?.url,
                statusCode: log.res?.statusCode
            })
        } catch {}
    }
}