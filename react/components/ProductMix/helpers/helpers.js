export const isEmptyObject = (obj) => {
	for(var i in obj) { return false; }
  	return true;
}

export const getProductHasStock = (product) => {
    if( !isEmptyObject(product) ){
        //para cada item(?) no produto
        for (let item of product?.items) {
            //para cada seller no item
            for (let seller of item?.sellers) {
                if (seller?.commertialOffer?.AvailableQuantity > 0) {
                    return item
                }
            }
        }
    }

    return;
}