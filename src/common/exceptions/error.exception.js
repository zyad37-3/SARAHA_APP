export const ApplicationException = (
    {message = 'Error',
    status = 400,
    extra = undefined,}
) => {
    
    throw new Error(message, { cause: { status, extra } })
}

export const ErrorResponse = ({ message = "Error", status = 400, extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}
export const ConflictException = ({ message = "Conflict", extra = undefined } = {}) => {
    return ApplicationException({ message, status: 409, extra })
}

export const BadRequestException = ({ message = "BadRequest", extra = undefined } = {}) => {
    return ApplicationException({ message, status: 400, extra })
}

export const UnauthorizedException = ({ message = "Unauthorized", extra = undefined } = {}) => {
    return ApplicationException({ message, status: 401, extra })
}

export const NotFoundException = ({ message = "NotFound", extra = undefined } = {}) => {
    
    return ApplicationException({ message, status: 404, extra })
}
export const ToManyRequestException = ({ message = "To Many Request Exception", extra = undefined } = {}) => {
    
    return ApplicationException({ message, status: 429, extra })
}
// export const BadReqestException = ({ message = "Bad Reqest Exception", extra = undefined } = {}) => {
    
//     return ApplicationException({ message, status: 400, extra })
// }


export const ForbiddenException = ({ message = "Forbidden", extra = undefined } = {}) => {
    return ApplicationException({ message, status: 403, extra })
}
