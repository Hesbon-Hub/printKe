"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-provider";

const whatsappNumber = "254795341458";
const PICKUP_STORAGE_KEY = "odeon-print-pickup-v1";
const pickupStations = [
  { id: "thika-johana", area: "Thika", name: "Johana Center", address: "Kwame Nkruma Rd, Thika Town" },
  { id: "nakuru-master", area: "Nakuru", name: "Master Plaza", address: "Nakuru · shop number not provided" },
  { id: "nairobi-lords", area: "Nairobi", name: "Lords House", address: "1st Flr, Tom Mboya Street" },
] as const;

export default function CartPage() {
  const { items, itemCount, estimatedTotal, hasQuoteItems, isLoaded, setQuantity, removeItem, clearCart } = useCart();
  const [pickupStation, setPickupStation] = useState("");
  const [pickupLoaded, setPickupLoaded] = useState(false);

  useEffect(() => {
    setPickupStation(localStorage.getItem(PICKUP_STORAGE_KEY) ?? "");
    setPickupLoaded(true);
  }, []);

  useEffect(() => {
    if (pickupLoaded) {
      if (pickupStation) localStorage.setItem(PICKUP_STORAGE_KEY, pickupStation);
      else localStorage.removeItem(PICKUP_STORAGE_KEY);
    }
  }, [pickupStation, pickupLoaded]);

  const selectedPickup = pickupStations.find((station) => station.id === pickupStation);
  const checkoutMessage = useMemo(() => [
    "Hello Odeon Print, I would like to order:",
    ...items.map((item) => `${item.quantity} x ${item.name}${item.option ? ` (${item.option} turnaround)` : ""}${item.unitPrice === null ? " - please quote" : ` - KES ${(item.unitPrice * item.quantity).toLocaleString("en-KE")}`}`),
    `Estimated total: KES ${estimatedTotal.toLocaleString("en-KE")}${hasQuoteItems ? " + items requiring a quote" : ""}`,
    selectedPickup ? `Pickup station: ${selectedPickup.name}, ${selectedPickup.address}` : "Pickup station: Please help me choose a location",
  ].join("\n"), [estimatedTotal, hasQuoteItems, items, selectedPickup]);
  const checkoutUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(checkoutMessage)}`;

  if (!isLoaded) return <main className="cart-page wrap"><p className="cart-loading">Loading your cart…</p></main>;

  return <main className="cart-page wrap">
    <nav className="product-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><strong>Your cart</strong></nav>
    <header className="cart-heading"><div><p className="product-eyebrow">YOUR ODEON PRINT ORDER</p><h1>Your cart</h1><p>{itemCount} {itemCount === 1 ? "item" : "items"} saved on this device</p></div>{items.length > 0 && <button className="cart-clear-button" type="button" onClick={clearCart}>Clear cart</button>}</header>

    {items.length === 0 ? <section className="cart-empty"><span aria-hidden="true">▱</span><h2>Your cart is ready for an idea.</h2><p>Browse print products and add the items you’re considering. Your cart stays saved on this device.</p><Link className="cart-continue-button" href="/catalogue">Explore products <b>→</b></Link></section> : <div className="cart-layout">
      <div className="cart-main-column">
        <section className="pickup-section" aria-labelledby="pickup-heading">
          <div className="pickup-heading"><div><p className="product-eyebrow">COLLECT YOUR ORDER</p><h2 id="pickup-heading">Choose a pickup station</h2></div><span>Free pickup</span></div>
          <div className="pickup-options" role="radiogroup" aria-labelledby="pickup-heading">{pickupStations.map((station) => <label className={`pickup-option${pickupStation === station.id ? " pickup-option-selected" : ""}`} key={station.id}><input type="radio" name="pickup-station" value={station.id} checked={pickupStation === station.id} onChange={() => setPickupStation(station.id)}/><span className="pickup-radio" aria-hidden="true"/><span className="pickup-copy"><small>{station.area}</small><strong>{station.name}</strong><span>{station.address}</span></span><b className="pickup-check" aria-hidden="true">✓</b></label>)}</div>
        </section>
        <section className="cart-items" aria-label="Cart items">{items.map((item) => <article className="cart-item" key={item.id}>
          <div className="cart-item-art" aria-hidden="true"><i>{item.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>ODEON PRINT</b></div>
          <div className="cart-item-info"><small>{item.category}{item.option ? ` · ${item.option} turnaround` : ""}</small><Link href={`/products/${item.productSlug}`}>{item.name}</Link><span>{item.unitPrice === null ? "Price confirmed by quote" : `KES ${item.unitPrice.toLocaleString("en-KE")} each`}</span><button type="button" onClick={() => removeItem(item.id)}>Remove</button></div>
          <div className="cart-item-controls"><div className="cart-quantity-control"><button type="button" aria-label={`Decrease ${item.name} quantity`} disabled={item.quantity <= 1} onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Increase ${item.name} quantity`} disabled={item.quantity >= 9999} onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button></div><strong>{item.unitPrice === null ? "Quote" : `KES ${(item.unitPrice * item.quantity).toLocaleString("en-KE")}`}</strong></div>
        </article>)}</section>
      </div>

      <aside className="cart-summary"><p className="product-eyebrow">ORDER SUMMARY</p><h2>At a glance</h2><div className="cart-summary-line"><span>Items ({itemCount})</span><span>{hasQuoteItems ? "Some prices on request" : "Ready to order"}</span></div><div className="cart-summary-line"><span>Pickup</span><span>{selectedPickup ? `${selectedPickup.name}, ${selectedPickup.area}` : "Choose a station"}</span></div><div className="cart-summary-total"><span>Estimated total</span><strong>KES {estimatedTotal.toLocaleString("en-KE")}</strong></div>{hasQuoteItems && <p className="cart-quote-note">Some items need a custom quote. We’ll confirm their prices in WhatsApp.</p>}<a className="cart-checkout-button" href={checkoutUrl} target="_blank" rel="noreferrer">Continue via WhatsApp <b>↗</b></a><Link className="cart-continue-link" href="/catalogue">Continue shopping</Link></aside>
    </div>}
  </main>;
}