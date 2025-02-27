import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const RechartsBarChart = ({ selectedClass }: { selectedClass: any }) => {
  if (!selectedClass) return null; // Ensure valid data

  // Total students for percentage calculation
  const totalStudents = Object.values(selectedClass)
    .filter((v) => !isNaN(Number(v)))
    .reduce((sum, val) => sum + Number(val), 0);

  // Convert data format: "30" -> 3.0, "35" -> 3.5
  const chartData = Object.keys(selectedClass)
    .filter((key) => !isNaN(Number(key))) // Ensure numeric keys
    .map((key) => {
      const grade = Number(key) / 10; // Convert to decimal scale
      const count = Number(selectedClass[key]); // Number of students
      const percentage = ((count / totalStudents) * 100).toFixed(2); // Compute %
      return { grade, students: count, percentage };
    });

  return (
    <div className="bg-white p-6 shadow-lg p-6 rounded-xl mb-8 border-b">
      <h2 className="text-2xl font-bold text-[#4b2e83] mb-2">Course Grade Distribution</h2>
      <p className="text-gray-600 mb-4">
        This graph represents the distribution of grades for every student who completed <strong>{selectedClass['Course Code']}</strong> over the past 5 years.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
          barCategoryGap={10}
        >
          {/* X-Axis */}
          <XAxis
            dataKey="grade"
            type="number"
            domain={[0, 4]} // Ensures proper scale
            tick={{ fontSize: 12 }}
            label={{ value: "Course Grade", position: "bottom", offset: 30 }}
            ticks={[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4]} // Properly spaced bins
            padding = {{ left: 20, right: 20 }}
          />

          {/* Y-Axis */}
          <YAxis
            tick={{ fontSize: 12}}
            label={{ value: "Number of Students", angle: -90, position: "middle", offset: -10}}
            domain={[0, Math.max(...chartData.map(d => d.students)) + 10]} // Adjust Y-axis
          />

          {/* Custom Tooltip (Matches Your Image) */}
          <Tooltip
            cursor={{ fill: "rgba(75, 46, 131, 0.1)" }} // Light hover effect
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { grade, students, percentage } = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.9)", // Force solid black background
                      color: "white", // Force white text
                      padding: "8px",
                      borderRadius: "6px",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Add a slight shadow
                    }}
                    className="tooltip-container"
                  >
                    <p className="font-bold">Grade {grade.toFixed(1)}</p>
                    <p>{percentage}% ({students} total)</p>
                  </div>
                );
              }
              return null;
            }}
          />


          {/* Bar Chart */}
          <Bar dataKey="students" fill="#4b2e83" barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsBarChart;
