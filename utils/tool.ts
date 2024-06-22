import {PDFDocument, type PDFPageDrawImageOptions} from "pdf-lib";

export async function generatePDFFromImage(images: File[], name?: string) {
  const pdfDoc = await PDFDocument.create();
  const results = [...images]?.map(async (img) => {
    let embedImage = null;
    if (img.type == "image/png") {
      embedImage = await pdfDoc.embedPng(await img.arrayBuffer());
    } else if (img.type == "image/jpg") {
      embedImage = await pdfDoc.embedJpg(await img.arrayBuffer());
    } else {
      return;
    }
    const {width, height} = embedImage.size();
    const page = pdfDoc.addPage();
    page.setSize(width, height);
    const embedOption: PDFPageDrawImageOptions = {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    };
    page.drawImage(embedImage, embedOption);
  });
  await Promise.all(results);

  const pdfB64 = await pdfDoc.save();
  const pdfFile = new File([pdfB64], name ? name + ".pdf" : "pdffile.pdf", {
    type: "application/pdf",
  });
  console.log("File size", formatFileSize(pdfFile.size));
  return pdfFile;
}

export function convertFileSize(byte: number, unit: "B" | "KB" | "MB" | "GB" | "TB"): number {
  const units: {[key in "B" | "KB" | "MB" | "GB" | "TB"]: number} = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024,
  };

  const conversionFactor = units[unit];
  if (!conversionFactor) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  return Math.round(byte / conversionFactor);
}

export async function splitPDF(pdf: File, limit = 24) {
  const pdfDocs: PDFDocument[] = [];
  const pdfDocConst = await PDFDocument.load(await pdf.arrayBuffer(), {
    updateMetadata: false,
  });
  const allPagesCount = pdfDocConst.getPageCount();
  const splitSize = Math.ceil(convertFileSize(pdf.size, "MB") / limit);

  for (let i = 0; i < splitSize; i++) {
    pdfDocs[i] = await PDFDocument.create();
    const min = (i > 0 ? Math.floor(allPagesCount / (splitSize - (i - 1))) + 1 : 1) - 1;
    const max = (allPagesCount / (splitSize - i) > allPagesCount ? allPagesCount : Math.floor(allPagesCount / (splitSize - i))) - 1;
    console.log("i : " + i, "Min : " + min, "Max : " + max);

    for (let x = min; x <= max; x++) {
      const copiedPages = await pdfDocs[i].copyPages(pdfDocConst, [x]);
      await pdfDocs[i].addPage(copiedPages[0]);
    }
  }
  return await Promise.all(
    pdfDocs.map(
      async (pdfDoc, c) =>
        new File([await pdfDoc.save()], pdf.name ? pdf.name.slice(0, -4) + "-" + (c + 1) + ".pdf" : "pdffile.pdf", {
          type: "application/pdf",
        })
    )
  );
}
