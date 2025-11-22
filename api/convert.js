const multer = require('multer');
const sharp = require('sharp');

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Use multer middleware
    upload.single('file')(req, res, async (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: 'File upload failed: ' + err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const format = req.body.format ? req.body.format.toLowerCase() : 'png';
            const validFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'];

            if (!validFormats.includes(format)) {
                return res.status(400).json({ error: 'Invalid format' });
            }

            // Handle PDF conversion separately
            if (format === 'pdf') {
                try {
                    const PDFDocument = require('pdfkit');
                    const metadata = await sharp(req.file.buffer).metadata();
                    const doc = new PDFDocument({ size: [metadata.width, metadata.height], margin: 0 });
                    const chunks = [];
                    doc.on('data', chunk => chunks.push(chunk));
                    doc.on('end', () => {
                        const pdfBuffer = Buffer.concat(chunks);
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
                        res.send(pdfBuffer);
                    });
                    const imageBuffer = await sharp(req.file.buffer).png().toBuffer();
                    doc.image(imageBuffer, 0, 0, { width: metadata.width, height: metadata.height });
                    doc.end();
                    return;
                } catch (pdfError) {
                    console.error('PDF conversion error:', pdfError);
                    return res.status(500).json({ error: 'PDF conversion failed: ' + pdfError.message });
                }
            }

            // Handle regular image format conversions
            let pipeline = sharp(req.file.buffer);
            if (format === 'jpg' || format === 'jpeg') {
                pipeline = pipeline.jpeg({ quality: 90 });
            } else if (format === 'png') {
                pipeline = pipeline.png({ quality: 90 });
            } else if (format === 'webp') {
                pipeline = pipeline.webp({ quality: 90 });
            } else if (format === 'gif') {
                pipeline = pipeline.gif();
            }
            pipeline = pipeline.toFormat(format);
            const outputBuffer = await pipeline.toBuffer();
            res.setHeader('Content-Type', `image/${format}`);
            res.setHeader('Content-Disposition', `attachment; filename="converted.${format}"`);
            res.send(outputBuffer);
        } catch (error) {
            console.error('Conversion error:', error);
            res.status(500).json({ error: 'Conversion failed: ' + error.message });
        }
    });
};
