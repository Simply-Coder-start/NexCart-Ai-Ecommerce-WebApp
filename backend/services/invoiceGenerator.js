const PDFDocument = require('pdfkit');

function generateInvoicePDF(order, user, stream) {
    const doc = new PDFDocument({ margin: 50 });

    // Header
    doc.fillColor('#444444')
        .fontSize(20)
        .text('NexCart Store', 110, 57)
        .fontSize(10)
        .text('123 Fashion Street, Tech City', 200, 65, { align: 'right' })
        .text('support@nexcart.com', 200, 80, { align: 'right' })
        .moveDown();

    // Line
    doc.strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, 110)
        .lineTo(550, 110)
        .stroke();

    // Customer / Order Info
    doc.fillColor('#000000')
        .fontSize(12)
        .text(`Invoice for: ${user.name}`, 50, 130)
        .text(`Order ID: ${order.orderId}`, 50, 145)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 160)
        .text(`Expected Delivery: ${new Date(order.expectedDeliveryDate).toLocaleDateString()}`, 50, 175)
        .moveDown();

    // Table Header
    const tableTop = 220;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 300, tableTop);
    doc.text('Price', 400, tableTop, { width: 90, align: 'right' });
    doc.text('Total', 500, tableTop, { width: 50, align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Table Rows
    let position = tableTop + 30;
    doc.font('Helvetica');
    order.items.forEach(item => {
        doc.text(item.productName, 50, position);
        doc.text(item.quantity.toString(), 300, position);
        doc.text(`INR ${item.price.toFixed(2)}`, 400, position, { width: 90, align: 'right' });
        doc.text(`INR ${(item.price * item.quantity).toFixed(2)}`, 500, position, { width: 50, align: 'right' });
        position += 20;
    });

    // Summary
    doc.moveTo(50, position + 10).lineTo(550, position + 10).stroke();

    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Grand Total:', 400, position + 30, { width: 90, align: 'right' });
    doc.text(`INR ${order.totalPrice.toFixed(2)}`, 500, position + 30, { width: 50, align: 'right' });

    // Footer
    doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for shopping with NexCart!', 50, 700, { align: 'center', width: 500 });

    doc.pipe(stream);
    doc.end();
}

module.exports = { generateInvoicePDF };
