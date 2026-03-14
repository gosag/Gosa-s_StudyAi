import {Schema, model} from 'mongoose';
interface IQuiz {
    question: string;
    options: string[];
    correctAnswer: string;
    materialId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    timestamps: Date;
}
const QuizSchema = new Schema<IQuiz>({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
    timestamps: { type: Date, default: Date.now }
});
const Quiz = model<IQuiz>('Quiz', QuizSchema);
export default Quiz;