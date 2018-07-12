import PropTypes from 'prop-types';

export const BlockIdType = PropTypes.string;
export const LinkIdType = PropTypes.string;

export const LinkItemType = PropTypes.shape({
    id: LinkIdType,
    startId: BlockIdType,
    endId: BlockIdType,
});

export const BlockItemType = PropTypes.shape({
    id: BlockIdType,
    top: PropTypes.number,
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    parentBlock: BlockItemType,
});
