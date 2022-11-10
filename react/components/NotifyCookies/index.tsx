import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./styles.css";
import { canUseDOM } from "vtex.render-runtime";

interface NotifyCookiesProps {

}

const NotifyCookies = ({
}: NotifyCookiesProps) => {
    if (!canUseDOM) return null;

    const [cookiesIsOpened, setCookiesIsOpened] = useState(false);
    const handleAcceptCookies = () => {
        Cookies.set("cookiesWasAccepted", "true", { expires: 365 });
        setCookiesIsOpened(false);
    };

    useEffect(() => {
        const cookiesWasAccepted = Cookies.get("cookiesWasAccepted");

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
                    <p className={styles["notify-cookies-text"]}>Dipua usa cookies para personalizar a comunicação e melhorar a sua experiência no site. Ao continuar navegando, você concorda com a nossa Política de privacidade.</p>
                    <button
                        onClick={handleAcceptCookies}
                        className={styles["notify-cookies-button"]}
                    >
                        Continuar e Fechar
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
