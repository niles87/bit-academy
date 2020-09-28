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
  let weightedAverage: number = 0,
    homeworkAverage: number = 0,
    quizAverage: number = 0,
    examAverage: number = 0,
    homeworkCount: number = 0,
    quizCount: number = 0,
    examCount: number = 0,
    homeworkTotal: number = 0,
    quizTotal: number = 0,
    examTotal: number = 0;

  arr.map((assignment: assignment) => {
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
  });

  if (weightedAverage !== 0) {
    if (homeworkCount > 0) {
      homeworkAverage = (homeworkTotal / homeworkCount) * homeWorkWeight;
    } else {
      homeworkAverage = 100 * homeWorkWeight;
    }
    if (quizCount > 0) {
      quizAverage = (quizTotal / quizCount) * quizWeight;
    } else {
      quizAverage = 100 * quizWeight;
    }
    if (examCount > 0) {
      examAverage = (examTotal / examCount) * examWeight;
    } else {
      examAverage = 100 * examWeight;
    }

    weightedAverage = homeworkAverage + quizAverage + examAverage;
  }

  return weightedAverage;
};
