export const idGenerator = (prefix = '', start = 0) => {
    let id = start;
    return () => prefix ? `${prefix}${id++}` : id;
};
export const blockIdGen = idGenerator('b');

export const getCenter = ({ top, left, width, height }) => [+left + width / 2, +top + height / 2];
export const getPosFromCenter = ({top, left, width, height}) => [[+left - width / 2, +top - height / 2]];

export const calcLine = ([x1, y1], [x2, y2]) => {
    const x = Math.abs(x2 - x1);
    const y = Math.abs(y2 - y1);
    const width = Math.sqrt(x ** 2 + y ** 2);
    let angle = Math.acos(x / width);
    if (y2 < y1) {
        angle = -angle;
    }

    if (x2 < x1) {
        angle = Math.PI - angle;
    }

    return { x1, y1, x2, y2, width, angle };
};