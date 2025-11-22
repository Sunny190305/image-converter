const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for frontend
app.use(cors({
    origin: '*', // Allow all origins for debugging
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.json());

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Conversion Endpoint
app.post('/api/convert', upload.single('file'), async (req, res) => {
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

                // First, get image metadata using sharp
                const metadata = await sharp(req.file.buffer).metadata();

                // Create PDF document
                const doc = new PDFDocument({
                    size: [metadata.width, metadata.height],
                    margin: 0
                });

                // Collect PDF data in buffer
                const chunks = [];
                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => {
                    const pdfBuffer = Buffer.concat(chunks);
                    res.set('Content-Type', 'application/pdf');
                    res.set('Content-Disposition', 'attachment; filename="converted.pdf"');
                    res.send(pdfBuffer);
                });

                // Convert image to PNG buffer first (PDFKit works well with PNG)
                const imageBuffer = await sharp(req.file.buffer).png().toBuffer();

                // Add image to PDF
                doc.image(imageBuffer, 0, 0, {
                    width: metadata.width,
                    height: metadata.height
                });

                doc.end();
                return;
            } catch (pdfError) {
                console.error('PDF conversion error:', pdfError);
                return res.status(500).json({
                    error: 'PDF conversion failed. Please install pdfkit: npm install pdfkit'
                });
            }
        }

        // Handle regular image format conversions
        let pipeline = sharp(req.file.buffer);

        // Format specific options
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

        res.set('Content-Type', `image/${format}`);
        res.set('Content-Disposition', `attachment; filename="converted.${format}"`);
        res.send(outputBuffer);

    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).json({ error: 'Conversion failed: ' + error.message });
    }
});

// Export the app for serverless deployment
module.exports = app;

// Start the server only when this file is run directly (local development)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
