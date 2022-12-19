import React, { useState, useEffect } from 'react'
import { useProduct } from 'vtex.product-context'
import { Modal, ModalTrigger, ModalHeader, ModalContent } from 'vtex.modal-layout'
import { Image } from 'vtex.store-components'
import styles from './styles.css'

function ProductMeasurementChart({}){
  const productContext = useProduct()
  const [loading, setLoading] = useState<boolean>(false)
  const categoryTree = productContext?.product?.categoryTree
  const showTable = categoryTree?.some((item:any) => (item?.id == 3) || (item?.id == 8))

  let dptoName = ""

  useEffect(() => {
    if(showTable){
      setLoading(true)
    }
  }, [productContext])

  return <>{loading ? (
    <div className={styles.productMeasurementChart}>
      <div className={styles.productMeasurementChartModal}>
        <ModalTrigger trigger='click'>
            <div className={styles.productMeasurementChartTitle}>Tabela de Medidas</div>
            <Modal disableEscapeKeyDown backdrop="clickable">
                <div className={styles.productMeasurementChartContent}>
                  <ModalContent>
                  <ModalHeader></ModalHeader>
                    <Image
                      alt={dptoName}
                      title={dptoName}
                      src={`/arquivos/tabela-de-medidas-aneis.jpg`}
                    ></Image>
                  </ModalContent>
                </div>
            </Modal>
        </ModalTrigger>
      </div>
    </div>
  ) : null}</>
}

export default ProductMeasurementChart