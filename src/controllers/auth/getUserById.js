import { request, response } from "express";
import db from "../../connector";

async function getUserById(req = request, res = response) {
  try {
    const { id } = req.params;

    const user = await db.users.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        imageProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: `User with ID ${id} not found`,
      });
    }

    res.status(200).json({
      status: "success",
      user: user,
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
