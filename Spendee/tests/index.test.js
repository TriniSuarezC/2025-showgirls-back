const request = require("supertest");
const app = require("../index");
const { PrismaClient } = require("@prisma/client");

jest.mock("@prisma/client", () => {
  const mPrisma = {
    gasto: { findMany: jest.fn() },
    ingreso: { findMany: jest.fn(), create: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe("GET /", () => {
  it("Cuando se ingresa a la ruta basica, debe aparecer un mensaje de bienvenida", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API de Gestion de Gastos");
  });
});

describe("GET /gasto", () => {
  let prisma;
  beforeEach(() => {
    prisma = new PrismaClient();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Cuando no hay gastos, la respuesta debe ser una lista vacía", async () => {
    prisma.gasto.findMany.mockResolvedValue([]);
    const res = await request(app).get("/gasto");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
  it("Cuando hay gastos, la respuesta debe ser una lista con los gastos", async () => {
    const gastosMock = [
      {
        id: 1,
        usuarioId: 1,
        gasto: 50,
        montoAnterior: 100,
        fecha: String(new Date()),
      },
      {
        id: 2,
        usuarioId: 1,
        gasto: 30,
        montoAnterior: 50,
        fecha: String(new Date()),
      },
    ];
    prisma.gasto.findMany.mockResolvedValue(gastosMock);
    const res = await request(app).get("/gasto");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(gastosMock);
  });
});
