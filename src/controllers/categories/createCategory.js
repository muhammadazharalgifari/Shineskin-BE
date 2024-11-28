import { request, response } from "express";
import db from "../../connector";
import { PrismaClient } from "@prisma/client";

// Inisialisasi Prisma Client
const prisma = new PrismaClient();

async function category(req = request, res = response) {
  const { name } = req.body;

  try {
    // Validasi input
    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Category name is required",
      });
    }

    // pengecekan nama kategori yg sudah ada
    const existingCategory = await prisma.categories.findFirst({
      where: {
        name: name,
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category with this name already exists",
      });
    }

    const response = await db.categories.create({
      data: {
        name,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { category };
