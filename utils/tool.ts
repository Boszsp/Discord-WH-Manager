import {PDFDocument, type PDFPageDrawImageOptions} from "pdf-lib";
import {ZipReader, BlobReader, BlobWriter, ZipWriter} from "@zip.js/zip.js";

export async function generatePDFFromImage(images: File[], name?: string, fixedSize?: boolean) {
  const pdfDoc = await PDFDocument.create();
  let fristPageSize: number[] = [];
  const results = [...images]?.map(async (img, id) => {
    if (img.type == "image/png" || img.name.toLowerCase().endsWith(".jpg")) {
      const page = await pdfDoc.addPage();
      let embedImage = null;
      if (img.type == "image/png") {
        embedImage = await pdfDoc.embedPng(await img.arrayBuffer());
      } else if (img.name.toLowerCase().endsWith(".jpg")) {
        embedImage = await pdfDoc.embedJpg(await img.arrayBuffer());
      } else {
        pdfDoc.removePage(pdfDoc.getPageCount() - 1);
        return;
      }
      const {width, height} = await embedImage.size();
      if (fristPageSize.length == 0 && fixedSize) fristPageSize = [width, height];

      await page.setSize(fristPageSize[0] ?? width, fristPageSize[1] ?? height);
      const embedOption: PDFPageDrawImageOptions = {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      };
      await page.drawImage(embedImage, embedOption);
    }
  });
  await Promise.all(results);

  const pdfB64 = await pdfDoc.save();
  const pdfFile = new File([pdfB64], name ? name + ".pdf" : "pdffile.pdf", {
    type: "application/pdf",
  });
  console.log("File size", formatFileSize(pdfFile.size));
  return pdfFile;
}

export function convertFileSize(byte: number = 0, unit: "B" | "KB" | "MB" | "GB" | "TB" = "MB", floating_point: number = 2): number {
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

  return parseFloat((byte / conversionFactor).toFixed(floating_point));
}

export async function splitPDF(pdf: File, limit = 20) {
  const pdfDocs: PDFDocument[] = [];
  const pdfDocConst = await PDFDocument.load(await pdf.arrayBuffer(), {
    updateMetadata: false,
  });
  const allPagesCount = pdfDocConst.getPageCount();
  let splitSize: number = Math.ceil(convertFileSize(pdf.size, "MB") / limit);
  const pagesPerPdfCount = Math.ceil(allPagesCount / splitSize);
  console.log("AllPagesCount : ", allPagesCount);
  console.log("SplitSize : ", splitSize, pagesPerPdfCount);
  console.log("PagesPerPdfCount : ", pagesPerPdfCount);

  for (let i = 0; i < splitSize; i++) {
    if (pagesPerPdfCount * (i + 1) - 1 < allPagesCount - 1 && i == splitSize - 1) {
      splitSize++;
    }
    pdfDocs[i] = await PDFDocument.create();
    const min = pagesPerPdfCount * i;
    const max = pagesPerPdfCount * (i + 1) - 1 < allPagesCount - 1 ? pagesPerPdfCount * (i + 1) - 1 : allPagesCount - 1;
    //console.log("i : " + i, "Min : " + min, "Max : " + max);

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

export async function imageToWebp(src: string, quality: number = 100): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const img = new Image();

  try {
    img.src = src;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0, img.width, img.height);
      return await new Promise((resolve, reject) => {
        console.log(quality);
        canvas.toBlob(resolve, "image/webp", quality / 100);
        setTimeout(() => canvas.remove(), 500);
      });
    } else {
      throw new Error("Canvas context not available");
    }
  } catch (error) {
    console.error("Error converting image to WebP:", error);
    return null;
  }
}

export function toBase64(imageFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = (event) => resolve(event.target?.result as string);
  });
}

export async function allImagesToWebp(imgs: never[], quality: number) {
  const webps: File[] = [].concat(imgs);
  return await Promise.all(
    webps.map(async (f) => {
      if (f.type.startsWith("image/")) {
        const webp = await imageToWebp(await toBase64(f), quality);
        if (webp)
          return new File([await webp.arrayBuffer()], f.name.split(".")[0] + ".webp", {
            type: "image/webp",
          });
      }
      return f;
    })
  );
}

export async function getFileFromClipboard() {
  try {
    // Request clipboard access
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      // Check if the clipboard item has any file types
      if (item.types[1].startsWith("image/") || item.types.includes("application/pdf")) {
        // Get the file from the clipboard item
        const blob = await item.getType(item.types[1]);

        // Create a File object from the Blob
        const file = new File([blob], "message." + blob.type.split("/")[1], {type: blob.type});

        // Return the file
        return file;
      }
    }

    // No file found in the clipboard
    return null;
  } catch (error) {
    console.error("Failed to read clipboard contents: ", error);
    return null;
  }
}

export function getMimeTypeFromFilename(fname: string): string {
  const extension = fname.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "bmp":
      return "image/bmp";
    case "svg":
      return "image/svg+xml";
    case "pdf":
      return "application/pdf";
    case "txt":
      return "text/plain";
    case "html":
      return "text/html";
    case "css":
      return "text/css";
    case "js":
      return "application/javascript";
    case "json":
      return "application/json";
    case "zip":
      return "application/zip";
    // Add more cases for other mime types as needed
    default:
      return "application/octet-stream"; // Default to generic binary type
  }
}

export async function extractZipFile(file: File) {
  const zip = new ZipReader(new BlobReader(file));
  return await Promise.all((await zip.getEntries({filenameEncoding: "utf-8"})).map(async (entry) => await (entry.getData ? new File([await entry?.getData(new BlobWriter())], entry.filename, {type: getMimeTypeFromFilename(entry.filename)}) : undefined)));
}

export async function createZipFile(files: File[], name: string): Promise<File> {
  const zip = new ZipWriter(new BlobWriter("application/zip"), {bufferedWrite: true});
  files.forEach((f) => {
    zip.add(f.name, new BlobReader(f));
  });
  return new File([await zip.close()], name && name != "" ? name : "ZIP_" + Date.now() + ".zip", {type: "application/zip"});
}

export async function createZipWithLimitSize(files: File[], name: string = "ZIP", limitSize: number): Promise<File[]> {
  let filesset: Array<Array<File> | File> = new Array();
  let count = 0;
  let size = 0;
  for (let f of files) {
    size += convertFileSize(f.size, "MB");
    if (size >= (limitSize - 1 || 24)) {
      filesset[count] = await createZipFile(filesset[count] as File[], name + "-" + count + ".zip");
      count += 1;
      size = convertFileSize(f.size, "MB");
    }
    if (!filesset[count]) filesset[count] = new Array(0) as File[];
    (filesset[count] as Array<File>).push(f);
  }
  filesset[filesset.length - 1] = await createZipFile(filesset[count] as File[], name + "-" + count + ".zip");
  return await Promise.all(filesset as Array<File>);
}

export function sortingFileNameFn(a: string, b: string) {
  if (a.search(/\d+\s/) != -1 && b.search(/\d+\s/) != -1) {
    return parseInt((a?.match(/\d+/) as Array<string>)[0] || a) - parseInt((b?.match(/\d+/) as Array<string>)[0] || b);
  }

  return !(isNaN(parseInt(a)) || isNaN(parseInt(b))) || (a?.search(/(\d+)\./) != -1 && b?.search(/(\d+)\./) != -1) ? parseInt(a?.match(/(\d+)\./) != null ? (a.match(/(\d+)\./) as Array<string>)[1] : a) - parseInt(b?.match(/(\d+)\./) ? (b.match(/(\d+)\./) as Array<string>)[1] : b) : a < b ? -1 : 1;
}
