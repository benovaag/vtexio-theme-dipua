import { ProductTypes } from "vtex.product-context";
import { getTitleColor } from "./getTitleColor";

export class CurrentProduct {
    public title: string | undefined;
    public link: string | undefined;
    public imageUrl: string | undefined;
    public color: string | undefined;

    constructor (productContextValue: Partial<ProductTypes.ProductContextState>) {
        this.title = productContextValue?.product?.productName;
        this.link = this.linkFormatted(productContextValue?.product?.link);
        this.imageUrl = productContextValue?.product?.items[0]?.images[0]?.imageUrl;
        this.color = getTitleColor(this.title);
    }

    private linkFormatted (link: string | undefined): string | undefined {
        if (link == undefined) return undefined;
        const linkFormatted = link.replace("https://portal.vtexcommercestable.com.br", "");
        return linkFormatted;
    }
}
