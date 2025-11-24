const express = require('express')
const busboy = require('busboy');
const GemmaController = require('../../controllers/gemma/gemmaController')

const router = express.Router()

// Middleware to handle multipart/form-data with images
router.post('/', (req, res, next) => {
    // Check if this is multipart form data with files
    const contentType = req.headers['content-type'];
    
    if (contentType && contentType.includes('multipart/form-data')) {
        // Use busboy to parse multipart data
        const bb = busboy({ headers: req.headers });
        req.body = {};
        req.files = [];
        
        bb.on('file', (fieldname, file, info) => {
            if (fieldname === 'images') {
                const chunks = [];
                
                file.on('data', (data) => {
                    chunks.push(data);
                });
                
                file.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    req.files.push({
                        originalname: info.filename,
                        buffer: buffer,
                        mimetype: info.mimeType,
                        size: buffer.length
                    });
                });
                
                file.on('error', (err) => {
                    console.error('Error reading file:', err);
                });
            }
        });

        bb.on('field', (fieldname, val) => {
            req.body[fieldname] = val;
        });

        bb.on('close', () => {
            next();
        });

        bb.on('error', (err) => {
            console.error('Busboy error:', err);
            res.status(400).json({ error: 'Error parsing form data' });
        });

        req.pipe(bb);
    } else {
        // For regular JSON requests, continue as normal
        next();
    }
}, GemmaController.setChat)

module.exports = router