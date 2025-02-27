import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, BarChart3 } from "lucide-react";

interface InstructorProfileProps {
  instructor: string;
  courseData: any;
  open: boolean;
  setOpen: (state: boolean) => void;
}

export function InstructorProfile({
  instructor,
  courseData,
  open,
  setOpen,
}: InstructorProfileProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {instructor
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-xl">{instructor}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Lecturer, Computer Science
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="evaluations">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          {/* Evaluations Tab */}
          <TabsContent value="evaluations" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Overall Rating Card */}
              <Card style={{ backgroundColor: "#98D69D" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <ThumbsUp className="h-4 w-4 text-emerald-500 mr-2" />
                    Overall Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5"
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
                    <span className="font-bold text-lg">
                      {courseData.Rating?.toFixed(1) || "N/A"}/5
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Course Difficulty Card */}
              <Card style={{ backgroundColor: "#FCA5A5" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="h-4 w-4 text-rose-500 mr-2" />
                    Course Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5"
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
                    <span className="font-bold text-lg">
                      {courseData.Difficulty?.toFixed(1) || "3.5"}/5
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>


            <div className="space-y-2 mt-6">
              <h3 className="text-lg font-medium">Evaluation Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Clear explanations</span>
                    <span className="text-sm font-medium">4.5/5</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Engaging lectures</span>
                    <span className="text-sm font-medium">4.3/5</span>
                  </div>
                  <Progress value={86} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Helpful feedback</span>
                    <span className="text-sm font-medium">4.0/5</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Availability</span>
                    <span className="text-sm font-medium">3.8/5</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Fair grading</span>
                    <span className="text-sm font-medium">4.1/5</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
              </div>
            </div>



          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="mt-4">
            <div className="space-y-3">
              {[
                {
                  code: courseData["Course Code"],
                  name: courseData["Course Title"],
                  quarters: [courseData.Term],
                },
                {
                  code: "Related Course 1",
                  name: "Related Course Title",
                  quarters: ["Other Quarter"],
                },
                {
                  code: "Related Course 2",
                  name: "Related Course Title",
                  quarters: ["Other Quarter"],
                },
              ].map((course, index) => (
                <Card key={index}>
                  <CardContent className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{course.code}</h4>
                      <p className="text-sm text-muted-foreground">
                        {course.name}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {course.quarters.map((quarter, idx) => (
                        <Badge key={idx} variant="outline">
                          {quarter}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
