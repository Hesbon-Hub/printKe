"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/catalogue";
import { getProductsForCategory, productPath } from "@/lib/products";

export default function CategoryDiscovery() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>(categories[0]);
  const featuredProducts = getProductsForCategory(activeCategory.href.split("/").pop()!).slice(0, 3);

  return <section className="section wrap category-discovery" id="categories">
    <div className="section-heading"><div><div className="eyebrow">FIND WHAT YOU NEED</div><h2>Print solutions for<br/><em>every big idea.</em></h2></div><p>Choose a category to explore popular products, starting prices and custom print options.</p></div>
    <div className="category-grid" role="group" aria-label="Select a print category">{categories.map((category) => <button className={`category-card${activeCategory.number === category.number ? " category-card-active" : ""}`} type="button" aria-pressed={activeCategory.number === category.number} onClick={() => setActiveCategory(category)} key={category.number}><span className="category-top"><span className="category-icon">{category.icon}</span><span className="category-number">{category.number}</span></span><strong>{category.name}</strong><span className="category-description">{category.description}</span><span className="category-link">Explore category <b>↗</b></span></button>)}</div>
    <div className="discovery-results" aria-live="polite" key={activeCategory.number}>
      <div className="discovery-results-heading"><div><span className="discovery-label">SELECTED RANGE</span><h3>{activeCategory.name}</h3></div><Link className="discovery-all-link" href={activeCategory.href}>View all products <b>→</b></Link></div>
      <div className="discovery-product-list">{featuredProducts.map((product, index) => <Link className="discovery-product" href={productPath(product.name)} key={product.slug}><span className={`discovery-product-art discovery-art-${index + 1}`} aria-hidden="true"><i>{product.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>ODEON PRINT</b></span><span className="discovery-product-copy"><small>{product.group}</small><strong>{product.name}</strong><span>{product.price === null ? "Request a quote" : `From KES ${product.price.toLocaleString("en-KE")}`}</span></span><b className="discovery-product-arrow">↗</b></Link>)}</div>
    </div>
  </section>;
}