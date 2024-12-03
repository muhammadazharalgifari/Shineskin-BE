import { request, response } from "express";
import db from "../../connector";

async function getCategory(req = request, res = response) {
  try {
    const response = await db.categories.findMany({
      select: {
        id: true,
        name: true,
        products: true,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Get categories successfully",
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

export { getCategory };
