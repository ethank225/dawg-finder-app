<span className="inline-flex items-center gap-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={`mean-${i}`}
                                className={`w-5 h-5 ${
                                  i + 0.5 < selectedClass?.["Mean"]
                                    ? "text-yellow-400" // Changed to yellow for Mean rating
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-md">
                              ({selectedClass?.["Mean"].toFixed(1)}/5)
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={`difficulty-${i}`}
                                className={`w-5 h-5 ${
                                  i + 0.5 < selectedClass?.["Difficulty"]
                                    ? "fill-blue-500 stroke-blue-500" // Changed to blue for Difficulty rating
                                    : "fill-gray-300 stroke-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-md">
                              ({selectedClass?.["Difficulty"].toFixed(1)}/5)
                            </span>
                          </span>

? "fill-[#b7a57a] stroke-[#b7a57a]"
                                    : "fill-gray-300 stroke-gray-300"