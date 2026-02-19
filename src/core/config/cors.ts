import type { CorsOptions } from "cors";

interface Options {
    FRONTEND_URL: string
    argv_2: string
    //NODE_ENV: string
}

export class CorsConfig {
    public corsOptions: CorsOptions;

    constructor(options: Options) {
        const { FRONTEND_URL, argv_2 } = options
        this.corsOptions = {
            origin: function (origin, callback) {
                const whitelist: Array<string | undefined> = [FRONTEND_URL]
                if (argv_2 === '--api') {
                    whitelist.push(undefined)
                }

                if (whitelist.includes(origin)) {
                    callback(null, true)
                } else {
                    callback(new Error('No permitido por CORS'))
                }
            }
        }
    }

}