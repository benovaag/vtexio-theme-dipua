import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./styles.css";
import { canUseDOM } from "vtex.render-runtime";

interface NotifyCookiesProps {
    diasParaCookieSumir: number;
    cookieName: string;
    text: string;
    labelText: string;
}

const NotifyCookies = ({
    diasParaCookieSumir = 365,
    cookieName = "cookiesWasAccepted",
    text = "Dipua usa cookies para personalizar a comunicação e melhorar a sua experiência no site. Ao continuar navegando, você concorda com a nossa Política de privacidade.",
    labelText = "Continuar e Fechar",
}: NotifyCookiesProps) => {
    if (!canUseDOM) return null;

    const [cookiesIsOpened, setCookiesIsOpened] = useState(false);
    const handleAcceptCookies = () => {
        Cookies.set(cookieName, "true", { expires: diasParaCookieSumir });
        setCookiesIsOpened(false);
    };

    useEffect(() => {
        const cookiesWasAccepted = Cookies.get(cookieName);

        if (!cookiesWasAccepted) {
            setCookiesIsOpened(true);
        }
    }, []);

    if (!cookiesIsOpened) return <div></div>;

    return (
        <div className={`${styles["notify-cookies__modal"]}`}>
            <div
                className={`${styles["notify-cookies"]} ${
                    cookiesIsOpened && styles["opened"]
                }`}
            >
                <div className={styles["notify-cookies-wrapper"]}>
                    <p className={styles["notify-cookies-text"]}>{text}</p>
                    <button
                        onClick={handleAcceptCookies}
                        className={styles["notify-cookies-button"]}
                    >
                        {labelText}
                    </button>
                </div>
            </div>
        </div>
    );
};
NotifyCookies.schema = {
    title: "Popup Cookies",
};

export { NotifyCookies };
