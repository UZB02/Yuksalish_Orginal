const formatDateTime = (dateString, locale = "uz-UZ") => {
  if (!dateString) return "Noma'lum sana";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24 soat formatda
  })
    .format(date)
    .replace(",", ""); // Vergulni olib tashlaymiz
};

export default formatDateTime;
