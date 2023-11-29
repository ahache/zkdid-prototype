import { initialize } from "zokrates-js";
import { source } from '../zk/source.js';
import provingKey from '../zk/provingKey';

const getProof = async (input) => {
    if (input) {
        let formattedProof;
      
        await initialize().then((zokratesProvider) => {
            const artifacts = zokratesProvider.compile(source);
            const { witness } = zokratesProvider.computeWitness(artifacts, [input]);
        
            const proof = zokratesProvider.generateProof(
                artifacts.program,
                witness,
                provingKey
            );

            formattedProof = zokratesProvider.utils.formatProof(proof);
        });
      
        return formattedProof;
    }
};

export default getProof;
