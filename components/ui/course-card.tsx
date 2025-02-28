"use client";

import { useState } from "react";
import {
  Star,
  ThumbsUp,
  BarChart3,
  Calendar,
  Info,
  BookOpen,
  User,
  MessageSquare,
  Award,
  Building2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InstructorProfile } from "@/components/ui/instructor-profile"; // Import it here

interface CourseCardProps {
  courseData: any;
}

export default function CourseCard({ courseData }: CourseCardProps) {
  const [open, setOpen] = useState(false);

  const convertTo12Hour = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return new Date(
      0,
      0,
      0,
      Number.parseInt(hours),
      Number.parseInt(minutes)
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Card className="bg-white p-6 shadow-lg p-6 rounded-xl mb-8">
        <CardHeader className="border-b pb-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-3xl font-bold text-[#4b2e83]">
                  {courseData["Course Code"]} {courseData.Section}
                </CardTitle>
                <Badge variant="outline" className="ml-2">
                  {courseData.Credits} Credits
                </Badge>
                <button
                  onClick={() =>
                    window.open(
                      `https://myplan.uw.edu/course/#/courses/${courseData.index}`,
                      "_blank"
                    )
                  }
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <CardDescription className="text-lg mt-1">
                {courseData["Course Title"]}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              SLN: {courseData["Registration Code"]}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Course Information</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average GPA:</span>
                  <span className="font-medium">
                    {courseData.Mean?.toFixed(2) || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Requirements:</span>
                  <Badge>{courseData["GenEd Requirements"] || "None"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Quarters Offered:</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {courseData.Term}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium">
                        Instructor Rating
                      </span>
                    </div>
                    <span className="font-bold">
                      {courseData.Rating?.toFixed(1) || "N/A"}/5
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full"
                            style={{
                              width: `${(courseData.Rating / 5) * 100}%`,
                              backgroundColor: "green",
                            }}
                          ></div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {courseData.Rating?.toFixed(1) || "N/A"} out of 5
                          stars
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(courseData.Rating || 0)
                        }`}
                        style={{
                          fill:
                            star <= Math.round(courseData.Rating || 3.5)
                              ? "green"
                              : "gray",
                          stroke:
                            star <= Math.round(courseData.Rating || 3.5)
                              ? "green"
                              : "gray",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium">
                        Instructor Difficulty
                      </span>
                    </div>
                    <span className="font-bold">
                      {courseData.Difficulty?.toFixed(1) || "3.5"}/5
                    </span>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                          <div
                            className="bg-rose-500 h-2.5 rounded-full"
                            style={{
                              width: `${
                                ((courseData.Difficulty || 3.5) / 5) * 100
                              }%`,
                              backgroundColor: "red",
                            }}
                          ></div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {courseData.Difficulty?.toFixed(1) || "3.5"} out of 5
                          difficulty
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(courseData.Difficulty || 3.5)
                        }`}
                        style={{
                          fill:
                            star <= Math.round(courseData.Difficulty || 3.5)
                              ? "red"
                              : "gray",
                          stroke:
                            star <= Math.round(courseData.Difficulty || 3.5)
                              ? "red"
                              : "gray",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Course Description</span>
              </div>

              <div className="text-sm">
                <p>{courseData["Course Description"]}</p>
              </div>

              <div className="space-y-3 mt-4 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {courseData.Days} {convertTo12Hour(courseData.Start)} -{" "}
                    {convertTo12Hour(courseData.End)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4" />
                  <span>{courseData.Building}</span>
                </div>
                <div className="text-sm">
                  Enrollment: {courseData.enrollCount}/
                  {courseData.enrollMaximum}
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div
                      className="back-primary h-2 rounded-full"
                      style={{
                        width: `${
                          (courseData.enrollCount / courseData.enrollMaximum) *
                          100
                        }%`,
                        backgroundColor: "black",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Instructor:</span>
                  <button
                    onClick={() => setOpen(true)}
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    {courseData.Instructor}
                    <Info className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Instructor Profile Component */}
      <InstructorProfile
        instructor={courseData.Instructor}
        courseData={courseData}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
