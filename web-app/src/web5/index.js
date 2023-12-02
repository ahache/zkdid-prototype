import { Web5 } from '@web5/api/browser';

export const writeProofToDWN = async proof => {
    const { web5, did } = await Web5.connect();
    const { record } = await web5.dwn.records.create({
        data: proof,
        message: {
            dataFormat: 'application/json',
            published: true
        }
    });

    // await record.send(did);

    return { record, did };
}

// This function is used to get a record from your DWN
export const getProofFromDWN = async recordId => {
    const { web5 } = await Web5.connect();
    let { record } = await web5.dwn.records.read({
        message: {
            filter: {
                recordId: recordId
            }
        }
    });

    const text = await record.data.text();

    return text;
}

// This function is used to get a record from a specified ION DID DWN
export const queryProofFromDWN = async (ionDid, recordId) => {
    const { web5 } = await Web5.connect();
    let { record } = await web5.dwn.records.read({
        from: ionDid,
        message: {
            filter: {
                recordId: recordId
            }
        }
    });

    const text = await record.data.text();

    return text;
}
