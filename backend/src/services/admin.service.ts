import DisciplineModel from '../models/Disciplina';
import QuestionModel from '../models/Questao';
import UserModel from '../models/User';
import QuizResultModel from '../models/QuizResult';
import QuizModel from '../models/QuizEntity';

export async function getAdminStats() {
    const [disciplines, questions, users, quizzes, quizResults] = await Promise.all([
        DisciplineModel.countDocuments(),
        QuestionModel.countDocuments(),
        UserModel.countDocuments(),
        QuizModel.countDocuments(),
        QuizResultModel.countDocuments(),
    ]);

    return {
        disciplines,
        questions,
        users,
        quizzes,
        quizResults,
    };
}

export default {
    getAdminStats,
};
