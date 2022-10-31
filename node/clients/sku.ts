import { ExternalClient, InstanceOptions, IOContext } from "@vtex/api";

export default class Skus extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`http://${context.account}.vtexcommercestable.com.br`, context, {
            ...options,
        });
    }

    public async getSkuId(id: string): Promise<any> {
        return this.http.get(
            `/api/catalog_system/pvt/sku/stockkeepingunitbyid/${id}`,
            {
                headers: {
                    VtexIdclientAutCookie: this.context.authToken,
                },
                metric: "category-get",
            }
        );
    }
}
