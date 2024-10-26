// lib/prisma.js

const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'development') {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = new PrismaClient();
}

// Log connection success
async function connect() {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Call the connect function to log the connection status
connect();

module.exports = prisma;
