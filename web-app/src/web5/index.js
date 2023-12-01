import { Web5 } from '@web5/api/browser';

export const writeProofToDWN = async proof => {
    const { web5 } = await Web5.connect();
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
