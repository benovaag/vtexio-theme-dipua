/**
 * Esse componete é responsave por criar um "seletor" personalizado
 * com base no produto similar do produto atual.
 * Mostrando a cor do produto em cada seletor.
 * Tambem possibilita visualizar o outro produto fazendo o hover sobre o seletor.
 *
 */

import PRODUCT_SIMILARS from "./queries/productSimilars.gql";

import React, { useState } from "react";
import { useQuery } from "react-apollo";
import { useProduct } from "vtex.product-context";
import { SimilarProducts } from "./utils/SimilarProducts";
import { CurrentProduct } from "./utils/CurrentProduct";
import { Selector } from "./components/Selector";
import { canUseDOM } from "vtex.render-runtime";

import styles from "./SimilarColorsChoose.css";

interface SimilarColorsChooseProps {
    justifyContent: string;
    margin: string;
    ballSize: string;
}

export const SimilarColorsChoose: any = ({
    justifyContent,
    margin,
    ballSize,
}: SimilarColorsChooseProps) => {
    const [showPrimaryProduct, setShowPrimaryProduct] = useState<boolean>(true);
    const productContextValue = useProduct();

    if (!productContextValue || !canUseDOM) return <></>;

    const itemId: string | undefined = productContextValue.product?.productId;
    const { loading, error, data } = useQuery(PRODUCT_SIMILARS, {
        variables: { productId: itemId },
    });

    if (loading) return <></>;
    if (error) return <></>;

    const productSimilarContext = data as SimilarProductsData.Props;
    const primaryProduct = new CurrentProduct(productContextValue);
    const similarProduct = new SimilarProducts(productSimilarContext);

    return (
        <div
            className={styles.similarColorsChoose__container}
            style={{
                justifyContent: justifyContent,
                margin: margin,
            }}
        >
            <Selector
                link={primaryProduct.link}
                color={primaryProduct.color}
                title={primaryProduct.title}
                imageUrl={primaryProduct.imageUrl}
                highlight={showPrimaryProduct}
                setHighlight={setShowPrimaryProduct}
                ballSize={ballSize}

                primary
            />
            <Selector
                link={similarProduct.link}
                color={similarProduct.color}
                title={similarProduct.title}
                imageUrl={similarProduct.imageUrl}
                highlight={!showPrimaryProduct}
                setHighlight={setShowPrimaryProduct}
                ballSize={ballSize}
            />
        </div>
    );
};
