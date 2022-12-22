import React, { useState, useEffect, useRef } from 'react'
import styles from "../ImageMapper.css";
import { useDevice } from 'vtex.device-detector'
import ImageMapperProduct from "./ImageMapperProduct"

const ImageMapperArea = ({
    schemaProducts,
    schemaImage,
    listProducts
}) => {

    if( (schemaImage == "") || (schemaImage == undefined ) ){
        schemaImage = "/arquivos/mix-default.jpg"
    }

    const myRef = useRef(null)
    const { isMobile } = useDevice()

    //Posições
    const imageMapPosition = schemaProducts

    const [offsetWidth, setOffsetWidth] = useState(1);
    const [offsetHeight, setOffsetHeight] = useState(1);

    const [naturalWidth, setNaturalWidth] = useState(1);
    const [naturalHeight, setNaturalHeight] = useState(1);

    const [showLoading, setShowLoading] = useState(false);

    const onImgLoad = ({ target: img }) => {
        const { naturalWidth, naturalHeight, offsetHeight, offsetWidth } = img

        setOffsetWidth(offsetWidth)
        setOffsetHeight(offsetHeight)

        setNaturalWidth(naturalWidth)
        setNaturalHeight(naturalHeight)
    }

    const handleImageMapperAreaSeeInfo = () => {
        document.getElementsByClassName(styles.imageMapperArea)[0].classList.toggle(styles.imageMapperAreaSeeMore);
    }

    useEffect(() => {
        // Width
        let _offsetWidth = myRef?.current?.clientWidth || 1

        // Height
        let _offsetHeight = myRef?.current?.clientHeight || 1

        // Narutal Width
        let _naturalWidth = myRef?.current?.naturalWidth || 1

        // Narutal Height
        let _naturalHeight = myRef?.current?.naturalHeight || 1

        setOffsetWidth(_offsetWidth)
        setOffsetHeight(_offsetHeight)

        setNaturalWidth(_naturalWidth)
        setNaturalHeight(_naturalHeight)

        console.log("loading")

        setShowLoading(true);
    })

    const ImageMapperTooltip = ({
        infoProduct,
        infoItem
    }) => {

        if( (infoItem?.coordY == "") && (infoItem?.coordX == "") ){
            return <></>
        }

        // let bulletWidth = (46*offsetWidth)/naturalWidth || 1
        // let bulletHeight = (46*offsetHeight)/naturalHeight || 1

        // if(bulletWidth < 30){ bulletWidth = 30 }
        // if(bulletHeight < 30){ bulletHeight = 30 }

        // if(bulletWidth > 46){ bulletWidth = 46 }
        // if(bulletHeight > 46){ bulletHeight = 46 }


        let bulletWidth = 32
        let bulletHeight = 32

        if(isMobile){
            bulletWidth = 36
            bulletHeight = 36
        }

        //Calculando as Coordenadas

        let itemCoordTop = infoItem?.coordY || 1
        let itemCoordLeft = infoItem?.coordX || 1

        let coordTop = (itemCoordTop*offsetHeight/naturalHeight) - bulletHeight
        let coordLeft = (itemCoordLeft*offsetWidth/naturalWidth) - bulletWidth

        if(coordTop < 0){
            coordTop = 0
        }

        if(coordLeft < 0){
            coordLeft = 0
        }

        //Setando as Coordenadas
        var styleCoords = {
            top: coordTop,
            left: coordLeft
        }

        var styleCoordsDimension = {
            width: bulletWidth,
            height: bulletHeight
        }

        const handleClose = event => {
            if(event.currentTarget.classList.contains(styles.imageMapperAreaItemActive)){
                event.currentTarget.classList.remove(styles.imageMapperAreaItemActive)
                event.currentTarget.parentNode.classList.remove(styles.imageMapperAreaItemOpen)
            }else{
                const boxes = Array.from(document.getElementsByClassName(styles.imageMapperAreaItem))
                boxes?.forEach(box => {
                    box?.classList.remove(styles.imageMapperAreaItemActive)
                    box?.parentNode.classList.remove(styles.imageMapperAreaItemOpen)
                })

                event.currentTarget.classList.add(styles.imageMapperAreaItemActive)
                event.currentTarget.parentNode.classList.add(styles.imageMapperAreaItemOpen)
            }
        }

        const handleMouseEnter = event => {
            event.currentTarget.classList.add(styles.imageMapperAreaItemOpen)

            var currentDataId = event.currentTarget.getAttribute("data-id")
            var targetElement = Array.from(document.getElementsByClassName(styles.imageMapperProduct))
            targetElement?.forEach(target => {
                let targetAttribute = target.getAttribute("data-id")
                if(targetAttribute == currentDataId){
                    target?.classList.add(styles.imageMapperProductHover)
                }
            })
        }

        const handleMouseLeave = event => {
            const boxes = Array.from(document.getElementsByClassName(styles.imageMapperAreaItemContainer))
            boxes?.forEach(box => {
                box?.classList.remove(styles.imageMapperAreaItemOpen)
            })

            var targetElement = Array.from(document.getElementsByClassName(styles.imageMapperProduct))
            targetElement?.forEach(target => {
                target?.classList.remove(styles.imageMapperProductHover)
            })
        }

        console.log("styleCoords", styleCoords)

        if(!showLoading){
            return <></>
        }

        if(isMobile){
            return (
                <div className={styles.imageMapperAreaItemContainer} style={styleCoords} data-id={infoItem?.productId}>
                    <div className={styles.imageMapperAreaItem} onClick={handleClose} style={styleCoordsDimension}></div>

                    <ImageMapperProduct
                        product={infoProduct}
                        isTooltip={true}
                        styleCoords={styleCoords}
                        offsetHeight={offsetHeight}
                        offsetWidth={offsetWidth}
                        bulletHeight={bulletHeight}
                        bulletWidth={bulletWidth}
                    />
                </div>
            )
        }else{
            return (
                <div className={styles.imageMapperAreaItemContainer} style={styleCoords} data-id={infoItem?.productId} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div className={styles.imageMapperAreaItem} style={styleCoordsDimension}></div>

                    <ImageMapperProduct
                        product={infoProduct}
                        isTooltip={true}
                        styleCoords={styleCoords}
                        offsetHeight={offsetHeight}
                        offsetWidth={offsetWidth}
                        bulletHeight={bulletHeight}
                        bulletWidth={bulletWidth}
                    />
                </div>
            )
        }
    }

    return (
        <div className={styles.imageMapperArea}>
            <div className={styles.imageMapperAreaSeeInfo} onClick={handleImageMapperAreaSeeInfo}>
                <div className={styles.imageMapperAreaSeeInfoIcon}></div>
                <div className={styles.imageMapperAreaSeeInfoText}>
                    <span className={styles.imageMapperAreaSeeInfoTextPrefixSee}>mostrar </span>
                    <span className={styles.imageMapperAreaSeeInfoTextPrefixHide}>ocultar </span>
                    mix
                </div>
            </div>
            <img
                onLoad={onImgLoad}
                src={schemaImage}
                ref={myRef}
                className={styles.imageMapperAreaImg}
            />

            {imageMapPosition?.map((infoItem, index) => {
                let infoProduct = listProducts?.filter((product) => {
                    return product?.productId == infoItem?.productId
                }) ?? []

                if(infoProduct?.length > 0){
                    let _infoProduct = infoProduct[0]
                    return (
                        <ImageMapperTooltip
                            infoProduct={_infoProduct}
                            infoItem={infoItem}
                            key={index}
                        />
                    )
                }
            })}
        </div>
    )
}

export default ImageMapperArea