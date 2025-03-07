import prisma from "../db.js";


export const addTodo = async (req, res) => {
  const routineId = req.user.id;
  const { task } = req.body;

  try {
    const todo = await prisma.todolist.create({
      data: { routineId, task },
    });

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error adding to-do:", error);
    res.status(500).json({ error: "Failed to add to-do" });
  }
};


export const updateTodo = async (req, res) => {
  const { id, completed } = req.body;

  try {
    const todo = await prisma.todolist.update({
      where: { id },
      data: { completed },
    });

    res.status(200).json(todo);
  } catch (error) {
    console.error("Error updating to-do:", error);
    res.status(500).json({ error: "Failed to update to-do" });
  }
};


export const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.todolist.delete({
      where: { id },
    });

    res.status(200).json({ message: "To-do deleted successfully" });
  } catch (error) {
    console.error("Error deleting to-do:", error);
    res.status(500).json({ error: "Failed to delete to-do" });
  }
};
