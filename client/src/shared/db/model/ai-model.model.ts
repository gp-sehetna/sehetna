import { Document, Schema, model, models } from "mongoose"
import { AiModelEnum, ModelStatusEnum, TaskEnum } from "../enums/ai-model.enum"

export interface IAiModel extends Document {
    display_name: string
    model_type: AiModelEnum
    version: string
    task_type: TaskEnum
    features: string[]
    targets: string[]
    training_data: {
        data_store_ids: Schema.Types.ObjectId[]
    }
    status: ModelStatusEnum
    createdAt: Date
}

const AiModelSchema = new Schema<IAiModel>(
    {
        display_name: {
            type: String,
            trim: true,
            default: function () {
                return `${(this as IAiModel).model_type}-${(this as IAiModel).version}`
            },
        },
        version: { type: String, default: "1.0.0" },
        model_type: { type: String, enum: AiModelEnum, required: true },
        task_type: { type: String, enum: TaskEnum, required: true },
        features: { type: [String], default: [] },
        targets: { type: [String], required: true },
        training_data: {
            data_store_ids: { type: [Schema.Types.ObjectId], ref: "DataStore", default: [] },
        },
        status: { type: String, enum: ModelStatusEnum, default: ModelStatusEnum.active },
    },
    { timestamps: { createdAt: true } }
)

// TODO: Ensure search index is correct
// AiModelSchema.searchIndex({ definition: { display_name: "text", version: "text" }, type: "search" })

export const AiModelModel = models.AiModel || model<IAiModel>("AiModel", AiModelSchema)
