const formatCurrency = (amount, locale = "uz-UZ", currency = "UZS") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export default formatCurrency;
