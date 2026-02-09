// @mui
import PropTypes from 'prop-types';
import BodyCell from './BodyCell';
import CustomBodyRow from './CustomBodyRow';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
    isNotFound: PropTypes.bool,
    text: PropTypes.string,
};

export default function TableNoData({ isNotFound, text = "No Data Found" }) {
    return (
        <>
            {isNotFound ? (
                <CustomBodyRow>
                    <BodyCell colSpan={10} align={"center"}>{text}</BodyCell>
                </CustomBodyRow>
            ) : null}
        </>
    );
}
