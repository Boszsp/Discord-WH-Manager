import {createMessage, encrypt, readMessage, decrypt} from "openpgp/lightweight";
const session = useCookie("session");
const config = useAppConfig();
export async function convertFileToMessage(file: File) {
  //const reader = new FileReaderSync();
  const arrayBuffer = await file.arrayBuffer();
  const message = await createMessage({
    binary: new Uint8Array(arrayBuffer),
    filename: file.name,
  });
  
  return message;
}

export async function uint8ArrayToFiles(uint8Array: Uint8Array, filename: string, file_type: string) {
  return new File([uint8Array], filename, {type: file_type});
}

export async function encryptFile(file: File, password: string = "DWHM@nager") {
  password +=  session.value as string || ""
  const encrypted = await encrypt({
    message: await convertFileToMessage(file), // input as Message object
    passwords: [password , "DWHM@nager"], // multiple passwords possible
    format: "binary", // don't ASCII armor (for Uint8Array output)
  });
  return await uint8ArrayToFiles(encrypted, "encrypted_" + file.name, file.type);
}

export async function decryptFile(file: File, password: string = "DWHM@nager") {
  password +=  session.value as string || ""
  const arrayBuffer = await file.arrayBuffer();
  const encryptedMessage = await readMessage({
    binaryMessage: new Uint8Array(arrayBuffer), // parse encrypted bytes
  });
  const {data: decrypted} = await decrypt({
    message: encryptedMessage,
    passwords: [password , "DWHM@nager"], // decrypt with password
    format: "binary", // output as Uint8Array
  });
  return await uint8ArrayToFiles(decrypted, file.name.replace("encrypted_", ""), file.type);
}
