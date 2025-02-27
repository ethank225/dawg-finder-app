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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any[]>([]); // Add this state

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
    const query = `${courseCode} ${courseSection}`;
    console.log("Fetching sections for:", query);

    // Set selected class before fetching sections
    setSelectedClass({ ...classItem, sections: [] });
    setIsLoading(true);

    try {
      const response = await fetch(`/api/getSections?courseId=${query}`);
      if (!response.ok) {
        throw new Error("Error fetching sections");
      }

      const data = await response.json();

      // Ensure data is an array; if not, default to an empty array
      const sections = Array.isArray(data) ? data : [];

      // Update selectedClass with fetched sections
      setSelectedClass((prevState: any) => ({
        ...prevState,
        sections: sections, // Ensure sections is always an array
      }));
    } catch (error) {
      console.error("Error fetching sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertTo12Hour = (time: any) => {
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
                className="w-full h-20 px-6 rounded-xl bg-[#4b2e83]/5 border-2 border-[#4b2e83]/10 hover:border-[#4b2e83]/20 focus:border-[#4b2e83] text-[#4b2e83] placeholder:text-[#4b2e83]/50 text-xl transition-colors"
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
                      {classItem.mean.toFixed(2)}
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
                    {/* Professor Info */}
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <GraduationCap className="w-4 h-4" />
                      <span>{classItem.Instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Star className="w-4 h-4" />
                      <span>{classItem.Rating.toFixed(1)} / 5.0</span>
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
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#4b2e83] flex items-baseline gap-3">
                <span>
                  {selectedClass?.["Course Code"]} {selectedClass?.Section}
                </span>

                <span className="text-lg font-normal text-[#4b2e83]/70">
                  {selectedClass?.["Credits"]} Credits
                </span>
              </DialogTitle>
              <h2 className="text-xl text-[#4b2e83]/90 mt-1">
                {selectedClass?.["Course Title"]}
              </h2>
            </DialogHeader>
            <p className="font-bold text-lg border border-[#3a1e6e] rounded-md px-3 py-1 inline">
              SLN: {selectedClass?.["Registration Code"]}
            </p>

            {/* Course Overview */}
            <div className="mt-6 ">
              <h3 className="font-semibold">Course Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 shadow-md p-6 rounded-xl">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Course Information
                  </h3>
                  <div className="grid gap-2">
                    <p>Average GPA: {selectedClass?.["mean"]?.toFixed(2)}</p>
                    <p>Requirements: {selectedClass?.["GenEd Requirements"]}</p>
                    <p>Quarters Offered: {selectedClass?.["Term"]}</p>
                    <div className="flex items-center gap-2 font-bold">
                      <a
                        href={selectedClass?.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#4b2e83]/5 hover:bg-[#4b2e83]/10 hover:animate-hover-glow transition-all rounded-xl p-6 text-[#4b2e83] hover:text-white inline-flex items-center justify-between w-full"
                      >
                        <span className="mr-2 font-medium font-semibold">
                          {selectedClass?.Instructor}
                        </span>

                        <span className="inline-flex items-center gap-2 text-md text-gray-700 font-medium">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i + 0.5 < selectedClass?.["mean"]
                                  ? "fill-[#b7a57a] stroke-[#b7a57a]"
                                  : "fill-gray-300 stroke-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-md">
                            ({selectedClass?.["mean"].toFixed(1)}/5)
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Course Description</h3>
                  <p className="text-[#4b2e83]/70">
                    {selectedClass?.["Course Description"]}
                  </p>
                </div>
              </div>
              <RechartsBarChart selectedClass={selectedClass} />

              {/* Available Sections */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">
                  Available Sections
                </h3>
                <div className="grid gap-4">
                  {selectedClass?.sections?.map((section: any) => (
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
                            <span>{section["Instructor"]}</span>
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 fill-[#b7a57a] stroke-[#b7a57a]" />
                              {section["mean"].toFixed(1)}
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
