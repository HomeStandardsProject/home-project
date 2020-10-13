export function validatePrice(price: string | undefined) {
  if (price) {
    // price validator
    const regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    return regex.test(price);
  }
  return false;
}
