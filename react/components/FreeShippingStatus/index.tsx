import React, { useEffect, useState } from "react";
import { OrderForm } from "vtex.order-manager";
import styles from "./styles.css";
import { canUseDOM } from "vtex.render-runtime";
import { FormattedCurrency } from 'vtex.format-currency'

interface FreeShippingStatusProps {
    valueForFreeShipping: number;
    showFreeShippingComponent: boolean,
}

export const FreeShippingStatus = ({
    valueForFreeShipping,
    showFreeShippingComponent
}:FreeShippingStatusProps)=> {
    if (!canUseDOM) return null;
    const [isFreeShipping, setIsFreeShipping] = useState<boolean>(false);
    const { useOrderForm } = OrderForm;
    const { orderForm }: OrderFormContext = useOrderForm();

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
    const valueForFreeShippingSelected = valueForFreeShipping;

    useEffect(() => {
        if (value >= valueForFreeShippingSelected) {
            setIsFreeShipping(true);
        } else {
            setIsFreeShipping(false);
        }
    }, [value]);

    var percent = (value * 100) / valueForFreeShippingSelected;
    if(percent > 100){
        percent = 100
    }

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
    description: 'Progresso de Frete Grátis',
    type: 'object',
    properties: {
        showFreeShippingComponent: {
          title: "Mostrar componente de frete grátis",
          type: "boolean",
          default: true
        },
        valueForFreeShipping: {
          title: "Valor minimo para o cliente receber frete Gratis",
          type: "number",
          default: 25000
        }
    }
};
