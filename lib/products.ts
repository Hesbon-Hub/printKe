export const productMenus = [
  { label: "Cards", categorySlug: "corporate-identity", groups: [{ title: "Business Cards", items: ["Business Cards Printing", "Spot UV Business Cards", "Postcards printing", "Bookmarks printing"] }, { title: "Cards & Vouchers", items: ["Gift Voucher Printing", "Wedding Cards printing", "New Baby Cards", "Tent Cards Printing"] }], featured: ["Business Cards Printing", "Spot UV Business Cards", "Postcards printing", "Bookmarks printing", "Gift Voucher Printing"] },
  { label: "Flyers", categorySlug: "marketing-materials", groups: [{ title: "Flyers & Leaflets", items: ["Flyer Printing", "A5 Flyers", "DL Flyers", "Folded Leaflets"] }, { title: "Brochures", items: ["Bi-fold Brochures", "Tri-fold Brochures", "Product Catalogues", "Company Profiles"] }], featured: ["Flyer Printing", "Folded Leaflets", "Tri-fold Brochures"] },
  { label: "Banners", categorySlug: "large-format", groups: [{ title: "Banner Printing", items: ["X Banner Printing", "Pull-up Banners", "PVC Banners", "Mesh Banners", "Step & Repeat Backdrops"] }, { title: "Signs & Displays", items: ["Foam Board Signs", "Directional Signage", "Exhibition Displays", "Window Graphics"] }], featured: ["X Banner Printing", "Pull-up Banners", "PVC Banners", "Exhibition Displays"] },
  { label: "Events", categorySlug: "events-occasions", groups: [{ title: "Event Stationery", items: ["Invitations", "Event Programmes", "Place Cards", "Thank You Cards"] }, { title: "Event Branding", items: ["Branded Backdrops", "Wristbands", "Table Menus", "Welcome Signs"] }], featured: ["Event Invitations", "Event Programmes", "Branded Backdrops"] },
  { label: "Apparel", categorySlug: "apparel-branding", groups: [{ title: "Clothing", items: ["Printed T-shirts", "Embroidered Polos", "Branded Hoodies", "Work Uniforms"] }, { title: "Accessories", items: ["Branded Caps", "Aprons", "Hi-vis Vests", "Staff Name Tags"] }], featured: ["Printed T-shirts", "Embroidered Polos", "Branded Caps"] },
  { label: "Promo", categorySlug: "promotional-merchandise", groups: [{ title: "Promotional Products", items: ["Branded Mugs", "Custom Pens", "Water Bottles", "USB Drives"] }, { title: "Business Gifts", items: ["Branded Notebooks", "Gift Sets", "Desk Calendars", "Tote Bags"] }], featured: ["Branded Mugs", "Custom Pens", "Branded Notebooks"] },
  { label: "Stickers", categorySlug: "packaging-labels", groups: [{ title: "Stickers & Labels", items: ["Product Labels", "Die-cut Stickers", "Roll Labels", "Window Stickers"] }, { title: "Packaging", items: ["Custom Boxes", "Paper Bags", "Packaging Sleeves", "Sealing Labels"] }], featured: ["Product Labels", "Die-cut Stickers", "Custom Boxes"] },
  { label: "Stationery", categorySlug: "office-stationery", groups: [{ title: "Office Printing", items: ["Letterheads", "Compliment Slips", "Envelopes", "Presentation Folders"] }, { title: "Business Forms", items: ["Receipt Books", "Invoice Books", "Delivery Notes", "Certificates"] }], featured: ["Letterheads", "Receipt Books", "Presentation Folders"] },
  { label: "Photos & More", categorySlug: "marketing-materials", groups: [{ title: "Photo Printing", items: ["Photo Prints", "Canvas Prints", "Photo Books", "Framed Prints"] }, { title: "More Services", items: ["Document Printing", "Lamination", "Graphic Design", "Custom Print Projects"] }], featured: ["Canvas Prints", "Photo Books", "Custom Print Projects"] },
] as const;

export const startingPrices: Record<string, number> = {
  "Business Cards Printing": 12,
  "Spot UV Business Cards": 65,
  "Postcards printing": 25,
  "Bookmarks printing": 19,
  "Gift Voucher Printing": 60,
  "Wedding Cards printing": 140,
  "New Baby Cards": 35,
  "Tent Cards Printing": 85,
  "X Banner Printing": 4500,
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  group: string;
  price: number | null;
  description: string;
};

export const slugifyProduct = (name: string) => name.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const productRecords = productMenus.flatMap((menu) => {
  const groupedItems = menu.groups.flatMap((group) => group.items.map((name) => ({ name, group: group.title })));
  const featuredItems = menu.featured.map((name) => ({ name, group: "Featured" }));
  const uniqueItems = new Map([...groupedItems, ...featuredItems].map((item) => [item.name, item]));

  return [...uniqueItems.values()].map(({ name, group }) => ({
    slug: slugifyProduct(name),
    name,
    category: menu.label,
    categorySlug: menu.categorySlug,
    group,
    price: startingPrices[name] ?? null,
    description: `Made to order ${name.toLowerCase()}, produced to your specifications with quality materials and a professional finish. Contact our team to confirm sizes, quantities, artwork and delivery.`,
  }));
});

export const products = [...new Map(productRecords.map((product) => [product.slug, product])).values()];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);

export const getProductsForCategory = (categorySlug: string) => products.filter((product) => product.categorySlug === categorySlug);

export const productPath = (name: string) => `/products/${slugifyProduct(name)}`;