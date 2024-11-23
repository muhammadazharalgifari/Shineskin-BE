import { request, response } from "express";
import db from "../../connector";

async function getUsers(req = request, res = response) {
  try {
    const response = await db.users.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        imageProfile: true,
      },
    });
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

export { getUsers };
