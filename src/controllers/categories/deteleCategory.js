import { request, response } from "express";
import db from "../../connector";
import { category } from "./createCategory";


async function deleteCategory(req = request, res = response) {
  try {
    const { id } = req.params;
    const categoriId = parseInt(id);

    if (isNaN(categoriId)){
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID"
      });
    }

    const findCategory = await db.categories.findUnique({
      where: {
        id: categoriId,
      }
    });

    if (!findCategory) {
      return res.status(404).json({
        status: "error",
        message: `Category with ID ${id} not found`,
      });
    }

    const response = await db.categories.delete({
      where: {
        id: categoriId,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      category: response.name,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

export { deleteCategory }