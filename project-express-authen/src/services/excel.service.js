const XLSX = require("xlsx");
const fs = require("fs/promises");
const path = require("path");

class ExcelService {
    async readExcell(filePath) {
        try {
            const workbook = XLSX.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            await fs.unlink(filePath);

            return sheetData;
        } catch (error) {
            throw new Error("Error reading Excell" + error.message);
        }
    }


    async writeExcel(data) {
        try {
        if (!Array.isArray(data)) {
            throw new Error("Input data must be an array of objects");
        }

        const dirPath = path.join(__dirname, "../../data");
        await fs.mkdir(dirPath, { recursive: true });

        const ws = XLSX.utils.json_to_sheet(data);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const filePath = path.join(dirPath, "output.xlsx");
        XLSX.writeFile(wb, filePath);

        return filePath;
        } catch (error) {
        throw new Error("Error writing Excel: " + error.message);
        }
    }
}

module.exports = new ExcelService();
