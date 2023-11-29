import { Web5 } from '@web5/api/browser';

const { web5, did } = await Web5.connect();

export const writeProofToDWN = async proof => {
    const { record } = await web5.dwn.records.create({
        data: proof,
        message: {
            dataFormat: 'application/json',
            published: true
        }
    });

    return record;
}

export const getRecordFromDWN = async recordId => {
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
