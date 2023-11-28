import { initialize } from "zokrates-js";
import { source } from '../zk/source.js';
import provingKey from '../zk/provingKey';

const getProof = async (input) => {
  let proof;

  await initialize().then((zokratesProvider) => {
    const artifacts = zokratesProvider.compile(source);
    const { witness } = zokratesProvider.computeWitness(artifacts, [input]);

    proof = zokratesProvider.generateProof(
      artifacts.program,
      witness,
      provingKey
    );
  });
  
  return proof;
};

export default getProof;
