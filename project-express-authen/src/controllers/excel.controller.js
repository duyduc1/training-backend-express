const path = require("path");
const ExcelService = require("../services/excel.service");
const response = require("../utils/response");

class excelController {
    /**
     * Đọc dữ liệu từ file Excel đã upload.
     * Kiểm tra file upload, lấy đường dẫn và đọc dữ liệu sheet.
     */
    async readExcell(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file upload"});
            }

            const filePath = path.join(__dirname, "../../", req.file.path);
            const sheetData = await ExcelService.readExcell(filePath);

            response.success(res, { data: sheetData , message: "File reading success"});
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ghi dữ liệu vào file Excel mới.
     * Nhận dữ liệu từ body, kiểm tra kiểu dữ liệu và tạo file Excel.
     */
    async writeExcel(req, res, next) {
        try {
            const data = req.body.data;
            if( !data || !Array.isArray(data)) {
                return res.status(400).json({ message: "Data must be an array" });
            }

            const filePath = await ExcelService.writeExcel(data);
            response.success(res , {message: "Excel file created" , path: filePath});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new excelController();