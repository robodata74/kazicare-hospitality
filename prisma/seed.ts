import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding KaziCare Hospitality...");
  console.log("");

  // ==========================================================
  // ORGANIZATION
  // ==========================================================

  const organization = await prisma.organization.upsert({
    where: {
      slug: "kazicare-demo",
    },
    update: {
      name: "KaziCare Hospitality",
      email: "kazi_care@outlook.com",
      phone: "+254771696500",
      country: "Kenya",
      timezone: "Africa/Nairobi",
      currency: "KES",
      isActive: true,
    },
    create: {
      name: "KaziCare Hospitality",
      slug: "kazicare-demo",
      email: "kazi_care@outlook.com",
      phone: "+254771696500",
      country: "Kenya",
      timezone: "Africa/Nairobi",
      currency: "KES",
      isActive: true,
    },
  });

  console.log(`✓ Organization: ${organization.name}`);
  console.log(`  Email: ${organization.email}`);
  console.log(`  Phone: ${organization.phone}`);
  console.log(`  ID: ${organization.id}`);
  console.log("");

  // ==========================================================
  // DEPARTMENTS
  // ==========================================================

  const departmentNames = [
    "Kitchen",
    "Front of House",
    "Bar",
    "Management",
    "Support",
  ];

  const departments: Record<
    string,
    {
      id: string;
      name: string;
    }
  > = {};

  for (const name of departmentNames) {
    const department = await prisma.department.upsert({
      where: {
        organizationId_name: {
          organizationId: organization.id,
          name,
        },
      },
      update: {
        isActive: true,
      },
      create: {
        organizationId: organization.id,
        name,
        isActive: true,
      },
    });

    departments[name] = department;

    console.log(`✓ Department: ${name}`);
  }

  console.log("");

  // ==========================================================
  // EMPLOYEES
  // ==========================================================

  const employees = [
    {
      employeeNumber: "E-1001",
      firstName: "Amina",
      lastName: "Wanjiru",
      jobTitle: "Head Chef",
      department: "Kitchen",
      phone: "+254712000111",
      hireDate: "2022-03-14",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1002",
      firstName: "Brian",
      lastName: "Otieno",
      jobTitle: "Line Cook",
      department: "Kitchen",
      phone: "+254712000112",
      hireDate: "2023-06-01",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1003",
      firstName: "Cynthia",
      lastName: "Achieng",
      jobTitle: "Sous Chef",
      department: "Kitchen",
      phone: "+254712000113",
      hireDate: "2021-11-20",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1004",
      firstName: "David",
      lastName: "Kamau",
      jobTitle: "Server",
      department: "Front of House",
      phone: "+254712000114",
      hireDate: "2023-01-09",
      employmentType: "PART_TIME" as const,
    },
    {
      employeeNumber: "E-1005",
      firstName: "Esther",
      lastName: "Njeri",
      jobTitle: "Host",
      department: "Front of House",
      phone: "+254712000115",
      hireDate: "2022-08-15",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1006",
      firstName: "Felix",
      lastName: "Mwangi",
      jobTitle: "Server",
      department: "Front of House",
      phone: "+254712000116",
      hireDate: "2024-02-01",
      employmentType: "CASUAL" as const,
    },
    {
      employeeNumber: "E-1007",
      firstName: "Grace",
      lastName: "Adhiambo",
      jobTitle: "Restaurant Manager",
      department: "Management",
      phone: "+254712000117",
      hireDate: "2020-05-10",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1008",
      firstName: "Hassan",
      lastName: "Ali",
      jobTitle: "Bartender",
      department: "Bar",
      phone: "+254712000118",
      hireDate: "2022-09-23",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1009",
      firstName: "Irene",
      lastName: "Chebet",
      jobTitle: "Barback",
      department: "Bar",
      phone: "+254712000119",
      hireDate: "2023-04-04",
      employmentType: "PART_TIME" as const,
    },
    {
      employeeNumber: "E-1010",
      firstName: "James",
      lastName: "Kiptoo",
      jobTitle: "Dishwasher",
      department: "Support",
      phone: "+254712000120",
      hireDate: "2023-10-30",
      employmentType: "FULL_TIME" as const,
    },
    {
      employeeNumber: "E-1011",
      firstName: "Kevin",
      lastName: "Njoroge",
      jobTitle: "Cleaner",
      department: "Support",
      phone: "+254712000121",
      hireDate: "2024-01-12",
      employmentType: "CASUAL" as const,
    },
    {
      employeeNumber: "E-1012",
      firstName: "Lucy",
      lastName: "Wambui",
      jobTitle: "Server",
      department: "Front of House",
      phone: "+254712000122",
      hireDate: "2023-07-19",
      employmentType: "PART_TIME" as const,
    },
  ];

  for (const employee of employees) {
    const department = departments[employee.department];

    if (!department) {
      throw new Error(
        `Department not found: ${employee.department}`
      );
    }

    await prisma.employee.upsert({
      where: {
        organizationId_employeeNumber: {
          organizationId: organization.id,
          employeeNumber: employee.employeeNumber,
        },
      },

      update: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle,
        departmentId: department.id,
        phone: employee.phone,
        employmentType: employee.employmentType,
        status: "ACTIVE",
        hireDate: new Date(employee.hireDate),
      },

      create: {
        organizationId: organization.id,
        departmentId: department.id,
        employeeNumber: employee.employeeNumber,
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle,
        phone: employee.phone,
        employmentType: employee.employmentType,
        status: "ACTIVE",
        hireDate: new Date(employee.hireDate),
      },
    });

    console.log(
      `✓ Employee: ${employee.firstName} ${employee.lastName}`
    );
  }

  // ==========================================================
  // SUMMARY
  // ==========================================================

  const employeeCount = await prisma.employee.count({
    where: {
      organizationId: organization.id,
    },
  });

  const departmentCount = await prisma.department.count({
    where: {
      organizationId: organization.id,
    },
  });

  console.log("");
  console.log("============================================================");
  console.log("✅ KaziCare Hospitality seed completed successfully");
  console.log("============================================================");
  console.log(`Organization : ${organization.name}`);
  console.log(`Slug         : ${organization.slug}`);
  console.log(`Organization ID: ${organization.id}`);
  console.log(`Email        : ${organization.email}`);
  console.log(`Phone        : ${organization.phone}`);
  console.log(`Departments  : ${departmentCount}`);
  console.log(`Employees    : ${employeeCount}`);
  console.log("============================================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ KaziCare Hospitality seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });