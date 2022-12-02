declare namespace SimilarProductsData {

    export interface Image {
        imageUrl: string;
        imageLabel: string;
        __typename: string;
    }

    export interface Item {
        images: Image[];
        __typename: string;
    }

    export interface Similar {
        link: string;
        linkText: string;
        productId: string;
        titleTag: string;
        items: Item[];
        __typename: string;
    }

    export interface Recommendations {
        similars: Similar[];
        __typename: string;
    }

    export interface Product {
        recommendations: Recommendations;
        __typename: string;
    }

    export interface Props {
        product: Product;
    }

}

