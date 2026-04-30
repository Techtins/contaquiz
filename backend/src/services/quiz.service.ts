import QuizModel from '../models/QuizEntity';
import DisciplineModel from '../models/Disciplina';
import QuestionModel from '../models/Questao';
import QuizResultModel from '../models/QuizResult';
import { CreateQuizDTO, ListQuizzesOptions, UpdateQuizDTO, IStudentHistory, IQuizHistoryItem } from '../dtos/quiz.dto';
import { httpError } from '../middlewares/error';

function toFrontendQuiz(doc: any) {
    const plain = doc?.toObject ? doc.toObject() : doc;
    const questions = plain.questionIds || plain.questions || [];
    return {
        ...plain,
        questions,
        timeLimit: plain.timeLimitSeconds ?? plain.timeLimit ?? null,
        passingScore: plain.score ?? plain.passingScore ?? null,
    };
}

export async function getQuizById(id: string) {
    const doc = await QuizModel.findById(id).populate('questionIds').populate('disciplineId');
    if (!doc) throw httpError(404, 'Quiz não encontrado');
    return toFrontendQuiz(doc);
}

export async function listQuizzes(opts: ListQuizzesOptions) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 10));
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (opts.filter) {
        filter.$or = [{ title: { $regex: opts.filter, $options: 'i' } }, { description: { $regex: opts.filter, $options: 'i' } }];
    }
    if ((opts as any).disciplineId) filter.disciplineId = (opts as any).disciplineId;

    const [items, total] = await Promise.all([
        QuizModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        QuizModel.countDocuments(filter),
    ]);

    return {
        items: items.map(toFrontendQuiz),
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
}

export async function createQuiz(data: CreateQuizDTO) {
    if (data.disciplineId) {
        const d = await DisciplineModel.findById(data.disciplineId);
        if (!d) throw httpError(404, 'Disciplina associada não encontrada');
    }

    // Verifica se todas as questões existem
    const qs = await QuestionModel.find({ _id: { $in: data.questionIds } });
    if (qs.length !== data.questionIds.length) throw httpError(404, 'Algumas questões não foram encontradas');

    try {
        return await QuizModel.create(data as any);
    } catch (e: any) {
        if (e?.code === 11000) throw httpError(409, 'Conflito ao criar quiz');
        throw e;
    }
}

export async function updateQuiz(id: string, data: UpdateQuizDTO) {
    if (data.disciplineId) {
        const d = await DisciplineModel.findById(data.disciplineId);
        if (!d) throw httpError(404, 'Disciplina associada não encontrada');
    }
    if (data.questionIds && data.questionIds.length > 0) {
        const qs = await QuestionModel.find({ _id: { $in: data.questionIds } });
        if (qs.length !== data.questionIds.length) throw httpError(404, 'Algumas questões não foram encontradas');
    }

    const updated = await QuizModel.findByIdAndUpdate(id, data as any, { new: true, runValidators: true });
    if (!updated) throw httpError(404, 'Quiz não encontrado');
    return updated;
}

export async function deleteQuiz(id: string) {
    const deleted = await QuizModel.findByIdAndDelete(id);
    if (!deleted) throw httpError(404, 'Quiz não encontrado');
    return deleted;
}

export async function submitQuiz(id: string, answers: Record<string, number>, timeSpentInSeconds?: number, userId?: string) {
    const quiz = await QuizModel.findById(id).populate('questionIds');
    if (!quiz) throw httpError(404, 'Quiz não encontrado');

    const questionDocs = (quiz as any).questionIds || [];
    const corrections = questionDocs.map((question: any) => {
        const userAnswer = answers?.[String(question._id)];
        const correctAnswer = Array.isArray(question.options)
            ? question.options.findIndex((option: any) => option.isCorrect)
            : -1;
        const isCorrect = userAnswer !== undefined && userAnswer !== null && Number(userAnswer) === correctAnswer;

        return {
            questionId: question._id,
            userAnswer: userAnswer !== undefined ? Number(userAnswer) : null,
            correctAnswer,
            isCorrect,
            explanation: question.explanation,
        };
    });

    const correctAnswers = corrections.filter((item: { isCorrect: boolean }) => item.isCorrect).length;
    const wrongAnswers = questionDocs.length - correctAnswers;
    const percentage = questionDocs.length ? (correctAnswers / questionDocs.length) * 100 : 0;

    const createData: any = {
        quizId: quiz._id,
        correctAnswers,
        wrongAnswers,
        totalQuestions: questionDocs.length,
        percentage,
        timeSpentInSeconds: timeSpentInSeconds ?? 0,
        passingScore: (quiz as any).score ?? 0,
        corrections,
    };

    // Adiciona userId se fornecido
    if (userId) {
        createData.userId = userId;
    }

    const result = await QuizResultModel.create(createData);

    return {
        _id: result._id,
        quizId: result.quizId,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        timeSpentInSeconds: result.timeSpentInSeconds,
        passingScore: result.passingScore,
        corrections: result.corrections,
    };
}

export async function getQuizResultById(resultId: string) {
    const result = await QuizResultModel.findById(resultId);
    if (!result) throw httpError(404, 'Resultado não encontrado');
    return {
        _id: result._id,
        quizId: result.quizId,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        timeSpentInSeconds: result.timeSpentInSeconds,
        passingScore: result.passingScore,
        corrections: result.corrections,
    };
}

export async function getStudentHistory(userId: string): Promise<IStudentHistory> {
    // Busca todos os resultados do usuário agrupados por quiz
    const results = await QuizResultModel.find({ userId: userId })
        .populate('quizId', 'title disciplineId')
        .populate({
            path: 'quizId',
            populate: {
                path: 'disciplineId',
                select: 'name'
            }
        })
        .sort({ createdAt: -1 });

    if (results.length === 0) {
        return {
            totalQuizzesCompleted: 0,
            averageScore: 0,
            totalStudyTime: 0,
            quizzes: [],
        };
    }

    // Agrupar resultados por quiz
    const quizMap = new Map<string, any>();
    
    results.forEach((result: any) => {
        const quizId = result.quizId._id.toString();
        
        if (!quizMap.has(quizId)) {
            quizMap.set(quizId, {
                quizId,
                title: result.quizId.title,
                discipline: result.quizId.disciplineId?.name || '',
                results: [],
            });
        }
        
        quizMap.get(quizId).results.push({
            percentage: result.percentage,
            timeSpentInSeconds: result.timeSpentInSeconds,
            createdAt: result.createdAt,
        });
    });

    // Processar dados agregados
    const quizzes: IQuizHistoryItem[] = [];
    let totalScore = 0;
    let totalTime = 0;

    quizMap.forEach((data) => {
        const attempts = data.results.length;
        const bestScore = Math.max(...data.results.map((r: any) => r.percentage));
        const lastAttemptDate = data.results[0].createdAt;
        const totalTimeSpent = data.results.reduce((sum: number, r: any) => sum + r.timeSpentInSeconds, 0);
        const averageTime = Math.round(totalTimeSpent / attempts);

        quizzes.push({
            _id: data.quizId,
            quizId: data.quizId,
            title: data.title,
            discipline: data.discipline || undefined,
            attempts,
            bestScore: Math.round(bestScore),
            lastAttemptDate,
            totalTimeSpent,
            averageTime,
        });

        totalScore += bestScore;
        totalTime += totalTimeSpent;
    });

    // Calcular média geral e tempo total
    const averageScore = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;
    
    return {
        totalQuizzesCompleted: quizzes.length,
        averageScore,
        totalStudyTime: totalTime,
        quizzes: quizzes.sort((a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime()),
    };
}
