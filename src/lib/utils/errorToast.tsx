export interface ErrorStackResponse{
    data?: any
}

export async function ErrorToastResponse(response: ErrorStackResponse){
    let errorMessage = response.data?.message
        ? response.data.message
        : response.data.errors
            ? response.data?.errors[0]?.msg
            : "An error occured:";   
    return errorMessage
}