import mongoose from "mongoose";

const ResponseSchema = new mongoose.Schema({
    formId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form',
        required: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false
    },
    answers: {
        type: Map,
        of: mongoose.Schema.Types.Mixed 
    }
}, { timestamps: true });

export default mongoose.model("Response", ResponseSchema);