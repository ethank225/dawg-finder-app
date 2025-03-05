"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, BarChart3, Star, Loader, ExternalLink } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  // Fetch instructor data from API
  const fetchInstructorData = async (teacherId: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        <div className="bg-white p-6 rounded-t-xl shadow-lg relative">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {instructor}
              </h2>
              {evaluationData?.Link && (
                <button
                  onClick={() =>
                    window.open(
                      evaluationData.Link,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                </button>
              )}
            </div>
          </DialogHeader>
        </div>

        <Tabs
          defaultValue="evaluations"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Evaluations Tab */}

          <TabsContent value="evaluations" className="p-6">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col justify-center items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Loader className="h-10 w-10 text-blue-500 animate-spin" />
                </motion.div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                  Loading instructor data...
                </p>
              </motion.div>
            ) : evaluationData ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {/* Instructor Rating */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-3">
                        <h3 className="text-sm font-medium text-white flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Instructor Rating
                        </h3>
                      </div>
                      <CardContent className="p-4">
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          transition={{ staggerChildren: 0.1 }}
                          className="flex justify-center gap-1"
                        >
                          {[1, 2, 3, 4, 5].map((star, index) => {
                            const roundedRating = evaluationData.Rating;
                            const fullStar = star <= Math.floor(roundedRating);
                            const halfStar =
                              star === Math.ceil(roundedRating) && !fullStar;
                            const gradientId = `half-fill-${index}`; // Unique gradient ID for each star

                            return (
                              <motion.div
                                key={star}
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  visible: { opacity: 1, y: 0 },
                                }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
                              >
                                <Star
                                  className="h-6 w-6"
                                  fill={
                                    fullStar
                                      ? "#10b981"
                                      : halfStar
                                      ? `url(#${gradientId})` // ✅ Correct reference
                                      : "#e5e7eb"
                                  }
                                  stroke={
                                    fullStar || halfStar ? "#10b981" : "#e5e7eb"
                                  }
                                />
                                {halfStar && (
                                  <svg width="0" height="0">
                                    <defs>
                                      <linearGradient id={gradientId}>
                                        <stop
                                          offset="50%"
                                          stopColor="#10b981"
                                        />
                                        <stop
                                          offset="50%"
                                          stopColor="#e5e7eb"
                                        />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Instructor Difficulty */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card className="border-0 shadow-md overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-red-500 p-3">
                        <h3 className="text-sm font-medium text-white flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Instructor Difficulty
                        </h3>
                      </div>
                      <CardContent className="p-4">
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          transition={{ staggerChildren: 0.1 }}
                          className="flex justify-center gap-1"
                        >
                          {[1, 2, 3, 4, 5].map((star, index) => {
                            const roundedRating = evaluationData.Difficulty;
                            const fullStar = star <= Math.floor(roundedRating);
                            const halfStar =
                              star === Math.ceil(roundedRating) && !fullStar;
                            const gradientId = `half-fill-${index}`; // Unique gradient ID for each star

                            return (
                              <motion.div
                                key={star}
                                variants={{
                                  hidden: { opacity: 0, y: 10 },
                                  visible: { opacity: 1, y: 0 },
                                }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
                              >
                                <Star
                                  className="h-6 w-6"
                                  fill={
                                    fullStar
                                      ? "#f43f5e"
                                      : halfStar
                                      ? `url(#${gradientId})` // ✅ Correct reference
                                      : "#e5e7eb"
                                  }
                                  stroke={
                                    fullStar || halfStar ? "#f43f5e" : "#e5e7eb"
                                  }
                                />
                                {halfStar && (
                                  <svg width="0" height="0">
                                    <defs>
                                      <linearGradient id={gradientId}>
                                        <stop
                                          offset="50%"
                                          stopColor="#f43f5e"
                                        />
                                        <stop
                                          offset="50%"
                                          stopColor="#e5e7eb"
                                        />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Evaluation Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="mt-8"
                >
                  <div className="space-y-5">
                    {[
                      {
                        name: "Amount Learned",
                        value: evaluationData.amount_learned_median,
                      },
                      {
                        name: "Grading Techniques",
                        value: evaluationData.grading_techniques_median,
                      },
                      {
                        name: "Instructor Contribution",
                        value: evaluationData.instructors_contribution_median,
                      },
                      {
                        name: "Instructor Effectiveness",
                        value: evaluationData.instructors_effectiveness_median,
                      },
                      {
                        name: "Instructor Interest",
                        value: evaluationData.instuctors_interest_median,
                      },
                      {
                        name: "Course Content",
                        value: evaluationData.the_course_content_median,
                      },
                    ]
                      .filter((metric) => metric.value > 0)
                      .map((metric, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                        >
                          <div className="border-2 p-4 shadow-lg rounded-lg">
                            <div className="flex justify-between mb-1.5">
                              <span className="text-sm font-semibold text-slate-700">
                                {metric.name}
                              </span>
                              <span className="text-md font-semibold text-slate-900 dark:text-white">
                                {(
                                  (metric.value ? metric.value : 0) * 20
                                ).toFixed(2)}
                                %
                              </span>
                            </div>
                            <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ">
                              <motion.div
                                className="absolute top-0 left-0 h-full bg-[#4b2e83] rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${(metric.value / 5) * 100}%`,
                                }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.2 + 0.1 * index,
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              </>
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-300">
                No data available for this instructor.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
