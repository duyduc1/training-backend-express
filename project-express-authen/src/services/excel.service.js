const XLSX = require("xlsx");
const fs = require("fs/promises");
const path = require("path");

class excelService {
    // Đọc dữ liệu từ file Excel và trả về dạng mảng object
    async readExcell(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Xóa file sau khi đọc xong
            await fs.unlink(filePath);

            return sheetData;
        } catch (error) {
            throw new Error("Error reading Excell" + error.message);
        }
    }

    // Ghi dữ liệu vào file Excel mới từ mảng object
    async writeExcel(data) {
        try {
            if (!Array.isArray(data)) {
                throw new Error("Input data must be an array of objects");
            }

            // Tạo thư mục lưu file nếu chưa tồn tại
            const dirPath = path.join(__dirname, "../../data");
            await fs.mkdir(dirPath, { recursive: true });

            // Chuyển dữ liệu thành sheet
            const ws = XLSX.utils.json_to_sheet(data);

            // Tạo workbook và thêm sheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            // Đường dẫn file xuất ra
            const filePath = path.join(dirPath, "output.xlsx");
            XLSX.writeFile(wb, filePath);

            return filePath;
        } catch (error) {
            throw new Error("Error writing Excel: " + error.message);
        }
    }
}

module.exports = new excelService();