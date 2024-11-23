import { request, response } from "express";
import db from "../../connector";

async function deleteUser(req = request, res = response) {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID",
      });
    }

    const findUser = await db.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      return res.status(404).json({
        status: "error",
        message: `User with ID ${id} not found`,
      });
    }

    const response = await db.users.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      user: response.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { deleteUser };
