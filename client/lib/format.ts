export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("uz-UZ");
};

export const calculateTax = (amount: number): number => {
  return Math.floor(amount * 0.1);
};

export const calculateShipping = (total: number): number => {
  return total >= 150000 ? 0 : 25000;
};
