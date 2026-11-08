import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/catalogue";
import { getProductsForCategory, productPath } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.href.split("/").pop()! }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = categories.find((item) => item.href.endsWith(`/${categorySlug}`));
  if (!category) notFound();
  const categoryProducts = getProductsForCategory(categorySlug);

  return <main className="browse-page wrap">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/catalogue">Shop</Link><span>›</span><strong>{category.name}</strong></nav>
    <header className="browse-heading"><p className="product-eyebrow">ODEON PRINT CATALOGUE</p><h1>{category.name}</h1><p>{category.description} Choose a product to see details, pricing and ordering options.</p></header>
    {categoryProducts.length > 0 ? <div className="catalogue-product-grid">{categoryProducts.map((product, index) => <Link className="catalogue-product-card" href={productPath(product.name)} key={product.slug}><span className={`catalogue-product-art art-variant-${index % 6}`} aria-hidden="true"><i>{product.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>ODEON PRINT</b></span><span className="catalogue-product-copy"><small>{product.group}</small><strong>{product.name}</strong><span>{product.price === null ? "Request a quote" : `From KES ${product.price.toLocaleString("en-KE")}`}</span><em>View product <b>→</b></em></span></Link>)}</div> : <div className="catalogue-empty"><h2>Custom orders welcome</h2><p>Tell us what you need and our print team will help specify the right solution.</p><a href="https://wa.me/254795341458?text=Hello%20Odeon%20Print%2C%20I%20would%20like%20help%20with%20a%20custom%20print%20order.">Ask for a quote <b>↗</b></a></div>}
  </main>;
}