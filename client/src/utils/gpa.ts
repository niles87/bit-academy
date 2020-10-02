interface assignment {
  id: string;
  name: string;
  grade: number;
  link: string;
  description: string;
  kind: string;
}

export const averagedGrades = (arr: assignment[]): number => {
  const homeWorkWeight: number = 0.25;
  const quizWeight: number = 0.3;
  const examWeight: number = 0.45;
  let weightedAverage: number | undefined,
    homeworkAverage: number = 0,
    quizAverage: number = 0,
    examAverage: number = 0,
    homeworkCount: number = 0,
    quizCount: number = 0,
    examCount: number = 0,
    homeworkTotal: number = 0,
    quizTotal: number = 0,
    examTotal: number = 0;

  arr.forEach((assignment: assignment) => {
    if (assignment.link !== "") {
      switch (assignment.kind) {
        case "homework":
          homeworkCount++;
          homeworkTotal += assignment.grade;
          return {
            homeworkCount,
            homeworkTotal,
          };
        case "quiz":
          quizCount++;
          quizTotal += assignment.grade;
          return {
            quizCount,
            quizTotal,
          };
        case "exam":
          examCount++;
          examTotal += assignment.grade;
          return {
            examCount,
            examTotal,
          };
        default:
          return (weightedAverage = 0);
      }
    }
  });
  let eWeight: number = examWeight,
    hwWeight: number = homeWorkWeight,
    qWeight: number = quizWeight;
  if (homeworkCount === 0 && quizCount === 0) {
    eWeight = examWeight + homeWorkWeight + quizWeight;
  } else if (quizCount === 0 && examCount === 0) {
    hwWeight = homeWorkWeight + quizWeight + examWeight;
  } else if (homeworkCount === 0 && examCount === 0) {
    qWeight = quizWeight + homeWorkWeight + examWeight;
  } else if (homeworkCount === 0) {
    eWeight = examWeight + homeWorkWeight / 2;
    qWeight = quizWeight + homeWorkWeight / 2;
  } else if (quizCount === 0) {
    hwWeight = homeWorkWeight + quizWeight / 2;
    eWeight = examWeight + quizWeight / 2;
  } else if (examCount === 0) {
    hwWeight = homeWorkWeight + examWeight / 2;
    qWeight = quizWeight + examWeight / 2;
  }
  if (weightedAverage !== 0) {
    if (homeworkCount > 0) {
      homeworkAverage = (homeworkTotal / homeworkCount) * hwWeight;
    }
    if (quizCount > 0) {
      quizAverage = (quizTotal / quizCount) * qWeight;
    }
    if (examCount > 0) {
      examAverage = (examTotal / examCount) * eWeight;
    }

    weightedAverage = homeworkAverage + quizAverage + examAverage;
  }
  return weightedAverage;
};
