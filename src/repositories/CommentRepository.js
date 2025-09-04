import { prismaClient } from "../../database/PrismaClient.js";

export class CommentRepository {
  async findAll(params) {
    return prismaClient.comment.findMany(params);
  }

  async count(where) {
    return prismaClient.comment.count({ where });
  }

  async findUnique(id) {
    return prismaClient.comment.findUnique({ where: { id } });
  }

  async create(data) {
    return prismaClient.comment.create({ data, include: { user: { select: { id: true, name: true } } } });
  }

  async delete(id) {
    return prismaClient.comment.delete({ where: { id } });
  }
}