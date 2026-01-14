export function formatPrice(price: string | number) {
  const num = typeof price === "string" ? Number(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}
