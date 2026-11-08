"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./cart-provider";

const turnaroundOptions = [
  { id: "rush", name: "Rush", time: "24 hrs", extra: 1500, coverage: "Nairobi only" },
  { id: "express", name: "Express", time: "2 days", extra: 500, coverage: "All regions" },
  { id: "standard", name: "Standard", time: "3 days", extra: 0, coverage: "All regions" },
] as const;

export default function ProductDetail({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [turnaround, setTurnaround] = useState<(typeof turnaroundOptions)[number]["id"]>("standard");
  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [artworkName, setArtworkName] = useState("");
  const [cartFeedback, setCartFeedback] = useState("");
  const { addItem } = useCart();
  const selectedTurnaround = turnaroundOptions.find((option) => option.id === turnaround) ?? turnaroundOptions[2];
  const isBanner = product.categorySlug === "large-format";
  const total = product.price === null ? null : (product.price + (isBanner ? selectedTurnaround.extra : 0)) * quantity;
  const orderMessage = [
    `Hello Odeon Print, I would like to order ${product.name}.`,
    `Quantity: ${quantity}`,
    ...(isBanner ? [`Turnaround: ${selectedTurnaround.name} (${selectedTurnaround.time})`] : []),
    total === null ? "Please provide a quote." : `Starting estimate: KES ${total.toLocaleString("en-KE")}`,
    deliveryZone ? `Delivery: ${deliveryZone}` : "Delivery: I will confirm the delivery zone",
    deliveryDate ? `Preferred delivery date: ${deliveryDate}` : "",
    artworkName ? `Artwork file: ${artworkName} (I will attach it in WhatsApp)` : "Artwork: I will share it in WhatsApp",
  ].filter(Boolean).join("\n");
  const whatsappOrder = `https://wa.me/254795341458?text=${encodeURIComponent(orderMessage)}`;

  return (
    <section className="product-detail-section" id="product-detail" aria-labelledby="product-title">
      <nav className="product-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/catalogue">Shop</a><span>›</span><a href={`/catalogue/${product.categorySlug}`}>{product.category}</a><span>›</span><strong>{product.name}</strong></nav>
      <div className="product-detail-grid">
        <div className="product-gallery">
          {isBanner ? <div className="x-banner-preview" role="img" aria-label="Red and white X banner stand print examples">
            <div className="banner-stand banner-stand-red"><div className="banner-panel"><b>⌂</b><strong>OPEN<br/>HOUSE</strong></div><i className="banner-rod rod-a"/><i className="banner-rod rod-b"/><i className="banner-rod rod-c"/><i className="banner-foot"/></div>
            <div className="banner-stand banner-stand-white"><div className="banner-panel"><b>YOUR<br/>BRAND</b></div><i className="banner-rod rod-a"/><i className="banner-rod rod-b"/><i className="banner-rod rod-c"/><i className="banner-foot"/></div>
          </div> : <div className={`product-sample-preview preview-${product.categorySlug}`} role="img" aria-label={`${product.name} print sample artwork`}>
            <div className="sample-sheet sample-sheet-back"><small>{product.category.toUpperCase()}</small><b>YOUR<br/>BRAND<br/>HERE.</b><i>ODEON PRINT</i></div>
            <div className="sample-sheet sample-sheet-mid"><small>MADE TO ORDER</small><b>MAKE<br/>IT<br/>MATTER.</b><i>PRINT / BRAND / GROW</i></div>
            <div className="sample-sheet sample-sheet-front"><small>{product.group.toUpperCase()}</small><b>{product.name}</b><i>DESIGNED FOR YOU</i></div>
            <span className="sample-preview-stamp">CUSTOM<br/>PRINT<br/><b>KENYA</b></span>
          </div>}
          <div className="product-benefits"><span><i>↗</i> Free delivery 10K+</span><span><i>✓</i> High quality prints</span></div>
        </div>

        <div className="product-configurator">
          <div className="product-title-row"><div><p className="product-eyebrow">{product.category.toUpperCase()}</p><h1 id="product-title">{product.name}</h1></div><span className="product-rating">Made to order</span></div>
          <p className="product-description">{product.description}</p>
          <p className="product-price"><strong>{product.price === null ? "Request a quote" : `KES ${product.price.toLocaleString("en-KE")}`}</strong>{product.price !== null && <span>starting price</span>}</p>

          <div className="config-label-row"><label htmlFor="product-quantity">Quantity</label><span>max 20</span></div>
          <div className="quantity-control"><button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button><input id="product-quantity" aria-label="Quantity" type="number" min="1" max="20" value={quantity} onChange={(event) => setQuantity(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}/><button type="button" aria-label="Increase quantity" disabled={quantity >= 20} onClick={() => setQuantity((value) => Math.min(20, value + 1))}>+</button></div>

          {isBanner && <><div className="config-label-row turnaround-label"><span>Turnaround</span><a href="/catalogue/large-format">See banner products</a></div><div className="turnaround-options" role="radiogroup" aria-label="Choose turnaround">{turnaroundOptions.map((option) => <label className={`turnaround-option turnaround-${option.id}${turnaround === option.id ? " is-selected" : ""}`} key={option.id}><input type="radio" name="turnaround" value={option.id} checked={turnaround === option.id} onChange={() => setTurnaround(option.id)}/><span className="turnaround-pill">{option.name}</span><strong>{option.time}</strong><small>{option.extra ? `+ KES ${option.extra.toLocaleString("en-KE")}` : "No extra"}</small><em>{option.coverage}</em></label>)}</div></>}

          <div className="config-label-row delivery-label"><span>Delivery</span><span>Optional</span></div>
          <label className="product-select"><span aria-hidden="true">⌖</span><select aria-label="Delivery zone" value={deliveryZone} onChange={(event) => setDeliveryZone(event.target.value)}><option value="">Delivery zone & fee (from KES 200)</option><option>Nairobi CBD (from KES 200)</option><option>Other Nairobi location (confirm fee)</option><option>Outside Nairobi (confirm fee)</option></select><b>⌄</b></label>
          <label className="product-select"><span aria-hidden="true">▦</span><input aria-label="Preferred delivery date" type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} placeholder="Choose a delivery date"/><b>⌄</b></label>

          <div className="config-label-row artwork-label"><span>Your design</span><span>Optional</span></div>
          <label className="artwork-upload"><span className="upload-symbol" aria-hidden="true">↑</span><span><strong>{artworkName || "Upload your design"}</strong><small>PDF, AI, PSD, JPG or PNG, max 50MB. Or send it in WhatsApp.</small></span><input type="file" accept=".pdf,.ai,.psd,.jpg,.jpeg,.png" onChange={(event) => setArtworkName(event.target.files?.[0]?.name ?? "")}/></label>

          <div className="product-order-row"><p>{total === null ? "Pricing" : "Estimated total"}<strong>{total === null ? "Quote on request" : `KES ${total.toLocaleString("en-KE")}`}</strong></p><div className="product-order-actions"><button className={`add-to-cart-button${cartFeedback ? " is-added" : ""}`} type="button" onClick={() => {addItem({productSlug: product.slug,name: product.name,category: product.category,unitPrice: product.price === null ? null : product.price + (isBanner ? selectedTurnaround.extra : 0),quantity,option: isBanner ? selectedTurnaround.name : ""});setCartFeedback(`${quantity} × ${product.name} added to cart.`)}}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg><span>{cartFeedback ? "Added to cart" : "Add to cart"}</span><b aria-hidden="true">{cartFeedback ? "✓" : "→"}</b></button><a className="whatsapp-order-button" href={whatsappOrder} target="_blank" rel="noreferrer" aria-label={total === null ? "Request a quote via WhatsApp" : "Order via WhatsApp"} title={total === null ? "Request a quote via WhatsApp" : "Order via WhatsApp"}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.5-4.9a8.4 8.4 0 1 1 16-3.9Z"/><path d="M8.2 7.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4-.1.6.3.6.8 1.2 1.3 1.7.6.5 1.2.9 1.9 1.1.2.1.4 0 .5-.1l.8-.9c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.5 0 .3-.2 1.2-.8 1.7-.5.5-1.2.7-2 .6-1.2-.2-2.7-.9-4.2-2.2-1.3-1.2-2.2-2.6-2.5-3.8-.3-1 .1-1.9.4-2.4Z"/></svg><span>WhatsApp</span></a></div></div>
          {cartFeedback && <p className="cart-add-feedback" role="status">{cartFeedback} <a href="/cart">View cart</a></p>}
        </div>
      </div>
    </section>
  );
}