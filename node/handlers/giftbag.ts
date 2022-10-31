// import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GiftBag(ctx: Context, next: () => Promise<any>) {
    const { id } = ctx.vtex.route.params;

    console.log(id);

    ctx.status = 200;
    ctx.body = {
        data: await ctx.clients.skus.getSkuId(id as string),
    };

    await next();
}
