import { PrismaClient } from '@prisma/client';

export class House {
  id!: number;
  address!: string;
  currentValue!: number;
  loanAmount!: number;
  risk!: number | null;
}

const prismaClient = new PrismaClient();

export const getAllHouses = (): Promise<House[]> => {
  return prismaClient.house.findMany();
};

export const getHouse = async (id: House['id']): Promise<House | null> => {
  const res = await prismaClient.house.findFirst({
    where: { id },
  });
  return res;
};

export const updateHouse = async (
  id: House['id'],
  update: Partial<House>
): Promise<House | null> => {
  const { currentValue, loanAmount } = (await getHouse(id)) as House;
  return prismaClient.house.update({
    where: { id },
    data: {
      ...update,
      risk: calculateRisk(
        update.loanAmount ?? loanAmount,
        update.currentValue ?? currentValue
      ),
    },
  });
};

export const createHouse = async (
  data: Omit<House, 'id'>
): Promise<House | null> => {
  return prismaClient.house.create({
    data: { ...data, risk: calculateRisk(data.loanAmount, data.currentValue) },
  });
};

export const calculateRisk = (loan: number, value: number): number => {
  let risk = loan / value;
  if (loan > 0.5 * value) risk += 0.1;
  return Math.min(1, Math.max(0, risk));
};
