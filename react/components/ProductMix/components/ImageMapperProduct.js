import React, { useState } from "react";
import styles from "../ImageMapper.css";
import { FormattedCurrency } from "vtex.format-currency";
import { Spinner } from "vtex.styleguide";
import { useDevice } from "vtex.device-detector";
import { useOrderItems } from "vtex.order-items/OrderItems";
import { usePixel } from "vtex.pixel-manager";

import { getProductHasStock } from "../helpers/helpers";

const ImageMapperProduct = ({
  product,
  isTooltip,
  styleCoords,
  offsetHeight,
  offsetWidth,
  bulletHeight,
  bulletWidth,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { addItems } = useOrderItems();
  const { isMobile } = useDevice();
  const { push } = usePixel();

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleClose = () => {
    const boxes = Array.from(
      document.getElementsByClassName(styles.imageMapperAreaItem)
    );
    boxes?.forEach((box) => {
      box?.classList.remove(styles.imageMapperAreaItemActive);
      box?.parentNode.classList.remove(styles.imageMapperAreaItemOpen);
    });
  };

  const handleAddToCart = (e, itemId) => {
    const items = [
      {
        id: itemId,
        seller: 1,
        quantity: 1,
      },
    ];

    setShowLoading(true);
    addItems(items);

    setTimeout(() => {
      setShowLoading(false);
      push({
        event: "cart",
        id: "add-to-cart-button",
      });
    }, 1500);
  };

  let productItem = getProductHasStock(product);

  //Nome do produto
  let productName = product?.productName || "...";

  //Link do produto
  let productLink = product?.link;
  if (productLink?.includes("portal.vtex")) {
    productLink = productLink?.replace(
      "https://portal.vtexcommercestable.com.br",
      ""
    );
  }

  //Id do produto
  let productId = product?.productId;

  //Preços
  let productListPrice =
    productItem?.sellers[0]?.commertialOffer?.ListPrice || 0;
  let productSpotPrice =
    productItem?.sellers[0]?.commertialOffer?.spotPrice || 0;

  //Id do SKU
  let productItemId = productItem?.itemId;

  //Imagem do produto

  let productImage = productItem?.images[0];
  let productImageText = productImage?.imageText;
  let productImageWidth = 360;
  let productImageHeight = "auto";
  let productImageId = productImage?.imageId;
  let productImageUrl = `/arquivos/ids/${productImageId}-${productImageWidth}-${productImageHeight}?width=${productImageWidth}&height=${productImageHeight}&aspect=true`;

  if (productImageId == undefined) {
    productImageUrl = "";
  }

  var stylePosition = {};
  var isLeftPosition = false;
  var isRightPosition = false;
  var isBottomPosition = false;

  if (isTooltip) {
    let widthScreen = offsetWidth;
    let widthScreenSplit2 = widthScreen / 2;
    let widthScreenSplit4 = widthScreen / 4;
    let widthScreenSplit6 = widthScreen / 6;
    let posLeft = styleCoords?.left;

    let widthScreenSplitOffset = widthScreenSplit4;
    if (widthScreen < 360) {
      widthScreenSplitOffset = widthScreenSplit6;
    }

    if (posLeft > widthScreenSplit2) {
      if (posLeft < widthScreenSplit2 + widthScreenSplitOffset) {
        stylePosition = {
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
        };
      } else {
        isRightPosition = true;

        stylePosition = {
          left: "auto",
          right: 5,
        };
      }
    } else {
      if (posLeft > widthScreenSplit2 - widthScreenSplitOffset) {
        stylePosition = {
          left: "50%",
          right: "auto",
          transform: "translateX(-50%)",
        };
      } else {
        isLeftPosition = true;

        stylePosition = {
          left: 5,
          right: "auto",
        };
      }
    }

    /* Altura */
    let heightScreen = offsetHeight;
    let heightScreenSplit2 = heightScreen / 2;
    let posTop = styleCoords?.top;

    if (posTop > heightScreenSplit2) {
      let newBottom = bulletHeight + 10;
      isBottomPosition = true;

      stylePosition = {
        ...stylePosition,
        top: "auto",
        bottom: newBottom,
      };
    }
  }

  return (
    <div
      className={`${
        productImageId == undefined ? styles.imageMapperProductLoading : ``
      } ${styles.imageMapperProduct} ${
        isLeftPosition ? styles.imageMapperProductLeft : ``
      } ${isRightPosition ? styles.imageMapperProductRight : ``} ${
        isBottomPosition ? styles.imageMapperProductBottom : ``
      }`}
      data-id={productId}
      style={stylePosition}
    >
      {isMobile && isTooltip && (
        <div
          className={styles.imageMapperProductClose}
          onClick={handleClose}
        ></div>
      )}

      <div className={styles.imageMapperProductImage}>
        <img
          src={productImageUrl}
          alt={productImageText}
          width={productImageWidth}
          height={productImageHeight}
          loading="lazy"
          className={styles.imageMapperProductImg}
        />
      </div>

      <div className={styles.imageMapperProductContent}>
        <div className={styles.imageMapperProductInfo}>
          <div className={styles.imageMapperProductName}>{productName}</div>
          <div className={styles.imageMapperProductPrice}>
            {productListPrice >= productSpotPrice && (
              <del className={styles.imageMapperProductOldPrice}>
                {productListPrice && (
                  <FormattedCurrency value={productListPrice} />
                )}
              </del>
            )}

            <span className={styles.imageMapperProductSpotPrice}>
              <FormattedCurrency value={productSpotPrice} />
            </span>
          </div>

          <div
            className={`${styles.imageMapperProductBuy} ${
              showLoading ? styles.imageMapperButtonLoading : ``
            }`}
            onClick={(e) => handleAddToCart(e, productItemId)}
          >
            {showLoading ? (
              <Spinner color="currentColor" size={15} />
            ) : (
              "Adicionar à sacola"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMapperProduct;
