"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, BarChart3, Star } from "lucide-react";
import { motion } from "framer-motion";

interface InstructorProfileProps {
  instructor: string;
  open: boolean;
  setOpen: (state: boolean) => void;
}

export function InstructorProfile({
  instructor = "Brett Wortzman",
  open,
  setOpen,
}: InstructorProfileProps) {
  const [activeTab, setActiveTab] = useState("evaluations");
  const [evaluationData, setEvaluationData] = useState<any>(null);

  // Fetch instructor data from API
  const fetchInstructorData = async (teacherId: string) => {
    try {
      const response = await fetch(
        `/api/searchInstructor?teacherId=${encodeURIComponent(teacherId)}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      console.log("Fetched evaluation data:", data);

      if (Array.isArray(data) && data.length > 0) {
        setEvaluationData(data[0]); // Assuming response is an array with a single object
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
    }
  };

  useEffect(() => {
    if (open && instructor) {
      fetchInstructorData(instructor);
    }
  }, [open, instructor]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl border shadow-lg">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-t-xl relative">
          <DialogHeader>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {instructor}
            </h2>
          </DialogHeader>
        </div>

        <Tabs
          defaultValue="evaluations"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start h-12 bg-transparent p-0 gap-8">
              <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>
          </div>

          {/* Evaluations Tab */}
          <TabsContent value="evaluations" className="p-6">
            
            {evaluationData && (
              <div className="grid grid-cols-2 gap-4">
                {/* Instructor Rating */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card className="border-0 shadow-md">
                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3">
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Instructor Rating
                      </h3>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-6 w-6"
                            fill={star <= Math.round(evaluationData.Rating) ? "#10b981" : "#e5e7eb"}
                            stroke={star <= Math.round(evaluationData.Rating) ? "#10b981" : "#e5e7eb"}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Instructor Difficulty */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                  <Card className="border-0 shadow-md">
                    <div className="bg-gradient-to-r from-rose-500 to-red-500 p-3">
                      <h3 className="text-sm font-medium text-white flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Instructor Difficulty
                      </h3>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-6 w-6"
                            fill={star <= Math.round(evaluationData.Difficulty) ? "#f43f5e" : "#e5e7eb"}
                            stroke={star <= Math.round(evaluationData.Difficulty) ? "#f43f5e" : "#e5e7eb"}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* Evaluation Metrics */}
            {evaluationData && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 text-center">
                  Available Evaluation Metrics
                </h3>
                <div className="space-y-5">
                  {[
                    { name: "Amount Learned", value: evaluationData.amount_learned_median },
                    { name: "Grading Techniques", value: evaluationData.grading_techniques_median },
                    { name: "Instructor Contribution", value: evaluationData.instructors_contribution_median },
                    { name: "Instructor Effectiveness", value: evaluationData.instructors_effectiveness_median },
                    { name: "Instructor Interest", value: evaluationData.instuctors_interest_median },
                    { name: "Course Content", value: evaluationData.the_course_content_median },
                  ].filter((metric) => metric.value > 0)
                  .map((metric, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 * index }}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">{metric.name}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{(metric.value ? metric.value: 0).toFixed(2)}/5</span>
                      </div>
                      <div className="relative h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(metric.value / 5) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + 0.1 * index }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
