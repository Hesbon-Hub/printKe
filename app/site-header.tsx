"use client";

import { useState } from "react";
import { categories } from "@/lib/catalogue";
import { productMenus, productPath, startingPrices } from "@/lib/products";
import Image from "next/image";
import { useCart } from "./cart-provider";

const whatsapp = "https://wa.me/254795341458?text=Hello%20Odeon%20Print%2C%20I%27d%20like%20to%20make%20a%20printing%20enquiry.";

function Icon({ name }: { name: "phone" | "mail" | "search" | "user" | "heart" | "bag" | "grid" | "chevron" | "globe" }) {
  const paths = {
    phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></>,
    bag: <><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    chevron: <><path d="m6 9 6 6 6-6"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { itemCount, isLoaded } = useCart();
  const activeMenuData = productMenus.find((menu) => menu.label === activeMenu);

  return <>
    <div className="store-utility">
      <div className="store-utility-inner">
        <div className="store-contact"><a href="tel:+254795341458"><Icon name="phone"/>0795 341 458</a><a href="mailto:orders@odeondigital.co.ke"><Icon name="mail"/>orders@odeondigital.co.ke</a></div>
        <div className="store-settings"><span className="currency-switch"><b>KES</b><span>USD</span></span><span className="language-setting"><Icon name="globe"/> English <Icon name="chevron"/></span><a href="/#about">Business Account</a><a href={whatsapp}>Help</a><span className="delivery-note">Free delivery over <b>KES 10,000</b></span></div>
      </div>
    </div>
    <header className="store-header">
      <div className="store-main-row">
        <a className="brand" href="/" aria-label="Odeon Print Hub Shop home"><Image className="brand-logo" src="/odeon-print-hub.svg" alt="Odeon Print Hub Shop" width={168} height={78}/></a>
        <form className="store-search" action="/catalogue/corporate-identity" role="search"><label className="visually-hidden" htmlFor="store-search">Search products</label><input id="store-search" name="q" type="search" placeholder="Search business cards, banners, stickers, books..."/><button type="submit" aria-label="Search"><Icon name="search"/></button></form>
        <div className="store-actions"><a href="/login"><Icon name="user"/><span>Sign in</span></a><a href="/login"><Icon name="heart"/><span>Account</span></a><a href="/cart" aria-label={`Cart${isLoaded ? `, ${itemCount} items` : ""}`}><Icon name="bag"/><span>Cart{isLoaded && itemCount > 0 ? <small className="cart-count">{itemCount}</small> : null}</span></a></div>
      </div>
      <nav className="store-nav" aria-label="Product navigation" onMouseLeave={() => setActiveMenu(null)}>
        <details className="all-products"><summary><Icon name="grid"/>All Products<Icon name="chevron"/></summary><div className="products-menu">{categories.map((category) => <a href={category.href} key={category.number}>{category.name}</a>)}</div></details>
        <div className="store-nav-links">{productMenus.map((menu) => <button className={`product-nav-trigger${activeMenu === menu.label ? " is-active" : ""}`} type="button" aria-haspopup="true" aria-expanded={activeMenu === menu.label} aria-controls="product-mega-menu" onMouseEnter={() => setActiveMenu(menu.label)} onFocus={() => setActiveMenu(menu.label)} onClick={() => setActiveMenu((current) => current === menu.label ? null : menu.label)} key={menu.label}>{menu.label}<Icon name="chevron"/></button>)}</div>
        <a className="store-contact-button" href={whatsapp}>Contact Us</a>
        {activeMenuData && <div className="mega-menu" id="product-mega-menu" onMouseEnter={() => setActiveMenu(activeMenuData.label)}><div className="mega-groups">{activeMenuData.groups.map((group) => <section className="mega-group" key={group.title}><h2>{group.title}</h2>{group.items.map((item) => <a href={productPath(item)} key={item}><span>{item}</span><small>{startingPrices[item] ? `KES ${startingPrices[item]}` : "Get a quote"}</small></a>)}</section>)}</div><section className="mega-featured"><div className="mega-featured-heading"><span>Featured</span><a href={`/catalogue/${activeMenuData.categorySlug}`}>View all <b>→</b></a></div><div className="featured-grid">{activeMenuData.featured.map((item, index) => <a className="featured-product" href={productPath(item)} key={item}><span className={`product-sample sample-${index % 4}`} aria-hidden="true"><i>{item.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>PRINT</b></span><span className="featured-product-info"><strong>{item}</strong><small>{startingPrices[item] ? `From KES ${startingPrices[item]}` : "Custom sizes & finishes"}</small><em>View product <b>→</b></em></span></a>)}</div><a className="browse-products" href={`/catalogue/${activeMenuData.categorySlug}`}>Browse {activeMenuData.label}</a></section></div>}
      </nav>
    </header>
  </>;
}