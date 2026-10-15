import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import geoip from "geoip-lite"
import { client } from '../../db/redis.connection.js';
import { successResponse } from './success.response.js';


async function fromWhere(ip) {
    try {
        return geoip.lookup(ip)
    } catch (error) {
        console.log("fail to detected request origin");
        console.log(error);

    }
}
export function generateRateLimiter({
    ttl = 5,
    limit = 50,
    standardHeaders = "draft-7",
    legacyHeaders = true,
    message = "Too Many Request",
    statusCode = 429,
    skipFailedRequests,
    skipSuccessfulRequests

}) {
    return rateLimit({
        windowMs: ttl * 60 * 1000,
        limit: limit,
        legacyHeaders: legacyHeaders,
        standardHeaders: standardHeaders,
        skipFailedRequests,
        skipSuccessfulRequests,
        handler: function (req, res, next) {
            return successResponse({ res, status: statusCode, message })
        },
        limit: async function (req) {
            const country = await fromWhere(req.ip)
           
            if (!country) {
                return limit;
            }

            return country.country === "EG" ? limit : 0;

        },
        keyGenerator: function (req) {
            const ip = ipKeyGenerator(req.ip, 52)
            return `${ip}::${req.path}`
        },
        store: {
            async incr(key, cd) {
                try {
                    const count = await client.incr(key)
                    if (count === 1) {
                        await client.expire(key, 60)
                    }
                    cd(null, count)
                } catch (error) {
                    cd(error)
                }
            },
            async decrement(key) {
                if (await client.exists(key)) {
                    await client.decr(key)
                }
            }
        }
    })

}
