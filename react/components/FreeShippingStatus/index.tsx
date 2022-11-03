import React, { useEffect, useState } from "react";
import { OrderForm } from "vtex.order-manager";
// import { clamp } from "../ModalZoomImagemProduto/utils/clamp";
import styles from "./styles.css";
import { canUseDOM } from "vtex.render-runtime";
import { FormattedCurrency } from 'vtex.format-currency'

interface Props {
    valueForFreeShipping: number,
    region: string,
}

interface FreeShippingStatusProps {
    regionsAndValueToFreeShipping: Props[],
    valueForFreeShipping: number;
    hideForUnlistedRegions: boolean,
    showFreeShippingComponent: boolean,
}

export const FreeShippingStatus = ({
    valueForFreeShipping,
    hideForUnlistedRegions,
    regionsAndValueToFreeShipping,
    showFreeShippingComponent
}:FreeShippingStatusProps)=> {
    if (!canUseDOM) return null;

    // const [distanceLeftTruck, setDistanceLeftTruck] = useState<number>(0);
    const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);
    const { useOrderForm } = OrderForm;
    const { orderForm }: OrderFormContext = useOrderForm();
    const  state  = orderForm?.shipping?.selectedAddress?.state;

    if (orderForm.totalizers.length > 0) {
        let value = 0;
        orderForm.totalizers.forEach( totalizer => {
            if(totalizer.id !== "Shipping"){
                value += totalizer.value;
            }
        });
        orderForm.value = value;
    }

    const { value } = orderForm;

    hideForUnlistedRegions;

    const exiteFreteEspecificoParaEssaRegiao = regionsAndValueToFreeShipping?.find(({region}) => region === state) ?? false;

    const valueForFreeShippingSelected = (exiteFreteEspecificoParaEssaRegiao)
            ? exiteFreteEspecificoParaEssaRegiao.valueForFreeShipping
            : valueForFreeShipping;

    useEffect(() => {
        if (value >= valueForFreeShippingSelected) {
            setIsFreeShipping(true);
        } else {
            setIsFreeShipping(false);
        }
    }, [value]);

    const percent = (value * 100) / valueForFreeShippingSelected;

    const dinheiroFaltaParaFreteGratis = valueForFreeShippingSelected - value;
    const dinheiroFaltaParaFreteGratisFormatted = dinheiroFaltaParaFreteGratis/100;

    return (
        <>
            {
                showFreeShippingComponent &&
                <div
                    className={styles.freeShippingStatus__container}
                >
                    {isFreeShipping && (
                        <strong className={styles.freeShippingStatus__gratters}>
                            Parabéns!!!
                        </strong>
                    )}
                    <img
                        src="/arquivos/icon__truck-minicart.svg"
                        alt="icone de um caminhão"
                        className={styles.freeShippingStatus__icon}
                        style={{
                            left: `${percent}%`
                        }}
                    />
                    <progress
                        className={styles.freeShippingStatus__progressBar}
                        max={valueForFreeShippingSelected}
                        value={value}
                    />
                    {(isFreeShipping) ? (
                        <p
                            className={styles.freeShippingStatus__text}
                            style={{maxWidth: "121px"}}
                        >
                            Você ganhou <span className={styles["freeShippingStatus__text--freeShipping"]}> frete grátis </span>
                        </p>
                    ) : (
                        <p className={styles.freeShippingStatus__text}>
                            Com mais <span className={styles["freeShippingStatus__text--value"]}>
                            <FormattedCurrency value={dinheiroFaltaParaFreteGratisFormatted} />
                            </span> você ganha <span className={styles["freeShippingStatus__text--freeShipping"]}> frete grátis </span>
                        </p>
                    )}
                </div>
            }
        </>
    );
};

FreeShippingStatus.schema = {
    title: "Progresso de Frete Grátis",
};
