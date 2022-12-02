import { getTitleColor } from "./getTitleColor";

export class SimilarProducts {
    public title: string | undefined;
    public link: string | undefined;
    public imageUrl: string | undefined;
    public color: string | undefined;

    constructor (data:SimilarProductsData.Props) {
        this.link = this.linkFormatted(data?.product?.recommendations?.similars[0]?.link);
        this.title = this.formatTitle(data?.product?.recommendations?.similars[0]?.titleTag);
        this.imageUrl = data?.product?.recommendations?.similars[0]?.items[0]?.images[0]?.imageUrl;
        this.color = getTitleColor(this.title);
    }

    private formatTitle (title: string | undefined): string | undefined{
        if (title == undefined) return undefined;

        const titleFormatted = title.replace(" | DIPUA", "");
        return titleFormatted;
    }

    private linkFormatted (link: string | undefined): string | undefined {
        if (link == undefined) return undefined;
        const linkFormatted = link.replace("https://portal.vtexcommercestable.com.br", "");
        return linkFormatted;
    }
}
