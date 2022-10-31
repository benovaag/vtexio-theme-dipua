import { json } from "co-body";

import responseError from "../utils/responseError";

export async function validateBody(ctx: Context, next: () => Promise<any>) {
    const { req } = ctx;

    const body = await json(req);

    if (!body) {
        responseError(ctx, "body is required");
    }

    if (!body.clientData) {
        responseError(ctx, "clientData property is required");

        return;
    }

    if (!body.addressData) {
        responseError(ctx, "addressData property is required");

        return;
    }

    await next();
}
