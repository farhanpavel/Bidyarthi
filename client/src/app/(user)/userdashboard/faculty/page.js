"use client";
import React, { useState, useEffect } from "react";
import { BookOpenText, HandPlatter, Plus, Trash2 } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export default function Page() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [routineImage, setRoutineImage] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [classOnDate, setClassOnDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [todolist, setTodolist] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  var token = Cookies.get("token");

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await fetch(`${url}/api/routine`, {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch routine");
        }

        const data = await response.json();
        setSchedule(data.schedule || {});
        setTodolist(data.todolist || []);
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
    };

    fetchRoutine();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("routineImage", file);

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${url}/api/routine/extract-routine`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to extract routine");
        }

        const data = await response.json();

        const saveResponse = await fetch(`${url}/api/routine/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({
            userId: "currentUserId",
            schedule: data.schedule,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save routine");
        }

        setSchedule(data.schedule);
      } catch (error) {
        console.error("Error uploading routine:", error);
        setError("Error extracting routine. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDialogSubmit = () => {
    setIsDialogOpen(false);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const day = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    setClassOnDate(schedule[day] || "No class scheduled for this date.");
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const day = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      const classes = schedule[day];

      if (classes) {
        const colors = {
          SUNDAY: "bg-gradient-to-r from-pink-400 to-pink-600",
          MONDAY: "bg-gradient-to-r from-blue-400 to-blue-600",
          TUESDAY: "bg-gradient-to-r from-purple-400 to-purple-600",
          WEDNESDAY: "bg-gradient-to-r from-green-400 to-green-600",
          THURSDAY: "bg-gradient-to-r from-yellow-400 to-yellow-600",
          FRIDAY: "bg-gradient-to-r from-red-400 to-red-600",
          SATURDAY: "bg-gradient-to-r from-indigo-400 to-indigo-600",
        };

        return (
          <div
            className={`w-2 h-2 rounded-full ${colors[day]} mx-auto shadow-lg`}
          />
        );
      }
    }
    return null;
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        const response = await fetch(`${url}/api/todolist/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token },
          body: JSON.stringify({
            routineId: "currentRoutineId",
            task: newTodo,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add to-do");
        }

        const todo = await response.json();
        setTodolist([...todolist, todo]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding to-do:", error);
      }
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      const response = await fetch(`${url}/api/todolist/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update to-do");
      }

      const updatedTodo = await response.json();
      setTodolist(
        todolist.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error("Error updating to-do:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${url}/api/todolist/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete to-do");
      }

      setTodolist(todolist.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting to-do:", error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="p-9">
        <div className="flex gap-x-2 items-center text-black">
          <BookOpenText className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">ফ্যাকালটি</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
        শিক্ষামূলক কার্যক্রমের তথ্য
        </p>

        <div className="mt-5">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="flex justify-between items-center mb-6"
          >
            <h2 className="text-2xl font-bangla font-bold text-purple-700">
              ক্যালেন্ডার
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bangla shadow-lg"
              onClick={() => setIsDialogOpen(true)}
              disabled={loading}
            >
              {loading ? "Processing..." : "রুটিন আপলোড করুন"}
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="calendar-wrapper rounded-xl overflow-hidden p-6 w-full"
        >
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            className="react-calendar border-0  w-[500px] text-lg" // Increase height and font size
            tileContent={tileContent}
          />
        </motion.div>

        {selectedDate && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="mt-6 p-6 bg-white rounded-xl shadow-lg"
          >
            <h3 className="font-bangla font-bold text-xl text-purple-700">
              {selectedDate.toDateString()}
            </h3>
            <p className="font-bangla mt-2 text-gray-700">{classOnDate}</p>
          </motion.div>
        )}

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mt-6 p-6 bg-white rounded-xl shadow-lg"
        >
          <h3 className="font-bangla font-bold text-xl text-purple-700 mb-4">
          আপনার কাজগুলোর পরিকল্পনা করুন
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="নতুন কাজ যোগ করুন"
              onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddTodo}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-md flex items-center gap-2"
            >
              <Plus size={20} />
              যোগ করুন
            </motion.button>
          </div>

          <motion.ul className="mt-4 space-y-2">
            <AnimatePresence>
              {todolist.map((todo) => (
                <motion.li
                  key={todo.id}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <motion.span
                    className={`flex-1 cursor-pointer ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                    onClick={() => handleToggleTodo(todo.id, todo.completed)}
                    whileHover={{ scale: 1.01 }}
                  >
                    {todo.task}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle className="font-bangla text-xl text-purple-700">
                রুটিন আপলোড করুন
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="font-bangla border-purple-200 focus:ring-purple-400"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <DialogFooter>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDialogSubmit}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bangla"
              >
                জমা দিন
              </motion.button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
