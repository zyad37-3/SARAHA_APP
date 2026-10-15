import { ConflictException, ForbiddenException, NotFoundException } from "../../common/exceptions/index.js"
import * as messageRepository from "../../common/respository/message.respository.js"
import * as identityRepository from "../../common/respository/identityRequest.respository.js"
import * as conversationRepository from "../../common/respository/conversation.respository.js"
import * as ConversationMessageRepository from "../../common/respository/conversationMessage.respository.js"
import { IdentityRequestStatusEnum } from "../../common/enum/message.enum.js"

export const createIdentityRequest = async ({ messageId }, user) => {

    const checkMessageIdExist = await messageRepository.findById({
        id: messageId
    })


    if (!checkMessageIdExist) {
        throw NotFoundException({ message: "Message not found" })
    }
    if (checkMessageIdExist.receiverId.toString() !== user._id.toString()) {
        throw ConflictException({ message: "Message not found" })
    }

    const checkIdentityExist = await identityRepository.findOne({
        filter: {
            messageId,
            requesterId: user._id
        }
    });
    if (checkIdentityExist) {
        throw ForbiddenException({ message: "Identity request already exists" })
    }
    const createIdentity = await identityRepository.create({
        data: {
            messageId,
            requesterId: user._id,
            senderId: checkMessageIdExist.senderId,

        }
    })
    return createIdentity
}

export const getIdentityRequest = async (user) => {

    const getIdentity = await identityRepository.find({
        filter: {
            senderId: user._id
        },
        options: {
            sort: { createdAt: -1 },
            select: "-senderId"
        }
    })




    return getIdentity
}
export const getIdentityRequestAccept = async ({ IdentityId }, { status }, user) => {

    const getIdentity = await identityRepository.findOne({
        filter: {
            _id: IdentityId,
            senderId: user._id
        }
    })
   

    if (!getIdentity) {
        throw NotFoundException({ message: "Message not found" })
    }
    if (getIdentity.status !== IdentityRequestStatusEnum.PENDING) {
        throw ForbiddenException({ message: `The request is already ${getIdentity.status}` })
    }
    const updateIdentity = await identityRepository.updateOne({
        filter: {
            _id: IdentityId,
            senderId: user._id,
            status: IdentityRequestStatusEnum.PENDING
        },
        update: {
            status: status
        }
    })
    if (!updateIdentity.matchedCount) {
        throw ForbiddenException({ message: "Failed to change request status" })
    }
    if (status == IdentityRequestStatusEnum.ACCEPTED) {
        const conversation = await conversationRepository.create({
            data: {
                messageId: getIdentity.messageId,
                participants: [
                    getIdentity.senderId,
                    getIdentity.requesterId
                ],
                identityRequestId: getIdentity._id
            }
        })

    }
    return updateIdentity
}







