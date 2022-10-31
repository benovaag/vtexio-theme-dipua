const HTTP_SUCCESS_REQUEST = 200;

export default function responseMessage(
    ctx: Context,
    message: string,
    code: number = HTTP_SUCCESS_REQUEST
) {
    ctx.status = code;
    ctx.body = { message };
}
