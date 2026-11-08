import Link from "next/link";
import { categories } from "@/lib/catalogue";

export default function CataloguePage() {
  return <main className="browse-page wrap">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><strong>All categories</strong></nav>
    <header className="browse-heading"><p className="product-eyebrow">THE ODEON PRINT RANGE</p><h1>Browse by category</h1><p>Find the right print products and services for your brand, business or next event.</p></header>
    <div className="browse-category-grid">{categories.map((category) => <Link className="browse-category-card" href={category.href} key={category.number}><span className="browse-category-icon">{category.icon}</span><span className="browse-category-number">{category.number}</span><h2>{category.name}</h2><p>{category.description}</p><span className="browse-card-link">Browse products <b>→</b></span></Link>)}</div>
  </main>;
}