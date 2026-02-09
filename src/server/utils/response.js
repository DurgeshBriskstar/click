// src/server/utils/response.js
import { NextResponse } from "next/server";

export function success(data, status = 200) {
    const response = {
        success: true,
        message: data?.message || "",
        data: data?.data || null
    };

    if (data?.count) response.count = data?.count;

    return NextResponse.json(response, { status });
}

export function error(message, status = 400) {
    return NextResponse.json({ success: false, message }, { status });
}
