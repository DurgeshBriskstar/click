import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Button, Stack, Typography } from "@mui/material";

const MySwal = withReactContent(Swal);

export const deleteModal = (onConfirm, isMulti = false, isArchive = false) => {
    MySwal.fire({
        title: `${isArchive ? "Archive" : "Delete"} ${isMulti ? "Records" : "Record"}?`,
        html: (
            <Stack className="muiStack-root" spacing={1}>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.43, textAlign: 'left', color: '#4B566B' }}>
                    Are you sure you want to {isArchive ? "archive" : "delete"} {isMulti ? "selected records" : "this record"}? This action cannot be undo.
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.43, textAlign: 'left', color: '#4B566B' }}>
                    Are you sure you want to continue?
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button className="secondry-btn" onClick={() => Swal.close()} sx={{ color: '#0C0E11', textTransform: 'none', fontWeight: 500, }}>
                        Cancel
                    </Button>
                    <Button
                        className="primary-btn"
                        variant="contained"
                        onClick={() => {
                            onConfirm();
                            Swal.close();
                        }}
                        sx={{ bgcolor: '#E94560', borderRadius: '8px', textTransform: 'none', fontWeight: 500, '&:hover': { bgcolor: '#d63d56' } }}
                    >
                        Yes, {isArchive ? "Archive" : "Delete"}
                    </Button>
                </Stack>
            </Stack>
        ),
        showConfirmButton: false,
        showCancelButton: false,
        heightAuto: true,
        customClass: {
            title: 'swal-custom-title',
        },
    });
};

export const cloneModal = (onConfirm) => {
    MySwal.fire({
        title: "Duplicate Record?",
        html: (
            <Stack className="muiStack-root" spacing={1}>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.43, textAlign: 'left', color: '#4B566B' }}>
                    Are you sure you want to clone this record? A duplicate copy will be created.
                </Typography>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.43, textAlign: 'left', color: '#4B566B' }}>
                    Are you sure you want to continue?
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button className="secondry-btn" onClick={() => Swal.close()} sx={{ color: '#0C0E11', textTransform: 'none', fontWeight: 500, }}>
                        Cancel
                    </Button>
                    <Button
                        className="info-btn"
                        variant="contained"
                        onClick={() => {
                            onConfirm();
                            Swal.close();
                        }}
                        sx={{ bgcolor: '#084698da', borderRadius: '8px', textTransform: 'none', fontWeight: 500, '&:hover': { bgcolor: '#084698' } }}
                    >
                        Yes, Duplicate
                    </Button>
                </Stack>
            </Stack>
        ),
        showConfirmButton: false,
        showCancelButton: false,
        heightAuto: true,
        customClass: {
            title: 'swal-custom-title',
        },
    });
};

export const makePrimaryModal = (onConfirm, hasPrevious = false) => {
    MySwal.fire({
        title: "Make Primary Store?",
        html: (
            <Stack className="muiStack-root" spacing={1}>
                <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.43, textAlign: 'left', color: '#4B566B' }}>
                    Are you sure you want to make this store as the primary store?
                </Typography>
                {hasPrevious && (
                    <Typography sx={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.43, textAlign: 'left', color: '#E94560' }}>
                        Note: The previous primary store will be removed from primary status.
                    </Typography>
                )}
                <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.43, textAlign: 'left', color: '#4B566B' }}>
                    Are you sure you want to continue?
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button className="secondry-btn" onClick={() => Swal.close()} sx={{ color: '#0C0E11', textTransform: 'none', fontWeight: 500, }}>
                        Cancel
                    </Button>
                    <Button
                        className="success-btn"
                        variant="contained"
                        onClick={() => {
                            onConfirm();
                            Swal.close();
                        }}
                        sx={{ bgcolor: '#2e7d32', borderRadius: '8px', textTransform: 'none', fontWeight: 500, '&:hover': { bgcolor: '#1b5e20' } }}
                    >
                        Yes, Make Primary
                    </Button>
                </Stack>
            </Stack>
        ),
        showConfirmButton: false,
        showCancelButton: false,
        heightAuto: true,
        customClass: {
            title: 'swal-custom-title',
        },
    });
};

export const sessionModal = (onConfirm) => {
    const newSwal = Swal.mixin({
        customClass: {
            confirmButton: "al_button al_button-success",
            cancelButton: "al_button al_button-error",
        },
        buttonsStyling: false,
    });

    newSwal.fire({
        title: "Session Expired",
        text: "You have been signed out. Please Sign in again.",
        showCancelButton: false,
        confirmButtonText: "Sign In",
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};
