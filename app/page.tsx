"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Clock, Calendar, Building2, Star } from "lucide-react"

// Mock data - replace with actual API call
const mockClasses = [
  {
    courseId: 142,
    courseDept: "CSE",
    name: "Computer Programming I",
    credits: 4,
    gpaAverage: 3.4,
    quarterOffered: "Autumn, Winter, Spring",
    creditSatisfied: "VLPA, QSR",
    professor: {
      name: "Stuart Reges",
      rating: 4.2,
    },
    schedule: {
      time: "10:30",
      days: "MWF",
      building: "CSE2",
    },
    description:
      "Basic programming-in-the-small abilities and concepts including procedural programming (methods, parameters, return values), basic control structures (sequence, if/else, for loop, while loop), file processing, arrays, and an introduction to defining classes.",
    sections: [
      {
        sln: "12345",
        section: "A",
        professor: "Stuart Reges",
        rating: 4.2,
        time: "10:30",
        days: "MWF",
        building: "CSE2",
        room: "G20",
        enrollmentCurrent: 45,
        enrollmentMax: 55,
      },
      {
        sln: "12346",
        section: "B",
        professor: "Brett Wortzman",
        rating: 4.5,
        time: "11:30",
        days: "MWF",
        building: "CSE2",
        room: "G10",
        enrollmentCurrent: 48,
        enrollmentMax: 55,
      },
      {
        sln: "12347",
        section: "C",
        professor: "Kevin Lin",
        rating: 4.7,
        time: "13:30",
        days: "TTh",
        building: "CSE2",
        room: "G20",
        enrollmentCurrent: 50,
        enrollmentMax: 55,
      },
    ],
  },
  {
    courseId: 143,
    courseDept: "CSE",
    name: "Computer Programming II",
    credits: 4,
    gpaAverage: 3.2,
    quarterOffered: "Autumn, Winter, Spring, Summer",
    creditSatisfied: "VLPA, QSR",
    professor: {
      name: "Brett Wortzman",
      rating: 4.5,
    },
    schedule: {
      time: "13:30",
      days: "TTh",
      building: "CSE2",
    },
    description:
      "Continuation of CSE142. Concepts of data abstraction and encapsulation including stacks, queues, linked lists, binary trees, recursion, instruction to complexity and use of predefined collection classes.",
    sections: [
      {
        sln: "12349",
        section: "A",
        professor: "Brett Wortzman",
        rating: 4.5,
        time: "13:30",
        days: "TTh",
        building: "CSE2",
        room: "G20",
        enrollmentCurrent: 42,
        enrollmentMax: 55,
      },
      {
        sln: "12350",
        section: "B",
        professor: "Kevin Lin",
        rating: 4.7,
        time: "15:30",
        days: "TTh",
        building: "CSE2",
        room: "G10",
        enrollmentCurrent: 38,
        enrollmentMax: 55,
      },
    ],
  },
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSearchPerformed(true)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen bg-white text-[#4b2e83]">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: searchPerformed ? -50 : 0 }}
          animate={{ y: 0 }}
          className={`text-center ${searchPerformed ? "mb-8" : "h-screen flex flex-col justify-center"}`}
        >
          <motion.h1
            initial={{ scale: 1 }}
            animate={{ scale: searchPerformed ? 0.8 : 1 }}
            className="text-6xl font-bold mb-8 text-[#4b2e83]"
          >
            DawgFinder
          </motion.h1>
          <form onSubmit={handleSearch} className="max-w-6xl mx-auto w-full px-4">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#4b2e83]/5 rounded-xl p-6 border-2 border-[#4b2e83]/10">
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
                          <div key={j} className="h-6 bg-[#4b2e83]/10 rounded w-full" />
                        ))}
                      </div>
                      <div className="space-y-3">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-6 bg-[#4b2e83]/10 rounded w-full" />
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
            {mockClasses.map((classItem) => (
              <motion.div
                key={classItem.courseId}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-[#4b2e83]/5 hover:bg-[#4b2e83]/10 rounded-xl p-6 cursor-pointer border-2 border-[#4b2e83]/10 hover:border-[#4b2e83]/20 transition-all"
                onClick={() => setSelectedClass(classItem)}
              >
                {/* Header Section */}
                <div className="flex items-start justify-between mb-4 border-b border-[#4b2e83]/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-bold text-[#4b2e83]">
                        {classItem.courseDept} {classItem.courseId}
                      </h2>
                      <span className="text-[#4b2e83]/70 text-lg">({classItem.credits} cr)</span>
                    </div>
                    <h3 className="text-xl font-medium text-[#4b2e83]/80 mt-1">{classItem.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#4b2e83]/70">Average GPA</div>
                    <div className="text-2xl font-bold text-[#4b2e83]">{classItem.gpaAverage.toFixed(2)}</div>
                  </div>
                </div>

                {/* Course Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    {/* Schedule Info */}
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Clock className="w-4 h-4" />
                      <span>
                        {classItem.schedule.days} {classItem.schedule.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Building2 className="w-4 h-4" />
                      <span>{classItem.schedule.building}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Calendar className="w-4 h-4" />
                      <span>{classItem.quarterOffered}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Professor Info */}
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <GraduationCap className="w-4 h-4" />
                      <span>{classItem.professor.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <Star className="w-4 h-4" />
                      <span>{classItem.professor.rating.toFixed(1)} / 5.0</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4b2e83]/80">
                      <BookOpen className="w-4 h-4" />
                      <span>{classItem.creditSatisfied}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#4b2e83]/70 text-sm line-clamp-2 mt-2">{classItem.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
          <DialogContent className="bg-white text-[#4b2e83] border-2 border-[#4b2e83] max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#4b2e83] flex items-baseline gap-3">
                <span>
                  {selectedClass?.courseDept} {selectedClass?.courseId}
                </span>
                <span className="text-lg font-normal text-[#4b2e83]/70">{selectedClass?.credits} Credits</span>
              </DialogTitle>
              <h2 className="text-xl text-[#4b2e83]/90 mt-1">{selectedClass?.name}</h2>
            </DialogHeader>

            {/* Course Overview */}
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Course Information
                  </h3>
                  <div className="grid gap-2 text-[#4b2e83]/80">
                    <p>Average GPA: {selectedClass?.gpaAverage?.toFixed(2)}</p>
                    <p>Requirements: {selectedClass?.creditSatisfied}</p>
                    <p>Quarters Offered: {selectedClass?.quarterOffered}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold">Course Description</h3>
                  <p className="text-[#4b2e83]/70">{selectedClass?.description}</p>
                </div>
              </div>

              {/* Available Sections */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Available Sections</h3>
                <div className="grid gap-4">
                  {selectedClass?.sections?.map((section: any) => (
                    <div key={section.sln} className="bg-[#4b2e83]/5 rounded-lg p-4 border border-[#4b2e83]/10">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-lg">Section {section.section}</span>
                            <span className="text-sm bg-[#4b2e83]/10 px-2 py-1 rounded">SLN: {section.sln}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#4b2e83]/80">
                            <GraduationCap className="w-4 h-4" />
                            <span>{section.professor}</span>
                            <span className="flex items-center gap-1 text-sm">
                              <Star className="w-3 h-3 fill-[#b7a57a] stroke-[#b7a57a]" />
                              {section.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#4b2e83]/80">
                            <Clock className="w-4 h-4" />
                            <span>
                              {section.days} {section.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#4b2e83]/80">
                            <Building2 className="w-4 h-4" />
                            <span>
                              {section.building} {section.room}
                            </span>
                          </div>
                          <div className="text-[#4b2e83]/80">
                            Enrollment: {section.enrollmentCurrent}/{section.enrollmentMax}
                            <div className="w-full bg-[#4b2e83]/10 rounded-full h-2 mt-1">
                              <div
                                className="bg-[#4b2e83] h-2 rounded-full"
                                style={{
                                  width: `${(section.enrollmentCurrent / section.enrollmentMax) * 100}%`,
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
  )
}

