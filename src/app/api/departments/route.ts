import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/departments?organizationId=<id>
 *
 * Returns departments belonging to one organization.
 */
export async function GET(request: NextRequest) {
  try {
    const organizationId =
      request.nextUrl.searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        {
          status: "error",
          message: "organizationId is required",
        },
        { status: 400 }
      );
    }

    const departments = await prisma.department.findMany({
      where: {
        organizationId,
      },
      include: {
        _count: {
          select: {
            employees: true,
            shifts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      status: "ok",
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("GET /api/departments failed:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Unable to retrieve departments",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/departments
 *
 * Creates a department inside an organization.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      organizationId,
      name,
      description,
    } = body;

    if (!organizationId || !name) {
      return NextResponse.json(
        {
          status: "error",
          message: "organizationId and name are required",
        },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: {
        organizationId,
        name: name.trim(),
        description: description?.trim() || null,
      },
      include: {
        _count: {
          select: {
            employees: true,
            shifts: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        data: department,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/departments failed:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Unable to create department",
      },
      { status: 500 }
    );
  }
}