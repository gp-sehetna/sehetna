import { AiModel, AiModelEnum, ModelStatus, ModelStatusEnum, Task, TaskEnum } from "@/shared/db/enums/ai-model.enum"
import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

// export interface IAiModel extends Document {
//     display_name: string
//     model_type: AiModelEnum
//     version: string
//     task_type: TaskEnum
//     features: string[] // not selected
//     targets: string[]
//     training_data: {
//         // not selected
//         data_store_ids: Schema.Types.ObjectId[]
//     }
//     status: ModelStatusEnum
//     createdAt: Date // not selected
// }

// const AiModelSchema = new Schema<IAiModel>(
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
    { timestamps: { createdAt: true, updatedAt: false }}
)

export type IAiModel = Require_id<InferSchemaType<typeof AiModelSchema>>

// TODO: Ensure search index is correct
// AiModelSchema.searchIndex({ definition: { display_name: "text", version: "text" }, type: "search" })

export const AiModelModel: Model<IAiModel> =
    models.AiModel || model<IAiModel>("AiModel", AiModelSchema)
