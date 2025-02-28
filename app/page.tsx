"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import CourseCard from "@/components/ui/course-card";
import { InstructorProfile } from "@/components/ui/instructor-profile"; // Import it here

import {
  BookOpen,
  GraduationCap,
  Clock,
  Calendar,
  Building2,
  Star,
  BookHeart,
} from "lucide-react";
import RechartsBarChart from "@/components/ui/RechartsBarChart";

import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]); // Add this state
  const [sections, setSections] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(
    null
  );

  function getRatingInfo(rating: number) {
    if (rating >= 4.5) {
      return { label: "Excellent", style: { backgroundColor: "#22c55e" } }; // Tailwind green-500
    } else if (rating >= 3.5) {
      return { label: "Good", style: { backgroundColor: "#84cc16" } }; // Tailwind lime-500
    } else if (rating >= 2.5) {
      return { label: "Average", style: { backgroundColor: "#fde047" } }; // Tailwind yellow-300
    } else if (rating >= 0) {
      return { label: "None", style: { backgroundColor: "#d1d5db" } }; // Tailwind gray-400
    } else {
      return { label: "Invalid", style: { backgroundColor: "#ef4444" } }; // Tailwind red-500 (for negative or null values)
    }
  }

  function getDifficultyInfo(rating: number) {
    if (rating >= 4.5) {
      return { label: "Hard", style: { backgroundColor: "#ef4444" } }; // Tailwind red-500
    } else if (rating >= 3.5) {
      return { label: "Average", style: { backgroundColor: "#facc15" } }; // Tailwind yellow-400
    } else if (rating >= 2.5) {
      return { label: "Easy", style: { backgroundColor: "#86efac" } }; // Tailwind green-300
    } else if (rating >= 0) {
      return { label: "None", style: { backgroundColor: "#d1d5db" } }; // Tailwind gray-400
    } else {
      return { label: "Invalid", style: { backgroundColor: "#ef4444" } }; // Tailwind red-500 (for negative or null values)
    }
  }

  //Handles the search query
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      // Check if response body is empty
      const textData = await response.text();
      if (!textData) {
        throw new Error("Empty response from server");
      }
      const data = JSON.parse(textData); // Manually parse JSON
      if (!response.ok) {
        throw new Error(data.message || "Error fetching data");
      }
      // Save API results
      setSearchResult(data);
      setSearchPerformed(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Handle when you click on an event
  const handleClassClick = async (classItem: any) => {
    const courseCode = classItem["Course Code"];
    const courseSection = classItem.Section;
    const query = `${courseCode}${courseSection}`;

    console.log("Fetching sections for:", query);

    // Set selected class without modifying sections
    setSelectedClass(classItem);
    setSections([]); // Clear previous sections
    setIsLoading(true);

    try {
      const response = await fetch(`/api/getSections?courseId=${query}`);
      if (!response.ok) {
        throw new Error("Error fetching sections");
      }

      const data = await response.json();
      setSections(Array.isArray(data) ? data : []); // Store sections separately
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertTo12Hour = (time: any) => {
    if (!time) return "Not Available"; // Handle null or undefined
    const [hours, minutes] = time.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <main className="min-h-screen bg-white text-[#4b2e83]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: searchPerformed ? -50 : 0 }}
          animate={{ y: 0 }}
          className={`text-center ${
            searchPerformed ? "mb-8" : "h-screen flex flex-col justify-center"
          }`}
        >
          <motion.h1
            initial={{ scale: 1 }}
            animate={{ scale: searchPerformed ? 0.8 : 1 }}
            className="text-6xl font-bold mb-8 text-[#4b2e83]"
          >
            DawgFinder
          </motion.h1>
          <form
            onSubmit={handleSearch}
            className="max-w-6xl mx-auto w-full px-4"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Ask any question about UW classes..."
                className="w-full h-20 px-6 rounded-xl bg-[#4b2e83]/5 border-2 border-[#4b2e83]/10 hover:border-[#4b2e83]/20 placeholder:text-[#4b2e83]/50 text-xl transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#4b2e83] hover:bg-[#4b2e83]/90 text-white px-8"
              >
                Search
              </Button>
            </div>
          </form>
        </motion.div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-4 mt-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-[#4b2e83]/5 rounded-xl p-6 border-2 border-[#4b2e83]/10"
                >
                  <div className="animate-pulse">
                    <div className="flex items-start justify-between mb-4 pb-4">
                      <div className="space-y-3">
                        <div className="h-8 w-32 bg-[#4b2e83]/10 rounded" />
                        <div className="h-6 w-48 bg-[#4b2e83]/10 rounded" />
                      </div>
                      <div className="h-12 w-16 bg-[#4b2e83]/10 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="h-6 bg-[#4b2e83]/10 rounded w-full"
                          />
                        ))}
                      </div>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="h-6 bg-[#4b2e83]/10 rounded w-full"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="h-4 bg-[#4b2e83]/10 rounded w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {searchPerformed && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto px-4"
          >
            {searchResult.map((classItem) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-[#4b2e83]/5 hover:bg-[#4b2e83]/10 rounded-xl p-6 cursor-pointer border-2 border-[#4b2e83]/10 hover:border-[#4b2e83]/20 transition-all"
                //add the ID to thediv
                key={`${classItem["Course Code"]} ${classItem.Section}`}
                onClick={() => handleClassClick(classItem)}
              >
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4 border-b border-[#4b2e83]/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-bold text-[#4b2e83]">
                        {classItem["Course Code"]} {classItem.Section}
                      </h2>
                      <span className="text-[#4b2e83]/70 text-lg">
                        ({classItem.Credits} cr)
                      </span>
                    </div>
                    <h3 className="text-xl font-medium text-[#4b2e83]/80 mt-1">
                      {classItem["Course Title"]}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#4b2e83]/70">Average GPA</div>
                    <div className="text-2xl font-bold text-[#4b2e83]">
                      {classItem.mean?.toFixed(2) ?? ""}
                    </div>
                  </div>
                </div>

                {/* Course Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    {/* Schedule Info */}
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Clock className="w-4 h-4" />
                      <span>
                        {classItem.Days} {convertTo12Hour(classItem.Start)} -{" "}
                        {convertTo12Hour(classItem.End)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Building2 className="w-4 h-4" />
                      <span>{classItem.Building}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Calendar className="w-4 h-4" />
                      <span>{classItem.Term}</span>
                    </div>
                    <div className="text-[#4b2e83]/80">
                      Enrollment: {classItem.enrollCount}/
                      {classItem.enrollMaximum}
                      <div className="w-full bg-[#4b2e83]/10 rounded-full h-2 mt-1">
                        <div
                          className="bg-[#4b2e83] h-2 rounded-full"
                          style={{
                            width: `${
                              (classItem.enrollCount /
                                classItem.enrollMaximum) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#6b5a9e]">
                      <Star className="h-5 w-5" />
                      <div className="flex items-center gap-2">
                        <span>Rating:</span>
                        <div className="flex items-center gap-1">
                          {(() => {
                            const { label: ratingLabel, style: ratingClass } =
                              getDifficultyInfo(classItem.Rating ?? 0);
                            return (
                              <Badge
                                className={`${ratingClass} text-white px-2 py-0.5 text-xs rounded-full`}
                              >
                                {ratingLabel}
                              </Badge>
                            );
                          })()}
                          <span className="text-sm">
                            ({classItem.Rating?.toFixed(1) ?? "N/A"}/5)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Professor Info */}
                    <div className="flex items-center gap-2 text-[#6b5a9e]">
                      <BookOpen className="h-5 w-5" />
                      <div className="flex items-center gap-2">
                        <span>Difficulty:</span>
                        <div className="flex items-center gap-1">
                          {(() => {
                            const { label: ratingLabel, style: ratingClass } =
                              getDifficultyInfo(classItem.Rating ?? 0);
                            return (
                              <Badge
                                className={`${ratingClass} text-white px-2 py-0.5 text-xs rounded-full`}
                              >
                                {ratingLabel}
                              </Badge>
                            );
                          })()}
                          <span className="text-sm">
                            ({classItem.Difficulty?.toFixed(1) ?? "N/A"}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <BookOpen className="w-4 h-4" />
                      <span>{classItem["GenEd Requirements"]}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#4b2e83]/70 text-sm line-clamp-2 mt-2">
                  {classItem["Course Description"]}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Class Details Dialog */}
        <Dialog
          open={!!selectedClass}
          onOpenChange={() => setSelectedClass(null)}
        >
          <DialogContent className="bg-white text-[#4b2e83] border-2 border-[#4b2e83] max-w-4xl max-h-[90vh] overflow-y-auto ">
            {/* Course Overview */}
            <div className="mt-6 ">
              {selectedClass && (
                <>
                  <CourseCard courseData={selectedClass} />
                  <RechartsBarChart selectedClass={selectedClass} />

                  {/* Available Sections */}
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">
                      Available Sections
                    </h3>
                    <div className="grid gap-4">
                      {sections?.map((section: any) => (
                        <div
                          key={section["Registration Code"]}
                          className="bg-[#4b2e83]/5 rounded-lg p-4 border border-[#4b2e83]/10"
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-lg">
                                  Section {section["Section"]}
                                </span>
                                <span className="text-sm bg-[#4b2e83]/10 px-2 py-1 rounded">
                                  SLN: {section["Registration Code"]}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[#4b2e83]/80">
                                <GraduationCap className="w-4 h-4" />
                                <button
                                  onClick={() => {
                                    console.log(
                                      "Setting instructor:",
                                      section.Instructor
                                    );
                                    setSelectedInstructor(section.Instructor); // Ensure correct instructor
                                    setOpen(true);
                                  }}
                                  className="text-primary hover:underline font-medium flex items-center gap-1"
                                >
                                  {section.Instructor}
                                </button>

                                {open && selectedInstructor && (
                                  <InstructorProfile
                                    instructor={selectedInstructor}
                                    courseData={section}
                                    open={open}
                                    setOpen={setOpen}
                                  />
                                )}
                                <span className="flex items-center gap-1 text-sm">
                                  <Star className="w-3 h-3 fill-[#b7a57a] stroke-[#b7a57a]" />
                                  {section.mean?.toFixed(2) ?? ""}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-[#4b2e83]/80">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {section["Days"]} {section["Start"]} -{" "}
                                  {section["End"]}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[#4b2e83]/80">
                                <Building2 className="w-4 h-4" />
                                <span>{section["Building"]}</span>
                              </div>
                              <div className="text-[#4b2e83]/80">
                                Enrollment: {section.enrollCount}/
                                {section.enrollMaximum}
                                <div className="w-full bg-[#4b2e83]/10 rounded-full h-2 mt-1">
                                  <div
                                    className="bg-[#4b2e83] h-2 rounded-full"
                                    style={{
                                      width: `${
                                        (section.enrollCount /
                                          section.enrollMaximum) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
