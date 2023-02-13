const rawDbImageStr: Buffer = Buffer.from([
    0x52, 0x61, 0x77, 0x44, 0x61, 0x74, 0x61,
    0x62, 0x61, 0x73, 0x65, 0x49, 0x6D, 0x61,
    0x67, 0x65,
]);

const magic = Buffer.from([0x47, 0x56, 0x41, 0x53]);

const useSave = (rawSaveFile: ArrayBuffer | undefined) => {
    const findBufferIndex = (buffer: ArrayBuffer, search: Buffer) => {
        const bufferView = new Uint8Array(buffer);
        const searchView = new Uint8Array(search);
        const bufferLength = bufferView.length;
        const searchLength = searchView.length;
        for (let i = 0; i < bufferLength; i++) {
            if (bufferView[i] === searchView[0]) {
                let found = true;
                for (let j = 1; j < searchLength; j++) {
                    if (bufferView[i + j] !== searchView[j]) {
                        found = false;
                        break;
                    }
                }
                if (found) {
                    return i;
                }
            }
        }
        return -1;
    }

    const extractDb = (saveData: ArrayBuffer | undefined) => {
        if (!saveData) return { dbData: undefined, imageStrStart: undefined, dbEndOffset: undefined };
        const enc = new TextDecoder("utf-8");
        // check first 4 bytes for magic header
        const magicBytes = saveData.slice(0, 4);
        if (!magic.equals(Buffer.from(magicBytes))) {
            throw new Error("invalid save file");
        }
        const imageStrStart = findBufferIndex(saveData, rawDbImageStr);
        if (imageStrStart === -1) {
            throw new Error("couldn't find db image string");
        }
        const dbSizeOffset = imageStrStart + 61;
        const dbStartOffset = dbSizeOffset + 4;
        const dbSizeBytes = saveData.slice(dbSizeOffset, dbStartOffset);
        const dbSize = new DataView(dbSizeBytes).getUint32(0, true);
        const dbEndOffset = dbStartOffset + dbSize;
        const dbData = saveData.slice(dbStartOffset, dbEndOffset);
        return { dbData, imageStrStart, dbEndOffset };
    }

    const { dbData, dbEndOffset, imageStrStart } = extractDb(rawSaveFile);

    // write database back to save file
    const writeDb = (updatedDbBytes: ArrayBuffer) => {
        if (!rawSaveFile) throw new Error("saveData is undefined");
        if (!dbEndOffset) throw new Error("dbEndOffset is undefined");
        if (!imageStrStart) throw new Error("imageStrStart is undefined");

        // console log first 4 bytes of updatedDbBytes as string
        const buf = new Uint8Array(4);

        const updatedDbBytesUint8 = new Uint8Array(updatedDbBytes);
        const saveDataUint8 = new Uint8Array(rawSaveFile);
        const updatedDbSize = updatedDbBytesUint8.length;
        const dataView = new DataView(buf.buffer);
        dataView.setUint32(0, updatedDbSize + 4, true);

        const outArray = new Uint8Array(
            saveDataUint8.length + updatedDbSize + buf.length * 2
        );
        let offset = 0;

        outArray.set(saveDataUint8.slice(0, imageStrStart + 35), offset);
        offset += imageStrStart + 35;

        outArray.set(buf, offset);
        offset += buf.length;

        outArray.set(saveDataUint8.slice(imageStrStart + 39, imageStrStart + 61), offset);
        offset += imageStrStart + 61 - imageStrStart - 39;

        dataView.setUint32(0, updatedDbSize, true);
        outArray.set(buf, offset);
        offset += buf.length;

        outArray.set(updatedDbBytesUint8, offset);
        offset += updatedDbSize;

        outArray.set(saveDataUint8.slice(dbEndOffset), offset);

        return outArray.buffer;
    }


    return {
        dbData,
        dbEndOffset,
        imageStrStart,
        writeDb,
    };
}

export default useSave;

