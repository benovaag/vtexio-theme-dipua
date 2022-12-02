import { SelectorProps } from "../../types/SelectorProps";
import React from "react";
import styles from "./styles.css";

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
            <a
                href={link}
                className={`
                    ${styles.similarColorsChoose__selector}
                    ${styles[`similarColorsChoose__selector--${color}`]}
                    ${highlight && styles.similarColorsChoose__selectorActive}
                `}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
                onClick={handleClick}
                style={{
                    height: ballSize,
                    width: ballSize
                }}
            />
        </div>
    );
}
