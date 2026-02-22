import { Document, Schema, model, models } from "mongoose"
import { AiModelEnum, ModelStatusEnum, TaskEnum } from "../enums/ai-model.enum"

export interface IAiModel extends Document {
    display_name: string
    model_type: AiModelEnum
    version: string
    task_type: TaskEnum
    input_features: string[]
    target_variables: string[]
    training_data: {
        dataset_ids: Schema.Types.ObjectId[]
    }
    status: ModelStatusEnum
    createdAt: Date
}

const AiModelSchema = new Schema<IAiModel>(
    {
        display_name: { type: String, required: true, trim: true },
        version: { type: String, default: "1.0.0" },
        model_type: { type: String, enum: AiModelEnum, required: true },
        task_type: { type: String, enum: TaskEnum, required: true },
        target_variables: { type: [String], required: true },
        input_features: { type: [String], default: [] },
        training_data: {
            dataset_ids: { type: [Schema.Types.ObjectId], ref: "DataStore", default: [] },
        },
        status: { type: String, enum: ModelStatusEnum, default: ModelStatusEnum.active },
    },
    { timestamps: { createdAt: true } }
)

AiModelSchema.index({ model_type: 1, task_type: 1, status: 1 })
AiModelSchema.index({ display_name: 1, version: 1 }, { unique: true })

export const AiModelModel = models.AiModel || model<IAiModel>("AiModel", AiModelSchema)
