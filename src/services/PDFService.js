import { PDFDocumentFactory, PDFDocumentWriter } from 'pdf-lib';

function mergeBetweenPDF(pdfFileList) {
    if (pdfFileList.length > 0) {
		const reader = new FileReader();
		reader.onload = function(evt) { console.log(evt.target.result); };

		const pdfDoc = PDFDocumentFactory.create();
		// let iterPdfDocBytes;
		let iterPdfDoc;
		let pdfFilePromiseArrayBufferList = [];
		let iterPdfDocPages = [];

		// Get all file URLs into a list using Promises and fetch API
		pdfFileList.forEach((pdfFile) => {
			pdfFilePromiseArrayBufferList.push(
				fetch(URL.createObjectURL(pdfFile))
					.then(res => res.arrayBuffer())
			)
		})

		return Promise
			.all(pdfFilePromiseArrayBufferList)
			.then((pdfArrayBufferFileList) => {
				pdfArrayBufferFileList.forEach((pdfArrayBuffer) => {
					console.log(pdfArrayBuffer)
					// iterPdfDocBytes = reader.readAsArrayBuffer(pdfBlob)
					iterPdfDoc = PDFDocumentFactory.load(new Uint8Array(pdfArrayBuffer))
					iterPdfDocPages = iterPdfDoc.getPages()
					iterPdfDocPages.forEach((pdfPage) => {
						pdfDoc.addPage(pdfPage)
					})
				})

				return PDFDocumentWriter.saveToBytes(pdfDoc);
			})
    }
}

export default {
	mergeBetweenPDF
}
