import { NotFoundException } from "../../common/exceptions/index.js"
import { create, findOne, deleteOne, pagination } from "../../common/respository/message.respository.js"
import { findById } from './../../common/respository/user.respository.js';

export const createMessage = async ({ content, receiverId } = {}, files = [],user) => {

    const checkReceiverIdExest = await findById({

        id: receiverId
    })

    
    if (!checkReceiverIdExest) {
        NotFoundException({ message: "Invalid receiver Id" })
    }
    const message = await create({
        
        data: {
            content,
            receiverId,
            attachments: files.map(file => file.path),
            senderId:user.id
        }

    })
 
    return message
}

export const getAllMessage = async ({ type, search, page, limit } = {}, user) => {
    let filter = {}
    if (type == "0") {
        filter = { receiverId: user._id }
    } else if (type == "1") {
        filter = { senderId: user._id }
    } else {
        filter = {
            $or: [
                { sederId: user._id },
                { receiverId: user._id }

            ]
        }
    }
    if (search) {
        filter.content = {
            $regex: search.trim(),
            $options: "i"
        }
    }

    const data = await pagination({
        
        options: {
            sort: { createdAt: -1 }
        },
        filter,
        page,
        limit
    })
    if (!data) {
        NotFoundException({ message: "user not found" })
    }


    return data
}
export const deletedMessage = async ({ messageId } = {}, user) => {
    const data = await deleteOne({
        
        filter: { receiverId: user._id, _id: messageId }
    })
    if (!data.deletedCount) {
        throw NotFoundException({ message: "Invalid message" })
    }

    return data
}
export const getMessage = async ({ messageId }, user) => {
    

    const data = await findOne({
        
        filter: { receiverId: user._id, _id: messageId }
    })
    if (!data) {
        throw NotFoundException({ message: "Invalid message id" })
    }

    return data
}

