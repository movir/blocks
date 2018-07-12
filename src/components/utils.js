export const idGenerator = (prefix = '', start = 0) => {
    let id = start;
    return () => prefix ? `${prefix}${id++}` : id;
};
export const blockIdGen = idGenerator('b');

export const getCenter = ({ top, left, width, height }) => [+left + width / 2, +top + height / 2];
export const getPosFromCenter = ({top, left, width, height}) => [[+left - width / 2, +top - height / 2]];