import { blockIdGen } from './utils';

export const sampleBlocks = (() => {
    const positions = [
        { top: 30, left: 30, width: 50, height: 50 },
        { top: 150, left: 460, width: 50, height: 50 },
        { top: 200, left: 150, width: 50, height: 50 },
    ];
    return positions.reduce(
        ({ blockIds, blocks }, position) => {
            const id = blockIdGen();
            return {
                blockIds: [...blockIds, id],
                blocks: { ...blocks, [id]: { ...position, id } },
            };
        },
        { blockIds: [], blocks: {} }
    );
})();
