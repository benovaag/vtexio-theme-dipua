import React from 'react'
import styles from "../ImageMapper.css";
import { Link } from 'vtex.render-runtime'

const ImageMapperHeader = ({
    schemaTitle
}) => {
    let link = "/compre-o-mix"
    return (
        <div className={styles.imageMapperHeader}>
            <Link page="store.custom" to={link} className={styles.imageMapperHeaderGoBack}>voltar para os mix</Link>
            <h3 className={styles.imageMapperHeaderTitle}>{schemaTitle}</h3>
        </div>
    )
}

export default ImageMapperHeader