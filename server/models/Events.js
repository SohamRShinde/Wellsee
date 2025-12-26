import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date, 
        required: true,
        index: true
    },
    venue: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    banner: {
        type: String, 
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false, 
    },
    formId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form',
        required: false 
    }
}, { timestamps: true });

export default mongoose.model("Event", EventSchema)