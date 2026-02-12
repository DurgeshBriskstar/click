import React, { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Box, Typography, IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { getFileFullPath } from "utils/formats";
import { maxSizeBytes } from "utils/constants";

const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "");

const CImageUpload = ({ name, control, label, error, rules, multiple = false, maxFiles = 1, accept = { "image/*": [] }, ...rest }) => {

    const DropzoneField = ({ value, onChange }) => {
        const [sizeError, setSizeError] = useState(null);
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
            accept,
            multiple,
            maxFiles,
            maxSize: maxSizeBytes,
            onDropRejected: () => setSizeError(`Please upload an image smaller than ${maxSizeMB} MB`),
            onDrop: async (acceptedFiles) => {
                setSizeError(null);
                const toBase64 = (file) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });

                if (multiple) {
                    const files = acceptedFiles.slice(0, maxFiles);
                    const payload = await Promise.all(
                        files.map(async (file) => ({
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            base64: await toBase64(file)
                        }))
                    );
                    onChange(payload);
                } else {
                    const file = acceptedFiles[0];
                    if (!file) {
                        onChange(null);
                        return;
                    }
                    onChange({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        base64: await toBase64(file)
                    });
                }
            },
        });

        const handleRemove = (e, index = null) => {
            e.stopPropagation();
            if (multiple && index !== null) {
                if (!Array.isArray(value)) return;
                const newValues = value.filter((_, i) => i !== index);
                onChange(newValues.length > 0 ? newValues : null);
            } else {
                onChange(null);
            }
        };

        const hasImage = !!value && (multiple ? Array.isArray(value) && value.length > 0 : true);

        const previewSources = useMemo(() => {
            if (!hasImage) return null;

            const normalise = (item) => item;

            if (multiple) {
                return Array.isArray(value) ? value.map(normalise) : [];
            }

            return normalise(value);
        }, [hasImage, multiple, value]);

        const getSrc = (item) => {
            if (!item) return "";

            // CASE 1: BASE64 (fresh upload)
            if (typeof item === "object" && item.base64) {
                return item.base64;
            }

            // CASE 2: PATH FROM BACKEND → convert to full path
            if (typeof item === "string" && item.startsWith("/")) {
                return getFileFullPath(item);
            }

            // CASE 3: object with path
            if (typeof item === "object" && (item.path || item.relativePath)) {
                return getFileFullPath(item.path || item.relativePath);
            }

            // CASE 4: File object from drag-drop
            if (item instanceof File) {
                return URL.createObjectURL(item);
            }

            return item;
        };

        return (
            <Box sx={{ width: "100%", ...rest }}>
                {label && (<Typography sx={{ mb: 1, fontWeight: 500 }}>{label}</Typography>)}

                <Box
                    {...getRootProps()}
                    sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 2,
                        padding: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        backgroundColor: isDragActive ? "#f1f1f1" : (hasImage ? "#f9f9f9" : "transparent"),
                        transition: "0.2s",
                        minHeight: hasImage ? 200 : "auto",
                        position: "relative",
                        height: '200px',
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <input {...getInputProps()} />

                    {hasImage ? (
                        <Box sx={{ position: "relative", width: "100%", maxWidth: 300 }}>
                            {multiple ? (
                                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                                    {Array.isArray(previewSources) && previewSources.map((item, index) => (
                                        <Box key={index} sx={{ position: "relative" }}>
                                            <img
                                                src={getSrc(item)}
                                                alt={`preview ${index + 1}`}
                                                style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd", }}
                                            />
                                            <IconButton
                                                onClick={(e) => handleRemove(e, index)}
                                                sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "white", width: 24, height: 24, "&:hover": { bgcolor: "error.dark", }, }}
                                                size="small"
                                            >
                                                <ClearIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Box sx={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={getSrc(previewSources)}
                                        alt="preview"
                                        style={{ width: "100%", maxWidth: 300, height: "auto", maxHeight: 120, objectFit: "contain", borderRadius: 8, border: "1px solid #ddd", }}
                                    />
                                    <IconButton
                                        onClick={(e) => handleRemove(e)}
                                        sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "white", width: 28, height: 28, "&:hover": { bgcolor: "error.dark", }, }}
                                        size="small"
                                    >
                                        <ClearIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Box>
                            )}
                            <Typography sx={{ mt: 2, fontSize: 12, color: "text.secondary" }}>Click to change image</Typography>
                        </Box>
                    ) : (
                        <Typography>{isDragActive ? "Drop the image here..." : "Drag & drop an image here, or click to upload"}</Typography>
                    )}
                </Box>

                {(error || sizeError) && (<Typography color="error" sx={{ mt: 1 }}>{error?.message || sizeError}</Typography>)}
            </Box>
        );
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={rules || {}}
            render={({ field }) => (
                <DropzoneField
                    value={field.value}
                    onChange={field.onChange}
                />
            )}
        />
    );
};

export default CImageUpload;
