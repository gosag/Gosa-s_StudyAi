import {Document,Schema,model,Types} from "mongoose"
interface IFlashcard extends Document {
  question: string;
  answer: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  materialId: Types.ObjectId;
  // SRS Fields
  nextReviewDate: Date;
  interval: number;
  easeFactor: number;
  repetitionCount: number;
}
const FlashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficultyLevel: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  nextReviewDate: { type: Date, default: Date.now },
  interval: { type: Number, default: 0 },
  easeFactor: { type: Number, default: 2.5 }, 
  repetitionCount: { type: Number, default: 0 }
});

export const Flashcard = model<IFlashcard>('Flashcard', FlashcardSchema);