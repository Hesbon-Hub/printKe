import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "../../product-detail";
import { getProduct, getProductsForCategory, productPath, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: `${product.name} | Odeon Print`, description: product.description } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const relatedProducts = getProductsForCategory(product.categorySlug).filter((item) => item.slug !== product.slug).slice(0, 4);

  return <main className="product-page">
    <ProductDetail product={product}/>
    {relatedProducts.length > 0 && <section className="related-products wrap"><div className="related-heading"><div><p className="product-eyebrow">KEEP EXPLORING</p><h2>More in {product.category}</h2></div><Link href={`/catalogue/${product.categorySlug}`}>View category <b>→</b></Link></div><div className="catalogue-product-grid">{relatedProducts.map((item, index) => <Link className="catalogue-product-card" href={productPath(item.name)} key={item.slug}><span className={`catalogue-product-art art-variant-${index % 6}`} aria-hidden="true"><i>{item.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>ODEON PRINT</b></span><span className="catalogue-product-copy"><small>{item.group}</small><strong>{item.name}</strong><span>{item.price === null ? "Request a quote" : `From KES ${item.price.toLocaleString("en-KE")}`}</span><em>View product <b>→</b></em></span></Link>)}</div></section>}
  </main>;
}