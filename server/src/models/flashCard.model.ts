import {Document,Schema,model,Types} from "mongoose"
import { de } from "zod/v4/locales";
interface IFlashcard extends Document {
  front: string;
  back: string;
  difficultyLevel: 'again' | 'hard' | 'good' | 'easy';
  materialId: Types.ObjectId;
  userId: Types.ObjectId;
  // SRS Fields
  nextReviewDate: Date;
  interval: number;
  easeFactor: number;
  repetitionCount: number;
  timestamps: Date;
}
const FlashcardSchema = new Schema<IFlashcard>({
  front: { type: String, required: true },
  back: { type: String, required: true },
  difficultyLevel: { type: String, enum: ['again', 'hard', 'good','easy'], default: 'good' },
  materialId: { type: Schema.Types.ObjectId, ref: 'Material', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nextReviewDate: { type: Date, default: Date.now },
  interval: { type: Number, default: 0 },
  easeFactor: { type: Number, default: 2.5 }, 
  repetitionCount: { type: Number, default: 0 },
  timestamps: { type: Date, default: Date.now }
});

const Flashcard = model<IFlashcard>('Flashcard', FlashcardSchema)
export default Flashcard;
export type {IFlashcard}