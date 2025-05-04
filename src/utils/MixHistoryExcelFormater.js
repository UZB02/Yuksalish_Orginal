// Method to export to Excel
import * as XLSX from 'xlsx';
import formatDateTime from './DateTimeFormatter';
import formatCurrency from './PriceFormatter';
const mixhistoryexportToExcelById = (history, name) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Formats the date as YYYY-MM-DD
    const fileName = `${name}-${currentDate}.xlsx`;
    // Map the data to include only the required fields
    const filteredData = history.map((item) => ({
        Haridor: item.fullName,
        Tell: item.phoneNumber,
        Hajm: item.size + ' ' + 'Kg',
        'Sotilish Narxi': formatCurrency(item.sellingPrice),
        Tannarxi: formatCurrency(item.originalPrice),
        'Jami Qiymat': formatCurrency(item.size * item.sellingPrice),
        Foyda: formatCurrency(item.size * (item.sellingPrice - item.originalPrice)),
        Valyuta: 'UZS',
        Tafsilot: item.description,
        'Sotilgan Sana': formatDateTime(item.createdAt) // Assuming formatDateTime is a function that formats the date
        // 'Yangilangan Sana': formatDateTime(item.updatedAt) // Assuming formatDateTime is a function that formats the date
    }));

    // Create the Excel sheet with the filtered data
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    // Write the Excel file to the browser
    XLSX.writeFile(workbook, fileName);
};

export default mixhistoryexportToExcelById;
