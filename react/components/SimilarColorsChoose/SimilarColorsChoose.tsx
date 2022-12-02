/**
 * Esse componete é responsave por criar um "seletor" personalizado
 * com base no produto similar do produto atual.
 * Mostrando a cor do produto em cada seletor.
 * Tambem possibilita visualizar o outro produto fazendo o hover sobre o seletor.
 *
 */

import PRODUCT_SIMILARS from "./queries/productSimilars.gql";

import React, { useEffect, useRef, useState } from "react";
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
    const $div = useRef<HTMLDivElement>(null);
    const productContextValue = useProduct();

    useEffect(() => {
        if (!$div) return;

        const $artigle = $div.current?.parentElement as HTMLElement;
        const $a = $artigle?.parentElement as HTMLAnchorElement;
        const $img = $a?.querySelector("img") as HTMLImageElement;
        const $title = $a?.querySelector("h1 span") as HTMLImageElement;
        if ($artigle?.tagName !== "ARTICLE") return;
        if ($a?.tagName !== "A") return;
        if ($img?.tagName !== "IMG") return;
        if ($title?.tagName !== "SPAN") return;

        $img.src =
            (showPrimaryProduct
                ? primaryProduct.imageUrl
                : similarProduct.imageUrl) ?? "";
    }, [showPrimaryProduct]);

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
            ref={$div}
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
                primary
                ballSize={ballSize}
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
