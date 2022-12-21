import React from 'react'
import styles from "./ImageMapper.css";
import { useDevice } from 'vtex.device-detector'

import { SliderLayout } from 'vtex.slider-layout'

import ImageMapperHeader from "./components/ImageMapperHeader"
import ImageMapperArea from "./components/ImageMapperArea"
import ImageMapperProduct from "./components/ImageMapperProduct"
import ImageMapperFooter from "./components/ImageMapperFooter"

import { Container } from 'vtex.store-components'

import { useQuery } from 'react-apollo'
import productsByIdentifier from './queries/productsByIdentifier.graphql'

import { isEmptyObject } from "./helpers/helpers"

const ImageMapper = ({
    schemaTitle = 'Compre o Mix',
    schemaTextDiscount = 'Comprando este mix você terá:',
    schemaDiscountPercent = "30",
    schemaProducts = [],
    schemaImage
}) => {
    const { isMobile } = useDevice()
    var listAux = []

    schemaProducts?.map((item) => {
      listAux.push(item?.productId)
    })

    const { data } = useQuery(productsByIdentifier, {
        variables: { ids: listAux }
    })

    let listProducts = data?.productsByIdentifier

    listProducts = listAux?.map(object => listProducts?.find((i) => i?.productId === object));
    listProducts = listProducts.filter(item => item);

    if( (schemaProducts?.length == 0) || isEmptyObject(schemaProducts[0]) ){
      return <></>
    }


    const sliderConfigurationProps = {
      itemsPerPage: 2,
      infinite: true,
      showNavigationArrows: 'always',
      showPaginationDots: 'never',
      arrowSize: 18,
      fullWidth: true
    }

    return (
      <Container>
        <div className={styles.imageMapper}>
          <ImageMapperHeader
            schemaTitle={schemaTitle}
          />

          {!isMobile && <ImageMapperArea schemaProducts={schemaProducts} schemaImage={schemaImage} listProducts={listProducts} />}

          <div className={styles.imageMapperContent}>
              {isMobile && <ImageMapperArea schemaProducts={schemaProducts} schemaImage={schemaImage} listProducts={listProducts} />}

              <div className={styles.imageMapperProducts}>
                <SliderLayout {...sliderConfigurationProps}>
                  {listProducts?.map((product, index) => {
                        return (
                          <ImageMapperProduct
                              product={product}
                              isTooltip={false}
                              key={index}
                          />
                        )
                    })
                  }
                </SliderLayout>
              </div>

              <ImageMapperFooter
                schemaTextDiscount={schemaTextDiscount}
                schemaDiscountPercent={schemaDiscountPercent}
                listProducts={listProducts}
              />
          </div>
        </div>
      </Container>
    )
}

ImageMapper.schema = {
    title: 'Compre o Mix',
    description: 'Compre o Mix',
    type: 'object',
    properties: {
      schemaTitle: {
        type: 'string',
        title: 'Título',
        default: 'Compre o Mix',
      },
      schemaProducts: {
        title: "Lista de Produtos",
        type: 'array',
        minItems: 0,
        items: {
          title: 'Produto',
          type: 'object',
          properties: {
            __editorItemTitle: {
              default: 'Item',
              title: 'Nome do Produto',
              description: '(Opcional para melhor identificação)',
              type: 'string'
            },
            productId: {
              title: 'ID do Produto',
              type: 'string'
            },
            coordX: {
                title: 'Coordenada X',
                description: 'Caso não queira utilizar, deixar em branco.',
                type: 'number'
            },
            coordY: {
                title: 'Coordenada Y',
                description: 'Caso não queira utilizar, deixar em branco.',
                type: 'number'
            }
          }
        }
      },
      schemaDiscountPercent: {
        type: 'string',
        title: 'Desconto (Em Porcentagem)',
        description: 'Não precisa colocar %',
        default: '30',
      },
      schemaTextDiscount: {
        type: 'string',
        title: 'Desconto',
        default: 'Comprando este mix você terá:',
      },
      schemaImage: {
        type: 'string',
        title: 'Imagem Principal',
        description: '(Tamanho: 500x750px)',
        widget: {
          'ui:widget': 'image-uploader'
        }
      }
    }
  }

export default ImageMapper