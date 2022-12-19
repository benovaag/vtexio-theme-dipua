import React from 'react'
import styles from "../ImageMapper.css";

const ImageMapperHeader = ({
    schemaTitle
}) => {
    return (
        <div className={styles.imageMapperHeader}>
            <div className={styles.imageMapperHeaderGoBack}>voltar para os mix</div>
            <h3 className={styles.imageMapperHeaderTitle}>{schemaTitle}</h3>
        </div>
    )
}

export default ImageMapperHeader