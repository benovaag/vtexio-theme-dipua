import React, { useState } from 'react'
import styles from "../ImageMapper.css"

import { FormattedCurrency } from 'vtex.format-currency'
import { useOrderItems } from "vtex.order-items/OrderItems"
import { Spinner } from 'vtex.styleguide'
import { usePixel } from 'vtex.pixel-manager'

import { isEmptyObject, getProductHasStock } from "../helpers/helpers"

const ImageMapperFooter = ({
    schemaTextDiscount,
    schemaDiscountPercent,
    schemaDiscountPercentActive,
    listProducts
}) => {
    const [showLoading, setShowLoading] = useState(false)
    const { addItems } = useOrderItems()
    const { push } = usePixel()

    var allProducts = []
    var totalListPrice = 0
    var totalSpotPrice = 0
    var productListPrice = 0
    var productSpotPrice = 0

    if(!isEmptyObject(listProducts)){
        listProducts?.map((item) => {
            let productItem = getProductHasStock(item)

            //Preços
            productListPrice = productItem?.sellers[0]?.commertialOffer?.ListPrice || 0
            totalListPrice = totalListPrice + productListPrice

            productSpotPrice = productItem?.sellers[0]?.commertialOffer?.spotPrice || 0
            totalSpotPrice = totalSpotPrice + productSpotPrice

            //Id do SKU
            let productItemId = productItem?.itemId
            allProducts.push(productItemId)
        })
    }

    /* Add to Cart */
    const handleAddToCart = () => {
        var items = []
        allProducts?.map((itemId) => {
            let item = {
                id: itemId,
                seller: 1,
                quantity: 1
            }
            items.push(item)
        })

        setShowLoading(true)
        addItems(items)

        setTimeout(() => {
            setShowLoading(false)
            push({
                event: "cart",
                id: "add-to-cart-button"
            })
        }, 1500)
    }

    let totalSpotPriceWithDiscount = totalSpotPrice
    if(schemaDiscountPercentActive){
        totalSpotPriceWithDiscount = totalSpotPrice - (totalSpotPrice * (Number(schemaDiscountPercent)/100))
    }

    return (
        <div className={styles.imageMapperFooter}>

            <div className={styles.imageMapperAllProducts}>
                <p className={styles.imageMapperAllProductsText}>{schemaTextDiscount}</p>

                <p className={styles.imageMapperAllProductsText}>
                    { schemaDiscountPercentActive &&
                        <>
                            <span className={styles.imageMapperDiscountPercent}>{schemaDiscountPercent}% off</span> nos produtos, de <span className={styles.imageMapperDiscountFullPrice}><FormattedCurrency value= {totalSpotPrice} /></span> por
                        </>
                    }
                    <span className={styles.imageMapperDiscountPrice}> <FormattedCurrency value={totalSpotPriceWithDiscount} /></span></p>
            </div>

            <div className={`${styles.imageMapperAllProductsBuy} ${(showLoading) ? styles.imageMapperButtonLoading : ``}`} onClick={handleAddToCart}>
                { (showLoading) ?
                    <Spinner color="currentColor" size={22} />
                    : "Comprar o Mix"
                }
            </div>
        </div>
    )
}

export default ImageMapperFooter