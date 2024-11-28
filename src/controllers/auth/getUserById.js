import { request, response } from "express";
import db from "../../connector";

async function getUserById(req = request, res = response) {
  try {
    const userId = req.userId;
    const response = await db.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        imageProfile: true,
      },
    });

    // Jika user tidak ditemukan
    if (!response) {
      return res.status(404).json({
        status: "error",
        message: `User with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: "success",
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

export { getUserById };
