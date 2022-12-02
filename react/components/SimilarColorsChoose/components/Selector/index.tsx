import { SelectorProps } from "../../types/SelectorProps";
import React from "react";
import styles from "./styles.css";

import { Link } from 'vtex.render-runtime'

export function Selector ({
    link,
    color,
    imageUrl,
    title,
    highlight,
    setHighlight,
    primary,
    ballSize

}: SelectorProps) {

    if (!(link && color && imageUrl && title)) return null;

    const a = (primary) ? true : false;

    function handleMouseLeave() {
        setHighlight(true);
    }

    function handleMouseEnter() {
        setHighlight(a);
    }

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = link as string;
    }

    return (
        <div

            className={`${styles.similarColorsChoose__selectorContainer}`}
        >
            <Link
                page="store.product"
                to={link}
                className={`
                    ${styles.similarColorsChoose__selector}
                    ${styles[`similarColorsChoose__selector--${color}`]}
                    ${highlight ? styles.similarColorsChoose__selectorActive : ``}
                `}
                onClick={handleClick}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                style={{
                    height: ballSize,
                    width: ballSize
                }}
            >
            </Link>
        </div>
    );
}
