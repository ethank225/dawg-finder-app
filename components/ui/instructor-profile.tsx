"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ThumbsUp,
  BarChart3,
  Star,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

interface InstructorProfileProps {
  instructor: string;
  title?: string;
  courseData: any;
  open: boolean;
  setOpen: (state: boolean) => void;
}

export function InstructorProfile({
  instructor = "Brett Wortzman",
  title = "Lecturer, Computer Science",
  courseData = {
    Rating: 4.5,
    Difficulty: 3.5,
    "Course Code": "CS 101",
    "Course Title": "Introduction to Computer Science",
    Term: "Spring 2025",
  },
  open,
  setOpen,
}: InstructorProfileProps) {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [courses, setCourses] = useState<any[]>([]);

  //This data is Already in the CourseData. Need to fix this later
  const metrics = [
    { name: "Clear explanations", value: 4.5, percent: 90 },
    { name: "Engaging lectures", value: 4.3, percent: 86 },
    { name: "Helpful feedback", value: 4.0, percent: 80 },
    { name: "Availability", value: 3.8, percent: 76 },
    { name: "Fair grading", value: 4.1, percent: 82 },
  ];

  //End points to get the list of things that this teacher teaches
  const searchInstructorClasses = async (teacherId: string) => {
    try {
      const response = await fetch(
        `/api/searchInstructor?teacherId=${encodeURIComponent(teacherId)}`
      );
      if (!response.ok) throw new Error("Failed to fetch classes");

      const data = await response.json();

      console.log("Fetched courses:", data); // ✅ Debugging: Check API response

      if (!Array.isArray(data)) {
        throw new Error("Invalid API response format");
      }

      setCourses(data); // ✅ Ensuring state update
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  //Make sure the query is ran when you swtich tabs
  useEffect(() => {
    if (activeTab === "courses") {
      searchInstructorClasses(instructor); // Fetch when tab switches
    }
  }, [activeTab]);

  //Make sure that it always opens the evaluations tab first
  useEffect(() => {
    if (open) {
      setActiveTab("evaluations");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl border shadow-lg">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-t-xl relative">
          <div className="flex items-center gap-4">
            <div>
              <DialogHeader>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {instructor}
                </h2>
              </DialogHeader>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {title}
              </p>
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="evaluations"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-8">
              <TabsTrigger
                value="evaluations"
                className={`px-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 h-12 font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 rounded-none transition-all`}
              >
                Evaluations
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className={`px-0 data-[state=active]:shadow-none data-[state=active]:bg-transparent data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 h-12 font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-400 rounded-none transition-all`}
              >
                Courses
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Evaluations Tab */}
          <TabsContent
            value="evaluations"
            className="p-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Instructor Rating Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-0 shadow-md">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 p-3"
                    style={{
                      background: "linear-gradient(to right, #10B981, #22C55E)",
                      padding: "12px",
                    }}
                  >
                    <h3 className="text-sm font-medium text-white flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Instructor Rating
                    </h3>
                  </div>
                  <CardContent className="p-4 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-6 w-6"
                            fill={
                              star <= Math.round(courseData.Rating)
                                ? "#10b981"
                                : "#e5e7eb"
                            }
                            stroke={
                              star <= Math.round(courseData.Rating)
                                ? "#10b981"
                                : "#e5e7eb"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Course Difficulty Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-md">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-red-500 p-3"
                    style={{
                      background: "linear-gradient(to right, #EF4444, #F43F5E)", // Red gradient
                      padding: "12px",
                    }}
                  >
                    <h3 className="text-sm font-medium text-white flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Instructor Difficulty
                    </h3>
                  </div>
                  <CardContent className="p-4 bg-gradient-to-b from-rose-50 to-white dark:from-rose-900/20 dark:to-slate-900">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-6 w-6"
                            fill={
                              star <= Math.round(courseData.Difficulty)
                                ? "#f43f5e"
                                : "#e5e7eb"
                            }
                            stroke={
                              star <= Math.round(courseData.Difficulty)
                                ? "#f43f5e"
                                : "#e5e7eb"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
                Evaluation Metrics
              </h3>
              <div className="space-y-5">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">
                        {metric.name}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {metric.value}/5
                      </span>
                    </div>
                    <div
                      className="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
                      style={{
                        backgroundColor: "#E5E7EB", // Light gray for light mode
                      }}
                    >
                      <motion.div
                        className="absolute bg-muted top-0 left-0 h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${metric.percent}%`,
                          backgroundColor: "blue",
                        }}
                        transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent
            value="courses"
            className="p-6 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="space-y-4">
              {courses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow border">
                    <CardContent className="p-0">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-slate-800 dark:text-white flex items-center">
                            {course.code}
                            <span className="ml-2 flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-3.5 w-3.5"
                                  fill={
                                    star <= Math.round(course.rating)
                                      ? "#3b82f6"
                                      : "#e5e7eb"
                                  }
                                  stroke="none"
                                />
                              ))}
                            </span>
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            {course.name}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {course.quarters.map((quarter, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="flex items-center gap-1 px-2 py-1"
                            >
                              <Calendar className="h-3 w-3" />
                              <span>{quarter}</span>
                            </Badge>
                          ))}

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
