import { prisma } from "lib/prismaClient";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { STATUS_INACTIVE, STORE_ADMIN_ROLE } from "utils/constants";

export async function POST(req) {
    try {
        const body = await req.json();
        const { first_name, last_name, email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.users.findFirst({ where: { email } });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role: STORE_ADMIN_ROLE, // Default role for registered users
                status: STATUS_INACTIVE, // Default inactive for registered users
                is_deleted: 0,
            },
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            data: {
                id: newUser.id,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
