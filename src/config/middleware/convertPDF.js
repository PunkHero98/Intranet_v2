import { getDocumentPathById } from "../../app/models/comment.model.js";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs"; // để kiểm tra file tồn tại đồng bộ

const execPromise = promisify(exec);

export async function convertPDF(req, res, next) {
    const documentId = req.params.id;
    const documentPath = await getDocumentPathById(documentId);

    if (!documentPath) {
        return res.status(404).json({
            success: false,
            message: "Document not found",
        });
    }

    const outputDir = path.resolve("documents_cache");

    try {
        await fs.mkdir(outputDir, { recursive: true });
        const ext = path.extname(documentPath).toLowerCase();
        if(ext === ".pdf") {
            // Nếu file đã là PDF, chỉ cần copy
            const fileName = path.basename(documentPath);
            const outputPath = path.join(outputDir, fileName);
            await fs.copyFile(documentPath, outputPath);
            req.pdfPath = outputPath;
            console.log("File đã là PDF, copy từ:", documentPath, "đến:", outputPath);
            return next();
        }

        // Tên file PDF sau khi convert
        const fileName = path.basename(documentPath, path.extname(documentPath)) + ".pdf";
        const outputPath = path.join(outputDir, fileName);

        // 🔍 Kiểm tra nếu file đã tồn tại thì bỏ qua bước convert
        if (fsSync.existsSync(outputPath)) {
            console.log("PDF đã được cache:", outputPath);
            req.pdfPath = outputPath;
            return next();
        }

        // ❗ Nếu chưa tồn tại, thực hiện convert
        const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${documentPath}"`;
        const { stdout, stderr } = await execPromise(command);

        console.log("LibreOffice stdout:", stdout);
        if (stderr) console.warn("LibreOffice stderr:", stderr);

        req.pdfPath = outputPath;
        next();
    } catch (err) {
        console.error("Error converting PDF:", err);
        return res.status(500).json({
            success: false,
            message: "Error converting PDF",
            error: err.message,
        });
    }
}
