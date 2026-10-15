import {  ForbiddenException, NotFoundException } from "../../common/exceptions/index.js"
import * as conversationRepository from "../../common/respository/conversation.respository.js"
import * as conversationMessageRepository from "../../common/respository/conversationMessage.respository.js"




export const sendConversationMessage = async (
    { conversationId, content, attachments },
    user
) => {

    const conversation = await conversationRepository.findOne({
        filter: {
            _id: conversationId
        }
    });

    if (!conversation) {
        throw NotFoundException({
            message: "Conversation not found"
        });
    }


    const isParticipant = conversation.participants.some(
        (participantId) =>
            participantId.toString() === user._id.toString()
    );

    if (!isParticipant) {
        throw ForbiddenException({
            message: "You are not allowed to send messages in this conversation"
        });
    }

    const message = await conversationMessageRepository.create({
        data: {
            conversationId,
            senderId: user._id,
            content,
            attachments
        }
    });

    return message;
};

export const getConversationMessages = async ({conversationId},user) => {

    const conversation = await conversationRepository.findOne({
        filter: {
            _id: conversationId
        },
        options: {
            sort: { createdAt: -1 },
            select: "-senderId"
        }
    })
    if (!conversation) {
        throw NotFoundException({
            message: "Conversation not found"
        });
    }

    const isParticipant = conversation.participants.some(
        (participantId) =>
            participantId.toString() === user._id.toString()
    );

    if (!isParticipant) {
        throw ForbiddenException({
            message: "You are not allowed to access this conversation"
        });
    }
    const messages = await conversationMessageRepository.find({
        filter: {
            conversationId
        },
        options: {
            sort: {
                createdAt: -1
            }
        }
    });

    return messages;

    
}






