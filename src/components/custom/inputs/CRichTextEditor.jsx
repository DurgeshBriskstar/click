"use client";

"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { Controller } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const CRichTextEditor = ({
    name,
    control,
    label,
    placeholder = "Enter content...",
    error,
    rules,
    height = "300px",
    ...rest
}) => {
    const quillRef = useRef(null);

    // Convert file to base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Link handler for Quill - ensures URLs have protocol
    const linkHandler = useCallback(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection();
        if (!range) return;

        let url = prompt("Enter link URL:");
        if (url) {
            // Add https:// if no protocol is specified
            if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
                url = "https://" + url;
            }
            quill.format("link", url);
        }
    }, []);

    // Image handler for Quill
    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            try {
                // Convert to base64
                const base64 = await fileToBase64(file);

                // Get Quill instance
                const quill = quillRef.current?.getEditor();
                if (!quill) return;

                // Get current selection
                const range = quill.getSelection(true);
                if (!range) return;

                // Insert image at cursor position
                quill.insertEmbed(range.index, "image", base64);

                // Move cursor after image
                quill.setSelection(range.index + 1);
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        };
    }, []);

    // Quill modules configuration
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ font: [] }],
                    [{ size: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                    link: linkHandler,
                },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [imageHandler, linkHandler]
    );

    // Quill formats
    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "indent",
        "script",
        "color",
        "background",
        "align",
        "link",
        "image",
        "video",
    ];

    return (
        <Controller
            name={name}
            control={control}
            rules={rules || {}}
            render={({ field }) => (
                <Box sx={{ width: "100%" }}>
                    {label && (
                        <Typography
                            sx={{
                                mb: 1,
                                fontSize: 13,
                                fontWeight: 500,
                                display: "block",
                                color: "text.secondary",
                            }}
                        >
                            {label}
                        </Typography>
                    )}
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: "4px",
                            "& .quill": {
                                backgroundColor: "#fff",
                                "& .ql-container": {
                                    height: height,
                                    fontSize: "14px",
                                    fontFamily: "inherit",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                },
                                "& .ql-editor": {
                                    minHeight: height,
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    "&.ql-blank::before": {
                                        fontStyle: "normal",
                                        color: "rgba(0, 0, 0, 0.6)",
                                        content: `"${placeholder}"`,
                                    },
                                    "& p, & ol, & ul, & li": {
                                        margin: 0,
                                        padding: 0,
                                    },
                                    "& ol, & ul": {
                                        paddingLeft: "1.5em",
                                    },
                                    "& ol": {
                                        listStyleType: "decimal",
                                    },
                                    "& ul": {
                                        listStyleType: "disc",
                                    },
                                },
                                "& .ql-toolbar": {
                                    borderTopLeftRadius: "4px",
                                    borderTopRightRadius: "4px",
                                    borderBottom: "1px solid rgba(0, 0, 0, 0.23)",
                                    backgroundColor: "#fff",
                                    "& .ql-stroke": {
                                        stroke: "#444",
                                    },
                                    "& .ql-fill": {
                                        fill: "#444",
                                    },
                                    "& .ql-picker-label": {
                                        color: "#444",
                                    },
                                },
                                "& .ql-container": {
                                    borderBottomLeftRadius: "4px",
                                    borderBottomRightRadius: "4px",
                                },
                                "& .ql-toolbar.ql-snow": {
                                    border: "1px solid rgba(0, 0, 0, 0.23)",
                                    borderBottom: "none",
                                },
                                "& .ql-container.ql-snow": {
                                    border: "1px solid rgba(0, 0, 0, 0.23)",
                                    borderTop: "none",
                                },
                                "& .ql-toolbar.ql-snow:hover": {
                                    border: error ? "1px solid #d32f2f" : "1px solid rgba(0, 0, 0, 0.87)",
                                },
                                "& .ql-container.ql-snow:hover": {
                                    border: error ? "1px solid #d32f2f" : "1px solid rgba(0, 0, 0, 0.87)",
                                },
                                "& .ql-toolbar.ql-snow.ql-focused": {
                                    border: error ? "2px solid #d32f2f" : "2px solid #1976d2",
                                },
                                "& .ql-container.ql-snow.ql-focused": {
                                    border: error ? "2px solid #d32f2f" : "2px solid #1976d2",
                                },
                            },
                        }}
                    >
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={field.value || ""}
                            onChange={(content) => {
                                field.onChange(content);
                            }}
                            modules={modules}
                            formats={formats}
                            placeholder={placeholder}
                            {...rest}
                        />
                    </Box>
                    {error && (
                        <Typography
                            mt={0.5}
                            component="label"
                            variant="caption"
                            fontWeight="regular"
                            color="error"
                        >
                            {error.message}
                        </Typography>
                    )}
                </Box>
            )}
        />
    );
};

export default CRichTextEditor;

