import { client } from "../../db/redis.connection.js"

export const set = async ({ key, value, ttl = undefined } = {}) => {
    if (typeof value == "object") {
        value = JSON.stringify(value)
    }
    return await client.set(key, value, { EX: ttl })
}
export const get = async ({ key} = {}) => {
    let value = await client.get(key)
    try {
        return JSON.parse(value)
    } catch (error) {
        return value
    }
}
export const exist = async ({ key} = {}) => {
    return await client.exists(key)
   
}

export const updat = async ({ key, value, ttl = undefined } = {}) => {
    if (!await exist({key})) {
      return 0
    }
    return await client.set({key, value,ttl} )
}

export const del = async ({key} = {}) => {
    return await client.del(key)
   
}
// export const del = async ({ key = [] } = {}) => {
//     if (!key.length) return 0

//     return await client.del(...key)
// }
export const keys = async ({key} = {}) => {
    return await client.keys(`${key}*`)
   
}
export const ttl = async ({key} = {}) => {
    return await client.ttl(key)
   
}
export const expire = async ({key,ttl} = {}) => {
    return await client.expire(key,ttl)
   
}
export const incrBy = async ({key,value=1} = {}) => {
    return await client.incrBy(key,value)
   
}
