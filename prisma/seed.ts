import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hopebridge.org' },
    update: {},
    create: {
      email: 'admin@hopebridge.org',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // Create NGO Staff
  const staff = await prisma.user.upsert({
    where: { email: 'staff@hopebridge.org' },
    update: {},
    create: {
      email: 'staff@hopebridge.org',
      passwordHash,
      role: Role.NGO_STAFF,
    },
  });

  // Create Volunteer
  let volunteerUser = await prisma.user.findUnique({ where: { email: 'volunteer@example.com' } });
  if (!volunteerUser) {
    volunteerUser = await prisma.user.create({
      data: {
        email: 'volunteer@example.com',
        passwordHash,
        role: Role.VOLUNTEER,
        volunteerProfile: {
          create: {
            name: 'John Doe',
            phone: '1234567890',
            skills: ['Teaching', 'Logistics'],
            availability: 'Weekends',
            location: 'New York',
          },
        },
      },
    });
  }

  // Create Donor
  let donorUser = await prisma.user.findUnique({ where: { email: 'donor@example.com' } });
  if (!donorUser) {
    donorUser = await prisma.user.create({
      data: {
        email: 'donor@example.com',
        passwordHash,
        role: Role.DONOR,
        donorProfile: {
          create: {
            name: 'Jane Smith',
          },
        },
      },
    });
  }

  // Create Beneficiary
  let beneficiaryUser = await prisma.user.findUnique({ where: { email: 'beneficiary@example.com' } });
  if (!beneficiaryUser) {
    beneficiaryUser = await prisma.user.create({
      data: {
        email: 'beneficiary@example.com',
        passwordHash,
        role: Role.BENEFICIARY,
        beneficiaryProfile: {
          create: {
            name: 'Timmy',
            age: 10,
            gender: 'Male',
            location: 'Rural Area',
            familySize: 4,
            program: 'Education',
          },
        },
      },
    });
  }

  // Create Project
  const project = await prisma.project.create({
    data: {
      name: 'Rural Education Initiative',
      description: 'Providing school books and stationary to children in rural areas.',
      goal: 5000,
      startDate: new Date(),
      targetBeneficiaries: 100,
    },
  });

  // Create Event
  const event = await prisma.event.create({
    data: {
      name: 'School Book Distribution',
      description: 'Distributing books to the rural school children.',
      date: new Date(new Date().setDate(new Date().getDate() + 7)), // next week
      location: 'Village Square',
      capacity: 10,
      duration: 4,
      projectId: project.id,
      status: 'OPEN_FOR_REGISTRATION',
    },
  });

  console.log({ admin, staff, volunteerUser, donorUser, beneficiaryUser, project, event });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
