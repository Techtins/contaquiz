import QuizModel from '../models/QuizEntity';
import DisciplineModel from '../models/Disciplina';
import QuestionModel from '../models/Questao';
import QuizResultModel from '../models/QuizResult';
import QuestionFavoriteModel from '../models/QuestionFavorite';
import { QuizVisibility } from '../models/QuizEntity';
import TopicModel from '../models/Tema';
import {
    CreateQuizDTO,
    GenerateQuizDTO,
    ListQuizzesOptions,
    UpdateQuizDTO,
    IStudentHistory,
    IQuizHistoryItem,
    StudentHistoryFilters,
    IQuizAttemptItem,
    IHistoryAnalytics,
} from '../dtos/quiz.dto';
import { httpError } from '../middlewares/error';
import { Types } from 'mongoose';

function normalizeIds(value?: string | string[]) {
    if (!value) return [] as string[];
    if (Array.isArray(value)) return value.filter(Boolean);
    return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function toObjectIds(ids: string[]): Types.ObjectId[] {
    return ids.map(id => {
        try {
            return new Types.ObjectId(id);
        } catch {
            return null;
        }
    }).filter(Boolean) as Types.ObjectId[];
}

async function sampleQuestionIds(match: Record<string, any>, size: number) {
    if (size <= 0) return [] as string[];

    // Convert topicIds to ObjectIds if present for proper MongoDB matching
    if (match.topicIds && typeof match.topicIds === 'string') {
        try {
            match.topicIds = new Types.ObjectId(match.topicIds);
        } catch {
            // Invalid ObjectId, will result in no matches
            return [] as string[];
        }
    } else if (Array.isArray(match.topicIds)) {
        match.topicIds = toObjectIds(match.topicIds);
    }

    const available = await QuestionModel.countDocuments(match);
    if (!available) return [] as string[];

    const sampled = await QuestionModel.aggregate([
        { $match: match },
        { $sample: { size: Math.min(size, available) } },
        { $project: { _id: 1 } },
    ]);

    return sampled.map((item: any) => String(item._id));
}

async function buildQuestionMap(questionIds: string[]) {
    if (questionIds.length === 0) {
        return new Map<string, any>();
    }

    const questions = await QuestionModel.find({ _id: { $in: questionIds } })
        .populate('disciplineId', 'name')
        .populate('topicIds', 'name disciplineId')
        .lean();

    return new Map(questions.map((question: any) => [String(question._id), question]));
}

function mapQuizResultResponse(result: any, questionMap: Map<string, any>, favoriteQuestionIds = new Set<string>()) {
    const plain = result?.toObject ? result.toObject() : result;

    return {
        _id: plain._id,
        quizId: plain.quizId,
        correctAnswers: plain.correctAnswers,
        wrongAnswers: plain.wrongAnswers,
        totalQuestions: plain.totalQuestions,
        percentage: plain.percentage,
        timeSpentInSeconds: plain.timeSpentInSeconds,
        passingScore: plain.passingScore,
        corrections: (plain.corrections || []).map((correction: any) => {
            const question = questionMap.get(String(correction.questionId));
            return {
                ...correction,
                isFavorite: favoriteQuestionIds.has(String(correction.questionId)),
                question: question ? {
                    _id: String(question._id),
                    statement: question.statement,
                    type: question.type,
                    disciplineId: question.disciplineId?._id ? String(question.disciplineId._id) : String(question.disciplineId || ''),
                    disciplineName: question.disciplineId?.name,
                    topicIds: Array.isArray(question.topicIds) ? question.topicIds.map((topic: any) => ({
                        _id: String(topic._id),
                        name: topic.name,
                    })) : [],
                    difficulty: question.difficulty,
                } : undefined,
            };
        }),
    };
}

function computeAverage(valueTotal: number, attempts: number) {
    return attempts > 0 ? Math.round(valueTotal / attempts) : 0;
}

type ComparisonAttempt = {
    attemptNumber: number;
    resultId: string;
    createdAt: Date;
    percentage: number;
};

type ComparisonGroup = {
    title: string;
    attempts: ComparisonAttempt[];
};

function applyHistoryFilters(results: any[], filters: StudentHistoryFilters) {
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

    return results.filter((result: any) => {
        const quiz = result.quizId;
        const createdAt = new Date(result.createdAt);
        const percentage = Number(result.percentage || 0);

        if (filters.quizId && String(quiz?._id || quiz) !== filters.quizId) {
            return false;
        }

        if (filters.disciplineId && String(quiz?.disciplineId?._id || quiz?.disciplineId || '') !== filters.disciplineId) {
            return false;
        }

        if (filters.visibility && String(quiz?.visibility || QuizVisibility.PUBLIC) !== filters.visibility) {
            return false;
        }

        if (filters.minScore !== undefined && percentage < Number(filters.minScore)) {
            return false;
        }

        if (filters.maxScore !== undefined && percentage > Number(filters.maxScore)) {
            return false;
        }

        if (dateFrom && createdAt < dateFrom) {
            return false;
        }

        if (dateTo) {
            const limit = new Date(dateTo);
            limit.setHours(23, 59, 59, 999);
            if (createdAt > limit) {
                return false;
            }
        }

        return true;
    });
}

async function toggleFavorite(userId: string, questionId: string) {
    const question = await QuestionModel.findById(questionId).lean();
    if (!question) {
        throw httpError(404, 'Questão não encontrada');
    }

    const existing = await QuestionFavoriteModel.findOne({ userId, questionId });
    if (existing) {
        await existing.deleteOne();
        return { favorited: false };
    }

    await QuestionFavoriteModel.create({ userId, questionId });
    return { favorited: true };
}

function toFrontendQuiz(doc: any) {
    const plain = doc?.toObject ? doc.toObject() : doc;
    const questions = plain.questionIds || plain.questions || [];
    return {
        ...plain,
        questions,
        timeLimit: plain.timeLimitSeconds ?? plain.timeLimit ?? null,
        passingScore: plain.score ?? plain.passingScore ?? null,
        visibility: plain.visibility ?? QuizVisibility.PUBLIC,
    };
}

export async function getQuizById(id: string, userId?: string) {
    const doc = await QuizModel.findById(id).populate('questionIds').populate('disciplineId');
    if (!doc) throw httpError(404, 'Quiz não encontrado');
    const plain = doc.toObject() as any;
    const isOwner = userId && plain.createdByUserId && plain.createdByUserId.toString?.() === userId;
    const canAccessPrivate = isOwner;
    const visibility = plain.visibility ?? QuizVisibility.PUBLIC;

    if (visibility === QuizVisibility.PRIVATE && !canAccessPrivate) {
        throw httpError(404, 'Quiz não encontrado');
    }

    return toFrontendQuiz(doc);
}

export async function listQuizzes(opts: ListQuizzesOptions, userId?: string) {
    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(100, Math.max(1, opts.limit || 10));
    const skip = (page - 1) * limit;

    const filter: any = { active: true };
    const andConditions: any[] = [];

    if (opts.filter) {
        andConditions.push({
            $or: [
                { title: { $regex: opts.filter, $options: 'i' } },
                { description: { $regex: opts.filter, $options: 'i' } },
            ],
        });
    }
    if ((opts as any).disciplineId) filter.disciplineId = (opts as any).disciplineId;

    const accessConditions = userId
        ? [
            { visibility: QuizVisibility.PUBLIC },
            { visibility: { $exists: false } },
            { createdByUserId: userId },
        ]
        : [
            { visibility: QuizVisibility.PUBLIC },
            { visibility: { $exists: false } },
        ];

    andConditions.push({ $or: accessConditions });

    if (andConditions.length > 0) {
        filter.$and = andConditions;
    }

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

export async function createQuiz(data: CreateQuizDTO, createdByUserId?: string) {
    if (data.disciplineId) {
        const d = await DisciplineModel.findById(data.disciplineId);
        if (!d) throw httpError(404, 'Disciplina associada não encontrada');
    }

    // Verifica se todas as questões existem
    const qs = await QuestionModel.find({ _id: { $in: data.questionIds } });
    if (qs.length !== data.questionIds.length) throw httpError(404, 'Algumas questões não foram encontradas');

    try {
        return await QuizModel.create({
            ...data,
            visibility: data.visibility ?? QuizVisibility.PUBLIC,
            createdByUserId: createdByUserId || null,
        } as any);
    } catch (e: any) {
        if (e?.code === 11000) throw httpError(409, 'Conflito ao criar quiz');
        throw e;
    }
}

export async function generateQuiz(data: GenerateQuizDTO, createdByUserId: string, visibility: QuizVisibility) {
    const title = data.title?.trim();
    if (!title) {
        throw httpError(400, 'Título do quiz é obrigatório');
    }

    // Validar se já existe quiz com esse nome
    const existingQuiz = await QuizModel.findOne({ title, active: true });
    if (existingQuiz) {
        throw httpError(409, 'Já existe um quiz com esse nome');
    }

    const disciplineId = data.disciplineId || undefined;
    const topicIds = normalizeIds(data.topicIds);
    const mixedDifficulty = Boolean(data.mixedDifficulty);
    const requestedDifficulty = data.difficulty;
    const questionCount = Math.max(1, data.questionCount || (data.questionsPerTopic && topicIds.length ? data.questionsPerTopic * topicIds.length : 10));

    // Convert IDs to ObjectIds for proper MongoDB matching
    let disciplineObjectId: Types.ObjectId | undefined = undefined;
    if (disciplineId) {
        try {
            disciplineObjectId = new Types.ObjectId(disciplineId);
        } catch {
            throw httpError(400, 'ID da disciplina inválido');
        }
        const disciplineExists = await DisciplineModel.findById(disciplineObjectId);
        if (!disciplineExists) throw httpError(404, 'Disciplina associada não encontrada');
    }

    let topicObjectIds: Types.ObjectId[] = [];
    if (topicIds.length > 0) {
        topicObjectIds = toObjectIds(topicIds);
        const topicsExist = await TopicModel.find({ _id: { $in: topicObjectIds } });
        if (topicsExist.length !== topicObjectIds.length) throw httpError(404, 'Alguns tópicos não foram encontrados');
    }

    const baseMatch: Record<string, any> = { active: true };
    if (disciplineObjectId) baseMatch.disciplineId = disciplineObjectId;
    if (!mixedDifficulty && requestedDifficulty) baseMatch.difficulty = requestedDifficulty;

    const selectedIds = new Set<string>();
    const perTopicCount = data.questionsPerTopic && data.questionsPerTopic > 0
        ? data.questionsPerTopic
        : topicObjectIds.length > 0
            ? Math.max(1, Math.ceil(questionCount / topicObjectIds.length))
            : 0;

    if (topicObjectIds.length > 0) {
        for (const topicId of topicObjectIds) {
            const ids = await sampleQuestionIds({ ...baseMatch, topicIds: topicId }, perTopicCount);
            ids.forEach((id) => selectedIds.add(id));
        }
    } else if (disciplineObjectId && data.questionsPerTopic) {
        const topics = await TopicModel.find({ disciplineId: disciplineObjectId, active: true }).select('_id');
        if (topics.length > 0) {
            const idsPerTopic = Math.max(1, data.questionsPerTopic);
            for (const topic of topics) {
                const ids = await sampleQuestionIds({ ...baseMatch, topicIds: topic._id }, idsPerTopic);
                ids.forEach((id) => selectedIds.add(id));
            }
        }
    }

    if (selectedIds.size < questionCount) {
        const remaining = questionCount - selectedIds.size;
        const extra = await sampleQuestionIds(
            selectedIds.size > 0 ? { ...baseMatch, _id: { $nin: Array.from(selectedIds).map(id => new Types.ObjectId(id)) } } : baseMatch,
            remaining,
        );
        extra.forEach((id) => selectedIds.add(id));
    }

    const questionIds = Array.from(selectedIds).slice(0, questionCount);

    if (questionIds.length === 0) {
        throw httpError(404, 'Nenhuma questão encontrada com os filtros informados');
    }

    const description = data.description || undefined;
    const score = data.score ?? 0;

    return createQuiz(
        {
            title,
            description,
            disciplineId: disciplineObjectId ? String(disciplineObjectId) : undefined,
            questionIds,
            timeLimitSeconds: data.timeLimitSeconds,
            score,
            visibility,
            active: data.active ?? true,
        },
        createdByUserId,
    );
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
    const questionMap = await buildQuestionMap(questionDocs.map((question: any) => String(question._id)));

    return mapQuizResultResponse(result, questionMap);
}

export async function getQuizResultById(resultId: string, userId?: string) {
    const result = await QuizResultModel.findById(resultId);
    if (!result) throw httpError(404, 'Resultado não encontrado');

    const questionIds = (result.corrections || []).map((correction: any) => String(correction.questionId));
    const questionMap = await buildQuestionMap(questionIds);
    const favoriteQuestionIds = userId
        ? new Set((await QuestionFavoriteModel.find({ userId, questionId: { $in: questionIds } }).select('questionId').lean()).map((item: any) => String(item.questionId)))
        : new Set<string>();

    return mapQuizResultResponse(result, questionMap, favoriteQuestionIds);
}

export async function toggleQuestionFavoriteByUser(userId: string, questionId: string) {
    return toggleFavorite(userId, questionId);
}

export async function getFavoriteQuestionIds(userId: string, questionIds?: string[]) {
    const query: any = { userId };
    if (questionIds && questionIds.length > 0) {
        query.questionId = { $in: questionIds };
    }

    const favorites = await QuestionFavoriteModel.find(query).select('questionId').lean();
    return {
        questionIds: favorites.map((item: any) => String(item.questionId)),
    };
}

export async function getStudentHistory(userId: string, filters: StudentHistoryFilters = {}): Promise<IStudentHistory> {
    const results = await QuizResultModel.find({ userId: userId })
        .populate({
            path: 'quizId',
            select: 'title disciplineId visibility',
            populate: {
                path: 'disciplineId',
                select: 'name',
            },
        })
        .populate({
            path: 'corrections.questionId',
            populate: [
                {
                    path: 'disciplineId',
                    select: 'name',
                },
                {
                    path: 'topicIds',
                    select: 'name disciplineId',
                },
            ],
        })
        .sort({ createdAt: -1 });

    const filteredResults = applyHistoryFilters(results as any[], filters);

    if (filteredResults.length === 0) {
        return {
            totalQuizzesCompleted: 0,
            averageScore: 0,
            totalStudyTime: 0,
            quizzes: [],
            attempts: [],
            analytics: {
                timeline: [],
                byDiscipline: [],
                byTopic: [],
                byDifficulty: [],
                comparison: [],
                lowAreas: [],
            },
        };
    }

    const attempts: IQuizAttemptItem[] = filteredResults.map((result: any) => ({
        _id: String(result._id),
        resultId: String(result._id),
        quizId: String(result.quizId?._id || result.quizId),
        title: result.quizId?.title || 'Quiz',
        discipline: result.quizId?.disciplineId?.name || '',
        visibility: result.quizId?.visibility || QuizVisibility.PUBLIC,
        percentage: Math.round(result.percentage),
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        totalQuestions: result.totalQuestions,
        timeSpentInSeconds: result.timeSpentInSeconds,
        passingScore: result.passingScore,
        createdAt: result.createdAt,
        passed: result.percentage >= result.passingScore,
    }));

    const quizMap = new Map<string, any>();
    const disciplineMap = new Map<string, { label: string; attempts: number; correctAnswers: number; percentageTotal: number; timeTotal: number }>();
    const topicMap = new Map<string, { label: string; attempts: number; correctAnswers: number; percentageTotal: number; timeTotal: number }>();
    const difficultyMap = new Map<string, { attempts: number; correctAnswers: number }>();
    const comparisonMap = new Map<string, ComparisonGroup>();

    filteredResults.forEach((result: any) => {
        const quizId = String(result.quizId?._id || result.quizId);

        if (!quizMap.has(quizId)) {
            quizMap.set(quizId, {
                quizId,
                title: result.quizId?.title,
                discipline: result.quizId?.disciplineId?.name || '',
                visibility: result.quizId?.visibility || QuizVisibility.PUBLIC,
                results: [],
            });
        }

        quizMap.get(quizId).results.push({
            percentage: result.percentage,
            timeSpentInSeconds: result.timeSpentInSeconds,
            createdAt: result.createdAt,
        });

        const disciplineKey = String(result.quizId?.disciplineId?._id || result.quizId?.disciplineId || '');
        if (disciplineKey) {
            const currentDiscipline = disciplineMap.get(disciplineKey) || {
                label: result.quizId?.disciplineId?.name || 'Disciplina',
                attempts: 0,
                correctAnswers: 0,
                percentageTotal: 0,
                timeTotal: 0,
            };
            currentDiscipline.attempts += 1;
            currentDiscipline.correctAnswers += result.correctAnswers;
            currentDiscipline.percentageTotal += result.percentage;
            currentDiscipline.timeTotal += result.timeSpentInSeconds;
            disciplineMap.set(disciplineKey, currentDiscipline);
        }

        const attemptOrder: ComparisonGroup = comparisonMap.get(quizId) || {
            title: result.quizId?.title || 'Quiz',
            attempts: [],
        };
        attemptOrder.attempts.push({
            attemptNumber: 0,
            resultId: String(result._id),
            createdAt: result.createdAt,
            percentage: Math.round(result.percentage),
        });
        comparisonMap.set(quizId, attemptOrder);

        (result.corrections || []).forEach((correction: any) => {
            const question = correction.questionId;
            if (!question) return;

            const topicDocs = Array.isArray(question.topicIds) ? question.topicIds : [];
            const topicTargets = topicDocs.length > 0 ? topicDocs : [{ _id: 'sem-topico', name: 'Sem tópico' }];
            topicTargets.forEach((topic: any) => {
                const topicKey = String(topic._id);
                const currentTopic = topicMap.get(topicKey) || {
                    label: topic.name || 'Sem tópico',
                    attempts: 0,
                    correctAnswers: 0,
                    percentageTotal: 0,
                    timeTotal: 0,
                };
                currentTopic.attempts += 1;
                currentTopic.correctAnswers += correction.isCorrect ? 1 : 0;
                currentTopic.percentageTotal += correction.isCorrect ? 100 : 0;
                topicMap.set(topicKey, currentTopic);
            });

            const difficultyKey = String(question.difficulty || 'MEDIO');
            const currentDifficulty = difficultyMap.get(difficultyKey) || { attempts: 0, correctAnswers: 0 };
            currentDifficulty.attempts += 1;
            currentDifficulty.correctAnswers += correction.isCorrect ? 1 : 0;
            difficultyMap.set(difficultyKey, currentDifficulty);
        });
    });

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

    const averageScore = quizzes.length > 0 ? Math.round(totalScore / quizzes.length) : 0;

    const timeline = attempts
        .slice()
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((attempt) => ({
            resultId: attempt.resultId,
            quizId: attempt.quizId,
            title: attempt.title,
            createdAt: attempt.createdAt,
            percentage: attempt.percentage,
            timeSpentInSeconds: attempt.timeSpentInSeconds,
        }));

    const byDiscipline = Array.from(disciplineMap.entries()).map(([key, value]) => ({
        key,
        label: value.label,
        attempts: value.attempts,
        correctAnswers: value.correctAnswers,
        averageScore: computeAverage(value.percentageTotal, value.attempts),
        averageTime: computeAverage(value.timeTotal, value.attempts),
    }));

    const byTopic = Array.from(topicMap.entries()).map(([key, value]) => ({
        key,
        label: value.label,
        attempts: value.attempts,
        correctAnswers: value.correctAnswers,
        averageScore: computeAverage(value.percentageTotal, value.attempts),
        averageTime: computeAverage(value.timeTotal, value.attempts),
    }));

    const byDifficulty = Array.from(difficultyMap.entries()).map(([difficulty, value]) => ({
        difficulty,
        attempts: value.attempts,
        correctAnswers: value.correctAnswers,
        accuracy: value.attempts > 0 ? Math.round((value.correctAnswers / value.attempts) * 100) : 0,
    }));

    const comparison = Array.from(comparisonMap.entries()).map(([quizId, value]) => ({
        quizId,
        title: value.title,
        attempts: value.attempts
            .slice()
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((attempt, index) => ({
                ...attempt,
                attemptNumber: index + 1,
            })),
    }));

    const lowAreas = [
        ...byDiscipline.map((item) => ({ kind: 'DISCIPLINE' as const, key: item.key, label: item.label, averageScore: item.averageScore, attempts: item.attempts })),
        ...byTopic.map((item) => ({ kind: 'TOPIC' as const, key: item.key, label: item.label, averageScore: item.averageScore, attempts: item.attempts })),
    ]
        .filter((item) => item.attempts >= 2)
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 5);
    
    return {
        totalQuizzesCompleted: quizzes.length,
        averageScore,
        totalStudyTime: totalTime,
        attempts,
        quizzes: quizzes.sort((a, b) => new Date(b.lastAttemptDate).getTime() - new Date(a.lastAttemptDate).getTime()),
        analytics: {
            timeline,
            byDiscipline,
            byTopic,
            byDifficulty,
            comparison,
            lowAreas,
        },
    };
}
