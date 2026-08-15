import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/employees?organizationId=<id>
 *
 * Returns employees belonging to a specific organization.
 *
 * NOTE:
 * Authentication and tenant authorization will be added in the
 * security phase. For now, organizationId is required explicitly
 * so we never accidentally query every tenant.
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

    const employees = await prisma.employee.findMany({
      where: {
        organizationId,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    });

    return NextResponse.json({
      status: "ok",
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    console.error("GET /api/employees failed:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Unable to retrieve employees",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/employees
 *
 * Creates an employee inside an organization.
 *
 * Authentication/authorization will be enforced in the security phase.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      organizationId,
      departmentId,
      employeeNumber,
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      employmentType,
      status,
      hireDate,
      hourlyRate,
    } = body;

    if (
      !organizationId ||
      !employeeNumber ||
      !firstName ||
      !lastName ||
      !jobTitle
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "organizationId, employeeNumber, firstName, lastName and jobTitle are required",
        },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        organizationId,
        departmentId: departmentId || null,
        employeeNumber,
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        jobTitle,
        employmentType: employmentType || "FULL_TIME",
        status: status || "ACTIVE",
        hireDate: hireDate ? new Date(hireDate) : null,
        hourlyRate: hourlyRate ?? null,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        data: employee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/employees failed:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "Unable to create employee",
      },
      { status: 500 }
    );
  }
}