import { prismaClient } from "../../database/PrismaClient.js";

export class UserRepository {
  async findAll() {
    return prismaClient.user.findMany({ select: { name: true, email: true } });
  }

  async findUnique(where) {
    return prismaClient.user.findUnique({ 
      where,
      select: { name: true, email: true }
     });
  }

  async findUserWithPassword (where) {
    return prismaClient.user.findUnique({ where })
  }
  
  async create(data) {
    return prismaClient.user.create({
      data,
      select: { id: true, name: true, email: true },
    });
  }

  async update(id, data) {
    return prismaClient.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true },
    });
  }

  async delete(id) {
    return prismaClient.user.delete({ where: { id } });
  }
}
