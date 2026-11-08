import { productPath, startingPrices } from "@/lib/products";
import CategoryDiscovery from "./category-discovery";
import Image from "next/image";

const whatsapp = "https://wa.me/254795341458?text=Hello%20Odeon%20Print%2C%20I%27d%20like%20to%20make%20a%20printing%20enquiry.";
const promoBannerSource = "/odeon-promo.svg";

export default function Home() {
  return (
    <main>
      <section className="campaign-banner campaign-hero wrap">
        <div className="campaign-copy">
          <span className="campaign-kicker">IDEAS, MADE TANGIBLE</span>
          <h1>Make your<br/>brand <em>stand out.</em></h1>
          <p>Thoughtful print for business, events and everything in between.</p>
          <a href="#categories">Explore print services <b>→</b></a>
        </div>
        <div className="campaign-art" aria-label="Odeon print samples">
          <div className="campaign-sheet sheet-back"><span>ODEON PRINT</span><b>YOUR<br/>IDEA<br/>HERE.</b><i/></div>
          <div className="campaign-sheet sheet-mid"><span>MAKE IT</span><b>MEMORABLE</b><i/></div>
          <div className="campaign-card"><small>BUSINESS CARD</small><strong>YOU<br/>MEAN<br/>BUSINESS.</strong><span>PRINT / BRAND / GROW</span></div>
          <span className="campaign-seal">PRINT<br/>WITH<br/><b>PURPOSE</b></span>
          <span className="campaign-spark">✳</span>
        </div>
        <div className="campaign-index"><b>01</b><span/> QUALITY PRINT. PERSONAL SERVICE.</div>
      </section>

      <section className="print-shelves wrap" aria-label="Featured print products">
        <section className="print-shelf print-specials">
          <div className="shelf-heading"><div><span className="shelf-kicker">MADE FOR YOUR NEXT BIG IDEA</span><h2>Print specials</h2></div><a href="#categories">Browse all products <b>→</b></a></div>
          <div className="shelf-content">
            <a className="shelf-feature" href="#categories"><span className="feature-topline">ODEON PRINT / KENYA</span><span className="feature-art" aria-hidden="true"><i className="feature-paper feature-paper-one">YOUR<br/>BRAND</i><i className="feature-paper feature-paper-two">MAKE<br/>IT MATTER</i><i className="feature-paper feature-paper-three">O.</i></span><span className="feature-message"><b>Good ideas<br/>deserve great print.</b><small>Discover your next favourite.</small></span><span className="feature-link">Explore print <b>↗</b></span></a>
            <div className="shelf-products">{Object.entries(startingPrices).filter(([name]) => name !== "X Banner Printing").slice(0, 4).map(([name, price], index) => <a className="shelf-product" href={productPath(name)} key={name}><span className={`shelf-product-art shelf-art-${index + 1}`} aria-hidden="true"><i>{name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>ODEON<br/>PRINT</b></span><strong>{name}</strong><small>From <b>KES {price}</b></small></a>)}</div>
          </div>
        </section>

        <section className="print-shelf featured-shelf">
          <div className="shelf-heading"><div><span className="shelf-kicker">A GOOD PLACE TO START</span><h2>Featured products</h2></div><div className="shelf-controls"><a href="#categories">View all <b>→</b></a><span aria-hidden="true">‹</span><span aria-hidden="true">›</span></div></div>
          <div className="featured-products">{Object.entries(startingPrices).slice(0, 6).map(([name, price], index) => <a className="featured-print" href={productPath(name)} key={name}><span className={`featured-print-art print-art-${index + 1}`} aria-hidden="true"><i>{name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</i><b>{index % 2 === 0 ? "PRINTED FOR YOU" : "ODEON / PRINT"}</b><span>{index % 2 === 0 ? "MATTE" : "SPECIAL FINISH"}</span></span><strong>{name}</strong><small>From <b>KES {price}</b></small></a>)}</div>
        </section>
      </section>

      <CategoryDiscovery />

      <section className="campaign-social-section" aria-label="Odeon Print promotions and social media">
        <div className="campaign-media-wrap"><Image className="campaign-media" src={promoBannerSource} alt="Odeon Print: Make your brand impossible to miss. Custom print for every big idea." width={1600} height={300} unoptimized/></div>
        <div className="social-follow wrap"><div className="social-follow-copy"><span>FOLLOW THE MAKING</span><strong>Fresh ideas, straight from the studio.</strong></div><nav className="social-links" aria-label="Follow Odeon Print"><a href="https://www.tiktok.com/@odeondigital" target="_blank" rel="noreferrer" aria-label="Odeon Digital on TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 7.1a6.7 6.7 0 0 1-4.1-1.4v8.1a6.1 6.1 0 1 1-5.3-6.1v3.2a2.9 2.9 0 1 0 2.1 2.8V2.5h3.2c.2 2.2 1.7 4 4.1 4.3v.3Z"/></svg></a><a href="https://www.facebook.com/odeondigital" target="_blank" rel="noreferrer" aria-label="Odeon Digital on Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.8l.4-3.1h-3.2v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z"/></svg></a><a href="https://www.instagram.com/odeondigital" target="_blank" rel="noreferrer" aria-label="Odeon Digital on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.8" r=".8" className="social-icon-fill"/></svg></a><a href="https://www.youtube.com/@odeondigital" target="_blank" rel="noreferrer" aria-label="Odeon Digital on YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 8a3 3 0 0 0-2.1-2.1C18 5.4 12 5.4 12 5.4s-6 0-7.9.5A3 3 0 0 0 2 8a31 31 0 0 0-.5 4 31 31 0 0 0 .5 4 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5A3 3 0 0 0 22 16a31 31 0 0 0 .5-4 31 31 0 0 0-.5-4ZM10 15.1V8.9l5.2 3.1-5.2 3.1Z"/></svg></a></nav></div>
      </section>

      <section className="quote-section wrap" id="about"><div><div className="eyebrow">LET'S MAKE SOMETHING STAND OUT</div><h2>Your next great<br/><em>print starts here.</em></h2><p>Have a custom project or a bulk order? Tell us what you have in mind. We’ll help you work out the details.</p></div><a className="button button-primary" href={whatsapp}>Talk to our team <span>↗</span></a></section>

      <footer className="footer"><div className="wrap footer-inner"><a className="brand brand-footer" href="/" aria-label="Odeon Print Hub Shop home"><Image className="brand-logo" src="/odeon-print-hub.svg" alt="Odeon Print Hub Shop" width={160} height={74}/></a><p>Professional printing and branding.<br/>A service by Odeon Digital Solutions.</p><div className="footer-links"><a href="https://shop.odeondigital.co.ke">shop.odeondigital.co.ke</a><a href={whatsapp}>WhatsApp: 0795 341 458</a></div></div><div className="wrap copyright">© {new Date().getFullYear()} Odeon Print. All rights reserved.</div></footer>
      <a className="whatsapp-float" href={whatsapp} aria-label="Chat with Odeon Print on WhatsApp">W</a>
    </main>
  );
}
