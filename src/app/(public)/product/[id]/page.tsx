import Image from "next/image"

import { BreadcrumbDemo } from "@/components/ui/breadcumb"
import { PriceDatailsArea } from "@/components/product/price-details-area"
import { ComparePriceArea } from "@/components/product/compare-price-area"
import { FetchProductById } from "@/http/product/fetch-product-by-id"
import { FetchTrendsById } from "@/http/product/fetch-trends-by-id"
import { FetchProductsByComparasion } from "@/http/product/fetch-products-by-comparasion"
import { PriceClassificationCard } from "@/components/product/ui/cards/price-classification"
import { PriceHistoryArea } from "@/components/product/price-history-area"
import ImageIndisplonible from "@/assets/image-indisponible.svg"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const productData = await FetchProductById(id)
  const trendsData = await FetchTrendsById(id)
  const comparasionData = await FetchProductsByComparasion(id)

  const filteredBestPriceOrder =
    comparasionData.response.FindInThreeStores.sort((a, b) => a.Value - b.Value)

  const lowestPriceProductId = filteredBestPriceOrder[0].Id

  return (
    <div className="flex flex-col max-w-screen-lg m-auto">
      <BreadcrumbDemo
        isProductPage
        productTitle={productData.response.Product.Title}
        produtId={productData.response.Product.Id}
      />
      <section className="flex justify-center gap-16 w-full flex-wrap p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-medium max-w-[430px]">
            {productData.response.Product.Title}
          </h1>

          <Image
            src={productData.response.Product.ImageUrl || ImageIndisplonible}
            width={212}
            height={112}
            alt=""
            className="size-[16rem] m-auto"
          />
        </div>

        <PriceDatailsArea
          price={productData.response.Product.Value}
          store={productData.response.Product.Kind}
          productEvaluation={trendsData.response.ProductEvaluation}
          tearmValue={productData.response.Product.onInstallment}
        />
      </section>

      <ComparePriceArea>
        {filteredBestPriceOrder.slice(0, 3).map((product, index) => (
          <PriceClassificationCard
            key={index}
            isLowestPrice={product.Id === lowestPriceProductId}
            productLink={product.Link}
            productPrice={product.Value}
            productStore={product.Kind}
            productImageUrl={product.ImageUrl}
            tearmValue={product.onInstallment}
            productId={product.Id}
          />
        ))}
      </ComparePriceArea>

      <PriceHistoryArea />
    </div>
  )
}
