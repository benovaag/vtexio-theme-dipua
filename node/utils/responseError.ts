const HTTP_BAD_REQUEST = 400;

export default function responseMessage(
    ctx: Context,
    message: string,
    code: number = HTTP_BAD_REQUEST
) {
    ctx.status = code;
    ctx.body = { message };
}
