import { AiModel, ModelStatus, Task } from "@/shared/db/enums/ai-model.enum"
import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

const AiModelSchema = new Schema(
    {
        display_name: {
            type: String,
            trim: true,
            default: function (this) {
                return `${this.model_type}-${this.version}`
            },
        },
        version: { type: String, default: "1.0.0" },
        model_type: { type: String, enum: AiModel, required: true },
        task_type: { type: String, enum: Task, required: true },
        features: { type: [String], default: [] },
        targets: { type: [String], required: true },
        training_data: {
            data_store_ids: { type: [Schema.Types.ObjectId], ref: "DataStore", default: [] },
        },
        status: { type: String, enum: ModelStatus, default: ModelStatus.active },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
)

export type IAiModel = Require_id<InferSchemaType<typeof AiModelSchema>>

export const AiModelModel: Model<IAiModel> =
    models.AiModel || model<IAiModel>("AiModel", AiModelSchema)
