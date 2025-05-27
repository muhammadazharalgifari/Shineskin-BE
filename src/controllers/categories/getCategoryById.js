import { request, response } from "express";
import db from "../../connector";

async function getCategoryById(req = request, res = response) {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id);

    const category = await db.categories.findUnique({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { getCategoryById };
